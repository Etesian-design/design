import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdListItem from '../components/HdListItem.vue';
import HdSectionHeader from '../components/HdSectionHeader.vue';
import HdSwitch from '../components/HdSwitch.vue';
import HdAvatar from '../components/HdAvatar.vue';
import HdCountBubble from '../components/HdCountBubble.vue';

const meta: Meta<typeof HdListItem> = {
  title: 'OS/ListItem', component: HdListItem, tags: ['autodocs'],
  parameters: { docs: { description: { component: '**N9** ListDelegate: 80 n9px rows (64 small), title in large light type, secondary subtitle, squircle thumbnail, drill-down arrow. **EXT**: hover tint, renders as link/button for keyboard access.' } } },
  args: { title: 'Anna Virtanen', subtitle: 'Mobile +358 40 123 4567' },
};
export default meta;
type S = StoryObj<typeof HdListItem>;
export const Basic: S = {};
export const WithThumbnail: S = { args: { thumbnailIcon: 'photo', title: 'Holiday 2011', subtitle: '48 photos' } };
export const DrillDown: S = { args: { drilldown: true, title: 'Wi-Fi', subtitle: 'Home network' } };
export const Small: S = { args: { small: true, subtitle: undefined } };
export const Disabled: S = { args: { clickable: true, disabled: true } };
export const List: S = {
  render: () => ({ components: { HdListItem, HdSectionHeader, HdSwitch, HdAvatar, HdCountBubble }, template: `<div role="list" style="max-width:420px">
    <HdSectionHeader title="Favourites" />
    <div role="listitem"><HdListItem title="Anna Virtanen" subtitle="Available" clickable><template #leading><HdAvatar name="Anna Virtanen" /></template></HdListItem></div>
    <div role="listitem"><HdListItem title="Mikko Laine" subtitle="Last seen 10:24" clickable><template #leading><HdAvatar name="Mikko Laine" /></template><template #trailing><HdCountBubble :value="2" /></template></HdListItem></div>
    <HdSectionHeader title="Settings" />
    <div role="listitem"><HdListItem title="Flight mode"><template #trailing><HdSwitch aria-label="Flight mode" /></template></HdListItem></div>
    <div role="listitem"><HdListItem title="Bluetooth" subtitle="Off" drilldown /></div></div>` }),
};
