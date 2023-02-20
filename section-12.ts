// 条件类型判断
// extends判断兼容性的时候，不需要类型完全相等，只需要具有兼容性

// 条件类型和泛型一起使用，可以基于填充后的泛型做进一步的类型操作
type LiteralType<T> = T extends string ? "string" : "other"

type Res127 = LiteralType<'lyle'> // "string"
type Res128 = LiteralType<599>  // "other"

// 条件类型也可以使用多层嵌套
export type LiteralType1211<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends null
  ? "null"
  : T extends undefined
  ? "undefined"
  : never

type Res1223 = LiteralType1211<'lyle'> // "string"
type Res1224 = LiteralType1211<123> // "number"
type Res1225 = LiteralType1211<true> // "boolean"

// 条件类型与泛型搭配
function universalAdd<T extends number | bigint | string>(x: T, y: T): LiteralToPrimitive<T> { return x + (y as any) }

export type LiteralToPrimitive<T> = T extends number
  ? number
  : T extends bigint
  ? bigint
  : T extends string
  ? string
  : never

universalAdd('lyle', '123') // T推导为 'lyle'|'123',返回值类型为string
universalAdd(123, 321) //T推导为 123|321，返回值类型为number
universalAdd(10n, 10n) // T 推导为10n，返回值为bigint

// 条件类型还可以用来对更复杂的类型进行比较，比如函数类型
type Func = (...args: any[]) => any

type FunctionConditionType<T extends Func> = T extends (...args: any[]) => string ? 'A string return func!' : "A none-string return func!"

type StringResult = FunctionConditionType<() => string>  //  'A string return func!'
type NonStringResult1 = FunctionConditionType<() => boolean>  // "A none-string return func!"
type NonStringResult2 = FunctionConditionType<() => number>  // "A none-string return func!"


// infer关键字
// TypeScript 中支持通过 infer 关键字来在条件类型中提取类型的某一部分信息
type FunctionReturnType<T extends Func> = T extends (
  ...args: any[]
) => infer R ? R : never
// 当传入的类型参数满足 T extends (...args:any[]) => infer R，返回infer R位置的值 R，否则返回never
// infer是inference的缩写，意为推断，infer R中的R就是 待推断的类型，
// infer只能在条件类型中使用，因为实际上仍然需要类型结构是一致的
// 上例中类型信息需要是一个函数类型结构，我们才能提取出它的返回值类型。如果连函数类型都不是，那我只会给你一个 never 

// 这样的类型结构不局限于函数类型结构，还可以是数组
type Swap1263<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T

type SwapResult1 = Swap1263<[1, 2]> // 符合元组结构，类型为[2,1]
type SwapResult2 = Swap1263<[1, 2, 3]> // 不符合元组结构，没有发生替换，类型为[1,2,3]

// 使用rest操作符处理任意长度的情况
// infer 甚至可以和 rest 操作符一样同时提取一组不定长的类型
// 提取首尾两个
type ExtractStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...any[],
  infer End
] ? [Start, End] : T
// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T;
// 调换开头两个
type SwapFirstTwo<T extends any[]> = T extends [
  infer Start1,
  infer Start2,
  ...infer Left
]
  ? [Start2, Start1, ...Left]
  : T;


// 结构层面的转换
type ArrayItemType<T> = T extends Array<infer ElementType> ? ElementType : never

type ArrayItemTypeResult1 = ArrayItemType<[]> // never
type ArrayItemTypeResult2 = ArrayItemType<string[]> // string
// 这里的[string,number] 等价于 (string | number)[]
type ArrayItemTypeResult3 = ArrayItemType<[string, number]> // string | number


// 除了数组，infer结构可以是接口
// 提取对象的属性类型
type PropType12105<T, K extends keyof T> = T extends { [key in K]: infer R } ? R : never

type PropTypeResult1 = PropType12105<{ name: string }, 'name'> // string
type PropTypeResult2 = PropType12105<{ name: string; age: number }, 'name' | 'age'> // string | number

// 反转键名与键值
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<infer K, infer V> ? Record<V & string, K> : never
type ReverseKeyValueResult1 = ReverseKeyValue<{ 'key': 'value' }>  // {'value':'key'}

// 为了体现 infer 作为类型工具的属性，我们结合了索引类型与映射类型，以及使用 & string 来确保属性名为 string 类型的小技巧。
// 不使用这个方法时
// 类型“V”不满足约束“string | number | symbol”。
type ReverseKeyValue2<T extends Record<string, string>> = T extends Record<
  infer K,
  infer V
>
  ? Record<V, K>
  : never;







// 分布式条件类型
type Condition12131<T> = T extends 1 | 2 | 3 ? T : never

type ConditionRes1 = Condition12131<1 | 2 | 3 | 4 | 5>  //2 | 1 | 3
type ConditionRes2 = 1 | 2 | 3 | 4 | 5 extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never // never

// 差异一：是否通过泛型参数传入
type Naked<T> = T extends boolean ? "Y" : "N"
type Wrapped<T> = [T] extends [boolean] ? "Y" : "N"

type Res3 = Naked<number | boolean> // "N" | "Y"
type Res4 = Wrapped<number | boolean> // "N"


// 条件类型分布式起作用的条件：
// 1.类型参数需要是联合类型
// 2.类型参数需要通过泛型参数的方式传入，不能直接进行条件类型判断
// 3.条件类型中的泛型参数不能被包裹

// 条件类型分布式特性的效果：
// 将这个联合类型拆开来，每个分支分别进行一次条件类型判断，再将最后的结果合并起来（如 Naked 中）

// 理解
type Naked2<T> = T extends boolean ? "Y" : "N";

// (number extends boolean ? "Y" : "N") | (boolean extends boolean ? "Y" : "N")
// "N" | "Y"
type Res32 = Naked2<number | boolean>;

// 泛型参数被类型别名包裹
export type NoDistribute<T> = T & {}

type Wrapped12162<T> = NoDistribute<T> extends boolean ? "Y" : "N"

type Res121 = Wrapped12162<number | boolean>  //"N"
type Res122 = Wrapped12162<true | false> // "Y"
type Res123 = Wrapped<true | false | 599>  // "N"

// 在某些情况下，我们也会需要包裹泛型参数来禁用掉分布式特性
// 将参数与条件都报裹起来，对联合类型的比较就变成了数组成员类型的比较。
type CompareUnion<T, U> = [T] extends [U] ? true : false

type CompareRes1 = CompareUnion<1 | 2, 1 | 2 | 3>  // true
type CompareRes2 = CompareUnion<1 | 2, 1>  // false


// 想判断一个类型是否为never时,也可以通过类似的手段
type IsNever<T> = [T] extends [never] ? true : false
type IsNever2<T> = T extends never ? true : false

type IsNeverRes1 = IsNever<never> //true
type IsNeverRes2 = IsNever<'123'> // false
type IsNever2Res1 = IsNever2<never> //never
type IsNever2Res2 = IsNever2<'123'>  // false

// any
// 直接使用,返回联合类型
type Tmp1 = any extends string ? 1 : 2 // 1|2

type Tmp2<T> = T extends string ? 1 : 2
// 通过泛型参数传入,同样返回联合类型
type Tmp2Res = Tmp2<any>  // 2 | 1

// 如果判断条件时any,那么仍然会进行判断
type Special1 = any extends any ? 1 : 2 // 1
type Special2<T> = T extends any ? 1 : 2
type Special2Res = Special2<any> //1


// never仅在作为泛型参数时才会产生
// 直接使用，仍然会进行判断
type Tmp3 = never extends string ? 1 : 2; // 1

type Tmp4<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，会跳过判断
type Tmp4Res = Tmp4<never>; // never

// 如果判断条件是 never，还是仅在作为泛型参数时才跳过判断
type Special3 = never extends never ? 1 : 2; // 1
type Special4<T> = T extends never ? 1 : 2;
type Special4Res = Special4<never>; // never


// 通过使用分布式条件类型，我们能轻易地进行集合之间的运算，比如交集
type Intersection<A, B> = A extends B ? A : never;

type IntersectionRes = Intersection<1 | 2 | 3, 2 | 3 | 4>; // 2 | 3