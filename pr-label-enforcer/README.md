# PR Label Enforcer Action

Ensures PR has at least one label or applies a default (`needs-triage`).

## Inputs
- `repo-token`: GitHub token (required)

## Outputs
None

## Example Usage
```yaml
- uses: ./pr-label-enforcer
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```
