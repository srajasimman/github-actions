const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const { URL } = require('url');

async function run() {
  try {
    const labelsToWatch = core.getInput('watch-labels').split(',').map(l => l.trim().toLowerCase());
    const slackWebhookUrl = core.getInput('slack-webhook-url');
    const payload = github.context.payload;

    const labeled = payload.label?.name?.toLowerCase();
    if (!labelsToWatch.includes(labeled)) {
      console.log(`Label '${labeled}' is not in the watch list. Skipping.`);
      return;
    }

    const pr = payload.pull_request;
    const title = pr.title;
    const url = pr.html_url;
    const author = pr.user.login;

    const slackMessage = {
      text: `🚨 *Critical PR Labeled*\n*Title:* ${title}\n*Author:* ${author}\n*Link:* ${url}`
    };

    const webhookUrl = new URL(slackWebhookUrl);

    const req = https.request({
      method: 'POST',
      hostname: webhookUrl.hostname,
      path: webhookUrl.pathname + webhookUrl.search,
      headers: {
        'Content-Type': 'application/json'
      }
    }, res => {
      console.log(`Slack response status: ${res.statusCode}`);
    });

    req.on('error', err => {
      core.setFailed(`Failed to send Slack message: ${err.message}`);
    });

    req.write(JSON.stringify(slackMessage));
    req.end();

  } catch (err) {
    core.setFailed(`Slack notification failed: ${err.message}`);
  }
}

run();
