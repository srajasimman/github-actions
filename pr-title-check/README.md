# PR Title Check Action

Validates PR titles against allowed Conventional Commit types.

## Inputs
- `allowed-types`: Comma-separated list of allowed types (default: `fix,feat,test,docs`)

## Outputs
None

## Example Usage
```yaml
- uses: ./pr-title-check
  with:
    allowed-types: "fix,feat"
```
