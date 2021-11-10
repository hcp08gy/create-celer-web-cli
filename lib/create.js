const { getRepoList, getTagList } = require("./http");
const inquirer = require('inquirer');
const path = require('path');
const util = require('util');
const downloadGitRepo = require('download-git-repo');
const chalk = require('chalk');

async function getRepos() {
    const repoList = await getRepoList();
    const repos = repoList.map(item => item.name);
    const {repo} = await inquirer.prompt([
        {
            type: "list",
            name: "repo",
            choices: repos,
            message: "请选择一个模版"
        }
    ]);
    return repo;
}

async function getTags(repo){
    const tagList = await getTagList(repo)
    const tags = tagList.map(item=>item.name)
    const {tag} = await inquirer.prompt([{
        name:'tag',
        type:'list',
        choices:tags,
        message:'请选择一个版本'
    }])
    return tag
}

//下载
async function onDownload(name,repo,tag){
    const requestUrl = `clay-cli/${repo}${tag?'#'+tag:''}`;//创建下载地址
    const cwd = process.cwd(); //获取当前命令行选择的目录
    const targetPath = path.join(cwd,name); //模板下载所在地址
    const downloadFunc = util.promisify(downloadGitRepo);
    downloadFunc(requestUrl,targetPath);
}

module.exports = async function(name,options){
    const repo = await getRepos();
    console.log('用户选择的模版是：', repo);
    const tag = await getTags(repo);
    console.log('用户选择的版本是：', tag);
    await onDownload(name, repo, tag);
    console.log(`\r\n成功创建项目 ${chalk.cyan(name)}`);
    console.log(`\r\n  cd ${chalk.cyan(name)}`);
    console.log('  npm run dev\r\n');
}