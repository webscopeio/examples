# Webscope Examples

Before using any of these example apps/starters for your projects, please refer to each directory's `README.md` file.

## Local Setup + Development

Use any of the options to run commands from your terminal:

```graphql
# Using GitHub CLI

$ gh repo clone webscope/examples/[example]
$ cd [example]
$ npm i
$ npm run dev
```

```graphql
# For Next.js projects using `npm` or `yarn`

$ npx create-next-app --example https://github.com/webscope/examples/[example] [example]
$ cd [example]

# <- Using `npm`
$ npm i
$ npm run dev

# <- Using `yarn`
$ yarn dev
```

## Remote Setup using StackBlitz/Vercel

Using _Markdown syntax_ each of the example apps/starters should have the following:

-   [Launching projects from GitHub](https://developer.stackblitz.com/guides/integration/open-from-github#frontmatter-title) - using the following URI pattern: `stackblitz.com/github/REPOSITORY_PATH/?file=OPTIONAL_PARAMS` as an example: `https://stackblitz.com/github/webscope/examples/trpc-basic-starter?file=src/pages/index.tsx&file=src/server/routers/user.ts&view=editor`
-   [Deploy with Vercel](https://vercel.com/docs/deploy-button#introduction/what-s-a-deploy-button) - using the following URI pattern: `vercel.com/new/clone?repository-url=REPOSITORY_PATH` as an example: `https://vercel.com/new/clone?repository-url=https://github.com/webscope/examples/trpc-basic-starter`
