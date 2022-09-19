# Mintlify Client

The client is essentially a frontend template used to host documentation. In production, when `yarn prebuild` is ran it fetches all the relevant assets (the config file, the content (mdx files), and static assets) and plugs them into the appropriate locations before building.

## Your First Code Contribution

### Prerequisites

- Node v16.13.2 (npm v8.1.2)
- Yarn

### Dependencies

From a terminal, where you have cloned the repository, execute the following command to install the required dependencies:

```
yarn
```

### Build

- `INTERNAL_SITE_BEARER_TOKEN=example yarn prebuild` - fetches the files for the site associated with that bearer token from GitHub. You need the pre-hashed bearer token for that to work. Mintlify employees can request the token that grants access to a test site. In the future, we will work on a way of generating temporary bearer tokens from an employee login.
- `yarn local` - the local version of `yarn prebuild` (fetches the content from the local `../docs` folder)
- `yarn local-to-docs` - transfers the untracked files to the `../docs` file (helpful for when you're working on content and you want to see changes live)
  - Both `yarn local` and `yarn local-to-docs` take in a filepath as a parameter for when you want to transfer files to a directory that isn't `../docs`. For example, let's say I'm working on a migration for a client, then I can run `yarn local ../../clients/vital/docs` to get the files from that folder.

### Watch

```
yarn dev
```

### Formatting

This project uses [prettier](https://prettier.io/) for code formatting. You can run prettier across the code by calling `yarn run format` from a terminal.

To format the code as you make changes you can install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items/esbenp.prettier-vscode) extension.

Add the following to your User Settings to run prettier:

```
"editor.formatOnSave": true,
"editor.defaultFormatter": "esbenp.prettier-vscode"
```

You can either modify the `settings.json` file or click on Preferences > Settings to use the UI.
