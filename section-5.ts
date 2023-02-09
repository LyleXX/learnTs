// 函数

// 函数声明
function foo(name: string): number {
  return name.length
}
// 函数表达式
const foo2 = function (name: string) {
  return name.length
}

const foo3: (name: string) => number = function (name) {
  return name.length
}

// 箭头函数
const foo4 = (name: string): number => {
  return name.length
}

const foo5: (name: string) => number = (name) => {
  return name.length
}  // 函数类型声明混合箭头函数声明时，代码的可读性会非常差，不建议使用

// 箭头函数使用最好用类型别名将函数声明抽离出来
type FuncFoo = (name: string) => number

const foo6: FuncFoo = (name) => {
  return name.length
}
// 只为了函数的类型结构，interface也可以
interface FuncFooStruct {
  (name: string): number
}
const foo7: FuncFooStruct = (name) => {
  return name.length
}

// 函数没有返回值,或者返回值为空的时候，类型是void
function foo8(): void { }
function foo9(): void {
  return
}
function foo10(): void {
  return 1
}

// 如果函数没有返回实际的值，最好使用undefined作为类型
function foo11(): undefined {
  return
}


// 可选参数与rest参数
// 在函数逻辑注入可参数默认值
// 可选参数必须位于必选参数之后
function foo12(name: string, age?: number): number {
  const inputAge = age || 18 //age ?? 18
  return name.length + inputAge
}
// 直接为可选参数声明默认值
function foo13(name: string, age: number = 18): number {
  const inputAge = age
  return name.length + inputAge
}

// rest
function foo14(arg1: string, ...rest: any[]) { }
foo14('1', 1, 2, 3, 4, '5')
function foo15(arg1: string, ...rest: [number, boolean]) { }
foo15('1', 2, true)
foo15('1', 2, true, 3)
foo15('1', 2, 3)



// 函数可能有多组入参类型和返回值类型
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo)
  } else {
    return foo * 599
  }
}


// 函数重载签名(Overload Signature)
function func1(foo: number, bar: true): string
function func1(foo: number, bar?: false): number
function func1(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo)
  } else {
    return foo * 599
  }
}

const res1 = func1(599)
const res2 = func1(599, true)
const res3 = func1(599, false)

// 异步函数类型签名
async function asyncFunc() {

}


//  Class
// 属性的类型标注类似于变量，而构造函数、方法、存取器的类型编标注类似于函数
// 类声明
class Foo {
  prop: string
  constructor(inputProp: string) {
    this.prop = inputProp
  }

  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`);
  }

  // 类的方法同样可以进行函数那样的重载，且语法基本一致
  try(foo: number, bar: true): string
  try(foo: number, bar?: false): number
  try(foo: number, bar?: boolean): string | number {
    if (bar) {
      return String(foo)
    } else {
      return foo * 599
    }
  }


  get propA(): string {
    return `${this.prop}+A`
  }

  set propA(value: string) {
    this.prop = `${value}+A`
  }
}

const classFoo = new Foo('2')
const classFoo2 = new Foo(2)
const try1 = classFoo.try(599)
const try2 = classFoo.try(599, true)
const try3 = classFoo.try(599, false)

// 类表达式
const Foo2 = class {
  prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }

  // ...
}
const classFoo3 = new Foo2('1')

// 修饰符
// public：此类成员在类、类的实例、子类中都能被访问。
// private：此类成员仅能在类的内部被访问。
// protected：此类成员仅能在类与子类中被访问，你可以将类和类的实例当成两种概念，即一旦实例化完毕（出厂零件），那就和类（工厂）没关系了，即不允许再访问受保护的成员。
class Foo3 {
  private prop: string

  constructor(inputProp: string) {
    this.prop = inputProp
  }

  protected print(addon: string): void {
    console.log(`${this.prop} and ${addon}`);
  }
}
// 可以在构造函数钟对参数应用访问性修饰符
class Foo4 {
  constructor(public arg1: string, private arg2: boolean) { }
}

const try4 = new Foo4('lyle', true)
console.log(try4.arg1);
console.log(try4.arg2);
console.log(
  Foo4.arg2
);


// 静态成员
class Foo5 {
  static staticHandler() { }
  public instanceHandler() { }
}
Foo5.staticHandler
Foo5.instanceHandler


// 用类 + 静态成员来收敛变量与 utils 方法
class Utils {
  public static identifier = "lyle";

  public static makeUHappy() {
    Utils.studyWithU();
    // ...
  }

  public static studyWithU() { }
}

Utils.makeUHappy();
Utils.identifier;
Utils.studyWithU();

// 继承，实现，抽象类

// override关键字。确保父类中有子类需要的方法
class Base {
  printWithLove() { }
}

class Derived extends Base {
  override print() {
    // ...
  }

  override printWithLove(): void {

  }
}

// 抽象类
abstract class AbsFoo {
  abstract absProp: string
  abstract get abstract(): string
  abstract absMethod(name: string): string
}
// 使用implements实现抽象类
// 必须实现抽象类的每一个抽象成员，否则就会报错
class Foo6 implements AbsFoo {
  // absProp: string = 'lyle'
  get abstract() {
    return 'lyle'
  }
  absMethod(name: string): string {
    return name
  }
}

// interface声明类的结构,和抽象类一样，必须实现每一个成员
interface FooStruct {
  absProp: string,
  get absGetter(): string
  absMethod(input: string): string
}

class Foo7 implements FooStruct {
  absProp: string = 'lyle'
  get absGetter() {
    return 'lyle'
  }
  absMethod(name: string): string {
    return name
  }
}

// Newable Interface
class Foo8 { }
interface FooStruct2 {
  new(): Foo
}

declare const NewableFoo: FooStruct2
const foo20 = new NewableFoo()