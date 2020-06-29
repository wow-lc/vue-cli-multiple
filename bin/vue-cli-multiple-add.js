#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

// 模板地址
const tplUrl = `${__dirname}/../template.json`;
const tplObj = require(tplUrl);

let question = [
    {
        name: 'name',
        type: 'input',
        message: '请输入模块名',
        validate(val) {
            if(val ==='') {
                return 'Name is required!'
            } else if(tplObj[val]){
                return "val has already existed!"
            } else {
                return true;
            }
        }
    },
    {
        name: 'url',
        input: 'input',
        message: '请输入模版地址',
        validate(val) {
            if(val === '') {
                return 'The url is required!'
            } else {
                return true;
            }
        }
    }
];

inquirer
    .prompt(question).then(answer => {
        let {name, url} = answer;
        tplObj[name] = url;
        fs.writeFile(tplUrl, JSON.stringify(tplObj), 'utf-8',err => {
            if(err) console.log(err);
            console.log('\n');
            console.log(chalk.green('add successfully'));
            console.log(chalk.grey('tplObj is : '));
            console.log(tplObj);
            console.log('\n');
        })
    })

