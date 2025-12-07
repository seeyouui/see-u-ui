<p align="center">
  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://raw.githubusercontent.com/GmhLovEDM/bolgImage/main/seeui.png" alt="Vite logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://www.npmjs.com/package/see-u-ui"><img src="https://img.shields.io/npm/v/vite.svg" alt="npm package"></a>
  <!-- <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a> -->
  <a href="https://github.com/GmhLovEDM/see-u-ui"><img src="https://img.shields.io/badge/github-seeui-s" alt="build status"></a>
    <br />
  <a href="https://twitter.com/GmhLovEDM"><img src="https://img.shields.io/badge/Twitter-GmhLovEDM-blue" alt="discord chat"></a>
</p>

# SeeYouUI

## [官方文档：(http://113.44.242.235:9000/)](http://113.44.242.235:9000/)

## 特性

- 🧩 100+个组件（即将），希望让你少写点代码。
- 🔍 支持 TypeScript，提供完整的类型定义文件。
- 🔧 全链路开发和设计工具体系。
- 🔨 深入每个细节的主题定制能力。
- 🔑 完善的文档和示例，帮助您快速上手。

## 关于 PR

我们 **真诚、迫切、由衷地欢迎** 你提交任何形式的 [Pull Request](https://github.com/GmhLovEDM/SeeYouUI/pulls) 来一起完善 SeeYouUI 组件库。

无论是修个 typo、补一句注释、提个小优化，还是提交一个超棒的新功能——**都对我们来说无比重要**。
你的每一次贡献，真的都会让这个项目变得更好。

**我们真的非常需要你的 PR 🙏❤️**
如果你愿意帮我们一点点，我们会非常感激的。

## 社区

- QQ 一群：123456789
- 钉钉一群：123456789

## 许可

SeeYouUI 组件库 基于 [MIT 协议](https://opensource.org/license/MIT) 开源协议，意味着您无需支付任何费用，也无需授权，即可将 SeeYouUI 应用到您的产品中。

注意：这并不意味着您可以将 SeeYouUI 应用到非法的领域，比如涉及赌博，暴力等方面。如因此产生纠纷或法律问题，SeeYouUI 相关方不承担任何责任。

## 自动化

```mermaid
graph TD
  see-u-ui:main提交 -->  GmhLovEDM手动review --> 发布至Dcloud
  see-u-ui:main提交 --> GitHubAction自动同步至SeeYouUINPM --> GmhLovEDM手动review --> 发布至NPM
  see-u-ui:main提交 --> Jenkins自动部署演示项目至https://www.seeuui.cn/
  see-u-ui-doc:main提交 --> Jenkins自动部署演示项目至https://www.seeuui.cn/
```