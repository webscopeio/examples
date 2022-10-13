# Webscope Examples

Before using any of these example apps/starters for your projects, please refer to each directory's `README.md` file.

## Local Setup + Development

Use any of the options to run commands from your terminal:

```
# Using GitHub CLI

$ gh repo clone webscopeio/examples/tree/main/[example]
$ cd [example]
$ npm i
$ npm run dev
```

```
# For Next.js projects using `npm` or `yarn`

$ npx create-next-app --example https://github.com/webscopeio/examples/tree/main/[example] [example]
$ cd [example]

# <- Using `npm`
$ npm i
$ npm run dev

# <- Using `yarn`
$ yarn dev
```

## Remote Setup using StackBlitz

Using _Markdown syntax_ each of the example apps/starters should have the following:

[Launching projects from GitHub](https://developer.stackblitz.com/guides/integration/open-from-github#frontmatter-title) - using the following URI pattern: `stackblitz.com/github/REPOSITORY_PATH/?file=OPTIONAL_PARAMS` as an example: `https://stackblitz.com/github/webscopeio/examples/tree/main/trpc-basic-starter?file=src/pages/index.tsx&file=src/server/routers/user.ts&view=editor`
