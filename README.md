# mytouch 自定义指令

> 基于`Vue2`的`touch`操作, 需要掌握`Vue`的指令操作, 暂未测试 PC 端效果.
> 依赖`Babel`(因为 ES6...), `Vue`( _(:з」∠)_ )
> Sorry for my poor English, English document will be displayed after a time.

## 引入操作

* 安装`cyj-vue-touch`

```bash
# install mytouch
npm install cyj-vue-touch
```

* 调用

```javascript
import 'cyj-vue-touch'
```

## 指令操作书写

```javascript
// 在标签中书写
v-mytouch:Action.modifiers="fun"
// 默认调用函数时传入event参数,
// 其中event参数增加键值对 catagory: Action
v-mytouch:Args="argument"
```

* `Action`不区分大小写

### 常用指令

| Action        |     说明     |       函数参数        |
| ------------- | :----------: | :-------------------: |
| `tap`         |   轻触事件   |        `event`        |
| `doubleclick` | 双击事件事件 |        `event`        |
| `press`       |   长按事件   |        `event`        |
| `swipe`       |   滑动事件   |   `event, 滑动角度`   |
| `swipeLeft`   | 左滑事件事件 |   `event, 滑动角度`   |
| `zoomIn`      |   放大事件   | `event, 双指形成角度` |

### 点击事件指令

| Action        |                说明                |   catagory 值   | 函数参数 |
| ------------- | :--------------------------------: | :-------------: | :------: |
| `tap`         |    轻触事件, 是`click0`的语法糖    |     `'tap'`     | `event`  |
| `doubleclick` |    双击事件, 是`click1`的语法糖    | `'doubleclick'` | `event`  |
| `click0`      |   在连按 0 下后单击, 即轻触事件    |     `'tap'`     | `event`  |
| `click1`      |   在连按 1 下后单击, 即双击事件    | `'doubleclick'` | `event`  |
| `click` n     | (n>1)在连按 n 下后单击, 即多击事件 |  `'click' + n`  | `event`  |
| n             |           即`click` `n`            |   即`click` n   | `event`  |

### 长按事件指令

| Action    |             说明              |  catagory 值  | 函数参数 |
| --------- | :---------------------------: | :-----------: | :------: |
| `press`   | 长按事件, 是`press0`的语法糖  |   `'press'`   | `event`  |
| `press0`  | 在连按 0 下后长按, 即长按事件 |   `'press'`   | `event`  |
| `press` n |    (n>0)在连按 n 下后长按     | `'press' + n` | `event`  |

### 移动事件指令

| Action  |                         说明                         | catagory 值  |                    函数参数                     |
| ------- | :--------------------------------------------------: | :----------: | :---------------------------------------------: |
| `move`  | 本质即`touchmove`事件, 会持续触发, 是`move0`的语法糖 |   `'move'`   | `event, x偏移量, y偏移量, x初始位置, y初始位置` |
| `move`n |          (n>0)在连按 n 下后, 移动会持续触发          | `'move' + n` | `event, x偏移量, y偏移量, x初始位置, y初始位置` |

### 滑动事件指令

| Action           |               说明                |         catagory 值         |      函数参数      |
| ---------------- | :-------------------------------: | :-------------------------: | :----------------: |
| `swipe`          |             滑动事件              |          `'swipe'`          | `event` `滑动角度` |
| `swipedeg`n      |        向 n° 方向滑动事件         |      `'swipedeg' + n`       | `event` `滑动角度` |
| `swipe`n         |     连续点击 n 次后的滑动事件     |        `'swipe' + n`        | `event` `滑动角度` |
| `swipe`n1`deg`n2 | 连续点击 n1 次后的向 n2° 滑动事件 | `'swipe' + n1 + 'deg' + n2` | `event` `滑动角度` |
| `swipe`n1`Left`  |     `swipe`n1`deg180`的语法糖     |  `'swipe' + n1 + 'deg180'`  | `event` `滑动角度` |
| `swipe`n1`Up`    |     `swipe`n1`deg270`的语法糖     |  `'swipe' + n1 + 'deg270'`  | `event` `滑动角度` |
| `swipe`n1`Right` |      `swipe`n1`deg0`的语法糖      |   `'swipe' + n1 + 'deg0'`   | `event` `滑动角度` |
| `swipe`n1`Down`  |     `swipe`n1`deg90`的语法糖      |  `'swipe' + n1 + 'deg90'`   | `event` `滑动角度` |

* 滑动角度: 以横向向右(x 轴)为初始边, 纵向下(负 y 轴)为 90° 边(即屏幕坐标系), `swipe` 中的取值为[0,360)
* `swipe`后紧跟两个参数, 因此用`deg`作为区分, 例如 `swipe4deg90` 表示在连续点击 4 次后触发向上滑动时触发的事件

### 放缩事件指令

| Action     |           说明           | catagory 值  |                              函数参数                              |
| ---------- | :----------------------: | :----------: | :----------------------------------------------------------------: |
| `zoomIn`   | 双指远离事件, 即放大事件 |  `'zoomin'`  |                       `event` `双指形成角度`                       |
| `zoomOut`  | 双指接近事件, 即缩小事件 | `'zoomout'`  |                       `event` `双指形成角度`                       |
| `zoomMove` | 双指放缩事件, 会持续触发 | `'zoomMove'` | `event` `双指所形成角度` `双指之间的距离` `双指之间的距离的初始值` |

* 滑动角度: 以横向向右(x 轴)为初始边, 纵向下(负 y 轴)为 90° 边(即屏幕坐标系), `zoom` 中的取值为[-90,90)

| modifiers |                        说明                         |
| --------- | :-------------------------------------------------: |
| `prevent` | 阻止浏览器默认行为, 一般需要设置用来阻止`click`事件 |

* 暂未添加更多, 如有需要可以增加......

### 指令参数列表

| Args               |                        说明                         | 数据类型 | 默认值 |   单位   | 取值 |
| ------------------ | :-------------------------------------------------: | :------: | :----: | :------: | :--: |
| `delay`            |            区分`轻触`和`长按`的时间间隔             | `Number` |  400   |    ms    |  /   |
| `maxDistance`      |          区分是否属于同一位置的最大偏移量           | `Number` |   10   |    px    |  /   |
| `minSwipeDistance` |         `Swipe!`区分是否触发滑动的最小距离          | `Number` |   50   |    px    |  /   |
| `minSwipeSpeed`    |       `Swipe!`区分是否触发滑动的最小平均速度        | `Number` |   0    | px/100ms |  /   |
| `maxSwipeDeg`      | `Swipe!`区分是否触发具体角度的`swipe`事件的容差角度 | `Number` |   20   |   deg    |  /   |
| `minZoomDistance`  |    `Zoom!`区分是否触发的`zoom`事件的最小变化距离    | `Number` |   60   |    px    |  /   |
| `manZoomDeg`       |    `Zoom!`区分是否触发的`zoom`事件的最大角度容差    | `Number` |   20   |   deg    |  /   |

* `Args`不区分大小写
* `maxswipedeg`是指上或下浮动的范围, 例如`swipe90deg`在默认的取值范围是`70-110`

## Demo1

```html
<!-- html/template 绑定轻触事件 -->
<div v-mytouch:tap.prevent="handleTap" />
<!-- 以下是语法糖 -->
<div v-mytouch:click0.prevent="handleTap" />
<div v-mytouch:0.prevent="handleTap" />
```

```javascript
// 引入
import 'cyj-vue-touch'
// VueScript
export default {
  // ...
  methods: {
    handleTap(e) {
      console.log(e.catagory) // 应该输出 'tap'
    }
  }
}
```

## Demo2

* 实现图片的展示功能

```html
<!-- CSS已省略 -->
    <div id="app">
        <!-- 允许轻触或放大操作进行展示, 图片较小, 因此就减小zoom触发距离 -->
        <img src="./assets/logo.png" v-mytouch:tap="showImg" v-mytouch:zoomIn="showImg" v-mytouch:minZoomDistance="20">
        <!-- 允许轻触隐藏, 长按保存图片, 双击放大缩小 -->
        <div id="imgBox" v-show="show" v-mytouch:tap="hideImg" v-mytouch:press="saveImg" v-mytouch:1="changeScale" v-mytouch:zoomMove="moves" v-mytouch:minZoomDistance="0">
            <img src="./assets/logo.png" :style="imgStyle">
        </div>
    </div>
```

```javascript
// 引入
import 'cyj-vue-touch'
// VueScript
export default {
  // ...
  methods: {
    showImg() {
      this.show = true
    },
    hideImg() {
      this.show = false
      this.scale = 1
    },
    saveImg() {
      confirm('是否保存图片')
    },
    changeScale() {
      if (this.scale != 1) this.scale = 1
      else this.scale = 2
    },
    moves(e, angel, dis, dispre) {
      let b = dis / dispre
      b = Math.max(Math.min(b, 2.5), 0.5)
      this.scale = b
    }
  },
  data() {
    return {
      show: false,
      scale: 1
    }
  },
  computed: {
    imgStyle() {
      return { transform: 'translate(-50%,-50%) scale(' + this.scale + ')' }
    }
  }
}
```

## 更新说明

* 1.0.0

  > 基础版本, 实现了`轻触` `长按` `多击` `多击后长按` 功能

* 1.0.2
  > 增加了`移动` `滑动`

## 作者说明

作者: cyj | LoveofRedMoon
本人小白, Bug 还请多多指教
Email: 2932802684@qq.com
