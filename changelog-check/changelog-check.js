const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const prNumber = github.context.payload.pull_request?.number;

    const changelogPath = core.getInput('changelog-path').trim();
    const codeExtensions = core.getInput('code-extensions')
      .split(',')
      .map(ext => ext.trim().startsWith('.') ? ext.trim() : `.${ext.trim()}`);

    const shouldFail = core.getInput('fail-on-missing') === 'true';

    const { data: files } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
    });

    const changedFiles = files.map(f => f.filename);

    const changedCodeFiles = changedFiles.filter(file =>
      codeExtensions.includes(path.extname(file))
    );

    const changelogUpdated = changedFiles.includes(changelogPath);

    if (changedCodeFiles.length > 0 && !changelogUpdated) {
      const body = `📝 **Changelog Missing**

This PR changes code files (${changedCodeFiles.length} file(s)) but does not update \`${changelogPath}\`.

Please add a changelog entry summarizing the change.`;

      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body
      });

      if (shouldFail) {
        core.setFailed("Changelog not updated despite code changes.");
      } else {
        console.log("⚠️ Changelog not updated, but workflow is non-blocking.");
      }
    } else {
      console.log("✅ Changelog presence validated.");
    }

  } catch (error) {
    core.setFailed(`Error checking for changelog update: ${error.message}`);
  }
}

run();
