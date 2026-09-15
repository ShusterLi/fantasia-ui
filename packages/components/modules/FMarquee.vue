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
.f-marquee {
	overflow: hidden;
	white-space: nowrap;
	background: linear-gradient(90deg, #fff1f8, #fdf2f8, #fff7ed);
	border: 1px solid #f9d8ea;
	border-radius: 8px;
	padding: 8px 0;

	&__track {
		display: inline-flex;
		align-items: center;
		width: max-content;
		min-width: 100%;
		animation: f-marquee-scroll var(--duration, 28s) linear infinite;
		animation-direction: var(--dir, normal);
		font-size: 14px;
		font-weight: 600;
		color: #9d174d;
		letter-spacing: 0.04em;
	}

	&.is-pause:hover .f-marquee__track {
		animation-play-state: paused;
	}
}

@keyframes f-marquee-scroll {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(-50%);
	}
}
</style>
