// 泛型

// 类型别名中的泛型
type Factory<T> = T | number | string
// 返回值一样的伪代码,加深理解
function Factory(typeArg) {
  return [typeArg, number, string]
}

// 类型别名中的泛型大多是用来进行根据类型封装
// Stringify 会将一个对象类型的所有属性类型置为 string ，而 Clone 则会进行类型的完全复制
type Stringify<T> = {
  [k in keyof T]: string
}

type Clone<T> = {
  [k in keyof T]: T[k]
}

// TypeScript内置工具类型实现
type Partial921<T> = {
  [P in keyof T]?: T[P]
}
// 添加的?表示属性均为可选
interface IFoo {
  prop1: string,
  prop2: number,
  prop3: boolean,
  prop4: () => void
}

type PartialIFoo932 = Partial921<IFoo>

// 等价于
interface PartialIFoo935 {
  prop1?: string,
  prop2?: number,
  prop3?: boolean,
  prop4?: () => void
}

// 条件类型
// 在条件类型参与的情况下，通常泛型会被作为条件类型中的判断条件（T extends Condition，或者 Type extends T）以及返回值（即 : 两端的值），这也是我们筛选类型需要依赖的能力之一。
type IsEqual<T> = T extends true ? 1 : 2
type A = IsEqual<true> //1
type B = IsEqual<false>  //2
type C = IsEqual<'123'>  //2


// 泛型默认值
type Factory951<T = boolean> = T | number | string
//不传T的时候会用T的默认值
const foo953: Factory951 = false

// 泛型约束
// 函数中只能在逻辑中处理
function add(source: number, add: number) {
  if (typeof source !== 'number' || typeof add !== 'number') {
    throw new Error('invalid arguments!')
  }
  return source + add
}
// 使用extends关键字约束传入的泛型参数必须符合要求
// A extends B 分为以下几类
// 更精确，如字面量类型是对应原始类型的子类型：'lyle' extends string, 599 extends number。    联合类型子集均为联合类型的子类型：1,1|2是1|2|3|4的子类型
// 更复杂:{name:string} 是 {} 的子类型，基类与派生类（父类与子类）同理


// 约束ResCode是number类型
type ResStatus<ResCode extends number> = ResCode extends 10000 | 10001 | 10002 ? 'success' : 'failure'

type Res1 = ResStatus<10000>  //'success'
type Res2 = ResStatus<20000>  //'failure'
type Res3 = ResStatus<'10000'>

// 与此同时，如果我们想让这个类型别名可以无需显式传入泛型参数也能调用，并且默认情况下是成功地，这样就可以为这个泛型参数声明一个默认值：

type ResStatus978<ResCode extends number = 10000> = ResCode extends 10000 | 10001 | 10002
  ? 'success'
  : 'failure';

type Res4 = ResStatus978 // "success"







// 多泛型关联
// 多泛型参数其实就像接受更多参数的函数，其内部的运行逻辑（类型操作）会更加抽象，表现在参数（泛型参数）需要进行的逻辑运算（类型操作）会更加复杂
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult;

//  "passed!"
type Result1 = Conditional<'lyle', string, 'passed!', 'rejected!'>;

// "rejected!"
type Result2 = Conditional<'lyle', boolean, 'passed!', 'rejected!'>;


type ProcessInput<
  Input,
  SecondInput extends Input = Input,
  ThirdInput extends Input = SecondInput
> = number;
// 这个工具类型接受 1-3 个泛型参数。
// 第二、三个泛型参数的类型需要是首个泛型参数的子类型。
// 当只传入一个泛型参数时，其第二个泛型参数会被赋值为此参数，而第三个则会赋值为第二个泛型参数，相当于均使用了这唯一传入的泛型参数。
// 当传入两个泛型参数时，第三个泛型参数会默认赋值为第二个泛型参数的值。




// 对象类型中的泛型
interface IRes<TData = unknown> {
  code: number,
  error?: string,
  data: TData
}
// 这个接口预留了响应数据的泛型坑位，可以在请求的函数中传入特定的响应类型
interface IUserProfileRes {
  name: string,
  homepage: string,
  avatar: string
}
function fetchUserProfile(): Promise<IRes<IUserProfileRes>> { }

type StatusSucceed = boolean
function handleOperation(): Promise<IRes<StatusSucceed>> { }
// 泛型嵌套
// 简单的泛型参数填充
interface IPaginationRes<TItem = unknown> {
  data: TItem[];
  page: number;
  totalCount: number;
  hasNextPage: boolean;
}

function fetchUserProfileList(): Promise<IRes<IPaginationRes<IUserProfileRes>>> { }