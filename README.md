# github-actions

This repository contains custom GitHub Actions for automating workflows and enforcing standards in your projects. Below is a list of available actions:

## Available Actions

- [Changelog Check](./changelog-check) — Fails PRs that change code without updating the changelog.
- [Commit Message Lint](./commit-lint) — Lints commit messages in a PR against Conventional Commits.
- [PR Label Enforcer](./pr-label-enforcer) — Ensures PR has at least one label or applies a default (`needs-triage`).
- [PR Title Check](./pr-title-check) — Validates PR titles against allowed Conventional Commit types.
- [Sensitive File Check](./sensitive-file-check) — Fails PRs containing sensitive files based on patterns.
- [Slack Label Alert](./slack-label-alert) — Notifies Slack if a PR is labeled with a critical/hotfix label.

Each action directory contains its own README with usage instructions and configuration options.