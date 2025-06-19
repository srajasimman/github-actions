# Slack Label Alert Action

Notifies Slack if a PR is labeled with a critical/hotfix label.

## Inputs
- `watch-labels`: Comma-separated list of labels to watch (required)
- `slack-webhook-url`: Slack Incoming Webhook URL (required)

## Outputs
None

## Example Usage
```yaml
- uses: ./slack-label-alert
  with:
    watch-labels: "critical,hotfix"
    slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```
