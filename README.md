# GitHub action to pack StreamDeck plugins

This action packs a StreamDeck plugin for release.

## Basic use

Add the following step to your workflow:

```yaml
- name: Pack
  id: pack
  uses: neilenns/streamdeck-cli-pack@v1
```

This will automatically pack the folder ending in `.sdPlugin` in the root of
your repository. The version will be set to either the release tag (e.g.
`1.0.0.0` for a release tag of `v1.0.0`), or the pull request number if used in
a pull request workflow (e.g. `0.0.36.0` for pull request #36).

## Advanced use

You can specify additional options using the `with` keyword:

```yaml
- name: Pack
  id: pack
  uses: neilenns/streamdeck-cli-pack@v1
  with:
    outputPath: 'dist'
    path: 'com.example.myplugin.sdPlugin'
    version: '1.1.0.0'
```

Here are all the available options:

| Option             | Description                                                                                              | Default                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `force`            | Overwrite the output file if it already exists.                                                          | `false`                                                         |
| `forceUpdateCheck` | Forces an update check for new validation rules. Cannot be used in conjunction with noUpdateCheck.       | `false`                                                         |
| `noUpdateCheck`    | Disables the update check for new validation rules. Cannot be used in conjunction with forceUpdateCheck. | `false`                                                         |
| `outputPath`       | The path to save the packed plugin to                                                                    | The workflow working directory                                  |
| `path`             | The path to the plugin to pack                                                                           | The first `*.sdPlugin` folder in the workflow working directory |
| `version`          | The version to set in the plugin                                                                         | The release tag or pull request number                          |
| `dryRun`           | Generates a report without creating a package                                                            | `false`                                                         |
