## some notes:

1. # typescript support in vscode:

> because in vue files + deno... some problems with autocompletions

- for typescript support in *.vue files:
  - `cp .vscode/settings.example.json .vscode/settings.json`
  - create `dev-hack` folder with `package.json`
  - so make duplicate of each dependency in:
    - `vite.config.mts`:
      - `import from "npm:zod"`
    - aliases in `deno.json`:
      - `{ "imports": { "zod": "https://deno.land/x/zod/mod.ts" } }`
    - make `cd dev-hack && npm i zod` **this is strange but solution for now**
  - and in `tsconfig.json`
    ```ts
    "compilerOptions": {
      "typeRoots": [
        "dev-hack/node_modules"
      ],
    }
    ```

#### explanation:

- all related to frontend files are supported with typescript, not deno
- but in reality only deno + vite is do all stuff
- so all strage above only to inform typescript only during developing-process

2. # inspiration sources:

- auth, vue, pinia:
  - [https://jasonwatmore.com/post/2022/05/26/vue-3-pinia-jwt-authentication-tutorial-example](https://jasonwatmore.com/post/2022/05/26/vue-3-pinia-jwt-authentication-tutorial-example)
- auth, deno:
  - [https://github.com/wpcodevo/deno-rs256-jwt/blob/master/src/utils/generateCryptoKeys.ts](https://github.com/wpcodevo/deno-rs256-jwt/blob/master/src/utils/generateCryptoKeys.ts)
