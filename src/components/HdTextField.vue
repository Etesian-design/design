<script setup lang="ts">
/**
 * TextField. N9-original: 52 n9px white field, inset look, light text, placeholder in secondary colour,
 * clear button. Extrapolated for web: visible label, helper and error text wired with aria-describedby.
 */
import { computed } from 'vue';
import { useId } from '../composables/useModal';
import HdIcon from './HdIcon.vue';
const props = withDefaults(defineProps<{
  modelValue?: string; label?: string; placeholder?: string; type?: string; disabled?: boolean; readonly?: boolean;
  required?: boolean; error?: string; helper?: string; clearable?: boolean; icon?: string; name?: string; autocomplete?: string; multiline?: boolean; rows?: number; ariaLabel?: string;
}>(), { modelValue: '', type: 'text', rows: 4 });
const emit = defineEmits<{ 'update:modelValue': [v: string] }>();
const id = useId('hd-field');
const describedBy = computed(() => [props.helper && `${id}-help`, props.error && `${id}-err`].filter(Boolean).join(' ') || undefined);
</script>
<template>
  <div class="hd-field" :class="{ 'is-error': error, 'is-disabled': disabled }">
    <label v-if="label" class="hd-field__label" :for="id">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <div class="hd-field__box hd-sqf" :class="{ 'hd-field__box--multi': multiline }">
      <HdIcon v-if="icon" :name="icon" :size="20" class="hd-field__icon" />
      <textarea v-if="multiline" :id="id" class="hd-field__input" :rows="rows" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
        :required="required" :name="name" :aria-invalid="error ? 'true' : undefined" :aria-describedby="describedBy" :aria-label="label ? undefined : ariaLabel"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"></textarea>
      <input v-else :id="id" class="hd-field__input" :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
        :required="required" :name="name" :autocomplete="autocomplete" :aria-invalid="error ? 'true' : undefined" :aria-describedby="describedBy" :aria-label="label ? undefined : ariaLabel"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
      <button v-if="clearable && modelValue && !disabled" type="button" class="hd-field__clear hd-sq hd-focusable" aria-label="Clear" @click="emit('update:modelValue', '')">
        <HdIcon name="close" :size="16" />
      </button>
    </div>
    <p v-if="helper" :id="`${id}-help`" class="hd-field__helper">{{ helper }}</p>
    <p v-if="error" :id="`${id}-err`" class="hd-field__error" role="alert"><HdIcon name="warning" :size="14" /> {{ error }}</p>
  </div>
</template>
<style>
.hd-field { display: flex; flex-direction: column; gap: var(--hd-space-medium); }
.hd-field.is-disabled { opacity: var(--hd-opacity-disabled); }
.hd-field__label { font: var(--hd-font-weight-regular) var(--hd-font-size-small)/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.hd-field__box { display: flex; align-items: center; gap: var(--hd-space-double); min-height: var(--hd-size-field); padding: 0 calc(var(--hd-size-field) / 3); }
.hd-field__box--multi { align-items: flex-start; padding-top: var(--hd-space-double); padding-bottom: var(--hd-space-double); }
.hd-field__box:hover { --hd-sqf-edge: var(--hd-c-fg-secondary); }
.hd-field__box:focus-within { --hd-sqf-edge: var(--hd-c-focus); --hd-sqf-edge-w: 2px; }
.is-error .hd-field__box { --hd-sqf-edge: var(--hd-color-palette-warning); }
.hd-field__input { flex: 1; min-width: 0; border: 0; background: transparent; color: var(--hd-c-fg); outline: none; resize: vertical;
  font: var(--hd-font-weight-light) var(--hd-font-size-default)/1.3 var(--hd-font-family-light); }
.hd-field__input::placeholder { color: var(--hd-c-fg-secondary); opacity: .8; }
.hd-field__input::selection { background: var(--hd-color-palette-select); color: #000; }
.hd-field__icon { color: var(--hd-c-fg-secondary); }
.hd-field__clear { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 0; --hd-sq-size: 28px; --hd-sq-fill: var(--hd-c-pressed); color: var(--hd-c-fg-secondary); cursor: pointer; }
.hd-field__helper, .hd-field__error { margin: 0; font-size: var(--hd-font-size-xsmall); color: var(--hd-c-fg-secondary); }
.hd-field__error { color: var(--hd-color-palette-warning); font-weight: 400; display: flex; align-items: center; gap: 4px; }
</style>
