#!/usr/bin/env node 

const program = require('commander');

program
    .version(require('../package.json').version)
    .usage('<command> [options]')
    .command('add','add modules')
    .command('create','create vue multipage project')

program.parse(process.argv)