<template>
  <div class="heart-rating flex gap-1.5">
    <button
      v-for="i in 5"
      :key="i"
      @click="$emit('update:modelValue', i)"
      class="heart-btn transition-transform active:scale-90"
    >
      <Heart
        :size="24"
        :fill="i <= modelValue ? '#E87FA5' : 'none'"
        :stroke="i <= modelValue ? '#E87FA5' : '#F4B8CE'"
        stroke-width="1.5"
      />
    </button>
  </div>
</template>

<script setup>
import { Heart } from 'lucide-vue-next'

defineProps({
  modelValue: { type: Number, default: 3 }
})
defineEmits(['update:modelValue'])
</script>
