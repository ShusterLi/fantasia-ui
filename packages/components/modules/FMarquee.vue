<script setup lang="ts">
import type { FMarqueeProps } from '@/types';

const props = withDefaults(defineProps<FMarqueeProps>(), {
	text: 'Fantasia UI',
	speed: 28,
	direction: 'left',
	pauseOnHover: true,
	gap: 32,
});

const content = computed(() => Array.from({ length: 2 }, () => props.text).join(' '.repeat(props.gap)));
const animationDirection = computed(() => props.direction === 'right' ? 'reverse' : 'normal');
</script>

<template>
	<div class="f-marquee" :class="{ 'is-pause': pauseOnHover }">
		<div class="f-marquee__track" :style="{ animationDirection, animationDuration: `${speed}s` }">
			<span>{{ content }}</span>
			<span>{{ content }}</span>
		</div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-marquee.scss';
</style>

