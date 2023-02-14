// 类型层级



// 判断类型兼容性的方式
type Result = 'lyle' extends string ? 1 : 2

// 通过赋值进行兼容性检查的方法
// 对于变量 a = 变量 b，如果成立，意味着 <变量 b 的类型> extends <变量 a 的类型> 成立，即 b 类型是 a 类型的子类型，在这里即是 string extends never ，这明显是不成立的。
declare let source: string
declare let anyType: any
declare let neverType: never

anyType = source

neverType = source



// 从原始类型开始
// 字面量类型 < 对应的原始类型
type Result1121 = 'lyle' extends string ? 1 : 2 //1
type Result1122 = 1 extends number ? 1 : 2 //1
type Result1123 = true extends boolean ? 1 : 2 //1
type Result1124 = { name: string } extends object ? 1 : 2 //1
type Result1125 = { name: 'lyle' } extends object ? 1 : 2 //1
type Result1126 = [] extends object ? 1 : 2 //1


// 联合类型
type Result1131 = 1 extends 1 | 2 | 3 ? 1 : 2 // 1
type Result1132 = 'lin' extends 'lin' | 'bu' | 'dao' ? 1 : 2 // 1
type Result1133 = true extends true | false ? 1 : 2; // 1

// 并不需要联合类型的所有成员均为字面量类型，或者字面量类型来自于同一基础类型这样的前提，只需要这个类型存在于联合类型中


// 字面量类型 < 包含此字面量类型的联合类型，原始类型 < 包含此原始类型的联合类型
type Result1136 = string extends string | false | false | number ? 1 : 2 // 1

// 同一基础类型的字面量联合类型 < 此基础类型
type Result1142 = 'lin' | 'bu' | 'dao' extends string ? 1 : 2 // 1
type Result1143 = {} | (() => void) | [] extends object ? 1 : 2 //1

// 结论：字面量类型< 包含此字面量类型的联合类型(同一基础类型) < 对应的原始类型

type Result1147 = 'lyle' extends 'lyle' | '599'
  ? 'lyle' | '123' extends string
  ? 2
  : 1
  : 0








// 装箱类型
// string到Object的类型层级
type Result14 = string extends String ? 1 : 2; // 1
type Result15 = String extends {} ? 1 : 2; // 1
type Result16 = {} extends object ? 1 : 2; // 1
type Result18 = object extends Object ? 1 : 2; // 1

// 在结构化类型系统的比较下，String 会被认为是 {} 的子类型。这里从 string < {} < object 看起来构建了一个类型链，但实际上 string extends object 并不成立
type Tmp1168 = string extends object ? 1 : 2; // 2

// 结论：原始类型 < 原始类型对应的装箱类型 < Object 类型。




// Top Type
// any 和 unknown 时系统设定的Top Type的两个类型
type Result22 = Object extends any ? 1 : 2
type Result23 = Object extends unknown ? 1 : 2

// 但如果我们把条件类型的两端对调一下呢？

type Result24 = any extends Object ? 1 : 2; // 1 | 2
type Result25 = unknown extends Object ? 1 : 2; // 2
// 你会发现，any 竟然调过来，值竟然变成了 1 | 2？我们再多试几个看看：

type Result26 = any extends 'linbudu' ? 1 : 2; // 1 | 2
type Result27 = any extends string ? 1 : 2; // 1 | 2
type Result28 = any extends {} ? 1 : 2; // 1 | 2
type Result29 = any extends never ? 1 : 2; // 1 | 2

// 。any 代表了任何可能的类型，当我们使用 any extends 时，它包含了“让条件成立的一部分”，以及“让条件不成立的一部分”。而从实现上说，在 TypeScript 内部代码的条件类型处理中，如果接受判断的是 any，那么会直接返回条件类型结果组成的联合类型。

// any extends string 并不能简单地认为等价于以下条件类型,这种情况下，由于联合类型的成员并非均是字符串字面量类型，条件显然不成立

type Result30 = ("I'm string!" | {}) extends string ? 1 : 2; // 2

// any类型和unknown类型的比较也是互相成立的
type Result31 = any extends unknown ? 1 : 2;  // 1
type Result32 = unknown extends any ? 1 : 2;  // 1

// 结论：Object < any / unknown








// 向下探索
// never类型，代表虚无，一个不存在的类型。这样的类型是任何类型的子类型，也包括字面量类型
type Result33 = never extends 'li' ? 1 : 2; // 1

// 结论 never < 字面量类型





// 类型层级链
// 8  意味着所以条件均成立
type TypeChain = never extends 'linbudu'
  ? 'linbudu' extends 'linbudu' | '599'
  ? 'linbudu' | '599' extends string
  ? string extends String
  ? String extends Object
  ? Object extends any
  ? any extends unknown
  ? unknown extends any
  ? 8
  : 7
  : 6
  : 5
  : 4
  : 3
  : 2
  : 1
  : 0

// 结合上面的结构化类型系统与类型系统设定，我们还可以构造出一条更长的类型层级链：
type VerboseTypeChain = never extends 'linbudu'
  ? 'linbudu' extends 'linbudu' | 'budulin'
  ? 'linbudu' | 'budulin' extends string
  ? string extends {}
  ? string extends String
  ? String extends {}
  ? {} extends object
  ? object extends {}
  ? {} extends Object
  ? Object extends {}
  ? object extends Object
  ? Object extends object
  ? Object extends any
  ? Object extends unknown
  ? any extends unknown
  ? unknown extends any
  ? 8
  : 7
  : 6
  : 5
  : 4
  : 3
  : 2
  : 1
  : 0
  : -1
  : -2
  : -3
  : -4
  : -5
  : -6
  : -7
  : -8






// 其他比较场景

// 对于基类和派生类，通常情况下派生类会完全保留基类的结构，而只是自己新增新的属性与方法。在结构化类型的比较下，其类型自然会存在子类型关系。更不用说派生类本身就是 extends 基类得到的。

// 联合类型多个成员判断
// 只需比较一个联合类型是否可以被视为另一个联合类型的子集，即这个联合类型中所有成员在另一个联合类型中都能找到
type Result36 = 1 | 2 | 3 extends 1 | 2 | 3 | 4 ? 1 : 2; // 1
type Result37 = 2 | 4 extends 1 | 2 | 3 | 4 ? 1 : 2; // 1
type Result38 = 1 | 2 | 5 extends 1 | 2 | 3 | 4 ? 1 : 2; // 2
type Result39 = 1 | 5 extends 1 | 2 | 3 | 4 ? 1 : 2; // 2





// 数组和元组
// 40，这个元组类型实际上能确定其内部成员全部为 number 类型，因此是 number[] 的子类型。而 41 中混入了别的类型元素，因此认为不成立。
// 42混入了别的类型，但其判断条件为 (number | string)[] ，即其成员需要为 number 或 string 类型。
// 43的成员是未确定的，等价于 never[] extends number[]，44 同理。
// 45类似于41，即可能存在的元素类型是符合要求的。
// 46、47，还记得身化万千的 any 类型和小心谨慎的 unknown 类型嘛？
// 48，类似于 43、44，由于 never 类型本就位于最下方，这里显然成立。只不过 never[] 类型的数组也就无法再填充值了。
type Result40 = [number, number] extends number[] ? 1 : 2; // 1
type Result41 = [number, string] extends number[] ? 1 : 2; // 2
type Result42 = [number, string] extends (number | string)[] ? 1 : 2; // 1
type Result43 = [] extends number[] ? 1 : 2; // 1
type Result44 = [] extends unknown[] ? 1 : 2; // 1
type Result45 = number[] extends (number | string)[] ? 1 : 2; // 1
type Result46 = any[] extends number[] ? 1 : 2; // 1
type Result47 = unknown[] extends number[] ? 1 : 2; // 2
type Result48 = never[] extends number[] ? 1 : 2; // 1


import LeiXingCengJi from './images/LeiXingCengJi.png'