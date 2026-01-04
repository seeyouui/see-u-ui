export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档更新
        'style', // 代码格式（不影响功能）
        'refactor', // 重构
        'perf', // 性能优化
        'test', // 测试相关
        'chore', // 构建/工具相关
        'revert', // 回滚
        'build', // 构建系统
        'ci', // CI 配置
        'release' // 发版提交
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100]
  },
  // 支持 emoji，解析格式：type(scope): emoji subject 或 type: emoji subject
  parserPreset: {
    parserOpts: {
      // 匹配带或不带 emoji 的提交信息
      // 使用 .*? 来匹配任何字符（包括 emoji），然后匹配类型
      // eslint-disable-next-line no-misleading-character-class
      headerPattern: /^.*?(\w+)(?:\((.*)\))?:\s*(?:[✨🐛✏️💄♻️⚡✅⏪📦👷🏹🚀]\s*)?(.+)$/u,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  }
}
