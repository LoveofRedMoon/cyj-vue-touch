import Vue from 'vue'

function mytouchWriteAll(arg, value, args, event, prevent) {
  // 绑定所有事件
  let num, type
  switch (true) {
    case /^zoom(in|out|move)$/.test(arg):
      event[arg] = value
      if (prevent) args.prevent.push(arg)
      break
    case /^(delay|maxdistance|minswipedistance|minswipespeed|maxswipedeg|minzoomdistance|maxzoomdeg)$/.test(
      arg
    ):
      if ((typeof value).toLowerCase() === 'number') args[arg] = value
      break
    case /^(click|press|move)/.test(arg):
      type = arg.match(/^(click|press|move)/)[0]
      if ((num = parseInt(arg.replace(type, ''))) >= 0) {
        if (args.delayClick < num + 1) args.delayClick = num + 1
        event[type + num] = value
        if (prevent) args.prevent.push(type + num)
      }
      break
    case /^swipe/.test(arg):
      arg = arg.replace(/deg$/, '')
      let temp = arg.match(/^swipe(.*?)deg/)
      if (temp) temp = temp[1]
      if (temp === '') arg = arg.replace(/^swipe/, 'swipe0')
      arg += /deg$/.test(arg) ? '0' : ''
      // 现在有如下形式 swipe0 swipe0deg1
      // 只需要检查数字的合法性即可
      num = arg.replace(/^swipe/, '').split(/deg/)
      if (num.length == 2) {
        if (isNaN(num[1])) return
        const angel = ((num[1] | 0) % 360 + 360) % 360
        arg = 'swipe' + num[0] + 'deg' + angel
      }
      if ((num = parseInt(num[0])) >= 0) {
        if (args.delayClick < num + 1) args.delayClick = num + 1
        event[arg] = value
        if (prevent) args.prevent.push(arg)
      }
      break
    default:
      if ((num = parseInt(arg)) >= 0) {
        if (args.delayClick < num + 1) args.delayClick = num + 1
        event['click' + num] = value
        if (prevent) args.prevent.push(click + 'num')
      }
  }
}

Vue.directive('mytouch', {
  bind(el, binding) {
    // 调整binding.arg
    let arg = binding.arg
      .toLowerCase()
      .replace(/right/, 'deg0')
      .replace(/up/, 'deg270')
      .replace(/left/, 'deg180')
      .replace(/down/, 'deg90')
    if (arg === 'tap') arg = 'click0'
    else if (arg === 'press') arg = 'press0'
    else if (arg === 'doubleclick') arg = 'click1'
    else if (arg === 'swipe') arg = 'swipe0'
    else if (arg === 'move') arg = 'move0'
    // 初始化绑定事件
    // 默认不开启多击事件(即延迟处理单击事件) 当绑定多击事件时,会自动开启
    if (!el.__vuemytouches__) el.__vuemytouches__ = {}
    // 用作记录手指数量
    // {
    //    ideentifier: {startTime: Number, startX: Number, startY: Number, alreadyswipe: Boolean}
    // }
    if (!el.__vuemytouchEvents__) el.__vuemytouchEvents__ = {}
    // 用作记录所有事件
    // 所有事件名被统一定义为 操作+操作前的点击次数 其中click0也叫作tap press0也叫作press
    if (!el.__vuemytouchArgs__)
      el.__vuemytouchArgs__ = {
        delayClick: 1, // 无法设置! 自动调整为最大的点击次数, 用来判断延迟
        clickNum: 0, // 无法设置! 用来记录当前的点击最大的连点次数, 可能会超过delayClick
        times: {}, // 无法设置! 用来记录所有定时器
        prevent: [], // 无法设置! 用来记录哪些事件包含prevent参数
        delay: 400, // 可以设置, 接受一个数值, 单位毫秒, 用来作为判断单击或长按的分界点
        maxdistance: 10, // 可以设置. 接受一个数值, 单位px, 用来判断是否属于同一位
        minswipedistance: 50, // 可以设置, 判定滑动的最小距离, 单位px, 用来判断是否触发swipe
        minswipespeed: 0, // 可以设置, 判定滑动的最小速度, 单位px/100ms, 用来判断滑动速度是否触发swipe
        maxswipedeg: 20, // 可以设置, 接受一个数值, 单位deg, 用来作为滑动最大容差,
        minzoomdistance: 60, //可以设置, 接受一个数值, 单位px, 用来作为zoom最小距离
        maxzoomdeg: 20 //可以设置, 接受一个数值, 单位px, 用来作为zoom最大角度变化
        // lastX, lastY 无法设置! 记录最后一次end中的位置, 以便阻止连击
      }
    let touches = el.__vuemytouches__,
      event = el.__vuemytouchEvents__,
      args = el.__vuemytouchArgs__
    const distance = (a, b, c = 0, d = 0) =>
      Math.sqrt(Math.pow(a - c, 2) + Math.pow(b - d, 2))
    const doEvent = (e, c, argumentss) => {
      if (argumentss === undefined) argumentss = []
      else if (!(argumentss instanceof Array)) argumentss = [argumentss]
      if (c === 'click0') e.catagory = 'tap'
      else if (c === 'press0') e.catagory = 'press'
      else if (c === 'click1') e.catagory = 'doubleclick'
      else if (c === 'swipe0') e.catagory = 'swipe'
      else if (c === 'move0') e.catagory = 'move'
      else e.catagory = c
      if (args.prevent.indexOf(c) >= 0) e.preventDefault()
      if (event[c]) return event[c](e, ...argumentss)
    }
    if (!el.__vuemytouchstart__) {
      el.__vuemytouchstart__ = e => {
        var t = new Date()
        var ct = e.changedTouches
        // 遍历修改时间, 位置
        ;[].forEach.call(ct, v => {
          touches[v.identifier] = {
            startTime: t,
            startX: v.clientX,
            startY: v.clientY
          }
          // 中断连击操作
          if (
            !args.clickNum &&
            args.lastX !== undefined &&
            distance(args.lastX, args.lastY, v.clientX, v.clientY) >
              args.maxdistance
          )
            args.clickNum = 0
        })
        // 清除所有定时器
        Object.values(args.times).forEach(v => clearTimeout(v))
        args.times = {}
        // 监听press事件
        if (ct.length === 1 && args.delayClick >= args.clickNum) {
          args.times[ct[0].identifier] = setTimeout(() => {
            // 一定时间后执行press事件
            doEvent(e, 'press' + args.clickNum)
            args.times[Math.random()] = setTimeout(
              () => (args.clickNum = 0),
              300
            )
          }, args.delay)
        }
      }
      el.addEventListener('touchstart', el.__vuemytouchstart__)
    }
    if (!el.__vuemytouchmove__) {
      el.__vuemytouchmove__ = e => {
        e.preventDefault()
        ;[].forEach.call(e.changedTouches, v => {
          let vi = v.identifier
          let dis = distance(
            v.clientX,
            v.clientY,
            touches[vi].startX,
            touches[vi].startY
          )
          if (dis < args.maxdistance) {
            // 未触发了移动
          } else {
            // 触发了移动
            clearTimeout(args.times[vi])
            args.times[vi] = null
            if (e.touches.length === 1) {
              // 滑动事件
              let disx = v.clientX - touches[vi].startX,
                disy = v.clientY - touches[vi].startY
              doEvent(e, 'move' + args.clickNum, [
                disx,
                disy,
                touches[vi].startX,
                touches[vi].startY
              ])
              if (!touches[vi].alreadySwipe && dis > args.minswipedistance) {
                if (
                  dis / (new Date() - touches[vi].startTime) * 100 >
                  args.minswipespeed
                ) {
                  // 角度偏移量, 若函数角度+偏移量落在0~2*args.maxswipedeg中则符合条件
                  const angel = Math.atan2(disy, disx) / Math.PI * 180
                  const ev = 'swipe' + args.clickNum
                  doEvent(e, ev, angel)
                  const reg = new RegExp('^' + ev + 'deg')
                  Object.keys(event).forEach(v => {
                    if (!reg.test(v)) return
                    let temp =
                      ((v.replace(reg, '') | 0) +
                        args.maxswipedeg -
                        angel +
                        360) %
                      360
                    if (temp >= 0 && temp <= 2 * args.maxswipedeg)
                      doEvent(e, v, angel)
                  })
                  args.times[Math.random()] = setTimeout(
                    () => (args.clickNum = 0),
                    300
                  )
                  touches[vi].alreadySwipe = true
                }
              }
            }
          }
        })
        if (e.touches.length === 2) {
          // 两指判断放缩
          let t0 = e.touches[0].identifier,
            t1 = e.touches[1].identifier,
            disx = e.touches[0].clientX - e.touches[1].clientX,
            disy = e.touches[0].clientY - e.touches[1].clientY,
            sx = touches[t0].startX - touches[t1].startX,
            sy = touches[t0].startY - touches[t1].startY,
            angel1 = Math.atan2(disy, disx) / Math.PI * 180,
            angel2 = Math.atan2(sy, sx) / Math.PI * 180
          if (touches[t0].alreadyZoom || touches[t1].alreadyZoom) {
            doEvent(e, 'zoommove', [
              (angel1 + 270) % 180 - 90,
              distance(disx, disy),
              distance(sx, sy)
            ])
            return
          }
          if (
            (angel1 - angel2 + args.maxzoomdeg + 360) % 180 >
            2 * args.maxzoomdeg
          )
            return
          let cha = distance(disx, disy) - distance(sx, sy)
          if (cha > args.minzoomdistance) {
            touches[t0].alreadyZoom = true
            touches[t1].alreadyZoom = true
            doEvent(e, 'zoomin', (angel1 + 270) % 180 - 90)
          } else if (cha < -args.minzoomdistance) {
            touches[t0].alreadyZoom = true
            touches[t1].alreadyZoom = true
            doEvent(e, 'zoomout', (angel1 + 270) % 180 - 90)
          }
        }
      }
      el.addEventListener('touchmove', el.__vuemytouchmove__)
    }
    if (!el.__vuemytouchend__) {
      el.__vuemytouchend__ = e => {
        Object.values(args.times).forEach(v => clearTimeout(v))
        args.times = {}
        if (e.changedTouches.length == 1 && e.targetTouches.length == 0) {
          args.clickNum++
          const t0 = e.changedTouches[0]
          // 判断距离不能太大
          if (
            distance(
              t0.clientX,
              t0.clientY,
              touches[t0.identifier].startX,
              touches[t0.identifier].startY
            ) < args.maxdistance
          ) {
            const duration = new Date() - touches[t0.identifier].startTime
            if (duration < args.delay) {
              // 先检查点击次数 小于则进入定时器,等待 等于则直接执行 不可能大于(防止意外会什么都不做, 直接清零)
              if (args.delayClick > args.clickNum) {
                // 如果开启了delayClick 开启定时器, 准备执行对应事件
                // 保存此时的位置 用作下次touchStart判断距离
                args.lastX = t0.clientX
                args.lastY = t0.clientY
                args.times[t0.identifier] = setTimeout(() => {
                  doEvent(e, 'click' + (args.clickNum - 1))
                  args.clickNum = 0
                }, 300)
              } else {
                if (args.delayClick === args.clickNum)
                  doEvent(e, 'click' + (args.clickNum - 1))
              }
            } else {
              if (args.prevent.indexOf('press' + (args.clickNum - 1)) >= 0)
                e.preventDefault()
            }
          }
        }
        args.times[Math.random()] = setTimeout(() => (args.clickNum = 0), 300)
      }
      el.addEventListener('touchend', el.__vuemytouchend__)
    }
    mytouchWriteAll(arg, binding.value, args, event, binding.prevent)
  },
  update(el, binding) {
    if (binding.value === binding.oldValue) return
    // 调整binding.arg
    let arg = binding.arg
      .toLowerCase()
      .replace(/right/, '0deg')
      .replace(/top/, '90deg')
      .replace(/left/, '180deg')
      .replace(/down/, '270deg')
    if (arg === 'tap') arg = 'click0'
    else if (arg === 'press') arg = 'press0'
    else if (arg === 'doubleclick') arg = 'click1'
    else if (arg === 'swipe') arg = 'swipe0'
    mytouchWriteAll(
      arg,
      binding.value,
      el.__vuemytouchArgs__,
      el.__vuemytouchEvents__
    )
  },
  unbind(el) {
    el.removeEventListener('touchstart', el.__vuemytouchstart__)
    delete el.__vuemytouchstart__
    el.removeEventListener('touchmove', el.__vuemytouchmove__)
    delete el.__vuemytouchmove__
    el.removeEventListener('touchend', el.__vuemytouchend__)
    delete el.__vuemytouchend__
    delete el.__vuemytouches__
    delete el.__vuemytouchEvents__
    delete el.__vuemytouchArgs__
  }
})
