# trug action

GitHub action that installs [`trug`].

[`trug`]: https://github.com/udoprog/trug

Prebuilt binaries exist for x86_64 Linux, aarch64 macOS and x86_64 Windows;
the action fails on any other runner.

## Inputs

### `version`

**Optional** The `trug` release tag to install, such as `0.1.0`. Defaults to
`latest`, which resolves the newest release through the GitHub API.

### `token`

**Optional** GitHub token used to look up the latest release. Defaults to
`github.token`.

## Example usage

```yaml
- uses: udoprog/actions@trug
  with:
    version: 0.1.0
```
