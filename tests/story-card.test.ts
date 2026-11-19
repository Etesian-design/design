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
  it('the card is the button: no buttons on it', async () => {
    const w = mount(HdStoryCard, { props: { title: 'T', source: 'S' } });
    expect(w.findAll('button')).toHaveLength(0);
    await w.trigger('click'); expect(w.emitted('open')).toHaveLength(1);
  });
});
