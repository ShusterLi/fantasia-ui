<script setup lang="ts">
import type { FEmptyProps } from '@/types';

withDefaults(defineProps<FEmptyProps>(), {
	description: '鏆傛棤鏁版嵁',
	image: '',
	imageSize: 120
})
</script>

<template>
	<div class="f-empty">
		<div class="f-empty__image" :style="{ width: `${imageSize}px`, height: `${imageSize}px` }">
			<slot name="image">
				<img v-if="image" :src="image" class="f-empty__image-img" alt="" />
				<svg v-else viewBox="0 0 160 160" class="f-empty__image-default">
					<ellipse cx="80" cy="132" rx="46" ry="8" fill="currentColor" opacity="0.08" />
					<path d="M40 60 L120 60 L128 128 L32 128 Z" fill="none" stroke="currentColor" stroke-width="3"
						stroke-linejoin="round" opacity="0.35" />
					<path d="M40 60 L58 32 L102 32 L120 60" fill="none" stroke="currentColor" stroke-width="3"
						stroke-linejoin="round" opacity="0.35" />
					<line x1="32" y1="88" x2="128" y2="88" stroke="currentColor" stroke-width="3" opacity="0.35" />
					<path d="M64 88 Q80 106 96 88" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
						opacity="0.5" />
				</svg>
			</slot>
		</div>

		<div class="f-empty__description">
			<slot name="description">{{ description }}</slot>
		</div>

		<div v-if="$slots.default" class="f-empty__extra">
			<slot />
		</div>
	</div>
</template>
<style lang="scss" scoped>
@use '../../styles/components/f-empty.scss';
</style>

