import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import XFeedList from '../src/shell/apps/XFeedList.vue';
import XFeedPosts from '../src/shell/apps/XFeedPosts.vue';
import XFeedReader from '../src/shell/apps/XFeedReader.vue';
import BelleWidget from '../src/shell/widgets/BelleWidget.vue';

const feeds = [{ id: 'hn', title: 'Hacker News', unread: 3, updated: '14:44' }, { id: 'lwn', title: 'LWN', error: "Can't update" }];
const posts = [{ id: 'p1', title: 'Libraries swarmed by bots', feed: 'Hacker News', when: '06/11/2026', unread: true }, { id: 'p2', title: 'Kernel news', feed: 'LWN', when: '05/11/2026' }];

describe('XFeedList', () => {
  it('starts with All posts and the total unread, then each feed, its error and the unread bar', async () => {
    const w = mount(XFeedList, { props: { feeds } });
    const rows = w.findAll('.x-fl__row');
    expect(rows[0]!.text()).toContain('All posts');
    expect(rows[0]!.text()).toContain('3 unread posts');
    expect(rows[1]!.classes()).toContain('is-unread');
    expect(rows[2]!.find('.is-error').text()).toBe("Can't update");
    await rows[0]!.trigger('click');
    await rows[2]!.trigger('click');
    expect(w.emitted('open')).toEqual([['all'], ['lwn']]);
  });
});

describe('XFeedPosts', () => {
  it('shows the unread count, marks unread posts and opens a post by its id', async () => {
    const w = mount(XFeedPosts, { props: { posts, title: 'All posts' } });
    expect(w.find('.x-fp__count').text()).toBe('1');
    expect(w.findAll('.x-fp__row')[0]!.classes()).toContain('is-unread');
    await w.findAll('.x-fp__row')[1]!.trigger('click');
    expect(w.emitted('open')).toEqual([['p2']]);
  });
  it('leaves the feed name out for a single feed, and says when there is nothing', () => {
    expect(mount(XFeedPosts, { props: { posts, showFeed: false } }).text()).not.toContain('Hacker News');
    expect(mount(XFeedPosts, { props: { posts: [] } }).text()).toContain('No posts yet');
  });
});

describe('XFeedReader', () => {
  it('shows the post and gives every link to the host instead of following it', async () => {
    const w = mount(XFeedReader, { props: { post: { ...posts[0]!, html: '<p>Read <a href="https://example.org/a">the article</a></p>' } } });
    expect(w.find('.x-fr__title').text()).toBe('Libraries swarmed by bots');
    await w.find('a').trigger('click');
    expect(w.emitted('link')).toEqual([['https://example.org/a']]);
  });
});

describe('Belle feeds widget with real posts', () => {
  it('shows one feed by name and reports the post, not its link', async () => {
    const w = mount(BelleWidget, { props: { kind: 'rss', posts, source: 'Hacker News', updated: '14:44' } });
    expect(w.find('.bw-rss__head').text()).toContain('Hacker News');
    expect(w.findAll('.bw-rss__row')).toHaveLength(2);
    await w.findAll('.bw-rss__row')[0]!.trigger('click');
    expect(w.emitted('post')).toEqual([['p1']]);
  });
});
