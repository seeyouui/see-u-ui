<template>
  <view class="container">
    <text class="title">按钮类型10</text>
    <view class="content">
      <see-button title="默认按钮" />
      <see-button title="主要按钮" type="primary" />
      <see-button title="失败按钮" type="error" />
      <see-button title="警告按钮" type="warning" />
      <see-button title="成功按钮" type="success" />
    </view>
    <text class="title">镂空按钮</text>
    <view class="content">
      <see-button isHollow title="默认按钮" />
      <see-button isHollow title="主要按钮" type="primary" />
      <see-button isHollow title="失败按钮" type="error" />
      <see-button isHollow title="警告按钮" type="warning" />
      <see-button isHollow title="成功按钮" type="success" />
    </view>
    <text class="title">禁用按钮</text>
    <view class="content">
      <see-button isDisabled title="默认按钮" />
      <see-button isDisabled title="主要按钮" type="primary" />
      <see-button isDisabled title="失败按钮" type="error" />
      <see-button isDisabled title="警告按钮" type="warning" />
      <see-button isDisabled title="成功按钮" type="success" />
    </view>
    <text class="title">按钮大小</text>
    <view class="content">
      <see-button size="normal" title="默认大小" />
      <see-button size="small" title="小型尺寸" />
      <see-button size="mini" title="最小尺寸" />
      <see-button size="large" title="超大尺寸" />
    </view>
    <text class="title">水波动画</text>
    <view class="content">
      <see-button title="默认动画" isRipple />
      <see-button type="primary" size="normal" title="按钮颜色" isRipple />
      <see-button size="normal" title="动画颜色" isRipple ripple-color="blue" />
      <see-button
        size="large"
        title="动画时长(10000ms)"
        isRipple
        :ripple-time="10000"
        ripple-color="red"
        :mask-time="20000"
      />
    </view>
    <text class="title">自定义</text>
    <view class="content">
      <see-button :customStyle="customStyle" title="自定义宽高" />
      <see-button :radius="24" title="圆角按钮" />
      <see-button
        size="large"
        title="渐变色按钮"
        textColor="#FFFFFF"
        color="linear-gradient(135deg, #3ca7ff, #52f7bd)"
        isRipple
      />
      <see-button
        title="自定义颜色"
        color="#8A4D35"
        textColor="#FFFFFF"
        isRipple
      />
      <see-button title="传入一个view">
        <view style="width: 10px; height: 10px; border: 1px red solid" />
      </see-button>
      <see-button size="large">
        <text>标题以slot形式</text>
      </see-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
const customStyle = {
  width: "200px",
  height: "150px",
};
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
    flex-direction: row;
    flex-wrap: warp;
    align-items: center;
    :deep(.see-button) {
      margin: 0 12px 12px 0;
    }
  }
}
</style>
