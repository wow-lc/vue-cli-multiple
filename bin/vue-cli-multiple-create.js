#!usr/bin/env node
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
    .usage('create [project-name]')

// 是否安装vue-cli 
if(!hasVueCli) {
    console.log(chalk.red('vue-cli not find  \nplease install vue-cli \nlike: npm install vue-cli -g '));
    process.exit(1);
}

program.parse(process.argv);
if(program.args.length < 1) return program.help();

let projectName = program.args[0];

const spinner = ora({
    text: 'vue-cli genertor now, waiting...',
    spinner:{
        interval: 80, 
        frames: ['-', '+', '-']}
})

spinner.start();

// 生成vue-cli目录 (当前vue-cli默认设置生成)
execSync(`vue create ${projectName} -d`);
deleteFile(`./${projectName}/src`);
spinner.succeed();

console.log(chalk.white('\n custom your multipage pages '));
let question = [
    {
        name: 'rootValue',
        type: 'input',
        message: 'Input UI design draft default rootValue:',
        validate(val) {
            if(val ==='' || val.split(' ').length === 0) {
                return 'rootValue is required!'
            } else if(isNaN(val))  {
                return 'rootValue is not Number!'
            }else {
                return true;
            }
        }
    },
    {
        name: 'moduleNames',
        type: 'input',
        message: 'Input moduleNames (multipage by spaces):',
        validate(val) {
            if(val ==='' || val.split(' ').length === 0) {
                return 'moduleName is required!'
            } else {
                return true;
            }
        }
    }
];

inquirer.prompt(question)
    .then(answer => {
        let {moduleNames, rootValue} = answer;
        let modules = moduleNames.split(' ');
        genertorConfig(modules, rootValue);
    });

// 生成config文件 
function genertorConfig(modules, rootValue) {
    rootValue = rootValue / 10;
    let pageConfig = {};
    mkdirsSync(`./${projectName}/src/pages`);
    copyDirectory(`${__dirname}/../template/lib`, `./${projectName}/src/lib`);
    console.log('coopy rem.js ok');
    // 修改postcss rootValue
    let remStr = fs.readFileSync(`./${projectName}/src/lib/rem.js`,'utf-8');
    let newRemStr = ejs.render(`${remStr}`, {rootValue});
    fs.writeFileSync(`./${projectName}/src/lib/rem.js`, newRemStr);
    // 生成各模块页面文件
    modules.map(module => {
        copyDirectory(`${__dirname}/../template/src`, `./${projectName}/src/pages/${module}`);
        // 修改App.vue模板
        let appTemplate = fs.readFileSync(`./${projectName}/src/pages/${module}/App.vue`,'utf-8');
        let newAppTemplate = ejs.render(`${appTemplate}`, {moduleName: module});
        fs.writeFileSync(`./${projectName}/src/pages/${module}/App.vue`, newAppTemplate);
        pageConfig[module] = {
            title: module
        };
    })
    let pageConfigStr = `
        const pageConfig = ${JSON.stringify(pageConfig)};

        module.exports = pageConfig;
    `;
    fs.writeFileSync(`./${projectName}/src/pages/config.js`, pageConfigStr);
    // vue.config.js copy
    let vueConfig = fs.readFileSync(`${__dirname}/../template/vue.config.js`,'utf-8');
    fs.writeFileSync(`./${projectName}/vue.config.js`, vueConfig);
    console.log('create vue.config.js');
    
    // postcss.config.js copy
    let postcssConfig = fs.readFileSync(`${__dirname}/../template/postcss.config.js`,'utf-8');
    let newPostcssConfig = ejs.render(`${postcssConfig}`, {rootValue});
    fs.writeFileSync(`./${projectName}/postcss.config.js`, newPostcssConfig);
    console.log('create postcss.config.js');
    
    execSync(`cd ${projectName} && npm i postcss-pxtorem`);

    console.log(chalk.green('congratulations! happy coding!'));
    console.log(chalk.green(`\n cd ${projectName} \n npm run serve`));
}
