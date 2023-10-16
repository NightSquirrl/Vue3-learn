// 公共的方法
function isObject(target) {
    return typeof target === 'object' && target !== null;
}
// 对象合并
const extend = Object.assign;

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver);
        if (!isReadonly) {
            return target;
        }
        if (shallow) {
            return res;
        }
        // key 是一个对象
        // 面试 懒代理
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
    };
}
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        // 触发更新
        return Reflect.set(target, key, value, receiver);
    };
}
// get
const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
// set
const set = createSetter();
const shallowSet = createSetter(true);
const reactiveHandlers = {
    get, set
};
const shallowReactiveHandlers = {
    get: shallowGet, set: shallowSet
};
// 进行合并
let readonlyObj = {
    set: (target, key) => {
        console.warn(`set ${target} on key ${key} failed`);
    }
};
const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlyObj);
const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,
}, readonlyObj);
//柯里化

function reactive(target) {
    return createReactObj(target, false, reactiveHandlers); // 高阶函数
}
function shallowReactive(target) {
    return createReactObj(target, false, shallowReactiveHandlers);
}
function readonly(target) {
    return createReactObj(target, true, readonlyHandlers);
}
function shallowReadonly(target) {
    return createReactObj(target, true, shallowReadonlyHandlers);
}
// 核心实现代理
// 数据结构
const reactiveMap = new WeakMap(); // key 必须是对象,自动垃圾回收
const readonlyMap = new WeakMap();
function createReactObj(target, isReadonly, baseHandlers) {
    if (!isObject(target)) {
        // 不是对象
        return target;
    }
    // 是对象
    const proxyMap = isReadonly ? readonlyMap : reactiveMap;
    // 1. 判断是否已经有代理
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    // 2. 代理
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}
// 4 个方法 1. 是不是只读 2. 是不是深层
// 注音核心 proxy  源码采用 柯里化 根据不同的参数

export { reactive, readonly, shallowReactive, shallowReadonly };
//# sourceMappingURL=reactivity.esm-bundler.js.map
