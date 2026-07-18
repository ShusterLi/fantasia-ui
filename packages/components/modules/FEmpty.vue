<script setup lang="ts">
import type { FEmptyProps } from '@/types';

withDefaults(defineProps<FEmptyProps>(), {
	description: '暂无数据',
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

<style lang="scss">
:root {
	--f-empty-image-color: #52525b;
	--f-empty-description-color: #71717a;
}

:root.light {
	--f-empty-image-color: #d4d4d8;
	--f-empty-description-color: #a1a1aa;
}

.f-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 32px 0;

	&__image {
		color: var(--f-empty-image-color);

		&-default,
		&-img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}

	&__description {
		margin-top: 12px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--f-empty-description-color);
		text-align: center;
	}

	&__extra {
		margin-top: 16px;
	}
}
</style>
