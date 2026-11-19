# kick action

GitHub action that installs [`kick`].

[`kick`]: https://github.com/udoprog/kick

## Inputs

### `version`

**Optional** The `kick` release tag to install, such as `2026-05-04`. It must
match a tagged release; `latest` is not supported. Defaults to `2026-05-04`.

## Example usage

```yaml
- uses: udoprog/actions@kick
  with:
    version: 2026-05-04
```
