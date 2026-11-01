<script setup lang="ts">
/** Mail mock. Container query: >= 860px wide shows list + detail side by side; narrower falls back to one pane (list, tap opens detail). */
import { ref, computed } from 'vue';
import XAppShell from '../parts/XAppShell.vue';
import HdListItem from '../../components/HdListItem.vue';
import HdAvatar from '../../components/HdAvatar.vue';
import HdButton from '../../components/HdButton.vue';
import HdPageHeader from '../../components/HdPageHeader.vue';
import HdSearchField from '../../components/HdSearchField.vue';
import { MAILS } from '../parts/data';
import { shellProps, type XAppProps } from '../parts/types';
const props = withDefaults(defineProps<XAppProps & { selected?: number; view?: 'list' | 'detail'; twoPane?: 'auto' | 'never' }>(), { selected: 1, view: 'list', twoPane: 'auto', hints: true });
const sel = ref(props.selected);
const single = ref(props.view);
const mail = computed(() => MAILS.find((m) => m.id === sel.value) ?? MAILS[0]!);
const actions = [{ icon: 'add', label: 'New mail', keys: 'Ctrl+N' }, { icon: 'search', label: 'Search', keys: 'Ctrl+F' }, { icon: 'refresh', label: 'Refresh', keys: 'F5' }];
function open(id: number) { sel.value = id; single.value = 'detail'; }
const q = ref('');
</script>
<template>
  <XAppShell title="Inbox" v-bind="shellProps(props)" :actions="actions" :back="single === 'detail'" @back="single = 'list'">
    <div class="x-mail" :class="{ 'x-mail--never': twoPane === 'never', [`x-mail--${single}`]: true }" style="--hd-accent: #0067BC">
      <section class="x-mail__list" aria-label="Messages">
        <HdPageHeader title="Inbox" subtitle="2 unread · anna@example.com" colored accent="#0067BC" />
        <div v-if="density === 'pointer'" class="x-mail__search"><HdSearchField v-model="q" placeholder="Search mail" /></div>
        <div class="x-mail__rows">
          <HdListItem v-for="m in MAILS" :key="m.id" :title="m.from" :subtitle="m.subject" clickable :selected="m.id === sel" :class="{ 'is-unread': m.unread }" @click="open(m.id)">
            <template #leading><HdAvatar :name="m.from" :size="density === 'pointer' ? 22 : 43" /></template>
            <template #trailing><span class="x-mail__time">{{ m.time }}</span></template>
          </HdListItem>
        </div>
      </section>
      <article class="x-mail__detail" aria-label="Message">
        <h2 class="x-mail__subject">{{ mail.subject }}</h2>
        <div class="x-mail__from"><HdAvatar :name="mail.from" :size="43" /><div><b>{{ mail.from }}</b><br /><span>to me · {{ mail.time }}</span></div></div>
        <div class="x-mail__body">
          <p>{{ mail.preview }}</p>
          <p>I had a look at the tablet mockups. The two-pane inbox feels right in landscape, and I like that portrait simply becomes the phone layout again: one list, tap to read, Back to return.</p>
          <p>Let's talk it through over lunch.</p>
          <p>Anna</p>
        </div>
        <div class="x-mail__actions"><HdButton variant="accent">Reply</HdButton><HdButton>Forward</HdButton><HdButton icon="delete" aria-label="Delete" /></div>
      </article>
    </div>
  </XAppShell>
</template>
<style>
.x-mail { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr; background: var(--hd-c-bg); }
.x-mail__list { min-width: 0; min-height: 0; display: flex; flex-direction: column; border-right: 1px solid var(--hd-c-divider); }
.x-mail__rows { flex: 1; overflow: hidden; }
.x-mail__search { padding: 8px 11px; }
.x-mail__time { font-size: var(--hd-font-size-xsmall); color: var(--hd-c-fg-secondary); }
.x-mail .is-unread .hd-list-item__title { font-weight: 700; font-family: var(--hd-font-family-base); }
.x-mail__detail { display: none; min-width: 0; overflow: hidden; padding: 20px 28px; }
.x-mail--detail .x-mail__list { display: none; }
.x-mail--detail .x-mail__detail { display: block; }
@container (min-width: 860px) {
  .x-mail:not(.x-mail--never) { grid-template-columns: minmax(300px, 38%) 1fr; }
  .x-mail:not(.x-mail--never) .x-mail__list { display: flex; }
  .x-mail:not(.x-mail--never) .x-mail__detail { display: block; }
}
.x-mail__subject { margin: 0 0 16px; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1.2 var(--hd-font-family-light); }
.x-mail__from { display: flex; gap: 11px; align-items: center; font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); }
.x-mail__from b { color: var(--hd-c-fg); font-size: var(--hd-font-size-default); }
.x-mail__body { max-width: 68ch; font-size: var(--hd-font-size-default); line-height: 1.5; }
.x-mail__actions { display: flex; gap: 8px; margin-top: 16px; }
</style>
