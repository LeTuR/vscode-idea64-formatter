# vscode-idea64-formatter

This extension use [Idea IntelliJ formatter CLI](https://www.jetbrains.com/help/idea/command-line-formatter.html) to format your files inside VSCode.

## Features

The formatter can be activated for Java, Groovy, Powershell, Yaml, Shell, and Batch files.

## Requirements

IntelliJ must be installed.

## Extension Settings

This extension contributes the following settings:

* `idea-format.language.java.enable`: enable/disable format for java
* `idea-format.language.groovy.enable`: enable/disable format for groovy
* `idea-format.language.powershell.enable`: enable/disable format for powershell
* `idea-format.language.yaml.enable`: enable/disable format for yaml
* `idea-format.language.shell.enable`: enable/disable format for shell
* `idea-format.language.bat.enable`: enable/disable format for Batch

* `idea-format.idea-executable`: path to the idea64 executable for example : "C:\\Program Files\\JetBrains\\IntelliJ IDEA Community Edition 2021.1.3\\bin\\idea64.exe"

## Known Issues

The formatter takes a long time before applying.

## Release Notes

Initial preview version

### 0.1.0

Initial preview version