<script setup lang="ts">
/** TextArea: multi-line TextField (N9-original component, same styling). */
import HdTextField from './HdTextField.vue';
defineProps<{ modelValue?: string; label?: string; placeholder?: string; rows?: number; disabled?: boolean; error?: string; helper?: string; required?: boolean }>();
defineEmits<{ 'update:modelValue': [v: string] }>();
</script>
<template>
  <HdTextField multiline v-bind="$props" @update:model-value="(v: string) => $emit('update:modelValue', v)" />
</template>
