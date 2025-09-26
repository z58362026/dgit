# ZenTao Git CLI

ZenTao Git CLI is a command-line interface tool that integrates Git operations with ZenTao project management features. This tool allows users to perform Git commands while seamlessly interacting with ZenTao's bug tracking and requirement management.

## Features

-   Wraps Git commands: `commit`, `pull`, `push`, `status`
-   Enhanced commit functionality to choose between requirement and bug lists
-   ZenTao API integration for fetching bug lists
-   Caching mechanism for ZenTao login sessions
-   User-friendly prompts for multi-selection of bug numbers and custom commit messages

## Installation

To install the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd zentao-git-cli
npm install
```

## Usage

### Command Line Interface

To use the CLI, run the following command:

```bash
node dist/cli.js <command> [options]
```

### Available Commands

-   `commit`: Commit changes with options to include bug or requirement references.
-   `status`: Show the current status of the Git repository.
-   `pull`: Fetch and integrate changes from a remote repository.
-   `push`: Upload local changes to a remote repository.

### Example

To commit changes with bug references:

```bash
node dist/cli.js commit --bugs 123,456 --message "Fixed bugs"
```

## API Integration

The tool interacts with the ZenTao API to fetch bug lists and manage user sessions. Ensure you have valid ZenTao credentials to use the bug tracking features.

## Testing

To run the tests, use the following command:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
