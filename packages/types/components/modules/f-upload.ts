interface FUploadProps {
	accept?: string;
	hint?: string;
	/** 最多允许存在的文件数（数量限制，不是字节大小） */
	limit?: number;
	/** 选中后是否立即自动上传，默认 true */
	autoUpload?: boolean;
	/**
	 * 校验/拦截钩子：返回 false 或 reject 则该文件不会进入列表也不会上传。
	 * 用来做文件大小、类型等前置校验，替代过去分散在各业务组件里的校验代码。
	 */
	beforeUpload?: (file: File) => boolean | Promise<boolean>;
	/**
	 * 实际上传逻辑，由调用方注入——组件本身不关心用的是 fetch/axios/dispatcher，
	 * 只负责在合适的时机调用它，并把 onProgress 回调交给它在上传过程中调用。
	 */
	httpRequest?: (file: File, onProgress: (percent: number) => void) => Promise<string>;
}

interface UploadFileItem {
	uid: string;
	name: string;
	status: 'ready' | 'uploading' | 'success' | 'error';
	percentage: number;
	raw: File;
	response?: string;
	errorMessage?: string;
}

export type { FUploadProps, UploadFileItem };
