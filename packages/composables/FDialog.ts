import type { FDialogFn, FDialogOptions, FDialogType } from '@/types';
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

		const cleanup = () => {
			visible.value = false;
			render(null, container);
			document.body.removeChild(container);
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
			...options,
		});

		render(vnode, container);
	});
};

const confirm = (content: string, title = '确认'): Promise<boolean> => {
	return showDialog({
		title,
		content,
		type: 'confirm',
		showCancel: true,
	});
};

const alert = (content: string, title = '提示', type: FDialogType = 'info'): Promise<boolean> => {
	return showDialog({
		title,
		content,
		type,
		showCancel: false,
		confirmText: '知道了',
	});
};

const success = (content: string, title = '成功'): Promise<boolean> => {
	return alert(content, title, 'success');
};

const warning = (content: string, title = '警告'): Promise<boolean> => {
	return alert(content, title, 'warning');
};

const error = (content: string, title = '错误'): Promise<boolean> => {
	return alert(content, title, 'error');
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
FDialog.error = error;
FDialog.info = info;

export default FDialog;
