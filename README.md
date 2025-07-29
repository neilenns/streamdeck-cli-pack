# GitHub Action to pack Stream Deck plugins

This action packs a Stream Deck plugin for release.

## Basic use

Add the following step to your workflow:

```yaml
- name: Pack
  uses: neilenns/streamdeck-cli-pack@v1
```

This will automatically pack the folder ending in `.sdPlugin` in the root of
your repository. The version will be set to either the release tag (e.g.
`1.0.0.0` for a release tag of `v1.0.0`), or the run number if used in a pull
request workflow (e.g. `0.0.36.0` for run #36).

## Real-world examples

For a complete example of using this plugin in an end-to-end pull request
validation workflow that attaches the packaged plug-in to the pull request as a
comment see the
[StreamDeck-TrackAudio CI workflow](https://github.com/neilenns/streamdeck-trackaudio/blob/main/.github/workflows/ci.yaml)
and
[StreamDeck-TrackAudio artifact comment workflow](https://github.com/neilenns/streamdeck-trackaudio/blob/main/.github/workflows/pr_artifact_comment.yml).

For a complete example of using this plugin with an end-to-end release workflow
that attaches the packaged plug-in to the GitHub release page see the
[StreamDeck-TrackAudio release workflow](https://github.com/neilenns/streamdeck-trackaudio/blob/main/.github/workflows/release.yaml).

## Advanced use

You can specify additional options using the `with` keyword:

```yaml
- name: Pack
  uses: neilenns/streamdeck-cli-pack@v1
  with:
    outputPath: 'dist'
    path: 'com.example.myplugin.sdPlugin'
    version: '1.1.0.0'
```

Here are all the available options:

| Option             | Description                                                                                                                                                                                                                                                                   | Default                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `force`            | Overwrite the output file if it already exists.                                                                                                                                                                                                                               | `false`                                                         |
| `forceUpdateCheck` | Forces an update check for new validation rules. Cannot be used in conjunction with noUpdateCheck. Not particularly useful in CI builds since the command-line tool is installed fresh every run, which results in an update check. Included in this action for completeness. | `false`                                                         |
| `ignoreValidation` | Bypasses validation errors (not recommended)                                                                                                                                                                                                                                  | `false`                                                         |
| `noUpdateCheck`    | Disables the update check for new validation rules. Cannot be used in conjunction with forceUpdateCheck.                                                                                                                                                                      | `false`                                                         |
| `outputPath`       | The path to save the packed plugin to                                                                                                                                                                                                                                         | The workflow working directory                                  |
| `path`             | The path to the plugin to pack                                                                                                                                                                                                                                                | The first `*.sdPlugin` folder in the workflow working directory |
| `version`          | The version to set in the plugin                                                                                                                                                                                                                                              | The release tag or pull request number                          |
| `dryRun`           | Generates a report without creating a package                                                                                                                                                                                                                                 | `false`                                                         |
