// 结构化类型系统
// TypeScript 比较两个类型并非通过类型的名称,而是比较这两个类型上实际拥有的属性与方法。也就是说，这里实际上是比较 Cat 类型上的属性是否都存在于 Dog 类型上。
class Cat {
  eat() { }
}
class Dog {
  eat() { }
}
function feedCat(cat: Cat) { }
feedCat(new Dog())


// Cat1016和Dog1021内部结构不一样,所以报错了
class Cat1016 {
  meow() { }
  eat() { }
}
class Dog1021 {
  eat() { }
}
function feedCat1025(cat: Cat1016) { }
// 报错！
feedCat1025(new Dog1021())

// 结构化类型系统认为 Dog 类型完全实现了 Cat 类型。至于额外的方法 bark，可以认为是 Dog 类型继承 Cat 类型后添加的新方法，即此时 Dog 类可以被认为是 Cat 类的子类
class Cat1026 {
  eat() { }
}
class Dog1029 {
  bark() { }
  eat() { }
}
function feedCat1033(cat: Cat1026) { }
feedCat1033(new Dog1029())



// 更进一步，在比较对象类型的属性时，同样会采用结构化类型系统进行判断。而对结构中的函数类型（即方法）进行比较时，同样存在类型的兼容性比较：
class Cat1039 {
  eat(): boolean {
    return true
  }
  // eat(): number {
  //   return 599
  // }
}

class Dog1046 {
  eat(): number {
    return 599
  }
}

function feedCat1052(cat: Cat1039) { }

feedCat1052(new Dog1046())



// 标称类型系统
// 两个可兼容的类型，其名称必须是完全一致的
type USD = number;
type CNY = number;

const CNYCount: CNY = 200;
const USDCount: USD = 200;

function addCNY(source: CNY, input: CNY) {
  return source + input;
}

addCNY(CNYCount, USDCount)

// 对于标称类型系统，父子类型关系只能通过显式的继承来实现，称为标称子类型
class Cat1075 { }
// 实现一只短毛猫！
class ShortHairCat extends Cat1075 { }


// 在 TypeScript 中模拟标称类型系统
// 再看一遍这句话：类型的重要意义之一是限制了数据的可用操作与实际意义。这往往是通过类型附带的额外信息来实现的（类似于元数据），要在 TypeScript 中实现，其实我们也只需要为类型额外附加元数据即可，比如 CNY 与 USD，我们分别附加上它们的单位信息即可，但同时又需要保留原本的信息（即原本的 number 类型）

// 通过交叉类型的方式实现信息的附加
export declare class TagProtector<T extends string>{
  protected __tag__: T
}

export type Nominal<T, U extends string> = T & TagProtector<U>

// 使用Nominal工具类型，改进上面的例子
export type CNY1091 = Nominal<number, 'CNY'>
export type USD1092 = Nominal<number, 'USD'>

const CNYCount1094 = 100 as CNY1091
const USDCount1095 = 100 as USD1092

function addCNY1097(source: CNY1091, input: CNY1091) {
  return (source + input) as CNY1091
}

addCNY1097(CNYCount1094, CNYCount1094)
addCNY1097(CNYCount1094, USDCount1095)

// 这一实现方式本质上只在类型层面做了数据的处理，在运行时无法进行进一步的限制。我们还可以从逻辑层面入手进一步确保安全性：
class CNY10105 {
  private __tag!: void;
  constructor(public value: number) { }
}
class USD10109 {
  private __tag!: void;
  constructor(public value: number) { }
}
//相应的，现在使用方式也要进行变化：

const CNYCount10115 = new CNY10105(100);
const USDCount10116 = new USD10109(100);

function addCNY10118(source: CNY10105, input: CNY10105) {
  return (source.value + input.value);
}

addCNY10118(CNYCount10115, CNYCount10115);
// 报错了！
addCNY10118(CNYCount10115, USDCount10116);