// 内置类型：any,unknown,never(Top Type:any,unknown ; Bottom Type:never)
// any
let foo1; //隐式推导为any

function func(foo, bar) { } // foo,bar都是any类型

// 被标记为any类型的变量可以拥有任意类型的值
let anyVar: any = 'lyle'
anyVar = false
anyVar = 123
anyVar = {
  test: '1'
}
anyVar = () => {
}

// 标记为具体类型的变量也可以接受任何any类型的值
const val1: string = anyVar
const val2: number = anyVar
const val3: () => {} = anyVar
const val4: {} = anyVar

// any类型变量上可以进行任意操作,可以认为类型推导与检查是被完全禁用的
let anyVar2: any = null
anyVar2.foo.bar.baz()
anyVar[0][1][2].prop1

// unknown
// unknown类型的变量可以再次赋值为any和unknown类型的变量
let unknownVar: unknown = 'lyle'

unknownVar = false
unknownVar = '123'
unknownVar = {
  test: '12'
}

unknownVar = () => { }

const val21: string = unknownVar
const val22: number = unknownVar
const val23: () => {} = unknownVar
const val24: {} = unknownVar

const val25: any = unknownVar
const val26: unknown = unknownVar

// unknown没有放弃类型检查
let unknownVar2: unknown
unknownVar2.foo()

// 虽然这是一个未知的类型，但我跟你保证它在这里就是这个类型！
let unKnown3: unknown
(unKnown3 as { foo: () => {} }).foo()




// never类型
type unionWithNever = 'lyle' | 123 | true | void | never  // 鼠标移上去，never类型被无视了

// never类型不携带任何的类型信息
declare let v1: never
declare let v2: void

v1 = v2
v2 = v1

// never 类型被称为 Bottom Type，是整个类型系统层级中最底层的类型
// 通常不会显式的声明never类型，在只负责抛出错误的函数中是符合逻辑的
function justThrow(): never {
  throw new Error()
}

// 一个返回值类型为never的函数被调用，下方的代码会被视为无效的代码（即无法执行到）
function foo61(input: number) {
  if (input > 1) {
    justThrow()
    // 等同于return后面的代码，即Dead Code
    const name = 'lyle'
  }
}

// 可以利用never进行类型检察
declare const strOrNumOrBool: string | number | boolean

if (typeof strOrNumOrBool === 'string') {
  console.log('str!');

} else if (typeof strOrNumOrBool === 'number') {
  console.log('num!');

} else if (typeof strOrNumOrBool === 'boolean') {
  console.log('bool!');

}
else if (typeof strOrNumOrBool === 'undefined') {
  console.log('bool!');
  // 此时strOrNumOrBool是never类型。可以将鼠标移上去查看
}
else {
  throw new Error(`UnKnown input type:${strOrNumOrBool}`)
}


// 每经过一个 if 语句处理，strOrNumOrBool 的类型分支就会减少一个（因为已经被对应的 typeof 处理过）。而在最后的 else 代码块中，它的类型只剩下了 never 类型
if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  strOrNumOrBool === true;
} else {
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}

// 此时这个未标明类型的数组被推导为了 never[] 类型，这种情况仅会在你启用了 strictNullChecks 配置，同时禁用了 noImplicitAny 配置时才会出现。解决的办法也很简单，为这个数组声明一个具体类型即可。
// const arr = [];

// arr.push("linbudu"); // 类型“string”的参数不能赋给类型“never”的参数。