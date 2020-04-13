#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

var fs = require('fs');

var filterDir = require('./filterDir');

const ProgressBar = require("./progressbar");

clear();
const dirPath = process.argv[2];

console.log(
    chalk.yellow(
        figlet.textSync('JS-XML', { horizontalLayout: 'full' })
    )
);

filterDir(dirPath, '.svg', function (err, list) {
    if (err) throw err;
    const Bar = new ProgressBar()
    const total = list.length
    Bar.init(total);
    let current = 0
    list.forEach(element => {
        var fileSvgName = element.split(dirPath+'/')[1]
        var updateNameToJs = fileSvgName.replace('.svg', '.js')
        fs.readFile(element, function (err, buf) {
            var previousValue = buf.toString()
            var file = fs.createWriteStream(`${updateNameToJs}`)
            file.on('error', function (err) { console.log(err) });
            file.write(
                "import React from 'react'" + "\n" +
                "import { SvgXml } from 'react-native-svg'" + "\n" + "\n" +
                "const xml = `" + "\n" +
                `${previousValue}` +
                "`" + `\n` +
                `export default () => <SvgXml xml={xml} width="100%"/>`
            )
            file.end
        });
        current = current + 1;
        Bar.update(current);
    });
    console.log('Finished!')

})
