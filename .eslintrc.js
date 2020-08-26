module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
  },
  extends: [
    "airbnb-base",
    "plugin:vue/recommended",
    "prettier/vue",
    "plugin:prettier/recommended",
  ],

  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "class-methods-use-this": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "implicit-arrow-linebreak": "off",
    "import/prefer-default-export": "off",
    "vue/component-name-in-template-casing": [
      "error",
      "kebab-case",
      {
        ignores: [],
      },
    ],
    "no-plusplus": [1, { allowForLoopAfterthoughts: true }],
    "no-param-reassign": [1, { props: false }],
    "no-return-assign": [1, "except-parens"],
    "no-underscore-dangle": [0, "allow"],
    "vue/no-v-html": [0],
    "no-bitwise": [2, { allow: ["<<", "&=", "&", ">>", "|", "~"] }],
    "consistent-return": [0],
    "no-console": [1],
    "prettier/prettier": ["error", { singleQuote: false, endOfLine: "auto" }],
  },
};
