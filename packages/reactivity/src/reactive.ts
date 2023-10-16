import {isObject} from "@vue/shared";
import { reactiveHandlers, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";



export function reactive(target) {
    return createReactObj(target, false, reactiveHandlers); // 高阶函数
}

export function shallowReactive(target) {
    return createReactObj(target, false, shallowReactiveHandlers);

}

export function readonly(target) {
    return createReactObj(target, true, readonlyHandlers);

}

export function shallowReadonly(target) {
    return createReactObj(target, true, shallowReadonlyHandlers);

}

// 核心实现代理
// 数据结构
const reactiveMap = new WeakMap(); // key 必须是对象,自动垃圾回收
const readonlyMap = new WeakMap();

function createReactObj(target, isReadonly, baseHandlers) {
    if (!isObject(target)) {
        // 不是对象
        return target
    }
    // 是对象
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    // 1. 判断是否已经有代理
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy
    }
    // 2. 代理
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy)
    return proxy

}

// 4 个方法 1. 是不是只读 2. 是不是深层
// 注音核心 proxy  源码采用 柯里化 根据不同的参数
