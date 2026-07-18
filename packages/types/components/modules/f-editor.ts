interface FEditorProps {
    placeholder?: string;
    rows?: number;
    language?: 'json' | 'text';
    readonly?: boolean;
    showLine?: boolean;
    height?: number;
}

export type { FEditorProps };