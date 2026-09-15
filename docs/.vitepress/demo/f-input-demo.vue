<script setup>
import FInput from '../../../packages/components/modules/FInput.vue'
import { ref } from 'vue'
const text = ref('')
</script>

<template>
  <div style="padding:12px; background:#fff;">
    <FInput v-model="text" placeholder="输入试试" />
    <p>当前输入：{{ text }}</p>
  </div>
</template>
