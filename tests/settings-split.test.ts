import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import XSettingsSplit from '../src/shell/apps/XSettingsSplit.vue';

const GROUPS = [
  { title: 'This device', pages: [{ id: 'look', title: 'Appearance', icon: 'moon', color: '#333' }] },
  { title: 'Your server', pages: [{ id: 'conn', title: 'Connections', icon: 'split', color: '#2F7D1E', admin: true }] },
];

describe('Settings split with real pages', () => {
  it('shows the host page in the slot and reports the choice', async () => {
    const w = mount(XSettingsSplit, { props: { groups: GROUPS, page: 'look' }, slots: { page: ({ page }: { page: string }) => h('p', { class: 'real' }, `page ${page}`) } });
    expect(w.find('.real').text()).toBe('page look');
    await w.findAll('.x-sset__side .hd-list-item').find((r) => r.text().includes('Connections'))!.trigger('click');
    expect(w.emitted('update:page')?.at(-1)).toEqual(['conn']);
    expect(w.find('.real').text()).toBe('page conn');
  });
  it('hides the admin pages from a device that is not the owner', () => {
    const w = mount(XSettingsSplit, { props: { groups: GROUPS, page: 'look', owner: false } });
    expect(w.text()).not.toContain('Connections');
  });
  it('follows the page prop (an address such as /settings/conn) and has a Back link to the list', async () => {
    const w = mount(XSettingsSplit, { props: { groups: GROUPS, page: 'look' }, slots: { page: ({ page }: { page: string }) => h('p', { class: 'real' }, page) } });
    await w.setProps({ page: 'conn' });
    await nextTick();
    expect(w.find('.real').text()).toBe('conn');
    expect(w.classes()).toContain('is-page');
    await w.find('.x-sset__back').trigger('click');
    expect(w.classes()).not.toContain('is-page');
  });
});
