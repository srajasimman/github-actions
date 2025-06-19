# Changelog Check Action

Fails PRs that change code without updating the changelog.

## Inputs
- `changelog-path`: Path to changelog file (default: `CHANGELOG.md`)
- `code-extensions`: Comma-separated list of code file extensions to watch (default: `.ts,.js,.py`)
- `fail-on-missing`: Whether to fail if changelog is missing (default: `true`)

## Outputs
None

## Example Usage
```yaml
- uses: ./changelog-check
  with:
    changelog-path: "CHANGELOG.md"
    code-extensions: ".ts,.js"
    fail-on-missing: "true"
```
