const core = require('@actions/core');
const github = require('@actions/github');
const minimatch = require('minimatch');

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const prNumber = github.context.payload.pull_request?.number;

    const patterns = core.getInput('sensitive-patterns')
      .split(',')
      .map(p => p.trim());

    const filesResponse = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber
    });

    const changedFiles = filesResponse.data.map(f => f.filename);

    const matched = changedFiles.filter(file =>
      patterns.some(pattern => minimatch(file, pattern, { dot: true }))
    );

    if (matched.length > 0) {
      const message = `🚫 **Sensitive File(s) Detected in PR**\n\nThe following files match sensitive patterns and must be removed:\n\n${matched.map(f => `- \`${f}\``).join('\n')}\n\nBlocked by security policy.`;

      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: message
      });

      core.setFailed(`Blocked due to sensitive files in PR: ${matched.join(', ')}`);
    } else {
      console.log("✅ No sensitive files detected in PR.");
    }
  } catch (error) {
    core.setFailed(`Error checking for sensitive files: ${error.message}`);
  }
}

run();
