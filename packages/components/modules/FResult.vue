<script lang="ts" setup>
import type { FResultProps } from '@/types';
import { CheckmarkCircle, CloseCircle, AlertCircle, InformationCircle } from '@vicons/ionicons5';
import { FIcon } from 'fantasia-ui';

const props = withDefaults(defineProps<FResultProps>(), {
	status: 'info'
});

defineSlots<{
	icon?(): any
	title?(): any
	subtitle?(): any
	extra?(): any
	default?(): any
}>();

const statusIconMap: Record<string, Component> = {
	success: CheckmarkCircle,
	error: CloseCircle,
	warning: AlertCircle,
	info: InformationCircle
};

const isCodeStatus = computed(() => ['403', '404', '500'].includes(props.status));
const showCode = computed(() => !props.icon && isCodeStatus.value);
const resolvedIcon = computed(() => props.icon ?? statusIconMap[props.status]);
</script>

<template>
	<div class="f-result" :class="`f-result--${status}`">
		<div class="f-result__icon">
			<slot name="icon">
				<span v-if="showCode" class="f-result__code">{{ status }}</span>
				<f-icon v-else :size="72">
					<component :is="resolvedIcon" />
				</f-icon>
			</slot>
		</div>

		<div v-if="$slots.title || title" class="f-result__title">
			<slot name="title">{{ title }}</slot>
		</div>

		<div v-if="$slots.subtitle || subTitle" class="f-result__subtitle">
			<slot name="subtitle">{{ subTitle }}</slot>
		</div>

		<div v-if="$slots.extra" class="f-result__extra">
			<slot name="extra" />
		</div>

		<div v-if="$slots.default" class="f-result__content">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.f-result {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 48px 24px;
	--_color: var(--blue);

	&--success {
		--_color: var(--green);
	}

	&--error {
		--_color: var(--red);
	}

	&--warning {
		--_color: var(--gold);
	}

	&--403,
	&--404,
	&--500 {
		--_color: var(--text-dim);
	}

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 24px;
		color: var(--_color);
	}

	&__code {
		font-size: 56px;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 2px;
	}

	&__title {
		font-size: 20px;
		font-weight: 600;
		line-height: 1.4;
		color: var(--text);
	}

	&__subtitle {
		margin-top: 8px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-muted);
		max-width: 480px;
	}

	&__extra {
		display: flex;
		gap: 12px;
		margin-top: 24px;
	}

	&__content {
		margin-top: 24px;
		width: 100%;
	}
}
</style>
