# Commit Message Lint Action

Lints commit messages in a PR against Conventional Commits.

## Inputs
- `allowed-types`: Comma-separated list of allowed commit types (default: `fix,feat,docs,test,chore,refactor,style`)
- `fail-on-error`: Whether to fail the workflow on invalid commits (default: `true`)

## Outputs
None

## Example Usage
```yaml
- uses: ./commit-lint
  with:
    allowed-types: "fix,feat,docs"
    fail-on-error: "true"
```
