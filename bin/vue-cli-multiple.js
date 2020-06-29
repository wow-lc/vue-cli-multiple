#!/usr/bin/env node 

const program = require('commander');

program
    .version(require('../package.json').version)
    .usage('<command> [options]')
    .command('add','add some things')
    .command('init','init vue project')
    .command('create','create vue multipage project')

program.parse(process.argv)