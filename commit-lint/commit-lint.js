const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const allowedTypes = core.getInput('allowed-types').split(',').map(t => t.trim());
    const shouldFail = core.getInput('fail-on-error') === 'true';

    const regex = new RegExp(`^(${allowedTypes.join('|')})(\\([^)]+\\))?:\\s.+`);

    const { owner, repo } = github.context.repo;
    const prNumber = github.context.payload.pull_request?.number;
    const octokit = github.getOctokit(token);

    // Get commits in PR
    const { data: commits } = await octokit.rest.pulls.listCommits({
      owner,
      repo,
      pull_number: prNumber,
    });

    const invalidCommits = commits
      .map(c => ({ sha: c.sha.slice(0, 7), message: c.commit.message.split('\n')[0] }))
      .filter(c => !regex.test(c.message));

    if (invalidCommits.length > 0) {
      const invalidList = invalidCommits
        .map(c => `- \`${c.sha}\`: ${c.message}`)
        .join('\n');

      const body = `🚫 **Invalid Commit Messages Detected**\n\nThe following commits don't follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):\n\n${invalidList}\n\nValid types: \`${allowedTypes.join(', ')}\`\nExample: \`feat(parser): add new token logic\``;

      // Comment on the PR
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body,
      });

      if (shouldFail) {
        core.setFailed('One or more commit messages do not follow the Conventional Commits format.');
      }
    } else {
      console.log("✅ All commit messages are valid.");
    }

  } catch (err) {
    core.setFailed(`Error validating commits: ${err.message}`);
  }
}

run();
