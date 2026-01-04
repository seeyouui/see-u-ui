#!/usr/bin/env node

/**
 * 自动为提交信息添加 emoji
 * 在 commit-msg hook 中调用
 */

import { readFileSync, writeFileSync } from 'fs'

// Emoji 映射表
const emojiMap = {
  chore: '🚀',
  fix: '🐛',
  feat: '✨',
  docs: '✏️',
  style: '💄',
  refactor: '♻️',
  perf: '⚡',
  test: '✅',
  revert: '⏪',
  build: '📦',
  ci: '👷',
  release: '🏹'
}

// 获取提交信息文件路径
const commitMsgFile = process.argv[2] || process.env.GIT_PARAMS || '.git/COMMIT_EDITMSG'

try {
  // 读取提交信息
  let commitMsg = readFileSync(commitMsgFile, 'utf-8').trim()
  const originalMsg = commitMsg

  // 先检查整个提交信息开头是否有 emoji（非标准格式）
  // eslint-disable-next-line no-misleading-character-class
  const startsWithEmoji = /^[✨🐛✏️💄♻️⚡✅⏪📦👷🏹🚀]/u.test(commitMsg)

  if (!startsWithEmoji) {
    // 匹配提交信息格式: type(scope): subject 或 type: subject
    // 使用 [\s\S]*? 匹配第一行（包括换行符前的所有内容）
    const match = commitMsg.match(/^(\w+)(?:\(([^)]+)\))?:\s*([^\n]+)(?:\n|$)/)

    if (match) {
      const [, type, scope, subject] = match
      const emoji = emojiMap[type]

      if (emoji) {
        // 检查 subject 开头是否已经有 emoji（避免重复添加）
        // eslint-disable-next-line no-misleading-character-class
        const emojiPattern = /^[✨🐛✏️💄♻️⚡✅⏪📦👷🏹🚀]/u
        const subjectHasEmoji = emojiPattern.test(subject.trim())

        if (!subjectHasEmoji) {
          // 重新构建提交信息，在描述前添加 emoji
          if (scope) {
            commitMsg = `${type}(${scope}): ${emoji} ${subject}`
          } else {
            commitMsg = `${type}: ${emoji} ${subject}`
          }

          // 如果有多行（body），保留 body
          const lines = originalMsg.split('\n')
          if (lines.length > 1) {
            commitMsg += '\n' + lines.slice(1).join('\n')
          }

          // 写回文件
          writeFileSync(commitMsgFile, commitMsg + '\n', 'utf-8')
        }
      }
    }
  }
} catch (error) {
  // 如果出错，不影响提交流程
  console.error('添加 emoji 时出错:', error.message)
  process.exit(0)
}
