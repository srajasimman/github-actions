const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const octokit = github.getOctokit(token);
    const { context } = github;

    const prNumber = context.payload.pull_request.number;
    const labels = context.payload.pull_request.labels;
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    if (labels.length > 0) {
      console.log(`PR #${prNumber} already has labels.`);
      return;
    }

    const defaultLabel = 'needs-triage';

    // Add default label
    await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: prNumber,
      labels: [defaultLabel],
    });
    console.log(`Added label '${defaultLabel}' to PR #${prNumber}`);

    // Post a comment
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `⚠️ This pull request had no labels. A default label \`${defaultLabel}\` has been added. Please update it if necessary.`,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
