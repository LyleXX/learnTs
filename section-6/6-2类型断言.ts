// 类型断言：警告编译器不准报错
let unknownVar621: unknown
(unknownVar621 as { foo: () => {} }).foo()
// as到any跳过类型检查
declare const str621: string
(str621 as any).func()
// 在联合类型中断言一个具体的分支
function foo622(union: string | number) {
  if ((union as string).includes('lyle')) { }
  if ((union as number).toFixed() === '1') { }
}

// 类型断言正确使用：当ts类型分析不正确或不符合预期是，将其断言为正确类型
interface IFoo {
  name: string
}
declare const obj: {
  foo623: IFoo
}
const { foo623 = {} as IFoo } = obj


// 双重断言
// 类型断言差异过大的时候会有类型报错
declare const str624: string
(str624 as { handler: () => {} }).handler()

  // 先断言到unknown类型，再断言到预期类型
  (str624 as unknown as { handler: () => {} }).handler()

  // 使用尖括号断言
  (<{ handler: () => {} }>(<unknown>str624)).handler()


// 非空断言
// ！ 标记前面的一个声明一定是非空的(剔除Null和Undefined类型)
declare const foo625: {
  func?: () => ({
    prop?: number | null
  })
}

foo625.func().prop.toFixed()
foo625.func!().prop!.toFixed() // 告诉类型检查这两个不是空值
foo625.func?.().prop?.toFixed() // 类似于可选链 

// 非空类型和可选链的区别
// 非空断言的运行时仍然会保持调用链，因此在运行时可能会报错。而可选链则会在某一个部分收到 undefined 或 null 时直接短路掉，不会再发生后面的调用。

// 非空断言的常见场景还有 document.querySelector、Array.find 方法等
const element = document.querySelector("#id")!;
const target = [1, 2, 3, 599].find(item => item === 599)!;



// 类型断言还可以作为代码提示的辅助工具使用
interface IStruct626 {
  foo: string;
  bar: {
    barPropA: string,
    brPropB: number,
    barMethod: () => void;
    baz: {
      handler: () => Promise<void>
    }
  }
}

// 使用类型标注会报错
const obj627: IStruct626 = {}

// 使用类型断言可以再保留类型的前提下，不用完整的实现这个结构
const obj628 = <IStruct626>{
  bar: {
    baz: {}
  }
}
// 此时类型提示仍然存在，错误实现结构时也会给报错信息
const obj629 = <IStruct626>{
  bar: {
    baz: {handle}
  }
}

