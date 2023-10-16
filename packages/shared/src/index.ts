// 公共的方法

export function  isObject(target) {
    return typeof target === 'object' && target !== null
}

// 对象合并
export const extend = Object.assign;
