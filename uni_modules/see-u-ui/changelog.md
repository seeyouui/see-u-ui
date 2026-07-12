## 1.3.2（2026-07-13）

> > - <Badge type="warning" text="修复" /> 安全：修复 Parse（H5 v-html 接入白名单+协议校验）、useHtmlParser（on\* 属性绕过）、Markdown（highlight 回调注入）三处 XSS
> > - <Badge type="warning" text="修复" /> 跨端崩溃：Popup（document/rAF 守卫）、IndexList（rAF）、Modal（命令式响应式）、useGesture（H5 守卫）
> > - <Badge type="warning" text="修复" /> v-model/受控：Cascader、Tree、CityLocate 接线与回显
> > - <Badge type="warning" text="修复" /> 表单校验：useForm 误置 success、FormItem change/blur 自动校验、CheckboxGroup/RadioGroup formContext.props 路径
> > - <Badge type="warning" text="修复" /> Input 小数输入、Navbar 显隐、Tabbar 安全区占位、Sticky 吸顶卡死、Tabs 指示器偏移、NoticeBar 图标、Toast/Notify 单例重复弹、Button onTap+ripple、Config 监听器泄漏、Upload 状态机、Image src 重置、Waterfall 加载更多

## 1.3.1（2026-06-11）

> > - <Badge type="tip" text="新增" /> Parse 富文本解析器组件（跨平台 HTML 富文本解析与渲染，内置 XSS 安全过滤/图片预览/链接拦截/tagStyle 注入；H5 使用 v-html 直接渲染，App/小程序使用 rich-text + parsed nodes）
> > - <Badge type="tip" text="新增" /> Markdown 文本解析组件（零依赖 GFM 子集纯字符串解析器：标题/强调/链接/图片/代码块/列表/任务列表/引用/水平线/表格/自动链接/反斜杠转义，内部委托 see-parse 渲染并复用其 XSS 过滤、图片预览、链接拦截能力）
> > - <Badge type="tip" text="新增" /> useHtmlParser 工具 Hook（导出 parseHtml / stripHtml / sanitizeHtml / extractImgSrc 四个纯函数）
> > - <Badge type="tip" text="新增" /> useMarkdownParser 工具 Hook（导出 markdownToHtml / stripMarkdown / extractMarkdownImages 三个纯函数）

## 1.1.0（2026-06-05）

> > - <Badge type="tip" text="新增" /> Form 表单组件（支持 validate/reset/clearValidate/scrollToField）
> > - <Badge type="tip" text="新增" /> FormItem 表单项组件（支持 label/校验状态/错误信息展示）
> > - <Badge type="tip" text="新增" /> Input 输入框组件（支持 clearable/password/formatter/prefix/suffix/count）
> > - <Badge type="tip" text="新增" /> Textarea 文本域组件（支持 autoHeight/wordLimit/clearable）
> > - <Badge type="tip" text="新增" /> Checkbox 复选框组件（支持 Group/全选半选/min/max 限制）
> > - <Badge type="tip" text="新增" /> Radio 单选框组件（支持 Group/行内排列/边框模式）
> > - <Badge type="tip" text="新增" /> Switch 开关选择器组件（支持自定义值/颜色/文字描述）
> > - <Badge type="tip" text="新增" /> Rate 评分组件（支持半星/自定义图标/清除评分）
> > - <Badge type="tip" text="新增" /> Slider 滑动选择器组件（支持范围选择/垂直模式/步长刻度）
> > - <Badge type="tip" text="新增" /> NumberBox 步进器组件（支持步长/小数位数/长按连续增减）
> > - <Badge type="tip" text="新增" /> Search 搜索组件（支持圆角方形/操作按钮/自定义插槽）
> > - <Badge type="tip" text="新增" /> Select 选择器组件（支持单选多选/搜索过滤/远程搜索/分组）
> > - <Badge type="tip" text="新增" /> Picker 选择器组件（支持单列/多列/联动模式）
> > - <Badge type="tip" text="新增" /> Cascader 级联选择器组件（支持无限级/懒加载）
> > - <Badge type="tip" text="新增" /> DatetimePicker 日期选择器组件（支持 date/time/datetime/year-month/month-day）
> > - <Badge type="tip" text="新增" /> Upload 上传组件（支持图片/视频/文件/多选/压缩/自定义上传）
> > - <Badge type="tip" text="新增" /> Code 验证码输入框组件（支持自动聚焦/粘贴/遮罩/光标动画）
> > - <Badge type="tip" text="新增" /> Keyboard 键盘组件（支持数字/身份证/完整键盘/安全键盘）
> > - <Badge type="tip" text="新增" /> useForm Hook（表单管理）
> > - <Badge type="tip" text="新增" /> useField Hook（字段管理）
> > - <Badge type="tip" text="新增" /> 表单验证引擎（支持同步/异步校验、内置规则、自定义校验器）

## 1.0.13（2025-12-14）

> > - <Badge type="info" text="修改" /> 部分组件中的 JsDoc
> > - <Badge type="info" text="修改" /> Dcloud 中README.md
> > - <Badge type="tip" text="新增" /> Link 组件 Props 中的 size 属性
> > - <Badge type="tip" text="新增" /> Text 组件 Props 中的 size 属性
> > - <Badge type="tip" text="新增" /> Icon 图标组件示例
> > - <Badge type="tip" text="新增" /> Icon 图标组件

## 1.0.10（2025-12-07）

上传dcloud插件市场

## 1.0.11

测试 GitHub Action 自动拉取最新 npm 包

## 1.0.12

测试 GitHub Action 自动拉取最新 npm 包
