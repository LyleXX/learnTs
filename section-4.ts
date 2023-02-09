interface Res {
  code: 10000 | 10001 | 50000
  status: "success" | "failure"
  data: any
}
declare var res: Res
if (res.status === "failure") {
  1
}
if (res.status === "1") {
  1
}


// 字面量类型
const str: "lyle" = "lyle"
const str2: "lyle" = "lyle2"
const num: 599 = 599
const bool: true = true

// 联合类型
interface Tmp {
  mixed: true | string | 599 | (() => {}) | (1 | 2)
}
declare var test: Tmp
test.mixed = 5

interface Tmp2 {
  user:
  {
    vip: true
    expires: string
  }
  | {
    vip: false
    promotion: string
  }
}

declare var tmp2: Tmp2
if (tmp2.user.vip) {
  console.log(tmp2.user.expires);
  console.log(tmp2.user.promotion);

}
if (tmp2.user.vip === false) {
  console.log(tmp2.user.promotion);
}

// 类型别名
type Code = 10000 | 10001 | 50000

type Status = "success" | "failure"

interface Tmp3 {
  obj: {
    name: "linbudu",
    age: 18
  }
}

const tmp3: Tmp3 = {
  obj: {
    name: "linbudu1",
    age: 18
  }
}

// 枚举值
enum pageUrl {
  Page1 = 'url1',
  Page2 = 'url2',
  Page3 = 'url3'
}

const page = pageUrl.Page1

// 可以使用数字枚举值和字符串枚举值
enum Mixed {
  Num = 599,
  Str = 'lyle'
}

const test2 = Mixed.Num
const testStr = Mixed.Str


// 常量枚举
const enum Items {
  Foo,
  Bar,
  Baz
}
const fooValue = Items.Bar