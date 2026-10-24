import { defineComponent, h } from 'vue';
import HdBusyIndicator from '../components/HdBusyIndicator.vue';
/**
 * N9 squircle spinner with the QSpinner API (size: '1em' | '48px' | number, color: Quasar colour name).
 * Used as the default spinner for Loading/Notify/QInnerLoading in the Harmattan Quasar config.
 */
export default defineComponent({
  name: 'HdQSpinnerSquircle',
  props: { size: { type: [String, Number], default: '1em' }, color: String, thickness: Number },
  setup(props) {
    return () => {
      const s = typeof props.size === 'number' ? `${props.size}px` : props.size;
      return h('span', { class: ['hd-q-spinner-squircle q-spinner', props.color ? `text-${props.color}` : ''], style: { width: s, height: s, fontSize: s }, role: 'progressbar' },
        [h(HdBusyIndicator, { size: 64, variant: 'squircle', label: 'Loading', style: { width: '100%', height: '100%' } })]);
    };
  },
});
