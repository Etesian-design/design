import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdIcon from '../../components/HdIcon.vue';

/* The N9's system apps at 480 x 854 n9px, shown at css = n9px x 2/3. Pictures are gradients; names are samples. */
const meta: Meta = {
  title: 'Examples/System apps (N9)',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'The system apps as the N9 draws them at 480 × 854, shown at 2/3 scale. **Dark apps** (Phone\'s dial pad header, Calculator, Camera, Gallery, Music) sit on black; **content apps** (Contacts, Calendar, Clock, Documents) are light grey (#DEE2E6) under a coloured 72px title bar or none. Every action is on the bottom toolbar (72px); a few apps (Phone, Calendar, Gallery) use it as **tabs**, the current one a lighter cell.' } } },
};
// A phone screen: centred, as big as itself.
meta.parameters = { ...meta.parameters, layout: 'centered' };
export default meta;
type S = StoryObj;
const comps = { HdIcon };

/* All sizes in N9 px; .ap zooms the screen to 2/3. */
const CSS = `<component is="style">
.ap { width: 480px; height: 854px; zoom: .666667; display: flex; flex-direction: column; overflow: hidden; position: relative; font-family: var(--hd-font-family-base); }
.ap--light { background: #DEE2E6; color: #222; } .ap--dark { background: #000; color: #fff; }
.ap-body { flex: 1; min-height: 0; overflow: hidden; position: relative; }
/* status bar: 36px, black */
.n9-sb { flex: none; height: 36px; display: flex; align-items: center; gap: 8px; padding: 0 6px; background: #000; color: #E6E2E6; font: 700 20px/1 var(--hd-font-family-base); }
.n9-sb .bat { width: 30px; height: 16px; border: 2px solid currentColor; border-radius: 3px; position: relative; } .n9-sb .bat::before { content: ''; position: absolute; left: 2px; top: 2px; bottom: 2px; width: 12px; background: currentColor; }
.n9-sb .t { margin-left: auto; }
/* title bar: 72px (70 colour, a darker line, a white highlight) */
.n9-title { flex: none; height: 72px; display: flex; align-items: center; padding: 0 18px 2px; font: 300 32px/1 var(--hd-font-family-light); color: #fff; border-radius: 10px 10px 0 0;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.12), inset 0 -1px 0 #fff; }
/* sheet header: grey, the two pills */
.n9-sheet { flex: none; height: 72px; display: flex; justify-content: space-between; align-items: center; padding: 0 17px 2px; background: #D3D1D3; border-radius: 10px 10px 0 0; box-shadow: inset 0 -2px 0 #BDBEBD, inset 0 -1px 0 #D5D6D5; }
.n9-pill { width: 160px; height: 41px; border-radius: 21px; display: grid; place-items: center; font: 700 22px/1 var(--hd-font-family-base); }
.n9-pill--grey { background: linear-gradient(#FFFFFF, #E2E2E4); color: #222; box-shadow: inset 0 0 0 1px #B5B4B8; }
.n9-pill--blue { background: linear-gradient(#8DC0EE, #6CA6DB); color: #fff; } .n9-pill--orange { background: linear-gradient(#FBA43A, #EE7A0A); color: #fff; }
/* toolbar: 72px, a shadow over it, a white highlight, light grey down to mid grey; 32px icons */
.n9-tb svg { stroke-width: 2.6; } .n9-tb { flex: none; height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 1px 28px 0; position: relative; color: #414041;
  background: linear-gradient(#FFFFFF 0 1px, #CDCED5 1px, #BDBEBD 50%, #A4A5A4); }
.n9-tb::before { content: ''; position: absolute; left: 0; right: 0; top: -6px; height: 6px; background: linear-gradient(transparent, rgba(0,0,0,.35)); }
.n9-tb--dark { color: #fff; background: linear-gradient(#5A5A5A 0 1px, #3A3A3A 1px, #1C1C1C); }
.n9-tb--tabs { padding: 1px 0 0; } .n9-tb--tabs > span { flex: 1; height: 100%; display: grid; place-items: center; }
.n9-tb--tabs > span.on { background: linear-gradient(#FFFFFF 0 1px, #E2DEE2 1px, #D5D2D5); box-shadow: inset 1px 0 #D5D6DE, inset -1px 0 #D5D6DE; }
.n9-tb--dark.n9-tb--tabs > span.on { background: linear-gradient(#6A6A6A 0 1px, #4A4A4A 1px, #333); box-shadow: none; }
/* search field: 44px, white with a grey rim and an inner shadow */
.n9-field { margin: 16px 16px; height: 44px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px 0 16px; border-radius: 22px; background: #fff;
  box-shadow: inset 0 0 0 1px #A4A6A8, inset 0 2px 3px rgba(0,0,0,.25); color: #9A9A9A; font: 300 24px/1 var(--hd-font-family-light); }
/* group header: a line, the letter at the right */
.n9-group { display: flex; align-items: center; gap: 22px; height: 24px; margin: 16px 16px 10px; font: 700 17px/1 var(--hd-font-family-base); color: #8C8C8C; }
.n9-group::before { content: ''; flex: 1; height: 1px; background: #B8BABD; box-shadow: 0 1px #fff; }
.ap--dark .n9-group::before { background: #3A3A3A; box-shadow: none; }
.n9-row { display: flex; align-items: center; gap: 18px; height: 80px; padding: 0 16px; }
.n9-row > .t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.n9-row b { font: 700 28px/1.1 var(--hd-font-family-base); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.n9-row small { font: 400 22px/1.1 var(--hd-font-family-base); color: #6E6E6E; } .ap--dark .n9-row small { color: #A0A0A0; }
.n9-av { flex: none; width: 62px; height: 62px; display: grid; place-items: center; color: #fff; font: 700 30px/1 var(--hd-font-family-base); background: linear-gradient(#3A3A3A, #0E0E0E); }
.n9-chev { flex: none; font: 700 30px/1 var(--hd-font-family-base); color: #222; }
/* phone */
.ph-head { flex: none; height: 216px; padding: 0 16px; background: linear-gradient(#202020, #201C1C 60%, #181818); color: #fff; border-radius: 10px 10px 0 0; box-shadow: inset 0 -1px #5A5D5A; }
.ph-sel { display: flex; justify-content: space-between; align-items: center; height: 64px; font: 300 36px/1 var(--hd-font-family-light); border-bottom: 2px solid #7B757B; }
.ph-sel span { font-size: 26px; padding-right: 18px; }
.ph-num { display: flex; justify-content: flex-end; align-items: center; gap: 24px; height: 150px; padding-right: 2px; font: 300 84px/1 var(--hd-font-family-light); }
.ph-bs { width: 36px; height: 23px; background: #9C9A9C; color: #202020; display: grid; place-items: center; clip-path: polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%); font: 700 16px/1 sans-serif; padding-left: 8px; }
.ph-pad { flex: none; display: grid; grid-template-columns: repeat(3, 150px); justify-content: center; grid-auto-rows: 102px; padding-top: 26px; background: #D5D2D5; color: #202820; }
.ph-pad > span { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 13px; font: 700 64px/.75 var(--hd-font-family-base); }
.ph-pad small { margin-top: 12px; font: 400 20px/1 var(--hd-font-family-base); color: #4A4A4A; }
.ph-act { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 58px 8px 58px; background: #D5D2D5; }
.ph-call { width: 212px; height: 61px; border-radius: 30px; background: linear-gradient(#73BA41, #62AE29 50%, #52A120); display: grid; place-items: center; color: #fff; box-shadow: 0 1px 1px rgba(0,0,0,.35), inset 0 1px rgba(255,255,255,.35); }
.ph-add { width: 62px; height: 62px; background: linear-gradient(#9C9DA4, #8B9194 50%, #838184); display: grid; place-items: center; color: #EEF2F6; }
/* calculator */
.ca-out { flex: none; display: flex; justify-content: flex-end; align-items: center; gap: 29px; height: 189px; padding: 0 61px 8px 0; font: 300 126px/1 var(--hd-font-family-light); color: #EE9508; }
.ca-bs { width: 46px; height: 28px; background: #7B797B; color: #000; display: grid; place-items: center; clip-path: polygon(28% 0, 100% 0, 100% 100%, 28% 100%, 0 50%); font: 700 18px/1 sans-serif; padding-left: 10px; }
.ca-line { flex: none; height: 2px; margin: 0 70px; background: #292829; }
.ca-keys { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 94px 94px 110px 110px 110px 110px; row-gap: 0; padding: 0 28px; font: 300 75px/1 var(--hd-font-family-light); color: #fff; }
.ca-keys > span { display: grid; place-items: center; } .ca-keys .op { color: #CDCACD; } .ca-keys .eq { color: #EE9508; } .ca-keys .gap { grid-column: 1 / -1; height: 29px; }
/* clock */
.cl-top { flex: none; height: 509px; background: #EEF2EE; position: relative; display: grid; place-items: center; padding-top: 22px; }
.cl-tz { position: absolute; top: 34px; left: 0; right: 0; text-align: center; font: 400 17px/1 var(--hd-font-family-base); color: #6E6E6E; }
.cl-dial { width: 380px; height: 380px; border-radius: 50%; position: relative; background: radial-gradient(circle at 50% 30%, #F4F4F4, #D2D2D4 75%); box-shadow: inset 0 0 0 3px #C9C9CB, inset 0 0 0 11px #E9E9EA, inset 0 0 0 13px #C2C2C4, 0 3px 8px rgba(0,0,0,.25); }
.cl-dial i { position: absolute; left: 50%; top: 50%; transform-origin: 0 50%; border-radius: 6px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,.35); }
.cl-dial .h { width: 120px; height: 14px; margin-top: -7px; transform: rotate(-112deg); } .cl-dial .m { width: 150px; height: 12px; margin-top: -6px; transform: rotate(-103deg); }
.cl-dial .s { width: 160px; height: 2px; margin-top: -1px; background: #F05A1E; box-shadow: none; transform: rotate(52deg); }
.cl-date { position: absolute; left: 32px; top: 152px; font: 400 17px/1 var(--hd-font-family-base); color: #6E6E6E; } .cl-date b { display: block; margin-top: 6px; font: 300 46px/1 var(--hd-font-family-light); color: #222; }
.cl-low { flex: 1; background: linear-gradient(#D5DADE, #E6E6E6 5px); }
.cl-head { display: flex; justify-content: space-between; align-items: center; height: 72px; padding: 0 16px; font: 300 36px/1 var(--hd-font-family-light); color: #222; }
.cl-plus { width: 42px; height: 42px; display: grid; place-items: center; background: linear-gradient(#FFFFFF, #E6E6E8); box-shadow: 0 1px 2px rgba(0,0,0,.35); color: #222; }
.cl-row { display: flex; align-items: center; gap: 22px; height: 110px; padding: 0 16px; border-top: 1px solid #D5CED5; box-shadow: inset 0 1px #fff; }
.cl-row:first-of-type { border-top: 0; box-shadow: none; }
.cl-row .t { flex: 1; display: flex; flex-direction: column; gap: 6px; } .cl-row b { font: 700 28px/1 var(--hd-font-family-base); } .cl-row small { font: 400 20px/1 var(--hd-font-family-base); color: #6E6E6E; }
.n9-sw-light { flex: none; width: 62px; height: 38px; position: relative; background: linear-gradient(#BDBDC0, #DCDCDE); box-shadow: inset 0 0 0 1px #9C9CA0, inset 0 2px 4px rgba(0,0,0,.35); border-radius: 19px; }
.n9-sw-light::after { content: ''; position: absolute; left: 4px; top: 4px; width: 30px; height: 30px; border-radius: 9px; background: linear-gradient(#FFFFFF, #ECECEE); box-shadow: 0 1px 2px rgba(0,0,0,.45); }
/* alarm editor */
.al-field { margin: 10px 16px 0; height: 44px; display: flex; align-items: center; padding: 0 14px; border-radius: 22px; background: #fff; box-shadow: inset 0 0 0 1px #A4A6A8, inset 0 2px 3px rgba(0,0,0,.2); color: #9A9A9A; font: 300 22px/1 var(--hd-font-family-light); }
.al-time { margin-top: 24px; text-align: center; font: 300 64px/1 var(--hd-font-family-light); color: #222; }
.al-wheel { position: relative; margin: 38px auto 0; width: 398px; height: 398px; border-radius: 50%; background: radial-gradient(circle at 50% 40%, #FAFAFA, #D6D6D8 70%, #C2C2C4); box-shadow: inset 0 0 0 1px #BDBDBF, 0 2px 4px rgba(0,0,0,.2); display: grid; place-items: center; }
.al-wheel::before { content: ''; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle at 50% 35%, #2E2E2E, #111); box-shadow: 0 0 0 10px rgba(0,0,0,.08); }
.al-knob { position: absolute; width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center; font: 300 26px/1 var(--hd-font-family-light); }
.al-more { position: absolute; left: 0; right: 0; bottom: 80px; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; font: 700 26px/1 var(--hd-font-family-base); color: #222; }
/* contact editor */
.ce-img { display: flex; align-items: center; gap: 22px; height: 98px; margin: 13px 16px 0; padding-bottom: 6px; border-bottom: 2px solid #C8C8CC; font: 300 24px/1 var(--hd-font-family-light); color: #555; }
.ce-ph { flex: none; width: 78px; height: 78px; display: grid; place-items: center; background: linear-gradient(#D6D6D8, #BFC0C2); color: #222; }
.ce-f { display: flex; gap: 10px; align-items: baseline; height: 60px; padding: 15px 18px 0; font: 400 28px/1 var(--hd-font-family-base); color: #333; }
.ce-f u { text-underline-offset: 4px; } .ce-f i { font-style: normal; color: #4A90D9; } .ce-f.focus { color: #3F8FD6; } .ce-f.focus i { color: #A8A8A8; }
.ce-f.focus::before { content: ''; position: absolute; left: 0; margin-top: 4px; border: 8px solid transparent; border-left: 10px solid #111; }
.ce-more { display: grid; place-items: center; height: 40px; margin: 28px 16px 0; border-bottom: 2px solid #C8C8CC; }
.ce-more span { width: 36px; height: 22px; background: linear-gradient(#FFFFFF, #E0E0E2); box-shadow: 0 1px 2px rgba(0,0,0,.35); display: grid; place-items: center; font-size: 14px; }
/* calendar */
.cg-bar { flex: none; height: 41px; display: flex; align-items: center; justify-content: flex-end; padding: 0 17px; font: 700 24px/1 var(--hd-font-family-base); }
.cg-bar.today { background: #EE5500; color: #fff; } .cg-bar.next { background: #D5D6D5; color: #222; border-top: 1px solid #C5C6C5; }
.cg-none { flex: none; height: 101px; padding: 22px 17px 0; font: 300 26px/1 var(--hd-font-family-light); color: #8C8C8C; }
.cg-ev { position: relative; padding: 14px 17px 18px; } .cg-ev b { display: block; font: 700 26px/1.2 var(--hd-font-family-base); }
.cg-ev span { display: block; margin-top: 6px; font: 400 22px/1.2 var(--hd-font-family-base); color: #333; } .cg-ev span + span { color: #6E6E6E; }
.cg-ev i { position: absolute; right: 14px; top: 18px; width: 5px; height: 26px; background: #F2C200; }
.cm { flex: none; height: 454px; background: #EEEEEE; box-shadow: 0 3px 6px rgba(0,0,0,.25); position: relative; z-index: 1; }
.cm-h { display: flex; justify-content: space-between; align-items: center; height: 70px; padding: 4px 26px 0; font: 300 36px/1 var(--hd-font-family-light); color: #222; }
.cm-h i { width: 0; height: 0; border: 11px solid transparent; } .cm-h i.l { border-right: 16px solid #EE5500; border-left: 0; } .cm-h i.r { border-left: 16px solid #EE5500; border-right: 0; }
.cm-g { display: grid; grid-template-columns: repeat(7, 66px); grid-template-rows: 30px; grid-auto-rows: 59px; padding: 0 0 0 4px; text-align: center; }
.cm-g .d { height: 28px; font: 700 17px/1 var(--hd-font-family-base); color: #555; } .cm-g .we { color: #EE5500; }
.cm-g span { display: grid; place-items: center; font: 400 26px/1 var(--hd-font-family-base); color: #333; } .cm-g .o { color: #A0A0A0; }
.cm-g .t > em { width: 44px; height: 44px; display: grid; place-items: center; font-style: normal; color: #fff; background: linear-gradient(#F68A3C, #E25A0C); }
.cm-none { padding-top: 150px; text-align: center; font: 300 26px/1 var(--hd-font-family-light); color: #8C8C8C; }
.cw-h { flex: none; height: 28px; display: grid; place-items: center; background: #313031; color: #E6E6E6; font: 700 17px/1 var(--hd-font-family-base); }
.cw-day { flex: none; display: flex; height: 44px; box-shadow: 0 -2px #EE5500; margin-top: 2px; }
.cw-day::before { content: ''; width: 70px; background: linear-gradient(#C5C2C5, #F6F6F6); }
.cw-day span { flex: 1; display: flex; align-items: center; padding: 0 10px; background: #EE5500; color: #fff; font: 300 26px/1 var(--hd-font-family-light); }
.cw-rows { border-top: 1px solid #838183; }
.cw-row { display: flex; height: 70px; } .cw-row > span { width: 70px; padding: 10px 0 0 10px; font: 400 18px/1 var(--hd-font-family-base); color: #555; background: #EEF2EE; border-bottom: 1px solid #D8DCD8; }
.cw-row > i { flex: 1; background: #F6F6F6; border-left: 1px solid #D0D0D0; border-bottom: 1px solid #E2E2E2; }
.cw-row.now > * { background: #EAE0D2; } .cw-row.now > span { box-shadow: inset 4px 0 #EE5500; }
.cw-row > i.ev { margin: 2px 6px 2px 2px; background: #2A7AD6; color: #fff; font: 700 20px/1 var(--hd-font-family-base); font-style: normal; padding: 8px; }
/* gallery, music */
.ga-grid { display: grid; grid-template-columns: repeat(3, 160px); grid-auto-rows: 160px; }
.ga-grid i { display: block; position: relative; } .ga-grid i small { position: absolute; right: 8px; bottom: 6px; font: 400 17px/1 var(--hd-font-family-base); font-style: normal; color: #fff; text-shadow: 0 1px 2px #000; }
.ga-tb { position: absolute; left: 0; right: 0; bottom: 0; }
.ga-info { position: absolute; left: 0; right: 0; top: 36px; padding: 14px 16px 16px; background: rgba(30,30,30,.82); }
.ga-info b { font: 700 26px/1.2 var(--hd-font-family-base); } .ga-info div { display: flex; justify-content: space-between; margin-top: 8px; font: 400 20px/1 var(--hd-font-family-base); color: #CCC; }
.mu-rows { position: absolute; left: 0; right: 0; top: 488px; }
.mu-row { display: flex; justify-content: space-between; align-items: center; height: 72px; padding: 0 16px; font: 700 26px/1 var(--hd-font-family-base); color: #fff; }
.mu-now { padding: 16px; } .mu-now b { display: flex; justify-content: space-between; font: 700 24px/1 var(--hd-font-family-base); } .mu-now p { margin: 14px 0 0; font: 400 20px/1.35 var(--hd-font-family-base); color: #CCC; }
.mu-ctl { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px 12px; }
.mu-prog { margin: 8px 16px 0; height: 6px; border-radius: 3px; background: #333; position: relative; } .mu-prog::before { content: ''; position: absolute; left: 0; top: 0; height: 6px; width: 4%; background: #C4008F; border-radius: 3px; }
.mu-t { display: flex; justify-content: space-between; padding: 8px 16px; font: 400 17px/1 var(--hd-font-family-base); color: #AAA; }
/* browser */
.br-top { flex: none; height: 72px; padding-top: 13px; background: #EEEAEE; border-bottom: 1px solid #D5D6D5; }
.br-top .n9-field { margin: 0 15px; height: 48px; border-radius: 24px; }
.br-label { display: flex; align-items: center; gap: 16px; height: 41px; padding: 0 17px; font: 700 17px/1 var(--hd-font-family-base); color: #222; } .br-label::before { content: ''; flex: 1; height: 1px; background: #C8C8C8; }
.br-site { height: 87px; display: flex; align-items: center; padding: 0 32px; border-bottom: 1px solid #EEEEEE; background: #fff; font: 300 54px/1 var(--hd-font-family-light); color: #222; white-space: nowrap; overflow: hidden; }
.br-site b { font-weight: 700; font-family: var(--hd-font-family-base); color: #1E3C8C; }
.br-hist { display: flex; align-items: center; gap: 16px; height: 72px; padding: 0 17px; background: #fff; } .br-hist .t { min-width: 0; } .br-hist b { display: block; font: 700 24px/1.1 var(--hd-font-family-base); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.br-hist small { display: block; font: 400 18px/1.2 var(--hd-font-family-base); color: #6E6E6E; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* documents */
.dc-ic { flex: none; width: 62px; height: 62px; display: grid; place-items: center; background: linear-gradient(#EEEEF0, #D0D0D3); font: 700 13px/1 var(--hd-font-family-base); color: #222; }
.dc-size { flex: none; align-self: flex-end; padding-bottom: 16px; font: 400 20px/1 var(--hd-font-family-base); color: #6E6E6E; }
</component>`;

const SB = `<div class="n9-sb"><span class="bat"></span><HdIcon name="wifi" :size="20" /><span class="t">18:21</span></div>`;
const app = (inner: string, cls = 'ap--light', statusBar = true) => `${CSS}<div class="ap hd-squircle-free ${cls}">${statusBar ? SB : ''}${inner}</div>`;
const PIC = ['#8A5A3A,#C9A57E', '#2F5C83,#9CC3DF', '#D6B07A,#7D4F2C', '#4E6B3C,#A9C27A', '#C9C1B8,#7C6F66', '#B03A48,#E8A0A6', '#3C4A63,#9EB0CC', '#DCCB9E,#8B7A4F', '#2B2B2B,#8D8D8D'];
const pic = (i: number) => `linear-gradient(135deg, ${PIC[i % PIC.length]})`;
/** A squircle (n = 2.8), the N9's shape for avatars, buttons and tiles. */
const SQ = 'hd-squircle';
const toolbar = (left: string, right: string, dark = false) => `<div class="n9-tb${dark ? ' n9-tb--dark' : ''}"><span>${left}</span><span>${right}</span></div>`;
const tabs = (icons: string[], on: number, dark = false) => `<div class="n9-tb n9-tb--tabs${dark ? ' n9-tb--dark' : ''}">${icons.map((ic, i) => `<span class="${i === on ? 'on' : ''}"><HdIcon name="${ic}" :size="40" /></span>`).join('')}</div>`;
const ico = (name: string, size = 32) => `<HdIcon name="${name}" :size="${size}" />`;

export const Phone: S = {
  name: 'Phone: dial pad',
  parameters: { docs: { description: { story: 'A **dark header** 216px with rounded top corners, the call type ("Mobile call" ⇕, an N9 selection dialog of the call services, light 36px over a 2px rule) and the number in large light type with ⌫. Then the pad on #D5D2D5: **no key boxes**, bold 64px digits with 20px letters under them, 3 columns of 150px, rows 102px apart. A wide green **call pill** (212 × 61) and a 62px contact-add squircle. The toolbar is three **tabs**: Call log, Dial pad (the lighter cell), Contacts.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ph-head"><div class="ph-sel">Mobile call<span>▲<br>▼</span></div><div class="ph-num"><span><span style="color:#9A9A9A">33</span>9</span><span class="ph-bs">✕</span></div></div>
    <div class="ph-pad">${[['1', 'oo'], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', '+'], ['0', ''], ['#', '']].map(([d, l]) => `<span>${d}<small>${l || '&nbsp;'}</small></span>`).join('')}</div>
    <div class="ph-act"><span class="ph-call">${ico('phone', 36)}</span><span class="ph-add ${SQ}">${ico('person', 36)}</span></div>
    ${tabs(['data', 'grid', 'person'], 1)}`) }),
};

export const Contacts: S = {
  name: 'Contacts: list',
  parameters: { docs: { description: { story: 'A **blue title bar** (#1085D5, 72px, rounded top corners, light 32px title), a 44px search field, then the alphabet as **group headers**: a line, the letter at its right end. Each row 80px: a 62px squircle picture (initials when there is none) and the name, bold 28px. **No scrollbar at rest**: the fast-scroll band appears, darker, only while the list moves. Toolbar: **+** (new contact) and the menu.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="n9-title" style="background:#1085D5">Contacts</div>
    <div class="n9-field">Search${ico('search', 30)}</div>
    <div class="ap-body" style="border-top:1px solid #D5CED5;box-shadow:inset 0 1px #fff">
      <div class="n9-group">A</div>
      ${['Aino Koski', 'Aleksi Ranta', 'Anna Lehto', 'Antti Vaara', 'Arja Peltola', 'Aune Kivi'].map((n) => `<div class="n9-row"><span class="n9-av ${SQ}">${n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</span><span class="t"><b>${n}</b></span></div>`).join('')}
      <div class="n9-group">C</div>
    </div>
    ${toolbar(ico('add', 40), ico('menu', 40))}`) }),
};

export const ContactEditor: S = {
  name: 'Contacts: editor',
  parameters: { docs: { description: { story: 'Editors are **sheets**: Cancel (grey pill) and Save (blue, pale until something changed) on a grey 72px header: the one place N9 puts buttons up there, because a sheet is a separate task with its own frame. A 78px picture squircle with "Add image", a rule, then fields as **label: value** lines 60px apart, 28px: the focused one blue with a ▸ at the left edge, phone and email labels underlined, empty values a blue hint. A small ▾ squircle shows more fields. No toolbar (the keyboard takes the bottom).' } } },
  render: () => ({ components: comps, template: app(`
    <div class="n9-sheet"><span class="n9-pill n9-pill--grey">Cancel</span><span class="n9-pill n9-pill--blue">Save</span></div>
    <div class="ap-body">
      <div class="ce-img"><span class="ce-ph ${SQ}">${ico('person', 44)}</span>Add image</div>
      <div class="ce-f focus" style="position:relative">First name: <i>Add first name</i></div>
      <div class="ce-f">Last name: <i>Add last name</i></div>
      <div class="ce-f"><u>Mobile:</u> <i>Add number</i></div>
      <div class="ce-f"><u>Home:</u> <i>Add email address</i></div>
      <div class="ce-more"><span class="${SQ}">▼</span></div>
    </div>`) }),
};

export const Calculator: S = {
  name: 'Calculator',
  parameters: { docs: { description: { story: 'Full screen, black, no status bar. The result in **light orange** (#EE9508), 126px, right-aligned with a grey ⌫ tag beside it, over a 2px rule inset 70px. Keys are **bare glyphs, no boxes**, light 75px: C ÷ ×, ± − + in light grey (#CDCACD) on two 94px rows, then the digits in white on 110px rows, **=** in orange. Nothing else: no scientific panel, no menu, no toolbar.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ca-out">0<span class="ca-bs">✕</span></div><div class="ca-line"></div>
    <div class="ca-keys">${['C', '÷', '×', '±', '−', '+'].map((k) => `<span class="op">${k}</span>`).join('')}${['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((k) => `<span>${k}</span>`).join('')}<span class="eq">=</span></div>`, 'ap--dark', false) }),
};

export const Clock: S = {
  name: 'Clock and alarms',
  parameters: { docs: { description: { story: 'One page. The top 509px (#EEF2EE) holds the **analogue clock**, 380px: white hands with a soft shadow, an orange second hand, the weekday and date on its left, the time zone above. Below, **Alarms** (light 36px) with a + squircle, then 110px rows: a light switch, the time bold with its name under it, ›. No tabs and no toolbar items: the N9 clock has only alarms.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="cl-top"><span class="cl-tz">London GMT+0:00</span><div class="cl-dial"><i class="h"></i><i class="m"></i><i class="s"></i><span class="cl-date">THU<b>19</b></span></div></div>
    <div class="cl-low"><div class="cl-head">Alarms<span class="cl-plus ${SQ}">${ico('add', 28)}</span></div>
      <div class="cl-row"><span class="n9-sw-light"></span><span class="t"><b>8:00</b><small>Alarm</small></span><span class="n9-chev">›</span></div>
      <div class="cl-row"><span class="n9-sw-light"></span><span class="t"><b>11:08</b><small>Alarm</small></span><span class="n9-chev">›</span></div></div>`) }),
};

export const AlarmEditor: S = {
  name: 'Clock: alarm editor',
  parameters: { docs: { description: { story: 'A sheet, Cancel and an **orange Save** (the N9 positive colour in editors). A title field, the time in light 64px type, and the 398px **time wheel**: drag the dark minute knob round the outer ring and the light hour knob round the inner one. Then More options › (repeat, snooze, tone as N9 selection rows).' } } },
  render: () => ({ components: comps, template: app(`
    <div class="n9-sheet"><span class="n9-pill n9-pill--grey">Cancel</span><span class="n9-pill n9-pill--orange">Save</span></div>
    <div class="ap-body"><div class="al-field">Alarm title</div><div class="al-time">11:08</div>
      <div class="al-wheel"><span class="al-knob" style="top:46px;right:10px;background:radial-gradient(circle at 50% 35%,#4A3A30,#1E1612);color:#fff">08</span><span class="al-knob" style="top:110px;left:110px;background:radial-gradient(circle at 50% 35%,#F2F2F2,#B8B8BA);color:#222">11</span></div>
      <div class="al-more">More options<span class="n9-chev">›</span></div></div>`) }),
};

const MONTH = Array.from({ length: 42 }, (_, i) => i - 5);
export const CalendarMonth: S = {
  name: 'Calendar: month',
  parameters: { docs: { description: { story: 'The month is a light panel (#EEEEEE, 454px, a soft shadow under it) with orange ◀ ▶ around the light 36px month name, weekday names with **Saturday and Sunday in orange**, days on a 66 × 59px grid, today an **orange squircle**, other months\' days grey. Under it, the chosen day\'s events, or "No events". Toolbar tabs: + (new event), Month, Week, Agenda, menu.' } } },
  render: () => ({ components: comps, setup: () => ({ MONTH }), template: app(`
    <div class="cm"><div class="cm-h"><i class="l"></i>November 2026<i class="r"></i></div>
      <div class="cm-g">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => `<span class="d ${i > 4 ? 'we' : ''}">${d}</span>`).join('')}
        <span v-for="n in MONTH" :key="n" :class="{ o: n < 1 || n > 30, t: n === 19 }"><em v-if="n === 19" class="${SQ}">19</em><template v-else>{{ n < 1 ? 31 + n : n > 30 ? n - 30 : n }}</template></span></div></div>
    <div class="ap-body"><div class="cm-none">No events</div></div>
    ${tabs(['add', 'grid', 'split', 'list', 'menu'], 1)}`) }),
};

export const CalendarWeek: S = {
  name: 'Calendar: day in the week',
  parameters: { docs: { description: { story: 'The week tab. A dark 28px strip "Week 47 - November 2026", an orange rule, the day in an **orange bar** (light white type) beside a 70px hours column; hour rows 70px; events are **solid blue** blocks with bold white titles; the current hour a warm beige band with an orange mark.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="cw-h">Week 47 - November 2026</div><div class="cw-day"><span>Thursday 19</span></div>
    <div class="ap-body cw-rows">${['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((h, i) => `<div class="cw-row ${i === 4 ? 'now' : ''}"><span>${h}</span><i class="${i === 1 ? 'ev' : ''}">${i === 1 ? 'Meeting' : ''}</i></div>`).join('')}</div>
    ${tabs(['add', 'grid', 'split', 'list', 'menu'], 2)}`) }),
};

export const CalendarAgenda: S = {
  name: 'Calendar: agenda',
  parameters: { docs: { description: { story: 'The agenda has **no header at the top**. Its first row is **today\'s orange bar** (#EE5500, 41px: "Today - Thursday, 19 November 2026", white bold 24px, right-aligned), then today\'s events, or a grey line **No events for today**. Right under it, the **next day with events**, however far ahead (a quiet calendar can jump weeks): a **grey bar** of the same kind with its date, and its events (title bold, time, place, the calendar\'s colour mark at the right). Nothing older than today, no "Touch to view events before / after" rows. With few days the list does not scroll, so **no fast scroll**: the rows take the full width. The ≡ opens the N9 menu (Today, Go to date, Search, Refresh, Import, Settings, About).' } } },
  render: () => ({ components: comps, template: app(`
    <div class="cg-bar today">Today - Thursday, 19 November 2026</div><div class="cg-none">No events for today</div>
    <div class="cg-bar next">Monday, 30 November 2026</div>
    <div class="cg-ev"><b>St. Andrew's Day (Scotland)</b><span>All day</span><span>United Kingdom</span><i></i></div>
    <div class="ap-body"></div>
    ${tabs(['add', 'grid', 'split', 'list', 'menu'], 3)}`) }),
};

export const Gallery: S = {
  name: 'Gallery: grid',
  parameters: { docs: { description: { story: 'Full screen, black, the pictures **edge to edge, 160px squares, no gaps** (videos show their length). The toolbar is **tabs** on a dark bar: All, Captures, Favourites, Tags (an N9 selection of the collections) and the menu; the current one a lighter cell.' } } },
  render: () => ({ components: comps, setup: () => ({ pic }), template: app(`
    <div class="ap-body"><div class="ga-grid"><i v-for="i in 15" :key="i" :style="{ background: pic(i) }"><small v-if="i < 3">00:{{ i === 1 ? '01' : '19' }}</small></i></div>
    <div class="ga-tb">${tabs(['star', 'photo', 'star', 'person', 'menu'], 0, true)}</div></div>`, 'ap--dark', false) }),
};

export const Photo: S = {
  name: 'Gallery: one picture',
  parameters: { docs: { description: { story: 'The picture fills the screen; a tap shows a translucent **info band** on top (name bold, date, place) and the dark toolbar: Back, ★, Share, Delete, menu. Another tap hides both.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ap-body" style="background:${pic(1)}"><div class="ga-info" style="top:0"><b>IMG_0412</b><div><span>9 May 2026 10:56</span><span>Athens, Greece</span></div></div></div>
    ${toolbar(ico('back', 36), `${ico('star', 32)}&emsp;&emsp;${ico('share', 32)}&emsp;&emsp;${ico('delete', 32)}&emsp;&emsp;${ico('menu', 32)}`, true)}`, 'ap--dark') }),
};

export const Music: S = {
  name: 'Music',
  parameters: { docs: { description: { story: 'Full screen. The top is a wall of **square album art**, 160px, edge to edge (the first tile "All songs"); under it bold 26px rows Artists, Albums, Songs, Playlists › and the Music Store, 72px apart, on black with a soft grey glow. No toolbar until something plays. Album art stays square (rule 22).' } } },
  render: () => ({ components: comps, setup: () => ({ pic }), template: app(`
    <div class="ap-body" style="background:radial-gradient(ellipse at 30% 75%, #2A2A2A, #000 70%)"><div class="ga-grid"><i v-for="i in 9" :key="i" :style="{ background: pic(i + 3) }"></i></div>
    <div class="mu-rows">${['Artists', 'Albums', 'Songs', 'Playlists'].map((r) => `<div class="mu-row">${r}<span class="n9-chev" style="color:#fff">›</span></div>`).join('')}<div class="mu-row">Music Store${ico('bag', 28)}</div></div></div>`, 'ap--dark', false) }),
};

export const NowPlaying: S = {
  name: 'Music: now playing',
  parameters: { docs: { description: { story: 'The art, square, edge to edge; the title bold with "1/1", artist and album; bare ⏮ ⏸ ⏭; a thin **magenta** progress line and times; the dark toolbar: Back, ★, repeat.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ap-body"><div style="height:480px;background:${pic(5)}"></div>
      <div class="mu-now"><b>No more blues<span>1/1</span></b><p>Sample artist<br>Sample album</p></div>
      <div class="mu-ctl">${ico('back', 40)}${ico('pause', 48)}<span style="transform:scaleX(-1);display:inline-grid">${ico('back', 40)}</span></div><div class="mu-prog"></div><div class="mu-t"><span>00:01</span><span>03:57</span></div></div>
    ${toolbar(ico('back', 36), `${ico('star', 32)}&emsp;&emsp;${ico('restart', 32)}`, true)}`, 'ap--dark') }),
};

export const Browser: S = {
  name: 'Browser: start page',
  parameters: { docs: { description: { story: 'The address field "Go to web address or search" (48px) is the only thing on top, on a light band. Then **Top sites** as huge type in 87px rows, each site its name set large (the brand bold and blue, the rest light), then the history grouped by date, each a globe, the title bold and the address. On a page, the N9 browser put Back, the address and its menu in a bar at the top that scrolls away: **Etesian moves those to the bottom toolbar** (rule 1); the toolbar hides as you scroll down and comes back as you scroll up.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="br-top"><div class="n9-field" style="font-size:22px">Go to web address or search</div></div>
    <div class="ap-body" style="background:#fff"><div class="br-label">Top sites</div>
      <div class="br-site">Latest on <b>&nbsp;Etesian</b></div><div class="br-site"><b>Etesian&nbsp;</b> Features</div><div class="br-site"><b>Etesian&nbsp;</b> Design</div><div class="br-site"><b>Etesian&nbsp;</b> Support</div><div class="br-site"><b>Etesian</b>.org</div>
      <div class="br-label">13/05/2026</div>
      <div class="br-hist">${ico('globe', 34)}<span class="t"><b>Design language: the squircle</b><small>https://etesian.example.org/design</small></span></div></div>`) }),
};

export const Documents: S = {
  name: 'Documents',
  parameters: { docs: { description: { story: 'An **orange title bar** (72px), then every document, newest first, grouped by **age** ("Today", "Yesterday", "5 years ago" at the right end of a line). Each 80px row: a light squircle with the file type, the name bold, the kind under it, the size at the right. No folders, no tabs. Toolbar: the menu only.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="n9-title" style="background:#EE5500">Documents</div>
    <div class="ap-body"><div class="n9-group">Today</div>
      ${[['PDF', 'Report 2026', 'PDF', '139 kB'], ['XLS', 'Budget', 'Spreadsheet', '22 kB']].map(([t, n, k, s]) => `<div class="n9-row"><span class="dc-ic ${SQ}">${t}</span><span class="t"><b>${n}</b><small>${k}</small></span><span class="dc-size">${s}</span></div>`).join('')}
      <div class="n9-group">Yesterday</div>
      <div class="n9-row"><span class="dc-ic ${SQ}">TXT</span><span class="t"><b>Notes for the trip</b><small>Text file</small></span><span class="dc-size">1 kB</span></div></div>
    ${toolbar('', ico('menu', 40))}`) }),
};

/* ---- Camera (PR1.3), measured from the user's own N9 captures (n9-ref/camera, SPEC.md), in N9 px. ----
   Every control is drawn as an SVG n = 2.8 squircle (pills: squircle-half ends), dark see-through with a thin light
   outline; glyphs are Etesian's own (the same paths as the Aperture patch's vector drawables). */
const SQN = 2.8;
/** A squircle path in w x h; with ends, squircle halves on the short side pulled apart (a pill). */
const sqPath = (w: number, h: number, ends = false, inset = 0) => {
  const pts: string[] = [];
  const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => {
    for (let a = a0; a <= a1 + 1e-6; a += 4) {
      const t = (a * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
      pts.push(`${(cx + rx * Math.sign(c) * Math.abs(c) ** (2 / SQN)).toFixed(2)} ${(cy - ry * Math.sign(s) * Math.abs(s) ** (2 / SQN)).toFixed(2)}`);
    }
  };
  const W = w - 2 * inset, H = h - 2 * inset, x = inset, y = inset;
  if (!ends || Math.abs(W - H) < 1) arc(x + W / 2, y + H / 2, W / 2, H / 2, 0, 360);
  else if (W > H) { arc(x + H / 2, y + H / 2, H / 2, H / 2, 90, 270); arc(x + W - H / 2, y + H / 2, H / 2, H / 2, 270, 450); }
  else { arc(x + W / 2, y + W / 2, W / 2, W / 2, 0, 180); arc(x + W / 2, y + H - W / 2, W / 2, W / 2, 180, 360); }
  return `M${pts.join('L')}Z`;
};
/** A squircle face behind a control: fill + a thin rim (1.5 N9 px), or a gradient. */
const face = (w: number, h: number, o: { ends?: boolean; fill?: string; rim?: string; grad?: [string, string] } = {}) => {
  const id = `g${Math.random().toString(36).slice(2, 8)}`;
  const fill = o.grad ? `url(#${id})` : (o.fill ?? 'rgba(0,0,0,.55)');
  return `<svg class="cf" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${o.grad ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.grad[0]}"/><stop offset="1" stop-color="${o.grad[1]}"/></linearGradient></defs>` : ''}<path d="${sqPath(w, h, o.ends, 0.75)}" fill="${fill}" stroke="${o.rim ?? 'rgba(255,255,255,.35)'}" stroke-width="1.5"/></svg>`;
};
const GLYPHS: Record<string, [string, string]> = {
  'back': ['0 0 24 24', '<path d="M20,12H5 M11,5l-7,7 7,7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'],
  'camera': ['0 0 24 24', '<path d="M9,3L7.2,5H4C2.9,5 2,5.9 2,7v11c0,1.1 0.9,2 2,2h16c1.1,0 2,-0.9 2,-2V7c0,-1.1 -0.9,-2 -2,-2h-3.2L15,3H9zM12,17.5c-2.5,0 -4.5,-2 -4.5,-4.5s2,-4.5 4.5,-4.5 4.5,2 4.5,4.5 -2,4.5 -4.5,4.5zM12,10.2a2.8,2.8 0,1 0,0 5.6a2.8,2.8 0,1 0,0 -5.6z" fill="currentColor"/>'],
  'exposure': ['0 0 24 24', '<path d="M12,3a9,9 0,1 1,0 18a9,9 0,1 1,0 -18z M6.5,17.5l11,-11 M7,9.5h4 M9,7.5v4 M13,15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'face': ['0 0 24 24', '<path d="M4,8V4h4 M16,4h4v4 M20,16v4h-4 M8,20H4v-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12,7a2.7,2.7 0,1 1,0 5.4a2.7,2.7 0,1 1,0 -5.4z M7,17.5c0,-2.3 2.2,-3.6 5,-3.6s5,1.3 5,3.6z" fill="currentColor"/>'],
  'filter_mono': ['0 0 24 24', '<path d="M12,4a8,8 0,1 1,0 16a8,8 0,1 1,0 -16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12,4a8,8 0,0 1,0 16z" fill="currentColor"/>'],
  'filter_negative': ['0 0 24 24', '<path d="M12,4a8,8 0,1 1,0 16a8,8 0,1 1,0 -16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8,12h8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'],
  'filter_off': ['0 0 24 24', '<path d="M12,4a8,8 0,1 1,0 16a8,8 0,1 1,0 -16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
  'filter_posterize': ['0 0 24 24', '<path d="M12,3.5a8.5,8.5 0,1 1,0 17a8.5,8.5 0,1 1,0 -17z M12,7a5,5 0,1 1,0 10a5,5 0,1 1,0 -10z M12,10.3a1.7,1.7 0,1 1,0 3.4a1.7,1.7 0,1 1,0 -3.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
  'filter_sepia': ['0 0 24 24', '<path d="M12,4a8,8 0,1 1,0 16a8,8 0,1 1,0 -16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12,7c-1.8,2.6 -3,4.3 -3,6a3,3 0,0 0,6 0c0,-1.7 -1.2,-3.4 -3,-6z" fill="currentColor"/>'],
  'filter_solarise': ['0 0 24 24', '<path d="M12,2l2,4.2 4.5,-1.5 -1,4.6 4.3,2.2 -4.3,2.2 1,4.6 -4.5,-1.5L12,22l-2,-4.2 -4.5,1.5 1,-4.6L2.2,12.5l4.3,-2.2 -1,-4.6 4.5,1.5z" fill="currentColor"/>'],
  'gallery': ['0 0 24 24', '<path d="M3.5,5.5h17v13h-17z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5,16.5l4,-5 3,3.5 2.5,-2.5 3.5,4z M15.5,8a1.5,1.5 0,1 1,0 3a1.5,1.5 0,1 1,0 -3z" fill="currentColor"/>'],
  'redeye': ['0 0 24 24', '<path d="M2.5,12C5,7.5 19,7.5 21.5,12C19,16.5 5,16.5 2.5,12z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12,9.3a2.7,2.7 0,1 1,0 5.4a2.7,2.7 0,1 1,0 -5.4z" fill="currentColor"/>'],
  'scene_auto': ['0 0 24 24', '<path d="M3.5,5.5h17v13h-17z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9,16l3,-8 3,8 M10.1,13.2h3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'],
  'scene_landscape': ['0 0 24 24', '<path d="M2,19.5l6.5,-10 4,6 2.5,-3.5 7,7.5z M17,4.5a2,2 0,1 1,0 4a2,2 0,1 1,0 -4z" fill="currentColor"/>'],
  'scene_macro': ['0 0 24 24', '<path d="M12,13c-3.3,0 -5.5,-2.6 -5.5,-7.5c2,0.3 3.8,1.3 5.5,3.3c1.7,-2 3.5,-3 5.5,-3.3C17.5,10.4 15.3,13 12,13z" fill="currentColor"/><path d="M12,13v8 M12,18c-1.5,-2.2 -3.5,-2.6 -5,-2.4 M12,17c1.5,-2 3.3,-2.4 5,-2.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'scene_night': ['0 0 24 24', '<path d="M14.5,2.5A9.5,9.5 0,1 0,21.5 15A7.5,7.5 0,0 1,14.5 2.5z" fill="currentColor"/>'],
  'scene_portrait': ['0 0 24 24', '<path d="M12,3.5a4,4 0,1 1,0 8a4,4 0,1 1,0 -8z M4,20.5c0,-4.4 3.6,-7 8,-7s8,2.6 8,7z" fill="currentColor"/>'],
  'scene_sports': ['0 0 24 24', '<path d="M15.5,2.5a2,2 0,1 1,0 4a2,2 0,1 1,0 -4z" fill="currentColor"/><path d="M13.5,8l-3,5 4,2.5 -1,5.5 M10.5,13l-3,4.5 -3.5,0 M12.5,9l4,2.5 3,-1 M12.5,9l-4,0.5 -2,2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
  'torch_off': ['0 0 24 24', '<path d="M8,9h8v2.5l-1.5,2V21h-5v-7.5L8,11.5z M8,5h8v3H8z" fill="currentColor"/>'],
  'torch_on': ['0 0 24 24', '<path d="M8,9h8v2.5l-1.5,2V21h-5v-7.5L8,11.5z M8,5h8v3H8z" fill="currentColor"/><path d="M4,4l2,1.5 M20,4l-2,1.5 M12,1v2 M3.5,9h2 M18.5,9h2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'],
  'video': ['0 0 24 24', '<path d="M16,10.5V7c0,-0.55 -0.45,-1 -1,-1H3c-0.55,0 -1,0.45 -1,1v10c0,0.55 0.45,1 1,1h12c0.55,0 1,-0.45 1,-1v-3.5l5,4v-11l-5,4z" fill="currentColor"/>'],
  'wb_auto': ['0 0 24 24', '<path d="M10,8.2a3,3 0,1 1,0 6a3,3 0,1 1,0 -6z M10,2.5v2 M10,18v2 M2.5,11.2h2 M4.6,5.8l1.4,1.4 M15.4,5.8l-1.4,1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15,21.5l2.5,-7 2.5,7 M15.9,19.2h3.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'],
  'wb_cloudy': ['0 0 24 24', '<path d="M7,19h10.5a3.5,3.5 0,0 0,0 -7h-0.3A5,5 0,0 0,7.5 13.3A2.9,2.9 0,0 0,7 19z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'wb_fluorescent': ['0 0 24 24', '<path d="M4,10h16v4H4z M6,6.5l1,1.5 M12,5v2 M18,6.5l-1,1.5 M6,17.5l1,-1.5 M12,19v-2 M18,17.5l-1,-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'wb_incandescent': ['0 0 24 24', '<path d="M9.5,21h5 M9.5,18h5 M12,3a5.8,5.8 0,0 0,-3.5 10.4V15.5h7v-2.1A5.8,5.8 0,0 0,12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'wb_sunny': ['0 0 24 24', '<path d="M12,8.5a3.5,3.5 0,1 1,0 7a3.5,3.5 0,1 1,0 -7z M12,2.5v2.2 M12,19.3v2.2 M2.5,12h2.2 M19.3,12h2.2 M5.3,5.3l1.5,1.5 M17.2,17.2l1.5,1.5 M5.3,18.7l1.5,-1.5 M17.2,6.8l1.5,-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'flash_auto': ['0 0 960 960', '<path d="M280,624L408,440L294,440L374,160L160,160L160,480L280,480L280,624ZM200,880L200,560L80,560L80,80L480,80L400,360L560,360L200,880ZM280,480L280,480L160,480L160,480L280,480L280,480L280,480L280,480ZM585,440L720,80L784,80L921,440L859,440L827,348L679,348L647,440L585,440ZM697,296L807,296L754,146L752,146L697,296Z" fill="currentColor"/>'],
  'flash_on': ['0 0 960 960', '<path d="M480,624L608,440L494,440L574,160L360,160L360,480L480,480L480,624ZM400,880L400,560L280,560L280,80L680,80L600,360L760,360L400,880ZM480,480L480,480L360,480L360,480L480,480L480,480L480,480L480,480Z" fill="currentColor"/>'],
  'flash_off': ['0 0 960 960', '<path d="M280,80L680,80L600,360L760,360L643,529L586,472L608,440L554,440L507,393L574,160L360,160L360,246L280,166L280,80ZM400,880L400,560L280,560L280,394L55,169L112,112L848,848L791,905L550,664L400,880ZM473,359L473,359L473,359L473,359L473,359L473,359L473,359L473,359Z" fill="currentColor"/>'],
  'location_on': ['0 0 24 24', '<path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM7,9c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88C9.92,16.21 7,11.85 7,9z" fill="currentColor"/><path d="M12,9m-2.5,0a2.5,2.5 0,1 1,5 0a2.5,2.5 0,1 1,-5 0" fill="currentColor"/>'],
};

const g = (name: string, size = 30, color = '#fff') => { const [vb, body] = GLYPHS[name]; return `<svg class="cg" width="${size}" height="${size}" viewBox="${vb}" style="color:${color}">${body}</svg>`; };
/** A control at (x, y) or right/bottom offsets, size w x h, with a squircle face and centred contents. */
const ctl = (pos: string, w: number, h: number, inner: string, o: Parameters<typeof face>[2] = {}, cls = '') =>
  `<span class="cc ${cls}" style="${pos};width:${w}px;height:${h}px">${face(w, h, o)}<span class="ci">${inner}</span></span>`;
const BOXA = `<span class="cbox">A</span>`;

const CAM_CSS = `<component is="style">
.cam { flex: 1; position: relative; overflow: hidden; background: radial-gradient(120% 70% at 30% 35%, #3A3A3A, #1C1C1C 55%, #0E0E0E), #111; }
.cam--warm { background: linear-gradient(170deg, #2A2622 0%, #4E4232 45%, #8A7458 70%, #A88E6A 100%); }
.cc { position: absolute; display: grid; place-items: center; color: #fff; }
.cc .cf { position: absolute; inset: 0; }
.cc .ci { position: relative; display: flex; align-items: center; gap: 17px; font: 700 22px/1 var(--hd-font-family-base); }
.ci > * { display: inline-grid; transition: transform .26s ease-in-out; }
.cbox { border: 2.5px solid #fff; border-radius: 2px; padding: 1px 3px; font: 700 14px/1 var(--hd-font-family-base); }
.cam-focus { position: absolute; left: 172px; top: 330px; width: 136px; height: 193px; --c: #fff;
  background: linear-gradient(var(--c),var(--c)) 0 0 / 19px 3px, linear-gradient(var(--c),var(--c)) 0 0 / 3px 19px, linear-gradient(var(--c),var(--c)) 100% 0 / 19px 3px, linear-gradient(var(--c),var(--c)) 100% 0 / 3px 19px,
    linear-gradient(var(--c),var(--c)) 0 100% / 19px 3px, linear-gradient(var(--c),var(--c)) 0 100% / 3px 19px, linear-gradient(var(--c),var(--c)) 100% 100% / 19px 3px, linear-gradient(var(--c),var(--c)) 100% 100% / 3px 19px; background-repeat: no-repeat; }
.cam-focus.locked { --c: #268CE1; }
.cam-strip { position: absolute; right: 18px; top: 95px; width: 59px; height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 8px 0; }
.cam-strip .cf { position: absolute; inset: 0; }
.cam-strip > span { position: relative; display: grid; place-items: center; height: 60px; }
.cam-rec { position: absolute; left: 16px; top: 16px; height: 30px; padding: 0 12px 0 10px; display: flex; align-items: center; gap: 9px; color: #fff; font: 400 19px/1 var(--hd-font-family-base); }
.cam-rec .cf { position: absolute; inset: 0; } .cam-rec > * { position: relative; } .cam-rec i { width: 11px; height: 11px; border-radius: 50%; background: #E0262A; }
.cam-card { flex: 1; display: flex; perspective: 1600px; } .cam-card > div { flex: 1; display: flex; position: relative; transform-style: preserve-3d; transition: transform .36s ease-in-out; }
.cam-card .cam { position: absolute; inset: 0; backface-visibility: hidden; } .cam-card .cam--back { transform: rotateY(180deg); }
.cam-card.is-video > div { transform: rotateY(180deg); }
@media (prefers-reduced-motion: reduce) { .cam-card > div { transition: none; } .cam-card .cam { transition: opacity .18s; } }
/* settings page */
.cs { flex: 1; padding: 0 16px; background: #000; color: #fff; overflow: hidden; position: relative; }
.cs-in { position: absolute; left: 16px; right: 16px; }
.cs h3 { margin: 14px 0 22px; font: 300 32px/1.1 var(--hd-font-family-light); }
.cs h4 { display: flex; align-items: center; gap: 44px; margin: 22px 0 18px; font: 700 15px/1 var(--hd-font-family-base); color: #8C8C8C; } .cs h4::after { content: ''; flex: 1; height: 1.5px; background: #3A3A3A; }
.cs-tiles { display: grid; grid-template-columns: repeat(3, 1fr); row-gap: 20px; text-align: center; font: 400 17px/1 var(--hd-font-family-base); color: #DDD; }
.cs-tiles > span { display: flex; flex-direction: column; align-items: center; gap: 12px; } .cs-tiles .t { position: relative; width: 62px; height: 62px; display: grid; place-items: center; } .cs-tiles .t .cf { position: absolute; inset: 0; } .cs-tiles .t .cg { position: relative; }
.cs-row { display: flex; align-items: center; gap: 16px; height: 80px; } .cs-row .t { position: relative; flex: none; width: 62px; height: 62px; display: grid; place-items: center; } .cs-row .t .cf { position: absolute; inset: 0; } .cs-row .t .cg { position: relative; }
.cs-row b { display: block; font: 700 26px/1.15 var(--hd-font-family-base); } .cs-row small { display: block; margin-top: 2px; font: 400 21px/1.1 var(--hd-font-family-base); color: #9A9A9A; }
.cs-seg { width: 320px; margin: 0 auto; border-radius: 12px; overflow: hidden; } .cs-seg span { display: grid; place-items: center; height: 50px; background: linear-gradient(#323232, #1C1C1C); border-top: 1px solid #000; font: 700 21px/1 var(--hd-font-family-base); }
.cs-seg span.on { background: #268CE1; } .cs-seg span:first-child { border-top: 0; }
.cs-hseg { display: flex; border-radius: 12px; overflow: hidden; } .cs-hseg span { flex: 1; display: grid; place-items: center; height: 48px; background: linear-gradient(#323232, #1C1C1C); border-left: 1px solid #000; font: 700 21px/1 var(--hd-font-family-base); } .cs-hseg span.on { background: #268CE1; } .cs-hseg span:first-child { border-left: 0; }
.cs-sw { display: flex; align-items: center; min-height: 64px; font: 700 26px/1.1 var(--hd-font-family-base); } .cs-sw > b { flex: 1; } .cs-sw .cg { margin-right: 26px; }
.cs-note { font: 400 21px/1.5 var(--hd-font-family-base); color: #EEE; margin: 0 0 10px; }
.cs-field { position: relative; height: 44px; display: flex; align-items: center; padding: 0 16px; font: 400 21px/1 var(--hd-font-family-base); color: #999; } .cs-field .cf { position: absolute; inset: 0; } .cs-field span { position: relative; }
.cs-lab { font: 400 20px/1 var(--hd-font-family-base); color: #9A9A9A; margin: 14px 0 10px; }
/* panels over the picture */
.cp { position: absolute; left: 0; right: 0; bottom: 0; padding: 12px 16px 14px; background: rgba(0,0,0,.5); color: #fff; }
.cp h4 { display: flex; align-items: center; gap: 44px; margin: 8px 0 16px; font: 700 15px/1 var(--hd-font-family-base); color: #9A9A9A; } .cp h4::after { content: ''; flex: 1; height: 1.5px; background: #6A6A6A; }
.cp .cs-tiles { color: #EEE; }
.cev { position: relative; height: 112px; font: 400 21px/1 var(--hd-font-family-base); }
.cev .lab { position: absolute; top: 4px; transform: translateX(-50%); } .cev .lab.on { color: #268CE1; }
.cev .tk { position: absolute; top: 34px; width: 1.5px; height: 10px; background: #fff; } .cev .tk.big { top: 30px; height: 14px; }
.cev .tr { position: absolute; left: 12px; right: 12px; top: 72px; height: 7px; border-radius: 4px; background: rgba(150,150,150,.6); } .cev .tr i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: #268CE1; }
.cev .hd { position: absolute; top: 56px; width: 40px; height: 40px; transform: translateX(-50%); } .cev .hd .cf { position: absolute; inset: 0; }
/* the dark toolbar, Back only */
.cam-tb { flex: none; height: 72px; display: flex; align-items: center; padding: 0 18px; background: linear-gradient(#141214, #070607); border-top: 1px solid #222; }
.cam-tb .cc { position: relative; }
</component>`;

const GRAD_BLUE: [string, string] = ['#3B9BEA', '#1678D2'];
const GRAD_TILE: [string, string] = ['#4A4A4A', '#262626'];
const camTb = `<div class="cam-tb">${ctl('', 52, 50, g('back', 30), { grad: ['#3A3A3A', '#1A1A1A'], rim: 'rgba(255,255,255,.18)' })}</div>`;
const camApp = (inner: string, extra = '') => `${CSS}${CAM_CSS}<div class="ap hd-squircle-free ap--dark ${extra}">${inner}</div>`;

/** The viewfinder, portrait, in N9 px: photo or video; flags for the strip, recording, blue focus. */
const viewfinder = (o: { video?: boolean; strip?: boolean; recording?: boolean; locked?: boolean; torch?: boolean; warm?: boolean; back?: boolean } = {}) => {
  const pill = o.video ? `<span class="cbox" style="font-size:15px;padding:2px 4px">HD</span>${BOXA}` : `${g('face', 30)}${BOXA}<span>7M</span>`;
  const flash = o.video ? g(o.torch ? 'torch_on' : 'torch_off', 30) : g(o.strip ? 'redeye' : 'flash_auto', 30);
  const rec = o.recording;
  return `<div class="cam ${o.warm ? 'cam--warm' : ''} ${o.back ? 'cam--back' : ''}">
    <span class="cam-focus ${o.locked ? 'locked' : ''}"></span>
    ${rec ? `<span class="cam-rec">${face(108, 30, { ends: true, fill: 'rgba(0,0,0,.45)' })}<i></i><span>00:03</span></span>` : ctl('left:16px;top:16px', 147, 47, pill, { ends: true })}
    ${rec ? '' : ctl('right:17px;top:17px', 59, 57, flash, o.strip ? { fill: '#3D8FE0', rim: '#3D8FE0' } : {})}
    ${o.strip ? `<span class="cam-strip">${face(59, 280, { ends: true, fill: 'rgba(150,150,150,.45)', rim: 'transparent' })}<span>${g('flash_auto', 30)}</span><span>${g('flash_on', 30)}</span><span>${g('flash_off', 30)}</span><span>${g('redeye', 30, '#268CE1')}</span></span>` : ''}
    ${rec ? '' : `<span class="cc" style="left:16px;bottom:32px;width:117px;height:57px">${face(117, 57, { ends: true })}<span class="ci" style="gap:12px;margin-left:6px">${o.video ? `<span style="position:relative;width:50px;height:50px;display:grid;place-items:center">${face(50, 50, { fill: '#fff', rim: '#fff' })}<span style="position:relative">${g('video', 30, '#000')}</span></span><span style="width:50px;display:grid;place-items:center">${g('camera', 30)}</span>` : `<span style="width:50px;display:grid;place-items:center">${g('video', 30)}</span><span style="position:relative;width:50px;height:50px;display:grid;place-items:center">${face(50, 50, { fill: '#fff', rim: '#fff' })}<span style="position:relative">${g('camera', 30, '#000')}</span></span>`}</span></span>`}
    ${ctl('left:197px;bottom:18px', 86, 88, g(o.video ? 'video' : 'camera', 38))}
    ${rec ? '' : ctl('right:17px;bottom:32px', 59, 58, g('gallery', 32))}
  </div>`;
};

export const Camera: S = {
  name: 'Camera',
  parameters: { docs: { description: { story: 'The viewfinder (n9vf-a): all picture, no toolbar, no status bar. Top left the strip pill (face detection, scene "A", 7M), top right the flash; bottom left the photo/video switch (the current one a white squircle inset), the **shutter** bottom centre (the largest control, 86 × 88), the gallery bottom right. Every control is a dark see-through **n = 2.8 squircle** with a thin light outline; the pills have squircle-half ends. Tapping the picture **focuses** (never shoots): the white brackets move there.' } } },
  render: () => ({ components: comps, template: camApp(viewfinder()) }),
};

export const CameraFocused: S = {
  name: 'Camera: focus locked',
  parameters: { docs: { description: { story: 'The brackets turn **blue** when the focus locks (n9vf-b).' } } },
  render: () => ({ components: comps, template: camApp(viewfinder({ locked: true })) }),
};

export const CameraFlash: S = {
  name: 'Camera: flash strip',
  parameters: { docs: { description: { story: 'Photo flash (n9fl-a): a tap turns the button **blue** (showing the current choice) and a see-through strip slides out along the long edge: Auto, On, Off, Red-eye reduction. The current choice is drawn blue, the others white, with no tile behind them. Picking one closes the strip. Rule: two values toggle straight from the button, three or more open a strip.' } } },
  render: () => ({ components: comps, template: camApp(viewfinder({ strip: true, warm: true })) }),
};

export const CameraVideo: S = {
  name: 'Camera: video',
  args: { torch: false },
  argTypes: { torch: { control: 'boolean' } },
  parameters: { docs: { description: { story: 'Video ready (n9vid-a, n9tor): the strip shows the quality (HD) and the scene, the shutter a video camera, the switch has video selected. The flash is a plain **torch toggle**: no menu, the button never turns blue, only its icon changes at once (a plain lamp off, with rays on).' } } },
  render: (args: { torch?: boolean }) => ({ components: comps, setup: () => ({ args }), template: `<div><div v-if="args.torch">${camApp(viewfinder({ video: true, torch: true, warm: true }))}</div><div v-else>${camApp(viewfinder({ video: true, warm: true }))}</div></div>` }),
} as S;

export const CameraRecording: S = {
  name: 'Camera: recording',
  parameters: { docs: { description: { story: 'Recording (n9vid-b): **everything hides except the shutter**; a small see-through pill with a red dot and the time sits in the strip\'s corner. The focus brackets stay (tap to focus still works). No pause button.' } } },
  render: () => ({ components: comps, template: camApp(viewfinder({ video: true, recording: true, warm: true })) }),
};

export const CameraFlip: S = {
  name: 'Camera: photo ↔ video',
  args: { video: false },
  argTypes: { video: { control: 'boolean' } },
  parameters: { docs: { description: { story: 'Toggle **video**: the whole screen turns over like a card in 3D, video on its back (rotateY with perspective; the camera changes over when the card is edge-on). With reduce motion it is a short crossfade instead.' } } },
  render: (args: { video?: boolean }) => ({ components: comps, setup: () => ({ args }), template: `${CSS}${CAM_CSS}<div class="ap hd-squircle-free ap--dark"><div class="cam-card" :class="{ 'is-video': args.video }"><div>${viewfinder()}${viewfinder({ video: true, back: true, warm: true })}</div></div></div>` }),
} as S;

const tilesHtml = (items: [string, string, boolean][], glass = false) => `<div class="cs-tiles">${items.map(([n, ic, on]) => `<span><span class="t">${face(62, 62, on ? { grad: GRAD_BLUE, rim: '#7FC0F6' } : glass ? { fill: 'rgba(255,255,255,.28)', rim: 'transparent' } : { grad: GRAD_TILE, rim: 'transparent' })}${g(ic, 34)}</span>${n}</span>`).join('')}</div>`;
const rowHtml = (ic: string, b: string, s: string) => `<div class="cs-row"><span class="t">${face(62, 62, { grad: GRAD_BLUE, rim: 'transparent' })}${g(ic, 36)}</span><span><b>${b}</b><small>${s}</small></span></div>`;
const segHtml = (items: string[], on = 0) => `<div class="cs-seg">${items.map((t, i) => `<span class="${i === on ? 'on' : ''}">${t}</span>`).join('')}</div>`;
const swHtml = (b: string, on: boolean, ic = '') => `<div class="cs-sw"><b>${b}</b>${ic ? g(ic, 30) : ''}<svg width="63" height="39" viewBox="0 0 63 39">${on ? '<defs><linearGradient id="swg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4195DE"/><stop offset="1" stop-color="#107DD6"/></linearGradient></defs>' : ''}<path d="${sqPath(63, 39, true)}" fill="${on ? 'url(#swg)' : '#2D2E2D'}"/><g transform="translate(${on ? 29 : 5},5)"><path d="${sqPath(29, 29)}" fill="#fff"/></g></svg></div>`;
const SCENES: [string, string, boolean][] = [['Automatic', 'scene_auto', true], ['Macro', 'scene_macro', false], ['Landscape', 'scene_landscape', false], ['Portrait', 'scene_portrait', false], ['Night', 'scene_night', false], ['Sports', 'scene_sports', false]];
const settingsPage = () => `<h3>Image capture settings</h3><h4>Scene</h4>${tilesHtml(SCENES)}<div style="height:16px"></div>
  ${rowHtml('wb_auto', 'White balance', 'Automatic')}${rowHtml('exposure', 'Exposure compensation', '0.0')}${rowHtml('filter_off', 'Colour filter', 'Off')}
  <h4>Self-timer</h4>${segHtml(['Disabled', '2 seconds', '10 seconds'])}
  <h4>Light sensitivity</h4>${segHtml(['Automatic', 'ISO 100', 'ISO 200', 'ISO 400', 'ISO 800'])}
  <h4>Aspect ratio</h4>${segHtml(['16:9', '4:3', '3:2'])}
  <h4>Resolution</h4>${segHtml(['High 7 Mpx', 'Medium 6 Mpx', 'Low 3 Mpx'])}
  <div style="height:8px"></div>${swHtml('Face detection', true, 'face')}${swHtml('Continuous shutter mode', false)}
  <p class="cs-note">In continuous shutter mode (until the capture button is released) several images are captured in quick sequence. Some camera settings and image resolutions are limited in continuous mode.</p>
  <h3 style="margin-top:22px">Camera settings</h3><h4>Show captured content</h4>${segHtml(['Disabled', '2 seconds', '5 seconds', 'No time-out'])}
  <div style="height:6px"></div>${swHtml('Show grid lines', false)}<div class="cs-lab">Creator name</div>
  <div class="cs-field">${face(448, 44, { ends: true, fill: '#E6E6E6', rim: '#B4B4B4' })}<span>Name or copyright</span></div>
  <div style="height:8px"></div>${swHtml('Use GPS', false, 'location_on')}
  <p class="cs-note">GPS coordinates will be attached to images and videos if GPS is available. If images or videos are shared, location data might be visible to third parties.</p>`;

export const CameraSettings: S = {
  name: 'Camera: settings',
  args: { scroll: 0 },
  argTypes: { scroll: { control: { type: 'range', min: 0, max: 1700, step: 50 } } },
  parameters: { docs: { description: { story: 'Opened from the strip pill (n9cam-0..6b). **Image capture settings** and later **Camera settings** in the large light style; section titles small bold grey with a rule. Scene: tiles 3 per row (the current one blue). White balance / Exposure compensation / Colour filter: blue icon rows with their value, each opening a panel over the live picture. Segmented groups stacked, centred, 320 of 480 wide, the selected one flat blue: Self-timer, Light sensitivity, Aspect ratio, Resolution. Switch rows (Face detection with its icon; Continuous shutter mode with its note), then Camera settings: Show captured content, Show grid lines, Creator name (a light squircle-half field), Use GPS with the privacy note. The dark toolbar has only Back. Use **scroll** to see the whole page.' } } },
  render: (args: { scroll?: number }) => ({ components: comps, setup: () => ({ args }), template: camApp(`<div class="cs"><div class="cs-in" :style="{ top: -(args.scroll || 0) + 'px' }">${settingsPage()}</div></div>${camTb}`) }),
} as S;

export const CameraSettingsLandscape: S = {
  name: 'Camera: settings, landscape',
  parameters: { docs: { description: { story: 'Landscape (n9cam-1, 4a-c, 5a-b): the scene tiles in one row, the icon rows in two columns, the segmented groups one full-width row of equal segments; switch rows full width.' } } },
  render: () => ({ components: comps, template: `${CSS}${CAM_CSS}<div class="ap hd-squircle-free ap--dark" style="width:854px;height:480px"><div class="cs"><div class="cs-in" style="top:0">
    <h3>Image capture settings</h3><h4>Scene</h4><div class="cs-tiles" style="grid-template-columns:repeat(6,1fr)">${tilesHtml(SCENES).replace('<div class="cs-tiles">', '').replace(/<\/div>$/, '')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;margin-top:10px">${rowHtml('wb_auto', 'White balance', 'Automatic')}${rowHtml('exposure', 'Exposure compensation', '0.0')}${rowHtml('filter_off', 'Colour filter', 'Off')}</div>
    <h4>Self-timer</h4><div class="cs-hseg"><span class="on">Disabled</span><span>2 seconds</span><span>10 seconds</span></div></div></div>${camTb}</div>` }),
};

const panel = (inner: string) => camApp(`<div class="cam cam--warm"><div class="cp">${inner}</div></div>${camTb}`);
export const CameraWhiteBalance: S = {
  name: 'Camera: white balance panel',
  parameters: { docs: { description: { story: 'White balance (n9cam-7a): back on the **live picture** with a dark see-through panel at the bottom, above the Back bar: a small grey title with a rule and tiles in their see-through look (lighter grey over a picture; solid dark on the page), the current one blue.' } } },
  render: () => ({ components: comps, template: panel(`<h4>White balance</h4>${tilesHtml([['Automatic', 'wb_auto', true], ['Sunny', 'wb_sunny', false], ['Cloudy', 'wb_cloudy', false], ['Fluorescent', 'wb_fluorescent', false], ['Incandescent', 'wb_incandescent', false]], true)}`) }),
};
export const CameraExposure: S = {
  name: 'Camera: exposure panel',
  args: { ev: 0 },
  argTypes: { ev: { control: { type: 'range', min: -6, max: 6, step: 1 } } },
  parameters: { docs: { description: { story: 'Exposure compensation (n9cam-8a/b): a stepped slider, -2 -1 0 +1 +2 above, a tick every third of a step, the current label blue, the track blue up to the white squircle handle and grey after. **ev** is in thirds.' } } },
  render: (args: { ev?: number }) => ({ components: comps, setup: () => ({ args, x: (v: number) => 24 + ((v + 6) / 12) * 400 }), template: panel(`<h4>Exposure compensation</h4><div class="cev">
    <span v-for="v in [-6,-3,0,3,6]" :key="'l'+v" class="lab" :class="{ on: v === (args.ev || 0) }" :style="{ left: x(v) + 'px' }">{{ v === 0 ? '0' : (v > 0 ? '+' : '') + v / 3 }}</span>
    <span v-for="v in 13" :key="'t'+v" class="tk" :class="{ big: (v - 7) % 3 === 0 }" :style="{ left: x(v - 7) + 'px' }"></span>
    <span class="tr"><i :style="{ width: (x(args.ev || 0) - 12) + 'px' }"></i></span>
    <span class="hd" :style="{ left: x(args.ev || 0) + 'px' }">${face(40, 40, { fill: '#fff', rim: 'rgba(0,0,0,.2)' })}</span></div>`) }),
} as S;
export const CameraColourFilter: S = {
  name: 'Camera: colour filter panel',
  parameters: { docs: { description: { story: 'Colour filter (n9cam-9a/b): Off, Black & white, Sepia, Vivid, Negative, Solarise as see-through tiles over the live picture.' } } },
  render: () => ({ components: comps, template: panel(`<h4>Colour filter</h4>${tilesHtml([['Off', 'filter_off', true], ['Black &amp; white', 'filter_mono', false], ['Sepia', 'filter_sepia', false], ['Vivid', 'filter_posterize', false], ['Negative', 'filter_negative', false], ['Solarise', 'filter_solarise', false]], true)}`) }),
};

export const CameraTurned: S = {
  name: 'Camera: device turned',
  args: { turned: true },
  argTypes: { turned: { control: 'boolean' } },
  parameters: { docs: { description: { story: 'Toggle **turned** (n9vfl, n9fl-a): nothing moves relative to the device; only the icons and text inside each control turn a quarter, animated (260 ms), to read upright.' } } },
  render: (args: { turned?: boolean }) => ({ components: comps, setup: () => ({ args }), template: `${CSS}${CAM_CSS}<component is="style">.cam-r.is-turned .ci > *, .cam-r.is-turned .cam-strip > span > * { transform: rotate(90deg); }</component>
    <div class="ap hd-squircle-free ap--dark cam-r" :class="{ 'is-turned': args.turned }">${viewfinder()}</div>` }),
} as S;
