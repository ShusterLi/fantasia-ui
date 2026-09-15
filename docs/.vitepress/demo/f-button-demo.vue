<script setup>
import FButton from '../../../packages/components/modules/FButton.vue'
import { ref } from 'vue'
const count = ref(0)
const onClick = () => count.value++
</script>

<template>
  <div style="padding:12px; background:#fff;">
    <FButton type="primary" @click="onClick">Primary {{ count }}</FButton>
    <FButton :disabled="true">Disabled</FButton>
  </div>
</template>
