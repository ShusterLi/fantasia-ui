interface BreadcrumbItem {
    label: string
    href?: string
}

interface FBreadcrumbProps {
    items: BreadcrumbItem[]
    separator?: string
    animated?: boolean
}

export type { FBreadcrumbProps, BreadcrumbItem };