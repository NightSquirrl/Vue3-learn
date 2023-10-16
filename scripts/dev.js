// 进行打包 monerepo
// 获取打包目录
// const fs = require("fs");
import {execa} from 'execa';


// 并行打包
async  function  build(target) {
    // -c 执行 rollup 配置 , 环境变量
    await  execa("rollup",["-cw","--environment",`TARGET:${target}`,"--bundleConfigAsCjs"],{stdio:"inherit"})
}

build("reactivity")


