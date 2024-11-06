const { loadEnvConfig } = require("@next/env");

const projectDir = process.cwd();
console.log(loadEnvConfig(projectDir));
