# 一次搞懂JS中的`this`

## 引用

[文章很好的解释了JS中`this`指针的问题]('https://zhuanlan.zhihu.com/p/78218727')

## 重点提取

### 1. 注意`函数调用`和`对象方法调用`区别

```js
 alert('Hello World!') // 函数调用
 console.log('Hello World!') // 方法调用
 new RegExp('\\d') // 构造函数
 alert.call(undefined, 'Hello World!') // 隐式调用
```

### 2. 函数调用

```js
function hello(name) {
    return 'Hello' + name
}
const message = hello('world')
console.log(message)
```

> hello('World')是函数调用: hello表达式等价于一个函数，跟在它后面的是一对括号以及'World'参数。

一个更高级的例子是IIFE(立即调用的函数表达式)

```js
const message = (function(name) {
       return 'Hello ' + name + '!';
    })('World');
    console.log(message) // => 'Hello World!'
```

> IIFE也是一个函数调用:第一对圆括号(function(name) {...})是一个表达式，它的计算结果是一个函数对象，后面跟着一对圆括号，圆括号的参数是“World”。

#### 2.1 函数调用中的this

> this 在函数调用中是一个全局对象(全局对象由执行环境来决定)
> 当this在任何函数作用域(最顶层作用域:全局执行上下文)之外使用，this 表示 window 对象

普通:

```js
    console.log(this === window); // => true
    this.myString = 'Hello World!';
    console.log(window.myString); // => 'Hello World!'
    <!-- In an html file -->
    <script type="text/javascript">
       console.log(this === window); // => true
    </script>
```

严格模式:

```js
function multiply(a, b) {
      'use strict'; // 启用严格模式
      console.log(this === undefined); // => true
      return a * b;
    }
    multiply(2, 5); // => 10
```

#### 2.3 陷阱: this在内部函数中的时候

```js
const numbers = {
       numberA: 5,
       numberB: 10,
       sum: function() {
         console.log(this === numbers); // => true
         function calculate() {
           console.log(this === numbers); // => false
           return this.numberA + this.numberB;
         }
         return calculate();
       }
    };
    numbers.sum(); // => NaN 
```

* `sum()`是对象上的方法调用，所以`sum`中的上下文是`numbers`对象。
* `calculate` 函数是在 `sum` 中定义的，你可能希望在`calculate()`中 `this` 也表示 `number` 对象。
* `calculate()`是**一个函数调用(不是方法调用)**，它将 `this` 作为全局对象 `window`(非严格模下)。
* 即使外部函数`sum`将上下文作为`number`对象，它在`calculate`里面没有影响。
* `sum()`的调用结果是 NaN，不是预期的结果`5 + 10 = 15`，这都是因为没有正确调用`calculate`。
* 为了解决这个问题，calculate函数中上下文应该与 sum 中的一样，以便可以访问numberA和numberB属性。
* 一种解决方案是通过调用`calculator.call(this)`手动将`calculate`上下文更改为所需的上下文。

### 3. 方法调用

方法是存储在对象属性中的函数。例如:

```js
 const myObject = {
      // helloFunction 是一个方法
      helloFunction: function() {
        return 'Hello World!';
      }
    };
    const message = myObject.helloFunction();
```

* 区分函数调用和方法调用非常重要，因为它们是不同的类型。主要区别在于方法调用需要一个属性访问器形式来调用函数`obj.myFunc()` 或 `obj['myFunc']()`，而函数调用不需要`myFunc()`。

#### 3.1 方法调用中的 `this`

* 当调用对象上的方法时候, `this` 就变成了对象本身, **换句话说, 谁调用最后的方法, `this`指向谁**

```js
     const calc = {
      num: 0,
      increment: function() {
        console.log(this === calc); // => true
        this.num += 1;
        return this.num;
      }
    };
    // method invocation. this is calc
    calc.increment(); // => 1
    calc.increment(); // => 2
```

#### 3.2 陷阱: 将方法与其对象分离

1. 如果方法在没有对象的情况下调用，那么函数调用就会发生，此时的this指向全局对象window严格模式下是undefined。

```js
    function Animal(type, legs) {
      this.type = type;
      this.legs = legs;  
      this.logInfo = function() {
        console.log(this === myCat); // => false
        console.log('The ' + this.type + ' has ' + this.legs + ' legs');
      }
    }
    const myCat = new Animal('Cat', 4);
    const extractedLogInfo = myCat.logInfo;  // The undefined has undefined legs 

```

2. 如果在为参数传入, 也是会认为与对象分离的, `this` 指向全局

```js
    function Animal(type, legs) {
      this.type = type;
      this.legs = legs;  
      this.logInfo = function() {
        console.log(this === myCat); // => false
        console.log('The ' + this.type + ' has ' + this.legs + ' legs');
      }
    }
    const myCat = new Animal('Cat', 4);
    setTimeout(myCat.logInfo, 1000);  // The undefined has undefined legs 
```

你可能认为`setTimeout`调用`myCat.logInfo()`时，它应该打印关于myCat对象的信息。
不幸的是，**方法在作为参数传递时与对象也是认为分离**，`setTimeout(myCat.logInfo)`以下情况是等效的：

```js
    setTimeout(myCat.logInfo);
    // 等价于
    const extractedLogInfo = myCat.logInfo;
    setTimeout(extractedLogInfo); //
```

* 这里的 `setTimeout(extractedLogInfo)` 就是方法与其对象分离了
* 将分离的`logInfo`作为函数调用时，`this`是全局`window`,所以对象信息没有正确地打印。
* 函数可以使用`.bind()`方法与对象绑定,就可以解决 `this` 指向的问题。

### 4. `new` 和 `class`的时候

#### 4.1 陷阱: 忘了使用 `new`

忘记了使用 `new` 那么 `this` 指向的是 window

```js
function Vehicle(type, wheelsCount) {
      this.type = type;
      this.wheelsCount = wheelsCount;
      return this;
    }
    // 忘记使用 new 
    const car = Vehicle('Car', 4);
    car.type;       // => 'Car'
    car.wheelsCount // => 4
    car === window  // => true   这里验证了 car 与 window是同一个对象
```

总结:
为函数调用对this影响最大，从现在开始不要问自己：
> this 是从哪里来的？

而是要看看
>函数是怎么被调用的？

对于箭头函数，需要想想
>在这个箭头函数被定义的地方，this是什么？
