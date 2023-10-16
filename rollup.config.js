// 通过 rollup 打包


// 1. 引入相关依赖

import ts from "rollup-plugin-typescript2"; // 解析 ts
import json from "@rollup/plugin-json"; // 解析 json
import resolvePlugin from "@rollup/plugin-node-resolve"; // 解析第三方依赖
import path from "path" // 处理路径


// 2. 获取打包目录

let packagesDir = path.resolve(__dirname, "packages");

// 2.1 获取需要打包的包

let packageDir = path.resolve(packagesDir, process.env.TARGET)

// 2.2 获取每个包的配置
let resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve(`package.json`));
const packageOptions = pkg.buildOptions || {};
const name = packageOptions.filename || path.basename(packageDir)

// 3. 创建映射表
const outputOptions = {
    "esm-bundler": {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: "es"
    },
    "cjs": {
        file: resolve(`dist/${name}.cjs.js`),
        format: "cjs"
    },
    "global": {
        file: resolve(`dist/${name}.global.js`),
        format: "iife"
    }
}

// rollup 需要导出一个配置
const options = pkg.buildOptions;
function  createConfig(format,output) {
    output.name = options.name;
    output.sourcemap = true
    return {
        input: resolve(`src/index.ts`),
        output,
        plugins: [
            json(),
            ts({
                tsconfig: path.resolve(__dirname, "tsconfig.json"),
            }),
            resolvePlugin()
        ]
    }

}
export  default  options.formats.map(format=>createConfig(format, outputOptions[format]))
