// 正则表达式匹配对应时间
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    // replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  // 等于正则表达对象
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    // test() 方法用于检测一个字符串是否匹配某个模式.
    if (new RegExp(`(${k})`).test(fmt)) {
      // str 存需要转换的值
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

// 用于检测单个时间的时候加0
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
