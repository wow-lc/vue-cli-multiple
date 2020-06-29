#!usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const download = require('download-git-repo');

const tplUrl = `${__dirname}/../template.json`;
const tplObj = require(tplUrl);

program
    .usage('<template-name> [project-name]')
program.parse(process.argv);

if(program.args.length < 1) return program.help();

let templateName = program.args[0]
let projectName = program.args[1]
if (!tplObj[templateName]) {
  console.log(chalk.red('\n Template does not exit! \n '))
  return
}
if (!projectName) {
  console.log(chalk.red('\n Project should not be empty! \n '))
  return
}

url = tplObj[templateName];

console.log(chalk.white('\n Start generating... \n'));
const sipnner = ora('download...');
sipnner.start();

// 执行下载
download(url, projectName, err => {
    if(err) {
        sipnner.fail();
        console.log(chalk.red(`Generation failed. ${err}`));
        return;
    }

    sipnner.succeed();
    console.log(chalk.green('\n Generation completed!'))
    console.log('\n To get started')
    console.log(`\n    cd ${projectName} \n`)
})