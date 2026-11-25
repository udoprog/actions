# kick action

GitHub action that installs [`kick`].

[`kick`]: https://github.com/udoprog/kick

## Inputs

### `version`

**Optional** The `kick` release tag to install, such as `2026-05-04`. Defaults to
`latest`, which resolves the newest release through the GitHub API.

### `token`

**Optional** GitHub token used to look up the latest release. Defaults to
`github.token`.

## Example usage

```yaml
- uses: udoprog/actions@kick
  with:
    version: 2026-05-04
```
