#!/usr/bin/env node

const commander = require("commander");

commander
  .version("1.0.0")
  .command("key", "Manage API key -- https://nomics.com")
  .command("check", "Check coin price info")
  .parse(process.argv);
