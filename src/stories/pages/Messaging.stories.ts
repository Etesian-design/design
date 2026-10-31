import N9Keyboard from '../parts/N9Keyboard.vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdEmptyState from '../../components/HdEmptyState.vue';
import HdToolBar from '../../components/HdToolBar.vue';
import HdTabBar from '../../components/HdTabBar.vue';
import HdIcon from '../../components/HdIcon.vue';
import HdSquircle from '../../components/HdSquircle.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';

/* Matched to the N9 (n9-sms-compose.png, n9-messaging-empty.png, n9-add-account.png and review photos).
 * Frame: 480 × 854 n9px at 0.75 → 360 × 640; app window top corners 7px, bottom square. Generic services only. */
const meta: Meta = {
  title: 'Examples/Messaging & Store',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '**N9** Messaging (first run, compose, conversation), Accounts (opened from Messaging) and Store, at phone size. Service icons and names are generic samples. The received bubble in *Conversation* is a **guess** (not yet seen on the device).' } } },
};
export default meta;
type S = StoryObj;
const phone = (inner: string, bg = '#fff', land = false) => `<div class="xm-phone${land ? ' xm-phone--land' : ''}" style="background:${bg}">${inner}</div>`;
const CSS = `<component is="style">
.xm-phone { width: 360px; height: 640px; display: flex; flex-direction: column; overflow: hidden; border-radius: 7px 7px 0 0; font-family: var(--hd-font-family-base); }
.xm-phone--land { width: 640px; height: 360px; }
.xm-lh { flex: none; display: flex; align-items: center; justify-content: space-between; height: 52px; padding: 0 14px; background: #09A7CC; color: #fff; font: 300 26px/1 var(--hd-font-family-light); }
.xm-list { flex: 1; overflow: hidden; background: #E6E6E8; color: #111; }
.xm-sec { display: flex; align-items: center; gap: 12px; padding: 12px 14px 4px; font: 700 13px/1 var(--hd-font-family-base); color: #8A8A8E; } .xm-sec::before { content: ''; flex: 1; height: 1px; background: #C8C8CC; }
.xm-th { position: relative; display: flex; align-items: center; gap: 10px; min-height: 76px; padding: 6px 14px; }
.xm-th.is-unread::before { content: ''; position: absolute; left: 4px; top: 10px; bottom: 10px; width: 4px; background: #09A7CC; }
.xm-th > span:first-child { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; } .xm-th b { font: 700 18px/1.15 var(--hd-font-family-base); } .xm-th i { font-style: normal; font-size: 15px; color: #333; }
.xm-meta { font-size: 12px; color: #6A6A6E; } .is-unread .xm-meta { color: #0789AA; } .xm-meta--fail { color: #D2161E; }
.xm-av { position: relative; flex: none; } .xm-av__ini { color: #fff; font: 700 18px/1 var(--hd-font-family-base); }
.xm-pres { position: absolute; right: -3px; top: -3px; }
.xm-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
/* compose */
.xm-sheet { flex: none; height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; background: linear-gradient(#EEEDEF, #E2E0E4); border-bottom: 1px solid #C8C6CA; }
.xm-cancel { width: 117px; height: 30px; border-radius: 8px; border: 1px solid #B5B4B8; background: linear-gradient(#FFFFFF, #ECECEE 50%, #DDDDE0); box-shadow: inset 0 1px 0 #fff; font: 700 15px/1 var(--hd-font-family-base); color: #111; }
.xm-sheet h2 { margin: 0; font: 300 18px/1 var(--hd-font-family-light); color: #333; }
.xm-to { flex: none; height: 46px; display: flex; align-items: center; gap: 12px; padding: 0 12px; background: #D9DFE5; font-size: 16px; color: #666; }
.xm-chip { padding: 3px 6px; background: #1C6BC8; color: #fff; font-size: 17px; }
.xm-body { flex: 1; padding: 10px 12px; font-size: 16px; color: #111; } .xm-body u { text-decoration-color: #555; }
.xm-strip { flex: none; height: 42px; display: flex; align-items: center; gap: 8px; padding: 0 10px; background: #fff; border-top: 1px solid #E2E2E4; }
.xm-strip__sp { flex: 1; } .xm-count { font: 700 16px/1 var(--hd-font-family-base); color: #444; } .xm-count small { font-weight: 400; font-size: 14px; }
.xm-send { height: 27px; padding: 0 12px; border: 0; border-radius: 8px; background: linear-gradient(#2A2A2A, #000); color: #fff; font: 700 15px/1 var(--hd-font-family-base); }
/* conversation */
.xm-conv { flex: 1; display: flex; flex-direction: column; gap: 14px; padding: 14px 10px; background: linear-gradient(#93A9BE, #E8EBEE 70%); }
.xm-bub { position: relative; max-width: 78%; padding: 8px 10px 6px; border-radius: 10px; font-size: 16px; line-height: 1.3; box-shadow: 0 1px 2px rgba(0,0,0,.2); }
.xm-bub small { display: block; margin-top: 4px; text-align: right; font-size: 11px; }
.xm-bub--out { align-self: flex-end; border-top-right-radius: 0; background: linear-gradient(#24AADD, #1A92C2); color: #fff; } .xm-bub--out small { color: rgba(255,255,255,.75); }
.xm-bub--out::after { content: ''; position: absolute; top: 0; right: -8px; border-style: solid; border-width: 0 0 8px 8px; border-color: transparent transparent transparent #24AADD; }
.xm-bub--in { align-self: flex-start; border-top-left-radius: 0; background: linear-gradient(#FFFFFF, #EEEEF0); color: #111; outline: 1px dashed #E07A12; outline-offset: 2px; } .xm-bub--in small { color: #8A8A8E; }
.xm-bub--in::after { content: ''; position: absolute; top: 0; left: -8px; border-style: solid; border-width: 0 8px 8px 0; border-color: transparent #fff transparent transparent; }
.xm-guess { align-self: flex-start; margin-top: -8px; font-size: 11px; color: #9a4c00; }
.xm-compose { flex: none; display: flex; align-items: center; gap: 10px; height: 48px; padding: 0 10px; background: #fff; border-top: 1px solid #D0D3D6; }
.xm-compose input { flex: 1; min-width: 0; border: 0; outline: 0; font: 400 16px/1 var(--hd-font-family-base); color: #111; } .xm-compose input::placeholder { color: #9A9A9E; } .xm-typed { flex: 1; font-size: 16px; color: #111; }
/* accounts */
.xm-acc-h { margin: 0 18px; padding: 16px 0 10px; border-bottom: 1px solid rgba(255,255,255,.3); font: 300 24px/1 var(--hd-font-family-light); color: #fff; }
.xm-acc { display: flex; align-items: center; gap: 14px; height: 66px; padding: 0 18px; color: #fff; }
.xm-acc span { flex: 1; display: flex; flex-direction: column; gap: 4px; } .xm-acc b { font: 700 18px/1 var(--hd-font-family-base); } .xm-acc small { font: 400 15px/1 var(--hd-font-family-base); color: #A8A8AC; }
.xm-svc { flex: none; width: 46px; height: 46px; display: block; }
/* store */
.xm-store-h { flex: none; padding: 14px 16px 10px; font: 300 26px/1 var(--hd-font-family-light); color: #111; border-bottom: 1px solid #DADADD; }
.xm-hero { flex: none; height: 150px; display: grid; place-items: center; background: radial-gradient(circle at 70% 30%, #6EC1FF, #1765C4 60%, #0B3F86); color: #fff; }
.xm-hero__t { flex: none; padding: 10px 16px; background: #1E1E20; color: #fff; font: 700 16px/1 var(--hd-font-family-base); }
.xm-feat { flex: none; padding: 7px 16px; background: linear-gradient(#EDEDEF, #DCDCDF); color: #222; font: 700 14px/1 var(--hd-font-family-base); }
.xm-app { display: flex; align-items: center; gap: 12px; height: 66px; padding: 0 16px; color: #111; border-bottom: 1px solid #EBEBED; }
.xm-app > span:not(.xm-free) { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; } .xm-app b { font: 700 16px/1.1 var(--hd-font-family-base); } .xm-app small { color: #77777B; font-size: 13px; }
.xm-stars { color: #F2A900; font-size: 12px; letter-spacing: 1px; } .xm-stars i { color: #CFCFD3; font-style: normal; }
.xm-free { font: 700 12px/1 var(--hd-font-family-base); color: #8A8A8E; letter-spacing: .04em; }
</component>`;
const keyboard = '<N9Keyboard />';
const comps = { HdToolIcon, N9Keyboard, HdEmptyState, HdToolBar, HdTabBar, HdIcon, HdSquircle };

export const MessagingList: S = {
  name: 'Messaging: conversations list (n9-messages-list.jpg)',
  parameters: { docs: { description: { story: 'Cyan brand header with the sort / filter ⇕ on the right; light grey page; date sections as a thin line with a bold grey label on the right; rows: bold name, preview, meta "time | service" (unread: cyan meta + cyan bar at the left edge; "Failed" in red); avatars on the RIGHT as squircles (photo with a presence badge, or dark squircle with white initials). Bottom bar: new message left, conversations right.' } } },
  render: () => ({ components: comps, template: CSS + phone(`<div class="xm-lh">Messages<svg width="18" height="22" viewBox="0 0 18 22" aria-label="Sort"><path d="M9 2 15 9H3zM9 20 3 13h12z" fill="#fff" /></svg></div>
    <div class="xm-list"><div class="xm-sec">Today</div>
      <div class="xm-th is-unread"><span><b>Anna Virtanen</b><i>Are we still on for lunch?</i><small class="xm-meta">16:03 | Chat service</small></span><span class="xm-av"><HdSquircle :size="48" color="linear-gradient(135deg,#7fb0d8,#333)" /><HdSquircle class="xm-pres" :size="14" color="#F2B111" /></span></div>
      <div class="xm-th"><span><b>Elena Virta</b><i>See you there?</i><small class="xm-meta xm-meta--fail">Failed</small></span><span class="xm-av"><HdSquircle :size="48" color="#1E1E21" lighting="lit"><b class="xm-av__ini">EV</b></HdSquircle></span></div>
      <div class="xm-th"><span><b>Mikko Laine</b><i>🙂</i><small class="xm-meta">11:39 | Chat service</small></span><span class="xm-av"><HdSquircle :size="48" color="linear-gradient(135deg,#a8c84a,#333)" /><HdSquircle class="xm-pres" :size="14" color="#F2B111" /></span></div>
      <div class="xm-th"><span><b>Sara Koski</b><i>Photos from Lapland</i><small class="xm-meta">10:27 | Social network</small></span><span class="xm-av"><HdSquircle :size="48" color="linear-gradient(135deg,#d38ab0,#333)" /></span></div>
      <div class="xm-th"><span><b>Jussi Hirvonen</b><i>Later, sleeping</i><small class="xm-meta">9:52</small></span><span class="xm-av"><HdSquircle :size="48" color="#1E1E21" lighting="lit"><b class="xm-av__ini">JH</b></HdSquircle></span></div>
      <div class="xm-sec">Yesterday</div></div>
    <HdToolBar label="Messages toolbar"><template #left><HdToolIcon icon="message" label="New message" /></template><template #right><HdToolIcon icon="list" label="Conversations" /></template></HdToolBar>`, '#E6E6E8') }),
};
export const MessagingEmpty: S = {
  name: 'Messaging: first run (Empty state pattern)',
  parameters: { docs: { description: { story: '**Empty state** pattern (`HdEmptyState`): no header or toolbar, striped charcoal, a huge LIGHT grey sentence, stacked dark lit buttons in the lower third.' } } },
  render: () => ({ components: comps, template: CSS + phone(`<HdEmptyState text="Send texts or chat via your favourite online services" :actions="['Send a text', 'Add chat account']" />`, '#1A1A1C') }),
};
export const MessagingCompose: S = {
  name: 'Messaging: new text message (sheet + keyboard)',
  render: () => ({ components: comps, template: CSS + phone(`<div class="xm-sheet"><button type="button" class="xm-cancel">Cancel</button><h2>New text message</h2></div>
    <div class="xm-to">To: <span class="xm-chip">Elena Virta</span></div>
    <div class="xm-body"><u>Hello</u></div>
    <div class="xm-strip"><HdSquircle :size="28" color="#F4F4F5" lighting="lit" tone="light"><HdIcon name="attach" :size="18" style="color:#222" /></HdSquircle>
      <HdSquircle :size="28" color="#F4F4F5" lighting="lit" tone="light"><svg width="20" height="20" viewBox="0 0 24 24" aria-label="Emoticon"><circle cx="12" cy="12" r="10" fill="#F5C518" stroke="#B88A00" /><circle cx="9" cy="10" r="1.4" /><circle cx="15" cy="10" r="1.4" /><path d="M8 14a5 5 0 0 0 8 0" stroke="#222" stroke-width="1.6" fill="none" /></svg></HdSquircle>
      <span class="xm-strip__sp"></span><span class="xm-count">155<small>(1)</small></span><button type="button" class="xm-send">Send</button></div>${keyboard}`) }),
};
export const MessagingConversation: S = {
  name: 'Messaging: conversation (received bubble is a guess)',
  render: () => ({ components: comps, setup: () => ({ draft: ref('') }), template: CSS + phone(`<div class="xm-conv">
      <div class="xm-bub xm-bub--out">Are we still on for lunch tomorrow?<small>26/10/26 | 5:39 PM</small></div>
      <div class="xm-bub xm-bub--in">Yes! 12:30 at the usual place.<small>26/10/26 | 5:41 PM</small></div>
      <span class="xm-guess">Received bubble: unverified guess</span>
      <div class="xm-bub xm-bub--out">Great, see you there<small>26/10/26 | 5:42 PM</small></div></div>
    <div class="xm-compose"><HdSquircle :size="22" color="#62B700" lighting="lit"><HdIcon name="message" :size="13" lit /></HdSquircle>
      <input v-model="draft" placeholder="Write your message here" aria-label="Message" /></div>`) }),
};
const strip = `<div class="xm-strip" aria-label="Keyboard strip"><HdSquircle :size="28" color="#F4F4F5" lighting="lit" tone="light"><HdIcon name="attach" :size="18" style="color:#222" /></HdSquircle>
      <HdSquircle :size="28" color="#F4F4F5" lighting="lit" tone="light"><svg width="20" height="20" viewBox="0 0 24 24" aria-label="Emoticon"><circle cx="12" cy="12" r="10" fill="#F5C518" stroke="#B88A00" /><circle cx="9" cy="10" r="1.4" /><circle cx="15" cy="10" r="1.4" /><path d="M8 14a5 5 0 0 0 8 0" stroke="#222" stroke-width="1.6" fill="none" /></svg></HdSquircle>
      <span class="xm-strip__sp"></span><span class="xm-count">151<small>(1)</small></span><button type="button" class="xm-send">Send</button></div>`;
export const MessagingConversationTyping: S = {
  name: 'Messaging: conversation, typing (white strip on the keyboard)',
  parameters: { docs: { description: { story: 'On the N9 the composer stays a plain field (service icon + text). Send, the SMS counter "155(1)" and the attach / emoticon squircles live in the white strip that is part of the keyboard; with the keyboard closed there is no Send and no counter.' } } },
  render: () => ({ components: comps, template: CSS + phone(`<div class="xm-conv">
      <div class="xm-bub xm-bub--out">Great, see you there<small>26/10/26 | 5:42 PM</small></div></div>
    <div class="xm-compose"><HdSquircle :size="22" color="#62B700" lighting="lit"><HdIcon name="message" :size="13" lit /></HdSquircle>
      <span class="xm-typed"><u>Lunch</u></span></div>${strip}${keyboard}`) }),
};
const hw = (land: boolean, inner: string): S => ({ name: '', parameters: { docs: { description: { story: 'Pro1-X hardware keyboard out: no on-screen keys; the white keyboard strip (attach, emoticon, counter, Send) sits on its own at the bottom.' + (land ? ' Landscape 640 × 360: the Pro1-X is landscape whenever the keyboard is out.' : '') } } }, render: () => ({ components: comps, template: CSS + phone(inner, '#fff', land) }) });
export const MessagingConversationHw: S = { ...hw(false, `<div class="xm-conv">
      <div class="xm-bub xm-bub--out">Great, see you there<small>26/10/26 | 5:42 PM</small></div></div>
    <div class="xm-compose"><HdSquircle :size="22" color="#62B700" lighting="lit"><HdIcon name="message" :size="13" lit /></HdSquircle>
      <span class="xm-typed"><u>Lunch</u></span></div>${strip}`), name: 'Messaging: conversation, hardware keyboard' };
export const MessagingConversationHwLandscape: S = { ...hw(true, `<div class="xm-conv">
      <div class="xm-bub xm-bub--out">Great, see you there<small>26/10/26 | 5:42 PM</small></div></div>
    <div class="xm-compose"><HdSquircle :size="22" color="#62B700" lighting="lit"><HdIcon name="message" :size="13" lit /></HdSquircle>
      <span class="xm-typed"><u>Lunch</u></span></div>${strip}`), name: 'Messaging: conversation, hardware keyboard (landscape)' };
export const MessagingComposeHw: S = { ...hw(false, `<div class="xm-sheet"><button type="button" class="xm-cancel">Cancel</button><h2>New text message</h2></div>
    <div class="xm-to">To: <span class="xm-chip">Elena Virta</span></div>
    <div class="xm-body"><u>Hello</u></div>${strip}`), name: 'Messaging: new text message, hardware keyboard' };
export const MessagingComposeHwLandscape: S = { ...hw(true, `<div class="xm-sheet"><button type="button" class="xm-cancel">Cancel</button><h2>New text message</h2></div>
    <div class="xm-to">To: <span class="xm-chip">Elena Virta</span></div>
    <div class="xm-body"><u>Hello</u></div>${strip}`), name: 'Messaging: new text message, hardware keyboard (landscape)' };
const svcs: [string, string, string][] = [
  ['Chat service', 'Calls, chat and more', '<circle cx="23" cy="23" r="21" fill="#19B2E8"/><path d="M14 16h18v11H21l-6 5v-5h-1z" fill="#fff"/>'],
  ['Mail service', 'Mail, chat and calls', '<rect x="2" y="2" width="42" height="42" rx="12" fill="#3B6FD8"/><path d="M11 15h24v17H11zM11 15l12 9 12-9" fill="none" stroke="#fff" stroke-width="2.4"/>'],
  ['Social network', 'Updates and more', '<rect x="3" y="3" width="40" height="40" rx="6" fill="#5C6FA8"/><circle cx="23" cy="18" r="6" fill="#fff"/><path d="M12 36a11 11 0 0 1 22 0z" fill="#fff"/>'],
  ['SIP', 'Calls and chat', '<rect x="2" y="2" width="42" height="42" rx="12" fill="#F2F2F2"/><path d="M10 13h26v16H18l-6 5v-5h-2z" fill="#1F5FC0"/><text x="23" y="25" font-size="10" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">SIP</text>'],
];
export const AddAccount: S = {
  name: 'Accounts: add account (page owned by another app)',
  parameters: { docs: { description: { story: 'Service icons are shown **as is** (their own shape, not re-masked). The toolbar has no Back: a page owned by another app shows that app\'s small squircle icon bottom-left (`HdToolBar owner`). **Unconfirmed**: what tapping it does on the device.' } } },
  render: () => ({ components: comps, setup: () => ({ svcs }), template: CSS + phone(`<div class="xm-acc-h">Add account</div>
    <div style="flex:1;padding-top:4px"><div v-for="s in svcs" :key="s[0]" class="xm-acc" role="link"><svg class="xm-svc" viewBox="0 0 46 46" aria-hidden="true" v-html="s[2]" /><span><b>{{ s[0] }}</b><small>{{ s[1] }}</small></span><HdIcon name="chevron-right" :size="24" /></div></div>
    <HdToolBar variant="dark" :owner="{ icon: 'wrench', label: 'Accounts' }" label="Accounts toolbar" />`, '#000') }),
};
const storeApps: [string, string, number, string][] = [
  ['Snow Sketch', 'Entertainment', 4, '<circle cx="23" cy="23" r="21" fill="#E8483F"/><path d="M15 30l14-14 3 3-14 14h-3z" fill="#fff"/>'],
  ['Tram Times', 'Travel', 5, '<rect x="3" y="3" width="40" height="40" rx="9" fill="#2A9D5B"/><rect x="14" y="11" width="18" height="20" rx="3" fill="#fff"/><path d="M17 35l3-4M29 35l-3-4" stroke="#fff" stroke-width="2"/>'],
  ['Puzzle Fjord', 'Games', 4, '<path d="M23 2l6 14 15 1-11 10 4 15-14-8-14 8 4-15L2 17l15-1z" fill="#F2A900"/>'],
  ['Pocket Notes', 'Productivity', 3, '<rect x="6" y="2" width="34" height="42" rx="4" fill="#F7E27A"/><path d="M12 14h22M12 21h22M12 28h14" stroke="#9A7B00" stroke-width="2"/>'],
];
export const StoreHome: S = {
  name: 'Store: home (hero, Featured, tabs)',
  parameters: { docs: { description: { story: 'App icons are shown **as is** (each in its own shape). Toolbar: lit squircle Back, then tabs; the selected tab is a lighter full-height cell.' } } },
  render: () => ({ components: comps, setup: () => ({ storeApps, tab: ref('home'), tabs: [{ id: 'home', label: 'Home', icon: 'home' }, { id: 'list', label: 'Categories', icon: 'list' }, { id: 'search', label: 'Search', icon: 'search' }, { id: 'account', label: 'Account', icon: 'person' }] }),
    template: CSS + phone(`<div class="xm-store-h">Store</div>
    <div class="xm-hero" role="img" aria-label="Store banner"><HdIcon name="bag" :size="72" /></div><div class="xm-hero__t">Welcome to the Store</div>
    <div class="xm-feat">Featured</div>
    <div style="flex:1;overflow:hidden"><div v-for="a in storeApps" :key="a[0]" class="xm-app" role="link"><svg class="xm-svc" viewBox="0 0 46 46" aria-hidden="true" v-html="a[3]" />
      <span><b>{{ a[0] }}</b><small>{{ a[1] }}</small><span class="xm-stars" :aria-label="a[2] + ' of 5 stars'">{{ '★'.repeat(a[2]) }}<i>{{ '★'.repeat(5 - a[2]) }}</i></span></span><span class="xm-free">FREE</span></div></div>
    <HdToolBar back label="Store toolbar"><HdTabBar v-model="tab" :tabs="tabs" label="Store sections" /></HdToolBar>`) }),
};
