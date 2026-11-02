<script setup lang="ts">
/** SearchField: TextField with search icon and clear button; role=search wrapper. Enter emits `search`. */
import HdTextField from './HdTextField.vue';
withDefaults(defineProps<{ modelValue?: string; placeholder?: string; label?: string }>(), { placeholder: 'Search', label: 'Search' });
const emit = defineEmits<{ 'update:modelValue': [v: string]; search: [v: string] }>();
</script>
<template>
  <form role="search" class="hd-search" @submit.prevent="emit('search', modelValue ?? '')">
    <HdTextField :model-value="modelValue" type="search" icon="search" clearable :placeholder="placeholder"
      :aria-label="label" @update:model-value="(v: string) => emit('update:modelValue', v)" />
  </form>
</template>
<style>
.hd-search input::-webkit-search-cancel-button { display: none; }
</style>
