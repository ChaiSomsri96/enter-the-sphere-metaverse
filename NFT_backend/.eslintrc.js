const OFF   = 0;
const WARN  = 1;
const ERROR = 2;

module.exports = {
  parser: "espree",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module" 
  },
  rules: {
    "semi": [OFF, "always"],
    "curly": [WARN, "all"],
  }
};
