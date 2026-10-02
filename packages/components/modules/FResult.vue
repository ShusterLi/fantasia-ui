<script lang="ts" setup>
import type { FResultProps } from '@/types';
import { CheckmarkCircle, CloseCircle, AlertCircle, InformationCircle } from '@vicons/ionicons5';
import FIcon from './FIcon.vue';

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
@use '../../styles/components/f-result.scss';
</style>

