<template>
  <see-config>
    <view class="container">
      <!-- ========== 基础表单 ========== -->
      <text class="title">基础表单</text>
      <view class="content">
        <see-form ref="basicFormRef" :model="basicForm" :rules="basicRules" label-width="160rpx">
          <see-form-item label="用户名" field="username">
            <see-input v-model="basicForm.username" placeholder="请输入用户名" />
          </see-form-item>
          <see-form-item label="密码" field="password">
            <see-input v-model="basicForm.password" type="password" placeholder="请输入密码" />
          </see-form-item>
          <see-form-item label="年龄" field="age">
            <see-input v-model="basicForm.age" type="number" placeholder="请输入年龄" />
          </see-form-item>
          <see-form-item label="性别" field="gender">
            <see-radio-group v-model="basicForm.gender">
              <see-radio label="male">男</see-radio>
              <see-radio label="female">女</see-radio>
            </see-radio-group>
          </see-form-item>
          <see-form-item label="爱好" field="hobbies">
            <see-checkbox-group v-model="basicForm.hobbies">
              <see-checkbox label="reading">阅读</see-checkbox>
              <see-checkbox label="coding">编程</see-checkbox>
              <see-checkbox label="gaming">游戏</see-checkbox>
            </see-checkbox-group>
          </see-form-item>
          <see-form-item label="启用通知" field="notify">
            <see-switch v-model="basicForm.notify" />
          </see-form-item>
        </see-form>
        <view class="btn-row">
          <see-button size="small" type="primary" @tap="handleValidateBasic">校验</see-button>
          <see-button size="small" @tap="handleResetBasic">重置</see-button>
          <see-button size="small" @tap="handleClearBasic">清除校验</see-button>
        </view>
      </view>

      <!-- ========== 表单校验 ========== -->
      <text class="title">表单校验（正则 / 自定义）</text>
      <view class="content">
        <see-form ref="validateFormRef" :model="validateForm" :rules="validateRules" label-width="160rpx">
          <see-form-item label="邮箱" field="email">
            <see-input v-model="validateForm.email" placeholder="请输入邮箱" />
          </see-form-item>
          <see-form-item label="手机号" field="phone">
            <see-input v-model="validateForm.phone" type="number" :maxlength="11" placeholder="请输入手机号" />
          </see-form-item>
          <see-form-item label="确认密码" field="confirmPwd">
            <see-input v-model="validateForm.confirmPwd" type="password" placeholder="请再次输入密码" />
          </see-form-item>
        </see-form>
        <view class="btn-row">
          <see-button size="small" type="primary" @tap="handleValidateCustom">校验</see-button>
          <see-button size="small" @tap="handleResetValidate">重置</see-button>
        </view>
      </view>

      <!-- ========== labelPosition ========== -->
      <text class="title">标签位置（labelPosition）</text>
      <view class="content">
        <view class="btn-row" style="margin-bottom: 12px">
          <see-button size="mini" :type="currentPosition === 'left' ? 'primary' : 'default'" @tap="currentPosition = 'left'">左对齐</see-button>
          <see-button size="mini" :type="currentPosition === 'right' ? 'primary' : 'default'" @tap="currentPosition = 'right'">右对齐</see-button>
          <see-button size="mini" :type="currentPosition === 'top' ? 'primary' : 'default'" @tap="currentPosition = 'top'">顶部</see-button>
        </view>
        <see-form :model="positionForm" :label-position="currentPosition" label-width="160rpx">
          <see-form-item label="字段一">
            <see-input v-model="positionForm.field1" placeholder="请输入" />
          </see-form-item>
          <see-form-item label="字段二">
            <see-input v-model="positionForm.field2" placeholder="请输入" />
          </see-form-item>
        </see-form>
      </view>

      <!-- ========== 登录表单 ========== -->
      <text class="title">实际场景：登录表单</text>
      <view class="content">
        <see-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top">
          <see-form-item label="账号" field="account">
            <see-input v-model="loginForm.account" prefix-icon="see-icon-user" placeholder="请输入账号" />
          </see-form-item>
          <see-form-item label="密码" field="password">
            <see-input v-model="loginForm.password" type="password" is-show-password prefix-icon="see-icon-lock" placeholder="请输入密码" />
          </see-form-item>
          <see-form-item>
            <see-checkbox v-model="loginForm.remember">记住密码</see-checkbox>
          </see-form-item>
          <see-form-item>
            <see-button size="large" type="primary" is-ripple @tap="handleLogin">登 录</see-button>
          </see-form-item>
        </see-form>
      </view>

      <!-- ========== 禁用 / 只读 ========== -->
      <text class="title">整组禁用</text>
      <view class="content">
        <see-form :model="disabledForm" is-disabled label-width="160rpx">
          <see-form-item label="用户名">
            <see-input v-model="disabledForm.username" />
          </see-form-item>
          <see-form-item label="邮箱">
            <see-input v-model="disabledForm.email" />
          </see-form-item>
        </see-form>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

// ==================== 基础表单 ====================
const basicFormRef = ref()

const basicForm = reactive({
  username: '',
  password: '',
  age: '',
  gender: '',
  hobbies: [] as string[],
  notify: false
})

const basicRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 16, message: '用户名长度为 2-16 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 个字符', trigger: 'blur' }
  ],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
}

const handleValidateBasic = async () => {
  const result = await basicFormRef.value?.validate()
  if (result?.valid) {
    uni.showToast({ title: '校验通过', icon: 'success' })
  } else {
    uni.showToast({ title: '校验失败', icon: 'none' })
  }
}

const handleResetBasic = () => {
  basicFormRef.value?.resetFields()
}

const handleClearBasic = () => {
  basicFormRef.value?.clearValidate()
}

// ==================== 表单校验 ====================
const validateFormRef = ref()

const validateForm = reactive({
  email: '',
  phone: '',
  confirmPwd: ''
})

const validateRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (value: unknown) => {
        if (value !== basicForm.password) {
          return '两次密码不一致'
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}

const handleValidateCustom = async () => {
  const result = await validateFormRef.value?.validate()
  if (result?.valid) {
    uni.showToast({ title: '校验通过', icon: 'success' })
  }
}

const handleResetValidate = () => {
  validateFormRef.value?.resetFields()
}

// ==================== labelPosition ====================
const currentPosition = ref<'left' | 'right' | 'top'>('right')

const positionForm = reactive({
  field1: '',
  field2: ''
})

// ==================== 登录表单 ====================
const loginFormRef = ref()

const loginForm = reactive({
  account: '',
  password: '',
  remember: false
})

const loginRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  const result = await loginFormRef.value?.validate()
  if (result?.valid) {
    uni.showToast({ title: '登录成功', icon: 'success' })
  }
}

// ==================== 禁用表单 ====================
const disabledForm = reactive({
  username: '张三',
  email: 'zhangsan@example.com'
})
</script>

<style lang="scss" scoped>
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
  }
  .btn-row {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-top: 16px;
  }
}
</style>
