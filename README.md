# The order i did things in:

- created a github repo with an accurate name and project description

- initialized a React project with Vite and TypeScript. (npm create vite@latest my-app-name)

- removed boilerplate code and built and ran the Vite development server

- I also went into vite.config.ts as I've done in the past and added the following property to the server: { port: 3000, open: true }. This was done as port 3000 is just a personal preference, setting open to true allows the app to open in the browser when the Vite server starts up, which speeds development.

- researched how to implement websockets and tools like socket.io

- found and followed the socket.io docs to start creating a server

- copied their starter code, ran it locally with the node command, and was greeted with "User connected"

- I realized that I cannot run this server and vite at the same time in my terminal, so I installed the concurrency package (npm install concurrency --save-dev) to let me perform concurrent commands ("dev": "concurrently \"node server.cjs\" \"vite\"",)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
