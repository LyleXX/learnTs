interface IDescription {
  name: string,
  age: number,
  male?: boolean
  func?: Function
}
const obj1: IDescription = {
  name: 'lyle',
  age: 24,
  male: true
}
obj1.other = '1'
obj1.func()
obj1.func = () => { }

interface Test {
  readonly name: string,
  age: number
}
const obj2: Test = {
  name: 'lyle',
  age: 18
}
obj2.name = 'ann'
obj2.age = 19

const uniqueSymbolFoo: unique symbol = Symbol("linbudu")

// 类型不兼容
const uniqueSymbolBar: unique symbol = uniqueSymbolFoo

declare const uniqueSymbolFoo2: unique symbol;

const uniqueSymbolBaz: typeof uniqueSymbolFoo2 = uniqueSymbolFoo2