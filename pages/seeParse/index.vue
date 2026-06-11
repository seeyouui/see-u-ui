<template>
  <see-config>
    <view class="container">
      <text class="title">基本使用</text>
      <view class="content">
        <see-parse :content="basicHtml" />
      </view>

      <text class="title">含图片与链接</text>
      <view class="content">
        <see-parse :content="richHtml" @on-link-tap="onLinkTap" @on-img-tap="onImgTap" />
      </view>

      <text class="title">tagStyle 自定义标签样式</text>
      <view class="content">
        <see-parse :content="styledHtml" :tag-style="customTagStyle" />
      </view>

      <text class="title">XSS 安全过滤（脚本与事件属性会被丢弃）</text>
      <view class="content">
        <see-parse :content="xssHtml" />
      </view>

      <text class="title">空内容占位</text>
      <view class="content">
        <see-parse content="" empty-text="暂无内容，请稍后再试~" />
      </view>

      <text class="title">动态更新内容</text>
      <view class="content">
        <see-parse ref="parseRef" :content="dynamicHtml" @on-load="onLoad" />
        <view class="gap-12"></view>
        <view class="flex-sb">
          <see-button is-ripple type="primary" @tap="switchHtml">切换内容</see-button>
          <see-button is-ripple type="warning" @tap="appendHtml">追加段落</see-button>
          <see-button is-ripple @tap="showText">查看纯文本</see-button>
        </view>
      </view>

      <text class="title">表格与代码块</text>
      <view class="content">
        <see-parse :content="tableHtml" />
      </view>

      <text class="title">可选中文本（rich-text 平台生效）</text>
      <view class="content">
        <see-parse :content="basicHtml" selectable />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

/** 基础 HTML */
const basicHtml = ref(`
<h3>欢迎使用 SeeYouUI Parse</h3>
<p>这是一段<b>富文本内容</b>，支持 <i>斜体</i>、<u>下划线</u>、<del>删除线</del>、<mark>高亮</mark> 等常用标签。</p>
<blockquote>引用：跨平台 HTML 解析器，让富文本在 H5 / App / 小程序一致呈现。</blockquote>
`)

/** 含图片与链接 */
const richHtml = ref(`
<p>下面是一张图片：</p>
<p><img src="https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app.png" alt="logo" style="width: 100%; max-width: 280px" /></p>
<p>点击 <a href="https://www.seeuui.cn">SeeYouUI 官网</a> 了解更多。</p>
`)

/** tagStyle 测试 */
const styledHtml = ref(`
<h3>带自定义样式的标题</h3>
<p>第一段文字 - 这段会被注入红色加大字号。</p>
<p>第二段也是。</p>
`)

const customTagStyle = ref({
  h3: 'color: #3ca7ff; font-size: 20px; border-bottom: 2px solid #3ca7ff; padding-bottom: 4px;',
  p: 'color: #ff6b6b; font-size: 16px; line-height: 1.8;'
})

/** XSS */
const xssHtml = ref(`
<p>正常文字 ✅</p>
${'<scr' + 'ipt>alert("xss")</scr' + 'ipt>'}
<div onclick="alert('xss')" onmouseover="alert(2)" title="hover-me-safely">点我没事（onclick 已被过滤）</div>
<p><a href="javascript:alert('xss')">恶意链接（被拦截）</a></p>
`)

/** 动态更新 */
const dynamicHtml = ref('<p>初始内容：当前时间是 <b>' + new Date().toLocaleTimeString() + '</b></p>')
const parseRef = ref<any>(null)

const switchHtml = () => {
  const list = [
    '<h4>第二屏内容</h4><p>这是切换后的<b>新内容</b>，颜色 <span style="color:#37d497">绿绿的</span>。</p>',
    '<h4>第三屏内容</h4><ul><li>列表项一</li><li>列表项二</li><li>列表项三</li></ul>',
    '<h4>第四屏内容</h4><p style="text-align:center;color:#ffb645">居中文字 + 警示色</p>'
  ]
  dynamicHtml.value = list[Math.floor(Math.random() * list.length)]
}

const appendHtml = () => {
  dynamicHtml.value += `<p>追加于 ${new Date().toLocaleTimeString()}</p>`
}

const showText = () => {
  const text = parseRef.value?.getText() || ''
  uni.showModal({ title: '纯文本', content: text, showCancel: false })
}

const onLoad = (nodes: any[]) => {
  console.log('[SeeParse] onLoad nodes:', nodes.length)
}

/** 链接 / 图片点击 */
const onLinkTap = (href: string) => {
  uni.showToast({ title: '点击链接: ' + href, icon: 'none' })
}

const onImgTap = (src: string) => {
  uni.showToast({ title: '点击图片', icon: 'none' })
  console.log('img src:', src)
}

/** 表格与代码 */
const tableHtml = ref(`
<h4>支持的标签清单</h4>
<table border="1" cellspacing="0" cellpadding="6">
  <thead><tr><th>类别</th><th>标签</th></tr></thead>
  <tbody>
    <tr><td>块级</td><td>div / p / h1~h6 / blockquote / pre / ul / ol</td></tr>
    <tr><td>内联</td><td>span / a / b / i / em / strong / code</td></tr>
    <tr><td>媒体</td><td>img / video / audio</td></tr>
  </tbody>
</table>
<p>行内代码： <code>const see = 'you-ui'</code></p>
<pre>function add(a, b) {
  return a + b
}</pre>
`)
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
