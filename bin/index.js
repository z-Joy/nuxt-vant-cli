const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');

program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    if(!fs.existsSync(name)){
      inquirer.prompt([
        {
          name: 'description',
          message: '请输入项目描述'
        },
        {
          name: 'author',
          message: '请输入作者名称'
        }
      ]).then((answers) => {
        const spinner = ora('download...');
        spinner.start();
        download('https://github.com:z-Joy/nuxt-vant#master', name, {clone: true}, (err) => {
          if(err){
            spinner.fail();
            console.log(chalk.red(err));
          }else{
            spinner.succeed();
            const fileName = `${name}/package.json`;
            const meta = {
              name,
              description: answers.description,
              author: answers.author
            }
            if(fs.existsSync(fileName)){
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            console.log(chalk.green('success'));
          }
        })
      })
    }else{
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  })
program.parse(process.argv);
