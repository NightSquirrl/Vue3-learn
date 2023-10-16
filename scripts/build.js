// 进行打包 monerepo
// 获取打包目录
// const fs = require("fs");
import fs from 'fs';
import {execa} from 'execa';
// 文件夹 才进行打包
const dirs = fs.readdirSync('packages').filter(p => {
    return fs.statSync(`packages/${p}`).isDirectory();

});


// 并行打包
async  function  build(target) {
    console.log(target,12312)
    // -c 执行 rollup 配置 , 环境变量
 await  execa("rollup",["-c","--environment",`TARGET:${target}`,"--bundleConfigAsCjs"],{stdio:"inherit"})
}

async function runParaller(dirs, itemfn) {
    let result = [];

    for (const dir of dirs) {
        result.push(itemfn(dir))
    }

    return Promise.all(result)
}

runParaller(dirs, build).then(() => {
    console.log('打包成功')
})

console.log(dirs)

