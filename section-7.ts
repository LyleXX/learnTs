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