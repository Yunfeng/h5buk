module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/essential'
  ],
  plugins: ["flowtype"],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
