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




// 函数中的泛型
// 我们为函数声明了一个泛型参数 T，并将参数的类型与返回值类型指向这个泛型参数。这样，在这个函数接收到参数时，T 会自动地被填充为这个参数的类型。这也就意味着你不再需要预先确定参数的可能类型了，而在返回值与参数类型关联的情况下，也可以通过泛型参数来进行运算
function handle9147<T>(input: T): T { }

// 在基于参数类型进行填充泛型时，其类型信息会被推断到尽可能精确的程度，如这里会推导到字面量类型而不是基础类型。这是因为在直接传入一个值时，这个值是不会再被修改的，因此可以推导到最精确的程度。而如果你使用一个变量作为参数，那么只会使用这个变量标注的类型（在没有标注时，会使用推导出的类型）。
const author = 'lyle'  // 使用const声明，被推导为'lyle'
let authorAge = 18 //使用let声明，被推导为number

handle9147(author)  // 填充为字面量类型'lyle'
handle9147(authorAge) //填充为基础类型number

// 例子2
function swap<T, U>([start, end]: [T, U]): [U, T] {
  return [end, start]
}
const swapped1 = swap(['lucas', 123])
const swapped2 = swap([null, 599])
const swapped3 = swap([{ name: 'lyle' }, {}])
const swapped4 = swap([author, authorAge])
// 函数泛型也存在约束与默认值
// 比如上面的 handle 函数，现在我们希望做一些代码拆分，不再处理对象类型的情况了：
function handle9166<T extends string | number>(input: T): T { }
// 只想处理数字元组的情况
function swap9168<T extends number, U extends number>([start, end]: [T, U]): [U, T] {
  return [end, start]
}
const swapped5 = swap9168([2, 1])
const swapped6 = swap9168(['a', 1])


// 多泛型关联
// 比如 lodash 的 pick 函数，这个函数首先接受一个对象，然后接受一个对象属性名组成的数组，并从这个对象中截取选择的属性部分：

const object = { 'a': 1, 'b': '2', 'c': 3 };

_.pick(object, ['a', 'c']);// => { 'a': 1, 'c': 3 }

// 这个函数很明显需要在泛型层面声明关联，即数组中的元素只能来自于对象的属性名（组成的字面量联合类型！），因此我们可以这么写（部分简化）：

pick<T extends object, U extends keyof T>(object: T, ...props: Array<U>): Pick<T, U>;

// 箭头函数的泛型
const handle9187 = <T>(input: T): T => { }

// tsx文件中泛型的尖括号可能会报错，需要写的更像泛型一些
const handle9190 = <T extends any>(input: T): T => { }


// 函数的泛型更明显的体现了泛型在调用是被填充这一特性。类型别名中，我们更多是手动传入泛型。
// 通常使用类型别名来对已经确定的类型结构进行类型操作，比如将一组确定的类型放置在一起。而在函数这种场景中，我们并不能确定泛型在实际运行时会被什么样的类型填充。

// 需要注意的是，不要为了用泛型而用泛型，就像这样：

function handle<T>(arg: T): void {
  console.log(arg);
};
// 在这个函数中，泛型参数 T 没有被返回值消费，也没有被内部的逻辑消费，这种情况下即使随着调用填充了泛型参数，也是没有意义的。因此这里你就完全可以用 any 来进行类型标注。








// Class中的泛型
// Class 中的泛型和函数中的泛型非常类似，只不过函数中泛型参数的消费方是参数和返回值类型，Class 中的泛型消费方则是属性、方法、乃至装饰器等。同时 Class 内的方法还可以再声明自己独有的泛型参数。我们直接来看完整的示例：
class Queue<TElementType> {
  private _list: TElementType[];

  constructor(initial: TElementType[]) {
    this._list = initial;
  }

  // 入队一个队列泛型子类型的元素
  enqueue<TType extends TElementType>(ele: TType): TElementType[] {
    this._list.push(ele);
    return this._list;
  }

  // 入队一个任意类型元素（无需为队列泛型子类型）
  enqueueWithUnknownType<TType>(element: TType): (TElementType | TType)[] {
    return [...this._list, element];
  }

  // 出队
  dequeue(): TElementType[] {
    this._list.shift();
    return this._list;
  }
}




// 内置方法中的泛型
// TypeScript 中为非常多的内置对象都预留了泛型坑位，如 Promise 中
function p() {
  return new Promise<boolean>((resolve, reject) => {
    resolve(true)
  })
}
// 在你填充 Promise 的泛型以后，其内部的 resolve 方法也自动填充了泛型，而在 TypeScript 内部的 Promise 类型声明中同样是通过泛型实现：
interface PromiseConstructor {
  resolve<T>(value: T | PromiseLike<T>): Promise<T>;
}

declare var Promise: PromiseConstructor;


// 数组Array<T>中,泛型参数代表数组的元素类型,几乎贯穿所有的数组方法
const arr: Array<number> = [1, 2, 3]

arr.push('lyle')
arr.includes('lyle')

arr.find(() => false) // number | undefined

// 第一种reduce
arr.reduce((prev, curr, idx, arr) => {
  return prev
}, 1)

// 第二种reduce
// 报错：不能将 number 类型的值赋值给 never 类型
arr.reduce((prev, curr, idx, arr) => {
  return [...prev, curr]
}, []);

// reduce 方法是相对特殊的一个，它的类型声明存在几种不同的重载：

// 当你不传入初始值时，泛型参数会从数组的元素类型中进行填充。
// 当你传入初始值时，如果初始值的类型与数组元素类型一致，则使用数组的元素类型进行填充。即这里第一个 reduce 调用。
// 当你传入一个数组类型的初始值，比如这里的第二个 reduce 调用，reduce 的泛型参数会默认从这个初始值推导出的类型进行填充，如这里是 never[]。

// 其中第三种情况也就意味着信息不足，无法推导出正确的类型，我们可以手动传入泛型参数来解决：
arr.reduce<number[]>((prev, curr, idx, arr) => {
  return prev;
}, []);