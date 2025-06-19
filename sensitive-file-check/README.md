# Sensitive File Check Action

Fails PRs containing sensitive files based on patterns.

## Inputs
- `sensitive-patterns`: Comma-separated list of glob-like file patterns to block (default: `.env,secrets.*,id_rsa,*.pem,*.key`)

## Outputs
None

## Example Usage
```yaml
- uses: ./sensitive-file-check
  with:
    sensitive-patterns: ".env,*.pem"
```
