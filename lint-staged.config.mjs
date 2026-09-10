const config = {
  "*.{js,mjs,cjs,jsx,ts,tsx}": (files) => [
    `eslint --fix ${files.map((file) => JSON.stringify(file)).join(" ")}`,
    `prettier --write ${files.map((file) => JSON.stringify(file)).join(" ")}`,
  ],
  "*.{json,md,mdx,yml,yaml,css}": "prettier --write",
};

export default config;
