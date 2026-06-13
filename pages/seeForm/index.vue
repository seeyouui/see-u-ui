<template>
  <see-config>
    <view class="container">
      <!-- ========== 基础表单 ========== -->
      <text class="title">{{ t('form.demo.basic') }}</text>
      <view class="content">
        <see-form ref="basicFormRef" :model="basicForm" :rules="basicRules" label-width="160rpx">
          <see-form-item :label="t('form.demo.username')" field="username">
            <see-input v-model="basicForm.username" :placeholder="t('form.demo.placeholderUsername')" />
          </see-form-item>
          <see-form-item :label="t('form.demo.password')" field="password">
            <see-input v-model="basicForm.password" type="password" :placeholder="t('form.demo.placeholderPassword')" />
          </see-form-item>
          <see-form-item :label="t('form.demo.age')" field="age">
            <see-input v-model="basicForm.age" type="number" :placeholder="t('form.demo.placeholderAge')" />
          </see-form-item>
          <see-form-item :label="t('form.demo.gender')" field="gender">
            <see-radio-group v-model="basicForm.gender">
              <see-radio label="male">{{ t('form.demo.male') }}</see-radio>
              <see-radio label="female">{{ t('form.demo.female') }}</see-radio>
            </see-radio-group>
          </see-form-item>
          <see-form-item :label="t('form.demo.hobbies')" field="hobbies">
            <see-checkbox-group v-model="basicForm.hobbies">
              <see-checkbox label="reading">{{ t('form.demo.reading') }}</see-checkbox>
              <see-checkbox label="coding">{{ t('form.demo.coding') }}</see-checkbox>
              <see-checkbox label="gaming">{{ t('form.demo.gaming') }}</see-checkbox>
            </see-checkbox-group>
          </see-form-item>
          <see-form-item :label="t('form.demo.enableNotify')" field="notify">
            <see-switch v-model="basicForm.notify" />
          </see-form-item>
        </see-form>
        <view class="btn-row">
          <see-button size="small" type="primary" @tap="handleValidateBasic">{{ t('form.demo.validateBtn') }}</see-button>
          <see-button size="small" @tap="handleResetBasic">{{ t('form.demo.resetBtn') }}</see-button>
          <see-button size="small" @tap="handleClearBasic">{{ t('form.demo.clearValidate') }}</see-button>
        </view>
      </view>

      <!-- ========== 表单校验 ========== -->
      <text class="title">{{ t('form.demo.validate') }}</text>
      <view class="content">
        <see-form ref="validateFormRef" :model="validateForm" :rules="validateRules" label-width="160rpx">
          <see-form-item :label="t('form.demo.email')" field="email">
            <see-input v-model="validateForm.email" :placeholder="t('form.demo.placeholderEmail')" />
          </see-form-item>
          <see-form-item :label="t('form.demo.phone')" field="phone">
            <see-input v-model="validateForm.phone" type="number" :maxlength="11" :placeholder="t('form.demo.placeholderPhone')" />
          </see-form-item>
          <see-form-item :label="t('form.demo.confirmPassword')" field="confirmPwd">
            <see-input v-model="validateForm.confirmPwd" type="password" :placeholder="t('form.demo.placeholderConfirmPwd')" />
          </see-form-item>
        </see-form>
        <view class="btn-row">
          <see-button size="small" type="primary" @tap="handleValidateCustom">{{ t('form.demo.validateBtn') }}</see-button>
          <see-button size="small" @tap="handleResetValidate">{{ t('form.demo.resetBtn') }}</see-button>
        </view>
      </view>

      <!-- ========== labelPosition ========== -->
      <text class="title">{{ t('form.demo.labelPosition') }}</text>
      <view class="content">
        <view class="btn-row" style="margin-bottom: 12px">
          <see-button size="mini" :type="currentPosition === 'left' ? 'primary' : 'default'" @tap="currentPosition = 'left'">
            {{ t('form.demo.alignLeft') }}
          </see-button>
          <see-button size="mini" :type="currentPosition === 'right' ? 'primary' : 'default'" @tap="currentPosition = 'right'">
            {{ t('form.demo.alignRight') }}
          </see-button>
          <see-button size="mini" :type="currentPosition === 'top' ? 'primary' : 'default'" @tap="currentPosition = 'top'">
            {{ t('form.demo.alignTop') }}
          </see-button>
        </view>
        <see-form :model="positionForm" :label-position="currentPosition" label-width="160rpx">
          <see-form-item :label="t('form.demo.field1')">
            <see-input v-model="positionForm.field1" :placeholder="t('form.demo.placeholderInput')" />
          </see-form-item>
          <see-form-item :label="t('form.demo.field2')">
            <see-input v-model="positionForm.field2" :placeholder="t('form.demo.placeholderInput')" />
          </see-form-item>
        </see-form>
      </view>

      <!-- ========== 登录表单 ========== -->
      <text class="title">{{ t('form.demo.loginForm') }}</text>
      <view class="content">
        <see-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top">
          <see-form-item :label="t('form.demo.account')" field="account">
            <see-input v-model="loginForm.account" prefix-icon="see-icon-user" :placeholder="t('form.demo.placeholderAccount')" />
          </see-form-item>
          <see-form-item :label="t('form.demo.password')" field="password">
            <see-input
              v-model="loginForm.password"
              type="password"
              is-show-password
              prefix-icon="see-icon-lock"
              :placeholder="t('form.demo.placeholderPassword')"
            />
          </see-form-item>
          <see-form-item>
            <see-checkbox v-model="loginForm.remember">{{ t('form.demo.rememberPwd') }}</see-checkbox>
          </see-form-item>
          <see-form-item>
            <see-button size="large" type="primary" is-ripple @tap="handleLogin">{{ t('form.demo.login') }}</see-button>
          </see-form-item>
        </see-form>
      </view>

      <!-- ========== 禁用 / 只读 ========== -->
      <text class="title">{{ t('form.demo.groupDisabled') }}</text>
      <view class="content">
        <see-form :model="disabledForm" is-disabled label-width="160rpx">
          <see-form-item :label="t('form.demo.username')">
            <see-input v-model="disabledForm.username" />
          </see-form-item>
          <see-form-item :label="t('form.demo.email')">
            <see-input v-model="disabledForm.email" />
          </see-form-item>
        </see-form>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeForm')

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
    { required: true, message: t('form.demo.requireUsername'), trigger: 'blur' },
    { min: 2, max: 16, message: t('form.demo.usernameLength'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('form.demo.requirePassword'), trigger: 'blur' },
    { min: 6, message: t('form.demo.passwordMinLength'), trigger: 'blur' }
  ],
  age: [{ required: true, message: t('form.demo.requireAge'), trigger: 'blur' }],
  gender: [{ required: true, message: t('form.demo.requireGender'), trigger: 'change' }]
}

const handleValidateBasic = async () => {
  const result = await basicFormRef.value?.validate()
  if (result?.valid) {
    uni.showToast({ title: t('form.demo.validatePass'), icon: 'success' })
  } else {
    uni.showToast({ title: t('form.demo.validateFail'), icon: 'none' })
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
    { required: true, message: t('form.demo.requireEmail'), trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: t('form.demo.invalidEmail'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: t('form.demo.requirePhone'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('form.demo.invalidPhone'), trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: t('form.demo.requireConfirmPwd'), trigger: 'blur' },
    {
      validator: (value: unknown) => {
        if (value !== basicForm.password) {
          return t('form.demo.passwordMismatch')
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
    uni.showToast({ title: t('form.demo.validatePass'), icon: 'success' })
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
  account: [{ required: true, message: t('form.demo.requireAccount'), trigger: 'blur' }],
  password: [
    { required: true, message: t('form.demo.requirePassword'), trigger: 'blur' },
    { min: 6, message: t('form.demo.passwordMinLength'), trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  const result = await loginFormRef.value?.validate()
  if (result?.valid) {
    uni.showToast({ title: t('form.demo.loginSuccess'), icon: 'success' })
  }
}

// ==================== 禁用表单 ====================
const disabledForm = reactive({
  username: t('form.data.zhangsan'),
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
    margin-top: 12px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.info {
  font-size: 12px;
  color: #999;
}

.btn-row {
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-top: 8px;
}
</style>
