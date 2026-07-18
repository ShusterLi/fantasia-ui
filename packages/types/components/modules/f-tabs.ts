type TabsType = 'line' | 'bar' | 'card' | 'segment';

interface TabItem {
  label: string
  name: string
  disabled?: boolean
}

interface FTabsProps {
  tabs: TabItem[]
  active?: string
  type?: TabsType
}

export type { FTabsProps }