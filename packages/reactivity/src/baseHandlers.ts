import {isObject,extend} from "@vue/shared";
import {reactive, readonly} from "./reactive";


function createGetter(isReadonly = false, shallow = false) {

    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver)
        if (!isReadonly) {
            return target
        }
        if(shallow) {
            return res
        }
        // key 是一个对象
        // 面试 懒代理
        if(isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
    }
}

function  createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        // 触发更新
        return Reflect.set(target, key, value, receiver)
    }

}

// get
const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)


// set
const set = createSetter()
const shallowSet = createSetter(true)

export const reactiveHandlers = {
    get,set
}
export const shallowReactiveHandlers = {
    get: shallowGet,set:shallowSet


}
// 进行合并
let readonlyObj = {
    set:(target,key)=> {
        console.warn(`set ${target} on key ${key} failed`)
    }
}
export const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlyObj)


export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,
}, readonlyObj)


//柯里化
