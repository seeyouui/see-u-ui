<template>
  <see-config>
    <view class="container">
      <text class="title">基本使用 - 标题与段落</text>
      <view class="content">
        <see-markdown :content="basicMd" />
      </view>

      <text class="title">强调与行内格式</text>
      <view class="content">
        <see-markdown :content="emphasisMd" />
      </view>

      <text class="title">链接与图片</text>
      <view class="content">
        <see-markdown :content="linkImgMd" @on-link-tap="onLinkTap" @on-img-tap="onImgTap" />
      </view>

      <text class="title">列表（含任务列表）</text>
      <view class="content">
        <see-markdown :content="listMd" />
      </view>

      <text class="title">代码块（含语言标识）</text>
      <view class="content">
        <see-markdown :content="codeMd" />
      </view>

      <text class="title">引用</text>
      <view class="content">
        <see-markdown :content="quoteMd" />
      </view>

      <text class="title">水平线</text>
      <view class="content">
        <see-markdown :content="hrMd" />
      </view>

      <text class="title">表格（GFM）</text>
      <view class="content">
        <see-markdown :content="tableMd" />
      </view>

      <text class="title">自动链接（linkify）</text>
      <view class="content">
        <see-markdown :content="linkifyMd" />
      </view>

      <text class="title">XSS 防护（脚本会被转义为文本）</text>
      <view class="content">
        <see-markdown :content="xssMd" />
      </view>

      <text class="title">自定义 tagStyle</text>
      <view class="content">
        <see-markdown :content="styledMd" :tag-style="customTagStyle" />
      </view>

      <text class="title">空内容占位</text>
      <view class="content">
        <see-markdown content="" empty-text="暂无 Markdown 内容~" />
      </view>

      <text class="title">动态更新内容</text>
      <view class="content">
        <see-markdown ref="mdRef" :content="dynamicMd" @on-load="onLoad" />
        <view class="gap-12"></view>
        <view class="flex-sb">
          <see-button is-ripple type="primary" @tap="switchMd">切换 Markdown</see-button>
          <see-button is-ripple type="warning" @tap="appendMd">追加段落</see-button>
          <see-button is-ripple @tap="showText">查看纯文本</see-button>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

/** 基础 Markdown */
const basicMd = ref(`# 一级标题
## 二级标题
### 三级标题

这是一个普通段落。SeeYouUI 的 Markdown 组件支持 GFM 子集，零依赖纯字符串解析。

下一段是另一个段落，会被独立包裹。`)

/** 强调与行内格式 */
const emphasisMd = ref(`这里有 **粗体**、*斜体*、~~删除线~~、\`行内代码\`、还有 ***粗斜体***。

可以使用 \`__bold__\` 与 \`_italic_\` 作为替代写法：__bold__ / _italic_。`)

/** 链接与图片 */
const linkImgMd = ref(`点击访问 [SeeYouUI 官网](https://www.seeuui.cn "SeeYouUI")。

下方是一张图片：

![logo](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app.png "uni-app")
`)

/** 列表 */
const listMd = ref(`**无序列表**
- 苹果
- 香蕉
- 樱桃

**有序列表**
1. 起床
2. 写代码
3. 摸鱼

**任务列表（GFM）**
- [x] 计划组件 API
- [x] 编写单元测试
- [ ] 完善文档
- [ ] 发布 npm 版本
`)

/** 代码块 */
const codeMd = ref(`普通围栏代码：

\`\`\`
const a = 1
const b = 2
console.log(a + b)
\`\`\`

带语言标识：

\`\`\`js
function add(a, b) {
  return a + b
}
\`\`\`
`)

/** 引用 */
const quoteMd = ref(`> 这是一段引用文字。
> 第二行也是引用的一部分。
>
> 引用中也可以包含 **粗体** 与 [链接](https://www.seeuui.cn)。
`)

/** 水平线 */
const hrMd = ref(`第一段

---

第二段（上面是 \`---\`）

***

第三段（上面是 \`***\`）
`)

/** 表格 */
const tableMd = ref(`| 列 A（左对齐）| 列 B（居中）| 列 C（右对齐）|
|:---|:---:|---:|
| 1 | 2 | 3 |
| 苹果 | 香蕉 | 樱桃 |
| 跨平台 | 零依赖 | 安全 |
`)

/** linkify */
const linkifyMd = ref(`直接粘贴裸链接 https://www.seeuui.cn 会被自动转为可点击的 a 标签。

不想自动转，就在组件上设 \`linkify="false"\`。`)

/** XSS */
const xssMd = ref(
  `正常文字 ✅

下面的脚本会被作为纯文本展示，不会执行：
<script>alert('xss')</scr` +
    `ipt>

链接 [恶意](javascript:alert('xss')) 的 href 已被拦截。
`
)

/** 自定义 tagStyle */
const styledMd = ref(`# 蓝色标题
## 红色二级
普通段落
> 黄色引用块
`)
const customTagStyle = ref({
  h1: 'color: #3ca7ff; border-bottom: 2px solid #3ca7ff; padding-bottom: 4px;',
  h2: 'color: #ff6b6b;',
  blockquote: 'border-left-color: #ffb645; background: #fff8e8; color: #b97a00;'
})

/** 动态更新 */
const dynamicMd = ref('## 初始内容\n当前时间：**' + new Date().toLocaleTimeString() + '**')
const mdRef = ref<any>(null)

const switchMd = () => {
  const list = [
    '## 第二屏\n- 列表项 1\n- 列表项 2\n- 列表项 3',
    '## 第三屏\n> 来自姐姐的引用：宝宝代码写得真棒~',
    '## 第四屏\n```ts\nconst hi: string = "Hello SeeYouUI"\nconsole.log(hi)\n```'
  ]
  dynamicMd.value = list[Math.floor(Math.random() * list.length)]
}

const appendMd = () => {
  dynamicMd.value += `\n\n_追加于 ${new Date().toLocaleTimeString()}_`
}

const showText = () => {
  const text = mdRef.value?.getText() || ''
  uni.showModal({ title: '纯文本', content: text, showCancel: false })
}

const onLoad = (html: string, _nodes: any[]) => {
  console.log('[SeeMarkdown] onLoad html length:', html.length)
}

const onLinkTap = (href: string) => {
  uni.showToast({ title: '点击链接: ' + href, icon: 'none' })
}

const onImgTap = (src: string) => {
  uni.showToast({ title: '点击图片', icon: 'none' })

  console.log('img src:', src)
}
</script>

<style lang="scss" scoped>
.gap-12 {
  width: 100%;
  height: 12px;
}
.flex-sb {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    color: #999;
  }
  .content {
    margin-top: 6px;
    margin-bottom: 24px;
    display: block;
  }
}
</style>
