import React from 'react'
import { CheckboxGroup, VisuallyHidden, useCheckbox, cn } from '@heroui/react'

// 自定义方角按钮组件（HeroUI 默认风格）
const GroupItem = (props: any) => {
  const { isSelected, getBaseProps, getInputProps, getLabelProps } = useCheckbox(props)

  return (
    <label {...getBaseProps()} className="m-0 p-0 flex-1">
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        className={cn(
          // 基础样式：高度固定，水平居中，边框合并逻辑
          'flex items-center justify-center h-10 cursor-pointer transition-all border-y-2 border-r-2 border-default',
          'first:border-l-2',
          // 圆角处理：仅在组的首尾保留默认圆角
          'first:rounded-l-md last:rounded-r-md',
          // 状态样式
          isSelected
            ? 'bg-primary border-primary text-primary-foreground z-10'
            : 'bg-transparent text-default-500 font-medium'
        )}
      >
        <span {...getLabelProps()}>{props.children}</span>
      </div>
    </label>
  )
}

export default function QueueButtonGroup() {
  const [selected, setSelected] = React.useState<string[]>([])

  const handleLogicChange = (values: any) => {
    // 找出最新被点击的值
    const lastKey =
      values.length > selected.length ? values.find((v: string) => !selected.includes(v)) : null

    if (!lastKey) {
      setSelected(values) // 处理取消勾选
      return
    }

    // 互斥逻辑判断
    if (lastKey === 'S' || lastKey === 'B') {
      setSelected([lastKey]) // S/B 独占
    } else {
      // 选中 L/C 时，过滤掉 S 和 B
      const next = values.filter((v: string) => v === 'L' || v === 'C')
      setSelected(next)
    }
  }

  // 生成最终要求的格式
  const result = {
    L: selected.includes('L'),
    C: selected.includes('C'),
    S: selected.includes('S'),
    B: selected.includes('B')
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="w-full max-w-sm">
        <CheckboxGroup
          orientation="horizontal"
          value={selected}
          onValueChange={handleLogicChange}
          classNames={{
            wrapper: 'gap-0 shadow-sm' // 关键：gap-0 实现无缝连接
          }}
        >
          <GroupItem value="L">L</GroupItem>
          <GroupItem value="C">C</GroupItem>
          <GroupItem value="S">S</GroupItem>
          <GroupItem value="B">B</GroupItem>
        </CheckboxGroup>
      </div>

      {/* 状态输出预览 */}
      <div className="p-4 bg-default-50 rounded-lg border border-default">
        <p className="text-xs text-default-400 mb-2 font-mono uppercase tracking-wider">
          Output Object:
        </p>
        <code className="text-sm whitespace-pre">{JSON.stringify(result, null, 2)}</code>
      </div>
    </div>
  )
}
