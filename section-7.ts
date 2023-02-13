// 类型别名
// 更推荐的方式是，interface用来描述对象、类的结构，而类型别名用来将一个函数签名、一组联合类型、一个工具类型等等抽离成一个完整独立的类型。但大部分场景下接口结构都可以被类型别名所取代，因此，只要你觉得统一使用类型别名让你觉得更整齐，也没什么问题。
type A = string

// 类型别名的作用主要是对一组类型或一个特定类型结构进行封装，以便于在其它地方进行复用
// 抽离一组联合类型
type StatusCode = 200 | 300 | 400 | 500 | 502
type PossibleDataTypes = string | number | (() => unknown)
const status71: StatusCode = 502
const status72: StatusCode = 501

// 抽离一个函数类型
type Handle73 = (e: Event) => void

const clickHandle: Handle73 = (e) => { }
const moveHandle: Handle73 = (e) => { }
const dragHandle: Handle73 = (e) => { }

// 声明一份对象，类似接口
type ObjType = {
  name: string,
  age: number
}

// 工具类型
// 工具类型基于类型别名，多个泛型
type Factory<T> = T | number | string

const foo74: Factory<boolean> = true

// 一般不会直接使用工具类型做类型标注，而是再声明一个新的类型别名
type FactoryWithBool = Factory<boolean>
const foo75: FactoryWithBool = false

// 泛型参数的名称（上面的 T ）也不是固定的。通常我们使用大写的 T / K / U / V / M / O ...这种形式。如果为了可读性考虑，我们也可以写成大驼峰形式（即在驼峰命名的基础上，首字母也大写）的名称，比如：

type Factory76<NewType> = NewType | number | string;

// 声明一个简单，有实际意义的工具类型
type MaybeNull<T> = T | null //这个工具类型会接受一个类型，并返回一个包括 null 的联合类型。这样一来，在实际使用时就可以确保你处理了可能为空值的属性读取与方法调用
function process(input: MaybeNull<{ handler: () => {} }>) {
  input?.handler()
}

//类似的还有 MaybePromise、MaybeArray。这也是我在日常开发中最常使用的一类工具类型：

type MaybeArray<T> = T | T[];

// 函数泛型我们会在后面了解~
function ensureArray<T>(input: MaybeArray<T>): T[] {
  return Array.isArray(input) ? input : [input];
}





// 联合类型与交叉类型
// 交叉类型
interface NameStruct {
  name: string
}
interface AgeStruct {
  age: number
}

type ProfileStruct = NameStruct & AgeStruct
const profile: ProfileStruct = {
  name: 'lyle',
  age: 18
}

// 对于原始类型的交叉类型,会得到never
type StrAndNum = string & number

// 对象类型的交叉类型，其内部的同名属性类型同样会按照交叉类型进行合并
type Struct777 = {
  primitiveProp: string,
  objectProp: {
    name: string
  }
}
type Struct783 = {
  primitiveProp: number,
  objectProp: {
    age: number
  }
}
type Composed = Struct777 & Struct783
type PrimitivePropType = Composed['primitiveProp']
type ObjectPropType = Composed['objectProp']

// 联合类型的交叉类型(取交叉类型的交集)
type UnionIntersection1 = (1 | 2 | 3) & (1 | 2) // 1 | 2
type UnionIntersection2 = (string | number | symbol) & string // string
// 总结一下交叉类型和联合类型的区别就是，联合类型只需要符合成员之一即可（||），而交叉类型需要严格符合每一位成员（&&）



// 索引类型
// 1.索引签名类型（快速声明一个键值类型一致的类型结构）
interface AllStringTypes {
  [key: string]: string
}
type AllStringTypes7105 = {
  [key: string]: string
}
// 即使你还没声明具体的属性，对于这些类型结构的属性访问也将全部被视为 string 类型
type propType7109 = AllStringTypes['lyle']
type PropType7110 = AllStringTypes['123']
// 声明的键的类型为[key:string]，只能声明字符串类型的键
// 由于 JavaScript 中，对于 obj[prop] 形式的访问会将数字索引访问转换为字符串索引访问，也就是说， obj[599] 和 obj['599'] 的效果是一致的。因此，在字符串索引签名类型中我们仍然可以声明数字类型的键。类似的，symbol 类型也是如此
const foo7112: AllStringTypes = {
  'lu': '123',
  223: '1',
  [Symbol("ddd")]: 'symbol'
}

// 索引签名类型也可以和具体的键值对类型声明并存，但这时这些具体的键值类型也需要符合索引签名类型的声明
interface AllStringTypes7120 {
  // 类型“number”的属性“propA”不能赋给“string”索引类型“boolean”。
  propA: number;
  [key: string]: boolean;
}
// 这里的符合即指子类型，因此自然也包括联合类型
interface StringOrBooleanTypes {
  propA: number;
  propB: boolean;
  [key: string]: number | boolean;
}

// 索引签名类型的一个常见场景是在重构 JavaScript 代码时，为内部属性较多的对象声明一个 any 的索引签名类型，以此来暂时支持对类型未明确属性的访问，并在后续一点点补全类型
interface AnyTypeHere {
  [key: string]: any
}
const foo7136: AnyTypeHere['lyle'] = 'any value'


// 2.索引类型查询(keyof)
// 索引类型查询，可以将对象中的所有键转换为字面量类型,然后再组合成联合类型。数字类型的键名不会被转换，仍然保持为数字类型字面量
interface Foo7141 {
  lyle: 1,
  123: 2
}
type FooKeys = keyof Foo //"lyle" | 599
// 从键名到联合类型的过程
// type FooKeys7147 = Object.keys(Foo).join("|")

// keyof 可以应用在any上，keyof any生产一个联合类型，由所有可用作对象键值的类型组成：string|number|symbol;是由无数字面量类型组成的，keyof的产物必定是一个联合类型

// 3.索引类型访问
// 在 JavaScript 中我们可以通过 obj[expression] 的方式来动态访问一个对象属性（即计算属性），expression 表达式会先被执行，然后使用返回值来访问属性。而 TypeScript 中我们也可以通过类似的方式，只不过这里的 expression 要换成类型。
interface NumberRecord {
  [key: string]: number
}
// 访问方式与返回值均是类型
type PropType = NumberRecord[string] //number
// 通过字面量类型进行索引类型访问
// 这里的'propA'和'propB'都是字符串字面量类型，而不是一个javaScript字符串值。
// 索引类型查询的本质：通过键的字面量类型('propA')访问这个键对应的键值类型(number)
interface Foo7159 {
  propA: number,
  propB: boolean
}
type PropAType = Foo7159['propA'] // number
type PropBType = Foo7159['propB'] // boolean

// 访问keyof获取到的联合类型
// 使用字面量联合类型进行索引类型访问时，其结果就是将联合类型每个分支对应的类型进行访问后的结果，重新组装成联合类型。索引类型查询、索引类型访问通常会和映射类型一起搭配使用，前两者负责访问键，而映射类型在其基础上访问键值类型
interface Foo7169 {
  propA: number,
  propB: string,
  propC: boolean
}
type PropTypeUnion = Foo7169[keyof Foo7169] // number | string | boolean

// 在未声明索引签名类型的情况下，不能使用obj[string]这种原始类型的访问方式，只能通过键名的字面量类型进行访问
interface Foo7178 {
  propA: number
}
type PropAType7181 = Foo[string]








// 映射类型（类型编程的第一步）
// 基于键名映射到键值类型
type Stringify<T> = {
  [k in keyof T]: string
}
// 这个工具类型会接受一个对象类型（假设我们只会这么用），使用 keyof 获得这个对象类型的键名组成字面量联合类型，然后通过映射类型（即这里的 in 关键字）将这个联合类型的每一个成员映射出来，并将其键值类型设置为 string。
interface Foo7196 {
  prop1: string,
  prop2: number,
  prop3: boolean,
  prop4: () => void
}

type StringifiedFoo = Stringify<Foo7196>

// 等价于
interface StringifiedFoo7206 {
  prop1: string,
  prop2: string,
  prop3: string,
  prop4: string
}
// 使用伪代码的形式进行说明
// const StringifiedFoo = {}
// for (const k of Object.keys(Foo7196)) {
//   StringifiedFoo[k] = string
// }

// 可以拿到键，键值类型也可以拿到
// 这里的T[K]其实就是上面说到的索引类型访问，我们使用键的字面量类型访问到了键值的类型，这里就相当于克隆了一个接口。需要注意的是，这里其实只有K in 属于映射类型的语法，keyof T 属于 keyof 操作符，[K in keyof T]的[]属于索引签名类型，T[K]属于索引类型访问。
type Clone<T> = {
  [k in keyof T]: T[k]
}

// 总结
import image from './images/section-7-1.png'