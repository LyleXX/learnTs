// 类型查询操作符：typeof
// ts中有两种功能不同的typeof:     1.js中，用于检查变量类型的typeof,返回'string'/'number'/'object'/'undefined'等值          2.ts新增用于类型查询的typeof，即Type Query Operator,这个Typeof返回的是一个TypeScript类型
const str83 = 'lyle'
const obj85 = { name: 'lyle' }
const nullVar = null
const undefinedVar = undefined

const func87 = (input: string) => {
  return input.length > 10
}

type Str = typeof str83 //'lyle'
type Obj = typeof obj85 // {name:string}
type Null = typeof nullVar // null 
type Undefined = typeof undefinedVar  // undefined
type Func = typeof func87  //(input:string) => boolean

// 还可以在工具类型中使用typeof
const func819: typeof func87 = (name: string) => {
  return name === 'lyle'
}

// ReturnType工具类型，返回一个函数类型中返回值位置的类型
type FuncReturnType = ReturnType<typeof func87> // func87返回值类型是boolean，所以FuncReturnType的类型是boolean

// typeof返回的类型就是鼠标移到变量名上推导出的类型。是最窄的推导程度（字面量类型级别）。
// 在逻辑代码中的typeof一定是js中的typeof，类型代码（如类型标注，类型别名等）中一定是类型查询的typeof。为了更好的避免这种情况，也就是隔离类型层和逻辑层，类型查询操作符后市不允许使用表达式的

const isInputValid = (input: string) => {
  return input.length > 10
}
let isValid: typeof isInputValid('lyle') //不允许表达式







// 类型守卫
// 使用if条件表达式进行类型保护
declare const strOrNumOrBool842: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  // 一定是数字！
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  // 一定是布尔值！
  strOrNumOrBool === true;
} else {
  // 要是走到这里就说明有问题！
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}

// 类型控制流分析做不到跨函数上下文进行类型的信息收集
function isString(input: unknown): boolean {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 类型“string | number”上不存在属性“replace”。
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
// 使用is关键字来显式的提供类型信息
// isString873函数称为类型守卫
function isString873(input: unknown): input is string {
  return typeof input === 'string'
}
function foo873(input: string | number) {
  if (isString873(input)) {
    (input).replace('lyle', 'lyle220')
  }
  if (typeof input === 'number') { }
}
// input is string解析： input是函数的某个参数;      is string,即is关键字 + 预期类型，如果这个函数成功返回为true，is关键字前这个入参的类型，就会被这个类型守卫调用方后续的类型控制流分析收集到

// 类型守卫函数不会对判断逻辑和实际类型的关联进行检查
// 从这个角度来看，其实类型守卫有些类似于类型断言，但类型守卫更宽容，也更信任你一些。你指定什么类型，它就是什么类型。
function isString886(input: unknown): input is number {
  return typeof input === 'string'
}
function foo890(input: string | number) {
  if (isString886(input)) {
    // 这里的input是number类型
    (input).replace('lyle', 'lyle22')
  }
  if (typeof input === 'number') { }
}

//  除了使用简单的原始类型以外，我们还可以在类型守卫中使用对象类型、联合类型等，比如下面我开发时常用的两个守卫：
export type Falsy = false | "" | 0 | null | undefined
export const isFalsy = (val: unknown): val is Falsy => !val

function foo8102(val) {
  if (isFalsy(val)) {
    console.log(val);
    // val是Falsy类型
  }
}

// 不包括不常用的symbol 和 bigint
export type Primitive = string | number | boolean | undefined

export const isPrimitive = (val: unknown): val is Primitive => ['string', 'number', 'boolean', 'undefined'].includes(typeof val)







// 基于in 和 instanceof 的类型保护
// js：key in object判断key是否存在object或其原型链上（true表示存在）
interface Foo8122 {
  foo: string,
  fooOnly: boolean,
  shared: number
}
interface Bar8127 {
  bar: string,
  barOnly: boolean,
  shared: number
}
function handle(input: Foo8122 | Bar8127) {
  if ('foo' in input) {
    input.fooOnly
  } else {
    input.barOnly
    input.fooOnly
  }
}
// 用shared区分
// Foo 与 Bar 都满足 'shared' in input 这个条件。因此在 if 分支中， Foo 与 Bar 都会被保留，那在 else 分支中就只剩下 never 类型。
function handle8141(input: Foo8122 | Bar8127) {
  if ('shared' in input) {
    input.fooOnly
  } else {
    input.barOnly
  }
}
// 在Foo8122和Bar8127中,foo/fooOnly/bar/barOnly是独有属性,可以作为"可辨识属性".Foo8122和Bar8127称为"可辨识联合类型"

// 可辨识属性可以是结构层面的:结构A的属性prop是数组,结构B的属性prop是对象;或者结构A存在属性prop而结构B不存在
// 可以是共同属性的字面量类型差异
function ensureArray(input: number | number[]): number[] {
  if (Array.isArray(input)) {
    return input
  } else {
    return [input]
  }
}
interface Foo8160 {
  kind: 'foo',
  diffType: string,
  fooOnly: boolean,
  shared: number
}
interface Bar8166 {
  kind: 'bar',
  diffType: number,
  barOnly: boolean,
  shared: number
}
function handle8172(input: Foo8160 | Bar8166) {
  if (input.kind === 'foo') {
    input.fooOnly
  } else {
    input.barOnly
  }
}
// 对于同名但不同类型的属性，我们需要使用字面量类型的区分，并不能使用简单的 typeof
function handle8180(input: Foo8160 | Bar8166) {
  if (typeof input.diffType === 'string') {
    input.fooOnly
  } else {
    input.barOnly
  }
}


// instanceof 进行类型保护
class FooBase { }
class BarBase { }
class Foo extends FooBase {
  fooOnly() { }
}
class Bar extends BarBase {
  barOnly() { }
}
function handle8198(input: Foo | Bar) {
  if (input instanceof FooBase) {
    input.fooOnly()
  } else {
    input.barOnly()
  }
}





// 类型断言守卫
// asserts
let name: any = 'lyly'
assert(typeof name === 'number')
name.toFixed() //正常来说是number类型

// 上面这段代码在运行时会抛出一个错误，因为 assert 接收到的表达式执行结果为 false。这其实也类似类型守卫的场景：如果断言不成立，比如在这里意味着值的类型不为 number，那么在断言下方的代码就执行不到（相当于 Dead Code）。如果断言通过了，不管你最开始是什么类型，断言后的代码中就一定是符合断言的类型，比如在这里就是 number。


// 断言守卫和类型守卫最大的不同点在于，在判断条件不通过时，断言守卫需要抛出一个错误，类型守卫只需要剔除掉预期的类型
// 这里的抛出错误可能让你想到了 never 类型，但实际情况要更复杂一些，断言守卫并不会始终都抛出错误，所以它的返回值类型并不能简单地使用 never 类型。为此，TypeScript 3.7 版本专门引入了 asserts 关键字来进行断言场景下的类型守卫，比如前面 assert 方法的签名可以是这样的：
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}
// 对于 assert(typeof name === 'number'); 这么一个断言，如果函数成功返回，就说明其后续的代码中 condition 均成立，也就是 name 神奇地变成了一个 number 类型。

// condition 可以结合使用 is 关键字来提供进一步的类型守卫能力
let name8229: any = 'lyle'

function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== 'number') {
    throw new Error('Not a number')
  }
}

assertIsNumber(name8229)
name.toFixed()  // number 类型
// 在这种情况下，你无需再为断言守卫传入一个表达式，而是可以将这个判断用的表达式放进断言守卫的内部，来获得更独立地代码逻辑。





// 拓展阅读
// 接口继承时,子接口中的属性类型需要能够兼容(extends)父接口中的属性类型
interface Struct8247 {
  primitiveProp: string
  objectProp: {
    name: string
  }
  unionProp: string | number
}

interface Struct8255 extends Struct8247 {
  // “primitiveProp”的类型不兼容。不能将类型“number”分配给类型“string”。
  primitiveProp: number,
  // 属性“objectProp”的类型不兼容。
  objectProp: {
    name: number
  },
  // 属性“unionProp”的类型不兼容。
  // 不能将类型“boolean”分配给类型“string | number”。
  unionProp: boolean
}

// 同名接口的同名属性类型要兼容
interface Struct8268 {
  primitiveProp: string
}
interface Struct8268 {
  // 后续属性声明必须属于同一类型。
  // 属性“primitiveProp”的类型必须为“string”，但此处却为类型“number”。
  primitiveProp: number
}


// 接口和类型别名之间的合并
type Base8279 = {
  name: string
}
interface IDerived extends Base8279 {
  // 报错！就像继承接口一样需要类型兼容
  name: number,
  age: number
}

interface IBase8288 {
  name: string
}
// 合并后的 name 同样是 never 类型
type Deiverd = IBase8288 & {
  name: number
}
