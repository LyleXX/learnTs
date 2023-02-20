// 工具类型
// 对属性的修饰，包括对象属性和数组元素的可选/必选、只读/可写。我们将这一类统称为   属性修饰工具类型。
// 对既有类型的裁剪、拼接、转换等，比如使用对一个对象类型裁剪得到一个新的对象类型，将联合类型结构转换到交叉类型结构。我们将这一类统称为   结构工具类型。
// 对集合（即联合类型）的处理，即交集、并集、差集、补集。我们将这一类统称为   集合工具类型。
// 基于 infer 的模式匹配，即对一个既有类型特定位置类型的提取，比如提取函数类型签名中的返回值类型。我们将其统称为   模式匹配工具类型。
// 模板字符串专属的工具类型，比如神奇地将一个对象类型中的所有属性名转换为大驼峰的形式。这一类当然就统称为   模板字符串工具类型了。



// 属性修饰工具类型
// 这一部分的工具类型主要使用属性修饰、映射类型与索引类型相关(索引类型签名、索引类型访问、索引类型查询均有使用，因此这里直接用索引类型指代)
// 在内置工具类型中,访问性修饰工具类型包括以下三位
// Partial 与 Required 使用类似的结构，在关键位置使用一个相反操作来实现反向
type Partial13<T> = {
  [P in keyof T]?: T[P]
}

type Required13<T> = {
  [P in keyof T]-?: T[P]
}

type Readonly13<T> = {
  readonly [P in keyof T]: T[P]
}
// Partial是?,标记属性为可选;    Required是-?,相当于原本属性上如果有?这个标记,则移除它.
// Partial也可以用+?来显示的表示添加可选标记
type Partial132<T> = {
  [P in keyof T]+?: T[P]
}


// 可选标记不等于修改此属性类型为 原类型 | undefined
interface Foo13 {
  optional: string | undefined
  required: string
}

const foo131: Foo13 = {
  required: '1'
} // 类型 "{ required: string; }" 中缺少属性 "optional"，但类型 "Foo" 中需要该属性。

const foo132: Foo13 = {
  required: '1',
  optional: undefined
}

// 一个属性是否必须提供仅取决于其是否携带可选标记。即使你使用 never 也无法标记这个属性为可选：
interface Foo132 {
  optional: never;
  required: string;
}
const foo133: Foo132 = {
  required: '1',
  // 不能将类型“string”分配给类型“never”。
  optional: '',
};


// 类似于 +?,Readonly也可以使用+readonly＼\
type Readonly132<T> = {
  +readonly [P in keyof T]: T[P]
}

// 实现工具类型Mutable移除readonly修饰
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}



// 结构工具类型
// 主要使用  条件类型 映射类型 索引类型
// 结构工具类型可分为两类: 1 结构声明  2 结构处理

// 结构声明
// 结构声明工具类型即快速声明一个结构，比如内置类型中的Record
type Record13<K extends keyof any, T> = {
  [P in K]: T
}
// K extends keyof any是键的类型，使用extends keyof any标明，传入的K可以是单个类型，也可以是联合类型，而T即为属性的类型

type RecordRes1 = Record13<string, unknown>  // 键名均为字符串，键值类型未知
type RecordRes2 = Record13<string, any> // 键名均为字符串，键值类型任意
type RecordRes3 = Record13<string | number, any> // 键名为字符串或数字，键值类任意

// Record<string, unknown> 和 Record<string, any> 是日常使用较多的形式，通常我们使用这两者来代替 object 

// 在一些工具类型库源码中还存在类似的结构声明工具类型
// Dictionary(字典)结构只需要一个作为属性类型的泛型参数即可
type Dictionary<T> = {
  [index: string]: T
}

type NumericDictionary<T> = {
  [index: number]: T
}

// 结构处理
// Pick 是保留这些传入的键，比如从一个庞大的结构中选择少数字段保留，需要的是这些少数字段
type Pick13<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface Foo13104 {
  name: string,
  age: number,
  job: JobUnionType
}

type PickedFoo = Pick13<Foo13104, 'age' | 'name'> // {age: number;name: string;}
// 上面的例子等价于
type Pick13112<T> = {
  [P in "name" | "age"]: T[P];
};


// Omit 则是移除这些传入的键，也就是从一个庞大的结构中剔除少数字段，需要的是剩余的多数部分
// Omit 类型则是基于 Pick 类型实现，也就是反向工具类型基于正向工具类型实现
// 接受的泛型是一个类型与联合类型（要剔除的属性），   

type Omit13<T, K extends keyof any> = Pick13<T, Exclude<keyof T, K>>

// Exclude<A,B>的结果是联合类型A中不存在于B的部分
type Tmp131 = Exclude<1, 2> // 1
type Tmp132 = Exclude<1 | 2, 2> // 1
type Tmp133 = Exclude<1 | 2 | 3, 2 | 3> // 1
type Tmp134 = Exclude<1 | 2 | 3, 2 | 4>; // 1 | 3







// 集合工具类型
import './images/JiHeGongJuLeiXing.png'
// 并集    ，两个集合的合并，合并时重复的元素只会保留一份（这也是   联合类型   的表现行为）。
// 交集    ，两个集合的相交部分，即同时存在于这两个集合内的元素组成的集合。
// 差集    ，对于 A、B 两个集合来说，A 相对于 B 的差集即为 A 中独有而 B 中不存在的元素 的组成的集合，或者说 A 中剔除了 B 中也存在的元素以后，还剩下的部分。
// 补集    ，补集是差集的特殊情况，此时集合 B 为集合 A 的子集，在这种情况下 A 相对于 B 的差集 + B = 完整的集合 A。

// 内置工具类型提供了交集和差集
type Extract13142<T, U> = T extends U ? T : never

type Exclude13144<T, U> = T extends U ? never : T
// 这里的具体实现其实就是条件类型的分布式特性，即当 T、U 都是联合类型（视为一个集合）时，T 的成员会依次被拿出来进行 extends U ? T1 : T2 的计算，然后将最终的结果再合并成联合类型。

type AExtractB = Extract13142<1 | 2 | 3, 1 | 2 | 4> // 1 | 2
// 运行逻辑
type _AExtractB =
  | (1 extends 1 | 2 | 4 ? 1 : never) // 1
  | (2 extends 1 | 2 | 4 ? 1 : never) // 2
  | (3 extends 1 | 2 | 4 ? 1 : never) // never

// 差集Exclude
// 差集存在相对的概念，A相对于B的差集与B相对于A的差集并不一定相同，交集则一定相同

type SetA = 1 | 2 | 3 | 5
type SetB = 0 | 1 | 2 | 4

type AExcludeB = Exclude13144<SetA, SetB> // 3 | 5
type BExcludeA = Exclude13144<SetB, SetA> // 0 | 4

type _AExcludeB =
  | (1 extends 0 | 1 | 2 | 4 ? never : 1) // never
  | (2 extends 0 | 1 | 2 | 4 ? never : 2) // never
  | (3 extends 0 | 1 | 2 | 4 ? never : 3) // 3
  | (5 extends 0 | 1 | 2 | 4 ? never : 5); // 5

type _BExcludeA =
  | (0 extends 1 | 2 | 3 | 5 ? never : 0) // 0
  | (1 extends 1 | 2 | 3 | 5 ? never : 1) // never
  | (2 extends 1 | 2 | 3 | 5 ? never : 2) // never
  | (4 extends 1 | 2 | 3 | 5 ? never : 4); // 4

// 并集和补集
// 并集
export type Concurrence<A, B> = A | B;

// 交集
export type Intersection<A, B> = A extends B ? A : never;

// 差集
export type Difference<A, B> = A extends B ? never : A;

// 补集
// 补集基于差集实现，只需要约束集合B为集合A的子集
export type Complement<A, B extends A> = Difference<A, B>;


// 内置工具类型中还有一个场景比较明确的集合工具类型：
// 它的本质就是集合 T 相对于 null | undefined 的差集，因此我们可以用之前的差集来进行实现。
type NonNullable<T> = T extends null | undefined ? never : T
type _NonNullable<T> = Difference<T, null | undefined>





// 模式匹配工具类型
// 主要使用条件类型和infer关键字

// 对函数类型签名的模式匹配
// 根据infer的位置不同，我们能够获取到不同位置的类型
type FunctionType = (...args: any) => any
// 获取参数类型
type Parameters<T extends FunctionType> = T extends (...args: infer P) => any ? P : never
// 获取返回值类型
type ReturnType<T extends FunctionType> = T extends (...args: any) => infer R ? R : any

// 只匹配第一个参数类型
type FirstParameter<T extends FunctionType> = T extends (arg: infer P, ...args: any) => any ? P : never

type FuncFoo = (arg: number) => void
type FuncBar = (...args: string[]) => void

type FooFirstParameter = FirstParameter<FuncFoo> // number
type BarFirstParameter = FirstParameter<FuncBar> // string

// 对Class进行模式匹配的工具类型
type ClassType = abstract new (...args: any) => any

type ConstructorParameters<T extends ClassType> = T extends abstract new (...args: infer P) => any ? P : never

type InstanceType<T extends ClassType> = T extends abstract new (...args: any) => infer R ? R : any

// Class 的通用类型签名可能看起来比较奇怪，但实际上它就是声明了可实例化（new）与可抽象（abstract）罢了。我们也可以使用接口来进行声明：
export interface ClassType2<TInstanceType = any> {
  new(...args: any[]): TInstanceType;
}