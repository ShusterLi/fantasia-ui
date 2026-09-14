import type { FDialogFn, FDialogOptions, Type } from '@/types';
import { h, render } from 'vue';
import FDialogComp from '../components/modules/FDialog.vue';

const showDialog = (options: FDialogOptions): Promise<boolean> => {
	return new Promise((resolve) => {
		const container = document.createElement('div');
		document.body.appendChild(container);

		const visible = ref(true);

		const handleConfirm = () => {
			cleanup();
			resolve(true);
		};

		const handleCancel = () => {
			cleanup();
			resolve(false);
		};

		const handleClose = () => {
			cleanup();
			resolve(false);
		};

		const cleanup = () => {
			visible.value = false;
			setTimeout(() => {
				render(null, container);
				document.body.removeChild(container);
			}, 300);
		};

		const vnode = h(FDialogComp, {
			modelValue: visible.value,
			'onUpdate:modelValue': (val: boolean) => {
				visible.value = val;
				if (!val) {
					cleanup();
				}
			},
			onConfirm: handleConfirm,
			onCancel: handleCancel,
			onClose: handleClose,
			...options,
		});

		render(vnode, container);
	});
};

const confirm = (content: string, title = '确认'): Promise<boolean> => {
	return showDialog({
		title,
		content,
		type: 'warning',
		showCancel: true,
		center: true,
	});
};

const alert = (content: string, title = '提示', type: Type = 'info'): Promise<boolean> => {
	return showDialog({
		title,
		content,
		type,
		showCancel: false,
		confirmText: '知道了',
		center: true,
	});
};

const success = (content: string, title = '成功'): Promise<boolean> => {
	return alert(content, title, 'success');
};

const warning = (content: string, title = '警告'): Promise<boolean> => {
	return alert(content, title, 'warning');
};

const failed = (content: string, title = '错误'): Promise<boolean> => {
	return alert(content, title, 'failed');
};

const info = (content: string, title = '提示'): Promise<boolean> => {
	return alert(content, title, 'info');
};

const FDialog = ((options: FDialogOptions): Promise<boolean> => {
	return showDialog(options);
}) as FDialogFn;

FDialog.showDialog = showDialog;
FDialog.confirm = confirm;
FDialog.alert = alert;
FDialog.success = success;
FDialog.warning = warning;
FDialog.failed = failed;
FDialog.info = info;

export default FDialog;
