const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const allowedTypes = core.getInput('allowed-types').split(',').map(t => t.trim());
    const prTitle = github.context.payload.pull_request?.title || '';
    const prNumber = github.context.payload.pull_request?.number;
    const repo = github.context.repo;
    const token = process.env.GITHUB_TOKEN;

    const regex = new RegExp(`^(${allowedTypes.join('|')}):\\s.+`);
    
    if (!regex.test(prTitle)) {
      core.setFailed(`Invalid PR title: "${prTitle}". Must start with one of: ${allowedTypes.join(', ')}`);

      const message = `🚫 **Invalid PR Title**: \`${prTitle}\`\n\nPlease use Conventional Commits. Valid types: \`${allowedTypes.join(' | ')}\`\nExample: \`feat: add user auth\``;

      const octokit = github.getOctokit(token);
      await octokit.rest.issues.createComment({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: prNumber,
        body: message,
      });
    } else {
      console.log(`✅ PR title is valid: "${prTitle}"`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
