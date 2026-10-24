import type { Meta } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { qs, both } from './q';
import HdTimePicker from '../../components/HdTimePicker.vue';
import HdColorPicker from '../../components/HdColorPicker.vue';
import HdSwitch from '../../components/HdSwitch.vue';
const meta: Meta = { title: 'Quasar/Components/Forms', ...both };
export default meta;
export const Input = qs(`<div class="q-gutter-md" style="max-width:360px"><q-input outlined label="Name" :model-value="'Anna'" /><q-input outlined label="Email" placeholder="you@example.com" :model-value="''" hint="We never share it" />
  <q-input outlined label="Phone" :model-value="'12'" error error-message="Too short" /><q-input outlined type="textarea" label="Note" :model-value="'Multi-line'" /><q-input standard label="Standard" :model-value="''" /><q-input outlined dense label="Dense" :model-value="''" /><q-input outlined disable label="Disabled" :model-value="'x'" /></div>`, undefined, { name: 'QInput' });
export const Field = qs(`<q-field outlined label="Custom field" stack-label style="max-width:360px"><template #control><div class="self-center full-width no-outline">Read-only value</div></template></q-field>`, undefined, { name: 'QField' });
export const Select = qs(`<q-select outlined label="Ringtone" :model-value="'Nokia tune'" :options="['Nokia tune','Bells','Silent']" style="max-width:360px" />`, undefined, { name: 'QSelect' });
export const File = qs(`<q-file outlined label="Attach file" :model-value="null" style="max-width:360px" />`, undefined, { name: 'QFile' });
export const Form = qs(`<q-form style="max-width:360px"><q-input outlined label="Username" :model-value="''" /><q-input outlined type="password" label="Password" :model-value="''" /><div class="row q-gutter-sm"><q-btn color="primary" label="Sign in" type="submit" /><q-btn flat label="Cancel" /></div></q-form>`, undefined, { name: 'QForm' });
export const Checkbox = qs(`<div class="column"><q-checkbox :model-value="true" label="Wi-Fi" /><q-checkbox :model-value="false" label="Bluetooth" /><q-checkbox :model-value="null" toggle-indeterminate label="Indeterminate" /><q-checkbox :model-value="true" disable label="Disabled" /></div>`, undefined, { name: 'QCheckbox' });
export const Radio = qs(`<div class="column"><q-radio :model-value="'a'" val="a" label="Automatic" /><q-radio :model-value="'a'" val="b" label="Manual" /></div>`, undefined, { name: 'QRadio' });
export const Toggle = qs(`<div class="column"><q-toggle :model-value="true" label="Flight mode" /><q-toggle :model-value="false" label="Power save" /></div>`, undefined, { name: 'QToggle (switch)' });
export const OptionGroup = qs(`<q-option-group :model-value="'op1'" :options="[{label:'Ring',value:'op1'},{label:'Vibrate',value:'op2'},{label:'Silent',value:'op3'}]" type="radio" />`, undefined, { name: 'QOptionGroup' });
export const Slider = qs(`<div style="max-width:360px"><q-slider :model-value="40" :min="0" :max="100" /><q-slider :model-value="70" label label-always :min="0" :max="100" /></div>`, undefined, { name: 'QSlider' });
export const Range = qs(`<q-range :model-value="{min:20,max:70}" :min="0" :max="100" style="max-width:360px" />`, undefined, { name: 'QRange' });
export const Knob = qs(`<q-knob :model-value="60" size="72px" show-value :thickness="0.15" />`, undefined, { name: 'QKnob' });
export const Date = qs(`<div class="column q-gutter-md items-start"><q-date :model-value="'2026/10/24'" /><q-date :model-value="'2026/10/24'" default-view="Months" /><q-date :model-value="'2026/10/24'" default-view="Years" /></div>`, undefined, { name: 'QDate' });
export const Time = qs(`<div class="row q-gutter-lg items-start">
  <HdTimePicker v-model="t" />
  <section class="hd-alarms" aria-label="Alarms">
    <h2 class="hd-alarms__title">Alarms</h2>
    <div v-for="a in alarms" :key="a.t" class="hd-alarms__row"><span class="hd-alarms__t"><b>{{ a.t }}</b><small>{{ a.d }}</small></span><HdSwitch v-model="a.on" :aria-label="'Alarm ' + a.t" /></div>
  </section>
  <div class="column q-gutter-sm"><div class="text-caption">QTime (Quasar API, N9 skin) · {{ t }}</div><q-time v-model="t" /></div>
</div>`, () => ({ t: ref('10:45'), alarms: ref([{ t: '06:45', d: 'Weekdays · Wake up', on: true }, { t: '08:30', d: 'Sat, Sun', on: false }, { t: '13:50', d: 'Today · Design review', on: true }]) }), { name: 'QTime + N9 time picker' }, { HdTimePicker, HdSwitch });
export const Color = qs(`<div class="row q-gutter-lg items-start"><HdColorPicker v-model="c" /><div class="column q-gutter-sm"><div class="text-caption">QColor (Quasar API, N9 skin) · {{ c }}</div><q-color v-model="c" style="width:280px" /></div></div>`,
  () => ({ c: ref('#4591FF') }), { name: 'QColor + N9 colour picker' }, { HdColorPicker });
export const Editor = qs(`<q-editor :model-value="'<p>Hello <b>N9</b></p>'" min-height="5rem" />`, undefined, { name: 'QEditor' });
export const PopupEdit = qs(`<div>Tap the name: <span style="cursor:pointer;border-bottom:1px dashed">{{ name }}<q-popup-edit v-model="name" auto-save v-slot="scope"><q-input v-model="scope.value" dense autofocus outlined @keyup.enter="scope.set" /></q-popup-edit></span></div>`, () => ({ name: ref('Anna') }), { name: 'QPopupEdit' });
export const Uploader = qs(`<q-uploader label="Upload photos" url="" style="max-width:320px" />`, undefined, { name: 'QUploader' });
