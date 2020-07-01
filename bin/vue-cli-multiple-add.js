#!/usr/bin/env node

const program = require('commander');
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer')
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const { exec, execSync } = require('child_process');

const { deleteFile, mkdirsSync, copyDirectory } = require('../utils/tool');
const {hasVueCli} = require('../utils/env'); 



program
    .usage('add')

// 是否安装vue-cli 
if(!hasVueCli) {
    console.log(chalk.red('vue-cli not find  \nplease install vue-cli \nlike: npm install vue-cli -g '));
    process.exit(1);
}

console.log(chalk.white('custom multipage pages \n'));
let question = [
    {
        name: 'moduleNames',
        type: 'input',
        message: 'Input moduleNames (multipage by spaces):',
        validate(val) {
            if(val ==='' || val.split(' ').length === 0) {
                return 'moduleNames is required!'
            } else {
                return true;
            }
        }
    }
];

inquirer.prompt(question)
    .then(answer => {
        let {moduleNames} = answer;
        let modules = moduleNames.split(' ');
        genertorConfig(modules);
    });

// 生成config文件 
function genertorConfig(modules) {
    let pageConfig = {};
    mkdirsSync(`./src/pages`);
    modules.map(module => {
        copyDirectory(`${__dirname}/../template/src`, `./src/pages/${module}`);
        // 修改App.vue模板
        let appTemplate = fs.readFileSync(`./src/pages/${module}/App.vue`,'utf-8');
        let newAppTemplate = ejs.render(`${appTemplate}`, {moduleName: module.toUpperCase()});
        fs.writeFileSync(`./src/pages/${module}/App.vue`, newAppTemplate);
        pageConfig[module] = {
            title: module
        };
    })

    const oldPageConfigStr = fs.readFileSync(`./src/pages/config.js`,'utf-8');
    
    const oldPageConfig = JSON.parse(/=(.+?);/g.exec(oldPageConfigStr)[1]);
    let pageConfigStr = `
        const pageConfig = ${JSON.stringify({...oldPageConfig, ...pageConfig})};

        module.exports = pageConfig;
    `;
    fs.writeFileSync(`./src/pages/config.js`, pageConfigStr);

    console.log(chalk.green(`add modules [${modules.join(',')}] success !`));
}
