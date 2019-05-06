const assert = require('assert')

// 1 初识断言的作用:判断代码段是否为真
//   assert(value[, message])
function test1 () {
  assert(true) // 括号里的代码为真,所以不报错
  assert(1) // 同上
  assert(false) // 括号内代码不为真,所以报错了
  assert(2)
}

// 2 assert.AssertionError 类
//   Error 的子类，表明断言的失败。 assert 模块抛出的所有错误都是 AssertionError 类的实例。
//   像Java异常一样,搞个类表示错误信息.
//
// 使用: new assert.AssertionError(options)
// options <Object>
//   message <string> 如果提供，则将错误消息设置为此值。
//   actual <any> 错误实例上的 actual 属性将包含此值。在内部用于 actual 错误输入，例如使用 assert.strictEqual()。
//   expected <any> 错误实例上的 expected 属性将包含此值。在内部用于 expected 错误输入，例如使用 assert.strictEqual()。
//   operator <string> 错误实例上的 operator 属性将包含此值。在内部用于表明用于比较的操作（或触发错误的断言函数）。
//   stackStartFn <Function> 如果提供，则生成的堆栈跟踪将移除所有帧直到提供的函数。
function test2 () {
  // 生成 AssertionError 以便稍后比较错误的消息：
  const {message} = new assert.AssertionError({
    actual: 1,
    expected: 2,
    operator: 'strictEqual'
  })

  // 验证错误的输出：
  try {
    assert.strictEqual(1, 2) // actual是1, expected是2,断言为真,不会报错
    // assert.strictEqual(1, 3) // actual是1, expected是3,断言为不为真,报错
  } catch (err) {
    assert(err instanceof assert.AssertionError)
    assert.strictEqual(err.message, message)
    assert.strictEqual(err.name, 'AssertionError [ERR_ASSERTION]')
    assert.strictEqual(err.actual, 1)
    assert.strictEqual(err.expected, 2)
    assert.strictEqual(err.code, 'ERR_ASSERTION')
    assert.strictEqual(err.operator, 'strictEqual')
    assert.strictEqual(err.generatedMessage, true)
  }
}

// 3 assert.deepEqual(actual, expected[, message])
function test3 () {
  const obj1 = {
    a: {
      b: 1
    }
  }
  const obj2 = {
    a: {
      b: 2
    }
  }
  const obj3 = {
    a: {
      b: 1
    }
  }
  const obj4 = Object.create(obj1)

  assert.deepEqual(obj1, obj1)
  // OK

  // Values of b are different:
  assert.deepEqual(obj1, obj2)
  // AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

  assert.deepEqual(obj1, obj3)
  // OK

  // Prototypes are ignored:
  assert.deepEqual(obj1, obj4)
  // AssertionError: { a: { b: 1 } } deepEqual {}
}

test3()