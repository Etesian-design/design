<script setup lang="ts">
/** QueryDialog. N9-original: optional icon, title, message, accept + reject buttons stacked (accept on top). */
import HdDialog from './HdDialog.vue';
import HdButton from './HdButton.vue';
withDefaults(defineProps<{ open: boolean; title: string; message?: string; acceptLabel?: string; rejectLabel?: string; destructive?: boolean; inline?: boolean }>(), { acceptLabel: 'OK' });
const emit = defineEmits<{ accept: []; reject: []; 'update:open': [v: boolean] }>();
const close = (a: boolean) => { a ? emit('accept') : emit('reject'); emit('update:open', false); };
</script>
<template>
  <HdDialog :open="open" :title="title" role="alertdialog" :inline="inline" @close="close(false)">
    <template #icon><slot name="icon" /></template>
    <slot>{{ message }}</slot>
    <template #buttons>
      <HdButton fixed-width :variant="destructive ? 'negative' : 'default'" @click="close(true)">{{ acceptLabel }}</HdButton>
      <HdButton v-if="rejectLabel" fixed-width @click="close(false)">{{ rejectLabel }}</HdButton>
    </template>
  </HdDialog>
</template>
