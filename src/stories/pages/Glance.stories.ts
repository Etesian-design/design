import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdStoryCard from '../../components/HdStoryCard.vue';
import HdToolBar from '../../components/HdToolBar.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdIcon from '../../components/HdIcon.vue';
import HdSquircle from '../../components/HdSquircle.vue';

/* Glance on the phone (2026-11-19): one screen like a news front page, its search bar searching everything on the
 * device and the web, the news under it, and a reader for the articles. Pictures here are gradients standing in for
 * photos; outlets and headlines are samples. Frame: 360 × 640 dp, shown at 8/9 (320 × 569, as the System apps). */
const meta: Meta = {
  title: 'Examples/Glance (news and search)',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Glance: **news and search everything** on one screen. Typing in the search bar replaces the news with results from the whole device (apps, contacts, messages, notifications, settings, files, the news) and the web; clearing it brings the news back. Stories open in the **reader**: just the article, in the system\'s type and colours, the original a tap away. Every action is on the **bottom toolbar** (see Guide / The phone, 3).' } } },
};
// A phone screen (or part of one): centred, as big as itself.
meta.parameters = { ...meta.parameters, layout: 'centered' };
export default meta;
type S = StoryObj;
const comps = { HdStoryCard, HdToolBar, HdToolIcon, HdIcon, HdSquircle };

const CSS = `<component is="style">
.gl-phone { width: 360px; height: 640px; zoom: .888889; display: flex; flex-direction: column; overflow: hidden; background: #000; color: #F2F2F2; font-family: var(--hd-font-family-base); }
.gl-body { flex: 1; overflow: hidden; }
.gl-sb { flex: none; height: 24px; display: flex; align-items: center; gap: 6px; padding: 0 8px; color: #E6E2E6; font: 700 13px/1 var(--hd-font-family-base); }
.gl-sb .t { margin-left: auto; } .gl-sb .bat { width: 20px; height: 10px; border: 1.5px solid currentColor; border-radius: 2px; }
.gl-sug { display: flex; align-items: center; gap: 14px; padding: 8px 16px; font-size: 16px; } .gl-sug > span { flex: none; width: 40px; height: 40px; display: grid; place-items: center; color: #9A9A9A; } /* a bare glyph, inset 10 in the 40 dp icon box */
.gl-search { margin: 10px 12px 8px; height: 48px; display: flex; align-items: center; gap: 10px; padding: 0 4px 0 14px; border-radius: 24px; background: #1C1C1C; border: 1px solid #333; color: #9A9A9A; font-size: 17px; }
.gl-search b { flex: 1; color: #F2F2F2; font-weight: 400; } .gl-search .gl-x { flex: none; width: 44px; height: 44px; display: grid; place-items: center; color: #9A9A9A; }
.gl-head { padding: 18px 16px 6px; font: 700 13px/1 var(--hd-font-family-base); letter-spacing: .06em; text-transform: uppercase; color: #00A5E5; }
.gl-row { display: flex; align-items: center; gap: 14px; padding: 8px 16px; }
.gl-row > .gl-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.gl-row b { font: 400 16px/1.2 var(--hd-font-family-base); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gl-row small { font-size: 13.5px; color: #9A9A9A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gl-letter { color: #fff; font: 700 20px/1 var(--hd-font-family-base); }
.gl-row i { font-style: normal; font-size: 12px; color: #9A9A9A; }
.gl-site { flex: none; padding: 10px 20px; font-size: 14px; color: #9A9A9A; }
.gl-reader { flex: 1; overflow: hidden; padding-top: 8px; font: 19px/1.6 "Noto Serif", Georgia, serif; }
.gl-reader .gl-hero { aspect-ratio: 16 / 9; margin-bottom: 18px; }
.gl-reader .gl-pad { padding: 0 20px; }
.gl-reader .gl-kicker { margin: 12px 0 6px; font: 600 13px/1.4 var(--hd-font-family-base); letter-spacing: .06em; text-transform: uppercase; color: #00A5E5; }
.gl-reader h1 { margin: 0 0 10px; font: 700 1.55em/1.25 var(--hd-font-family-base); }
.gl-reader .gl-by { margin-bottom: 18px; font: 14px/1.4 var(--hd-font-family-base); color: #9A9A9A; }
.gl-reader p { margin: 0 0 1em; } .gl-reader a { color: #00A5E5; text-decoration: none; }
</component>`;
const phone = (inner: string) => `${CSS}<div class="gl-phone"><div class="gl-sb"><span class="bat"></span><HdIcon name="wifi" :size="14" /><span class="t">19:17</span></div>${inner}</div>`;
const PHOTO = [
  'linear-gradient(160deg, #2C4A6E, #8FA7C0 45%, #3A2A1E)', 'linear-gradient(200deg, #0E3B5C, #1D7FB8 50%, #E0EEF5)',
  'linear-gradient(170deg, #3E5B2C, #A9C27A 50%, #2B2B1A)', 'linear-gradient(150deg, #5A1E22, #C8504A 50%, #20120F)',
];
const NEWS_BAR = `<HdToolBar variant="dark" label="Glance toolbar"><template #left><HdToolIcon icon="refresh" label="Refresh" /></template><template #right><HdToolIcon icon="settings" label="Settings" /></template></HdToolBar>`;

export const News: S = {
  name: 'News: picture cards',
  parameters: { docs: { description: { story: 'The front page: a search bar on top (a field, not a button: fields stay where the eye starts), then **Top stories** and **For you**. Every story is a card with its picture edge to edge at 16:9, the headline, and where it is from. The actions (Refresh, Settings) are on the bottom toolbar; the screen has no Back because it is the app\'s first screen.' } } },
  render: () => ({ components: comps, setup: () => ({ PHOTO }), template: phone(`
    <div class="gl-search"><HdIcon name="search" :size="22" /><span>Search your phone and the web</span></div>
    <div class="gl-body">
      <div class="gl-head">Top stories</div>
      <HdStoryCard lead title="Leaders meet on the summit sidelines as talks on trade resume" source="World Service" age="27 min" :outlets="5" section="World" :image="PHOTO[0]" />
      <HdStoryCard title="Storm brings record rain to the coast; thousands without power" source="Coast Herald" age="1 h" :outlets="3" :image="PHOTO[1]" />
    </div>${NEWS_BAR}`) }),
};

export const NoPicture: S = {
  name: 'News: a story without a picture',
  parameters: { docs: { description: { story: 'A story that has no picture of its own still gets one: a tile in the **outlet\'s colour** (the same colour every time), with its name. The feed never shows a text-only card among picture cards. Stories with pictures are preferred when choosing what to show.' } } },
  render: () => ({ components: comps, setup: () => ({ PHOTO }), template: phone(`
    <div class="gl-body">
      <HdStoryCard title="Council approves the new tram line after a decade of planning" source="City Times" age="3 h" />
      <HdStoryCard title="Researchers map the deep ocean floor with autonomous gliders" source="Science Weekly" age="5 h" :outlets="2" :image="PHOTO[2]" />
    </div>${NEWS_BAR}`) }),
};

const row = (icon: string, color: string, title: string, sub = '', time = '') =>
  `<div class="gl-row"><HdSquircle :size="40" color="${color}" lighting="lit"><HdIcon name="${icon}" :size="22" lit /></HdSquircle><span class="gl-t"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span>${time ? `<i>${time}</i>` : ''}</div>`;
export const Search: S = {
  name: 'Search everything',
  parameters: { docs: { description: { story: 'Typing replaces the news with results, in sections: **Applications first**, the web last, the rest by how well they match (contacts, messages, notifications — even ones already dismissed —, settings pages, files, the news). The web section ends with the search engine\'s suggestions. Matching is by the start of a name or any of its words, or initials (“gm” → Maps by G…). Enter opens the first result. The ✕ in the field clears it; Back clears it too before leaving. The launcher shows the same results under the apps in its own search.' } } },
  render: () => ({ components: comps, template: phone(`
    <div class="gl-search"><HdIcon name="search" :size="22" /><b>ann</b><span class="gl-x" role="button" aria-label="Clear"><HdIcon name="close" :size="22" /></span></div>
    <div class="gl-body">
      <div class="gl-head">Applications</div>${row('calendar', '#E8483F', 'Anniversary planner')}
      <div class="gl-head">Contacts</div><div class="gl-row"><HdSquircle :size="40" color="#00A5E5"><b class="gl-letter">A</b></HdSquircle><span class="gl-t"><b>Anna Petrou</b><small>+30 694 123 4567</small></span></div>
      <div class="gl-head">Messages</div>${row('message', '#09A7CC', 'Anna Petrou', 'See you at seven by the lake', '2 h')}
      <div class="gl-head">Settings</div>${row('settings', '#5C5C5C', 'Announcements', 'Settings')}
      <div class="gl-head">Web</div>${row('search', '#3A3A3A', 'Search the web for “ann”')}${['ann widdecombe', 'ann taylor', 'anne frank'].map((q) => `<div class="gl-sug"><span><HdIcon name="search" :size="20" /></span>${q}</div>`).join('')}
    </div>${NEWS_BAR}`) }),
};

export const Reader: S = {
  name: 'Reader',
  parameters: { docs: { description: { story: 'A story opens in the **reader**: the article taken out of its page (Readability, as in Firefox\'s Reader View, itself Arc90\'s), in the system\'s type and colours, without the site\'s scripts, ads or pop-ups. On top only **where it is from** (the site); the picture, the outlet, the headline, the byline and date, then the text in a serif. The article ends with “Read the original on …”. Bottom toolbar: **Back on the far left**, then Open in browser (globe), Share and the menu (text size). A page that is not an article is shown as it is.' } } },
  render: () => ({ components: comps, setup: () => ({ PHOTO }), template: phone(`
    <div class="gl-site">worldservice.example</div>
    <div class="gl-reader">
      <div class="gl-hero" :style="{ background: PHOTO[0] }"></div>
      <div class="gl-pad">
        <div class="gl-kicker">World Service</div>
        <h1>Leaders meet on the summit sidelines as talks on trade resume</h1>
        <div class="gl-by">Ann Example · 19 November 2026</div>
        <p>The talks, the first in a year, opened with a short statement from both delegations and <a>a joint plan</a> for the weeks ahead.</p>
      </div>
    </div>
    <HdToolBar back variant="dark" label="Reader toolbar"><template #right><HdToolIcon icon="globe" label="Open in browser" /><HdToolIcon icon="share" label="Share" /><HdToolIcon icon="menu" label="Menu" /></template></HdToolBar>`) }),
};

export const ReaderBackRight: S = {
  name: 'Reader: Back on the right (user setting)',
  parameters: { docs: { description: { story: 'The same toolbar with **Back on the right**, the user\'s choice (Etesian settings → N9 toolbar → Back button). Only Back moves; the other items keep their order. The default, as on the N9, is the left.' } } },
  render: () => ({ components: comps, template: phone(`
    <div class="gl-site">worldservice.example</div><div class="gl-reader"><div class="gl-pad"><h1>Leaders meet on the summit sidelines</h1></div></div>
    <HdToolBar back back-side="end" variant="dark" label="Reader toolbar"><template #right><HdToolIcon icon="globe" label="Open in browser" /><HdToolIcon icon="share" label="Share" /><HdToolIcon icon="menu" label="Menu" /></template></HdToolBar>`) }),
};
