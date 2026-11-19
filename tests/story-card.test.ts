import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HdStoryCard from '../src/components/HdStoryCard.vue';

describe('HdStoryCard', () => {
  it('every story has a picture: without one, the outlet tile with its name', () => {
    const w = mount(HdStoryCard, { props: { title: 'T', source: 'City Times' } });
    expect(w.find('.hd-story__outlet').text()).toBe('City Times');
    expect(w.find('.hd-story__picture').attributes('style')).toContain('linear-gradient');
  });
  it('the outlet colour is the same every time', () => {
    const a = mount(HdStoryCard, { props: { title: 'A', source: 'X' } }).find('.hd-story__picture').attributes('style');
    const b = mount(HdStoryCard, { props: { title: 'B', source: 'X' } }).find('.hd-story__picture').attributes('style');
    expect(a).toBe(b);
  });
  it('a picture URL fills the card; meta is source · age · outlets', () => {
    const w = mount(HdStoryCard, { props: { title: 'T', source: 'S', age: '1 h', outlets: 3, image: 'https://x/p.jpg' } });
    expect(w.find('.hd-story__outlet').exists()).toBe(false);
    expect(w.find('.hd-story__meta').text()).toBe('S · 1 h · 3 outlets');
  });
  it('the section, when there is one, ends the meta line', () => {
    const w = mount(HdStoryCard, { props: { title: 'T', source: 'BBC', age: '38 min', outlets: 5, section: 'Business' } });
    expect(w.find('.hd-story__meta').text()).toBe('BBC · 38 min · 5 outlets · Business');
  });
  it('the card is the button: no buttons on it', async () => {
    const w = mount(HdStoryCard, { props: { title: 'T', source: 'S' } });
    expect(w.findAll('button')).toHaveLength(0);
    await w.trigger('click'); expect(w.emitted('open')).toHaveLength(1);
  });
});

import HdToolBar from '../src/components/HdToolBar.vue';
describe('HdToolBar back side', () => {
  const order = (backSide?: 'start' | 'end') => mount(HdToolBar, { props: { back: true, backSide }, slots: { right: '<button aria-label="Share">s</button>' } })
    .findAll('button').map((b) => b.attributes('aria-label'));
  it('Back is at the far left by default, as on the N9', () => expect(order()).toEqual(['Back', 'Share']));
  it('the user can put it at the far right; the rest keep their order', () => expect(order('end')).toEqual(['Share', 'Back']));
});
