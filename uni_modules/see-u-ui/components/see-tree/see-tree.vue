<template>
  <view class="see-tree">
    <!-- 搜索框 -->
    <view v-if="isFilterable" class="see-tree__search">
      <input class="see-tree__search-input" type="text" :placeholder="displaySearchPlaceholder" :value="searchQuery" @input="handleSearch" />
    </view>

    <!-- 树形列表 -->
    <scroll-view v-if="flatNodes.length > 0" class="see-tree__scroll" scroll-y :style="scrollStyle">
      <view
        v-for="flatNode in flatNodes"
        v-show="flatNode.visible"
        :key="getNodeKey(flatNode.node)"
        class="see-tree__node"
        :class="{
          'see-tree__node--expanded': flatNode.expanded,
          'see-tree__node--leaf': flatNode.isLeaf,
          'see-tree__node--disabled': flatNode.node.isDisabled,
          'see-tree__node--selected': selectedKey === getNodeKey(flatNode.node)
        }"
        :style="getNodeStyle(flatNode)"
        @tap="handleNodeClick(flatNode)"
      >
        <!-- 展开/折叠图标 -->
        <view
          class="see-tree__expand-icon"
          :class="{ 'see-tree__expand-icon--expanded': flatNode.expanded }"
          @tap.stop="handleToggleExpand(flatNode)"
        >
          <text v-if="flatNode.hasChildren" class="see-tree__expand-icon-text">
            {{ flatNode.expanded ? '▾' : '▸' }}
          </text>
          <text v-else-if="!flatNode.isLeaf" class="see-tree__expand-icon-text">▸</text>
        </view>

        <!-- 复选框 -->
        <view
          v-if="isCheckable"
          class="see-tree__checkbox"
          :class="{
            'see-tree__checkbox--checked': flatNode.checked,
            'see-tree__checkbox--indeterminate': flatNode.indeterminate
          }"
          @tap.stop="handleToggleCheck(flatNode)"
        >
          <text v-if="flatNode.checked" class="see-tree__checkbox-icon">✓</text>
          <text v-else-if="flatNode.indeterminate" class="see-tree__checkbox-icon">-</text>
        </view>

        <!-- 节点内容 -->
        <view class="see-tree__content">
          <text class="see-tree__label">{{ getNodeLabel(flatNode.node) }}</text>
        </view>

        <!-- 加载状态 -->
        <text v-if="flatNode.loading" class="see-tree__loading">...</text>
      </view>
    </scroll-view>

    <!-- 空数据 -->
    <view v-else class="see-tree__empty">
      <text class="see-tree__empty-text">{{ displayEmptyText }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '../../locale'
import { useTree } from '../../utils/hooks/useTree'
import type { TreeNode, SeeTreeProps, SeeTreeEmits, SeeTreeExpose } from './type'

defineOptions({ name: 'SeeTree' })

const { t } = useI18n()

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeTreeProps>(), {
  data: () => [],
  modelValue: () => [],
  selectMode: 'single',
  childrenField: 'children',
  labelField: 'label',
  keyField: 'id',
  isAccordion: false,
  isShowConnector: false,
  isCheckable: false,
  isExpandAll: false,
  isFilterable: false,
  isLazy: false,
  isVirtual: false,
  virtualHeight: 400,
  nodeHeight: 44,
  indent: 24,
  emptyText: '',
  searchPlaceholder: ''
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeTreeEmits>()

/** ---------- computed ---------- */
const displayEmptyText = computed(() => props.emptyText || t('noData'))
const displaySearchPlaceholder = computed(() => props.searchPlaceholder || t('search'))

/** ---------- state ---------- */
// 用浅拷贝包装一份内部数据，避免 useTree 的写入操作污染父组件传入的 props.data
const dataRef = ref<TreeNode[]>(props.data ? [...props.data] : [])
const searchQuery = ref('')

// 仅在 props.data 引用变化时同步（非 deep），避免大数据下的循环更新
watch(
  () => props.data,
  (val) => {
    dataRef.value = val ? [...val] : []
  }
)

/** ---------- useTree ---------- */
const {
  flatNodes,
  checkedKeys,
  selectedKey,
  toggleExpand,
  toggleCheck,
  selectNode,
  expandAll,
  collapseAll,
  filterNodes,
  getCheckedNodes,
  getExpandedKeys,
  setExpandedKeys,
  appendNode,
  removeNode,
  updateNode
} = useTree({
  data: dataRef,
  keyField: props.keyField,
  labelField: props.labelField,
  childrenField: props.childrenField,
  selectMode: props.selectMode,
  isLazy: props.isLazy
})

/** ---------- computed ---------- */
const scrollStyle = computed(() => {
  if (props.isVirtual) {
    return { height: `${props.virtualHeight}px` }
  }
  return {}
})

/** ---------- methods ---------- */
const getNodeKey = (node: TreeNode): string | number => {
  return (node as any)[props.keyField]
}

const getNodeLabel = (node: TreeNode): string => {
  return (node as any)[props.labelField] || ''
}

const getNodeStyle = (flatNode: any) => {
  return {
    paddingLeft: `${flatNode.level * props.indent + 16}px`
  }
}

const handleNodeClick = (flatNode: any) => {
  if (flatNode.node.isDisabled) return

  emit('onNodeClick', flatNode.node)

  if (props.selectMode === 'single') {
    selectNode(getNodeKey(flatNode.node))
  }

  if (flatNode.hasChildren && !flatNode.isLeaf) {
    toggleExpand(getNodeKey(flatNode.node))
    emit('onNodeExpand', flatNode.node, !flatNode.expanded)
  }
}

const handleToggleExpand = (flatNode: any) => {
  if (flatNode.node.isDisabled) return
  toggleExpand(getNodeKey(flatNode.node))
  emit('onNodeExpand', flatNode.node, !flatNode.expanded)
}

const handleToggleCheck = (flatNode: any) => {
  if (flatNode.node.isDisabled) return
  toggleCheck(getNodeKey(flatNode.node))
  emit('onCheckChange', Array.from(checkedKeys.value), flatNode.node)
}

const handleSearch = (e: any) => {
  const query = e.detail?.value || e.target?.value || ''
  searchQuery.value = query
  filterNodes(query)
  emit(
    'onSearch',
    query,
    flatNodes.value.filter((n) => n.visible).map((n) => n.node)
  )
}

const scrollToNode = (_key: string | number) => {
  // 实现滚动到指定节点
}

/** ---------- expose ---------- */
defineExpose<SeeTreeExpose>({
  getCheckedNodes,
  getExpandedKeys,
  setExpandedKeys,
  expandAll,
  collapseAll,
  filter: filterNodes,
  scrollToNode,
  appendNode,
  removeNode,
  updateNode
})
</script>

<style lang="scss" scoped>
.see-tree {
  width: 100%;
  background: var(--see-bg-color);

  &__search {
    padding: 16rpx 24rpx;
  }

  &__search-input {
    height: var(--see-tree-search-height, 72rpx);
    background: var(--see-info-light, #f2f3f5);
    border-radius: 36rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: var(--see-main-color);
  }

  &__scroll {
    width: 100%;
  }

  &__node {
    display: flex;
    align-items: center;
    height: var(--see-tree-node-height, 88rpx);
    padding-right: 24rpx;
    box-sizing: border-box;
    transition: background 0.2s ease;

    &:active {
      background: var(--see-tree-hover-bg, var(--see-info-light));
    }

    &--selected {
      background: var(--see-tree-hover-bg, var(--see-info-light));
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__expand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;

    &--expanded {
      transform: rotate(90deg);
    }
  }

  &__expand-icon-text {
    font-size: 24rpx;
    color: var(--see-tips-color);
  }

  &__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid var(--see-border-color);
    border-radius: 6rpx;
    margin-right: 12rpx;
    box-sizing: border-box;

    &--checked {
      background: var(--see-tree-active-color, var(--see-primary));
      border-color: var(--see-tree-active-color, var(--see-primary));
    }

    &--indeterminate {
      background: var(--see-tree-active-color, var(--see-primary));
      border-color: var(--see-tree-active-color, var(--see-primary));
      opacity: 0.7;
    }
  }

  &__checkbox-icon {
    font-size: 24rpx;
    color: #ffffff;
    font-weight: bold;
  }

  &__content {
    flex: 1;
    overflow: hidden;
  }

  &__label {
    font-size: 30rpx;
    color: var(--see-main-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__loading {
    font-size: 24rpx;
    color: var(--see-tips-color);
    margin-left: 8rpx;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400rpx;
  }

  &__empty-text {
    font-size: 28rpx;
    color: var(--see-tips-color);
  }
}
</style>
