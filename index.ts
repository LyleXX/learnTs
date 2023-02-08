import { expectType } from "tsd";

expectType<string>('123') // √
expectType<string>(123) //×
console.log('hello TypeScript');

const arr3: [string, string] = ['1', '2']
console.log(arr3[4]);

const arr5: [string, number, boolean] = ['123', 4, false]
const [Pname, age, male, other] = arr5