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
/* camera (PR1.3) */
.cam { flex: 1; position: relative; background: linear-gradient(#1A1A1A, #2C2C2C 60%, #4A4A4A); }
.cam-pill { position: absolute; height: 44px; display: flex; align-items: center; gap: 12px; padding: 0 12px; border-radius: 14px; background: rgba(0,0,0,.6); color: #fff; font: 700 17px/1 var(--hd-font-family-base); }
.cam-sq { position: absolute; width: 44px; height: 44px; display: grid; place-items: center; border-radius: 14px; background: rgba(0,0,0,.6); color: #fff; }
.cam-shutter { position: absolute; left: 50%; bottom: 14px; width: 82px; height: 60px; margin-left: -41px; display: grid; place-items: center; border-radius: 18px; background: rgba(0,0,0,.6); color: #fff; }
.cam-mode { position: absolute; left: 8px; bottom: 14px; height: 60px; display: flex; align-items: center; gap: 4px; padding: 0 8px; border-radius: 18px; background: rgba(0,0,0,.6); color: #fff; }
.cam-mode span { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; } .cam-mode span.on { background: #fff; color: #000; }
.cam-focus { position: absolute; left: 50%; top: 46%; width: 120px; height: 200px; transform: translate(-50%, -50%);
  background: linear-gradient(#fff,#fff) 0 0 / 22px 3px, linear-gradient(#fff,#fff) 0 0 / 3px 22px, linear-gradient(#fff,#fff) 100% 0 / 22px 3px, linear-gradient(#fff,#fff) 100% 0 / 3px 22px,
    linear-gradient(#fff,#fff) 0 100% / 22px 3px, linear-gradient(#fff,#fff) 0 100% / 3px 22px, linear-gradient(#fff,#fff) 100% 100% / 22px 3px, linear-gradient(#fff,#fff) 100% 100% / 3px 22px; background-repeat: no-repeat; }
.cs { flex: 1; padding: 0 16px; background: #000; color: #fff; overflow: hidden; }
.cs h3 { margin: 18px 0 18px; font: 300 32px/1 var(--hd-font-family-light); }
.cs h4 { display: flex; align-items: center; gap: 12px; margin: 14px 0 12px; font: 700 15px/1 var(--hd-font-family-base); color: #8C8C8C; } .cs h4::after { content: ''; flex: 1; height: 1px; background: #3A3A3A; }
.cs-tiles { display: grid; grid-template-columns: repeat(3, 1fr); row-gap: 16px; text-align: center; font: 400 17px/1 var(--hd-font-family-base); color: #CCC; }
.cs-tiles span { display: flex; flex-direction: column; align-items: center; gap: 8px; } .cs-tiles i { width: 60px; height: 60px; display: grid; place-items: center; background: linear-gradient(#4A4A4A, #262626); color: #fff; }
.cs-tiles .on i { background: linear-gradient(#3B9BEA, #1678D2); box-shadow: inset 0 0 0 2px #7FC0F6; }
.cs-row { display: flex; align-items: center; gap: 18px; height: 80px; } .cs-row i { flex: none; width: 60px; height: 60px; display: grid; place-items: center; border-radius: 50%; background: linear-gradient(#3B9BEA, #1678D2); color: #fff; }
.cs-row b { display: block; font: 700 26px/1.1 var(--hd-font-family-base); } .cs-row small { display: block; margin-top: 4px; font: 400 20px/1 var(--hd-font-family-base); color: #9A9A9A; }
.cs-seg { width: 320px; margin: 4px auto 0; border-radius: 8px; overflow: hidden; } .cs-seg span { display: grid; place-items: center; height: 50px; background: linear-gradient(#3A3A3A, #1E1E1E); border-top: 1px solid #000; font: 700 20px/1 var(--hd-font-family-base); }
.cs-seg span.on { background: #268CE1; }
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

export const Camera: S = {
  name: 'Camera',
  parameters: { docs: { description: { story: 'The viewfinder is all picture. Top left a strip with face detection, scene and resolution (7M); top right the flash; bottom left the photo/video switch (the current one a white squircle), the **shutter** bottom centre, the gallery bottom right. Tap the picture to focus: the white brackets turn **blue** when focus locks. While recording only the shutter stays, with a red-dot timer. All controls are dark see-through squircles (rgba(0,0,0,.6)).\n\n**Turning the device does not move anything**: only the icons and text inside each control turn, animated, to read upright.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="cam"><span class="cam-pill" style="left:8px;top:8px">☺ ▣ 7M</span><span class="cam-sq" style="right:8px;top:8px">${ico('torch', 26)}</span>
      <span class="cam-focus"></span>
      <span class="cam-mode">${ico('record', 26)}<span class="on">${ico('camera', 26)}</span></span><span class="cam-shutter">${ico('camera', 34)}</span><span class="cam-sq" style="right:8px;bottom:22px">${ico('photo', 26)}</span></div>`, 'ap--dark') }),
};

export const CameraSettings: S = {
  name: 'Camera: settings',
  parameters: { docs: { description: { story: '**Image capture settings** (light 32px) on black. Scene: a grid of icon tiles (the current one blue). White balance, Exposure compensation and Colour filter as round blue icons with their value; each opens a panel over the live picture. Self-timer as a stacked selection, the current one blue. In portrait the groups are vertical; in landscape they lay out as full-width rows. Video has the same structure: scenes Automatic and Video at night, a Resolution group, and the shared Camera settings (show captured content, grid lines, GPS).' } } },
  render: () => ({ components: comps, template: app(`
    <div class="cs"><h3>Image capture settings</h3><h4>Scene</h4>
      <div class="cs-tiles">${[['Automatic', 'camera', 1], ['Macro', 'star', 0], ['Landscape', 'photo', 0], ['Portrait', 'person', 0], ['Night', 'moon', 0], ['Sports', 'record', 0]].map(([n, ic, on]) => `<span class="${on ? 'on' : ''}"><i class="${SQ}">${ico(ic as string, 30)}</i>${n}</span>`).join('')}</div>
      <div style="height:14px"></div>
      ${[['White balance', 'Automatic', 'wrench'], ['Exposure compensation', '0.0', 'restart'], ['Colour filter', 'Off', 'record']].map(([b, s, ic]) => `<div class="cs-row"><i>${ico(ic, 30)}</i><span><b>${b}</b><small>${s}</small></span></div>`).join('')}
      <h4>Self-timer</h4><div class="cs-seg"><span class="on">Disabled</span><span>2 seconds</span><span>10 seconds</span></div></div>
    ${toolbar(ico('back', 36), '', true)}`, 'ap--dark') }),
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

export const CameraTurned: S = {
  name: 'Camera: device turned',
  args: { turned: true },
  argTypes: { turned: { control: 'boolean' } },
  parameters: { docs: { description: { story: 'Toggle **turned**: nothing moves, only the icons and text inside each control turn a quarter, animated (260 ms), to read upright.' } } },
  render: (args: { turned?: boolean }) => ({ components: comps, setup: () => ({ args }), template: `${CSS}<component is="style">.cam-r .cam-pill > *, .cam-r .cam-sq > *, .cam-r .cam-shutter > *, .cam-r .cam-mode > * { display: inline-grid; transition: transform .26s ease-in-out; }
    .cam-r.is-turned .cam-pill > *, .cam-r.is-turned .cam-sq > *, .cam-r.is-turned .cam-shutter > *, .cam-r.is-turned .cam-mode > * { transform: rotate(-90deg); }</component>
    <div class="ap ap--dark cam-r" :class="{ 'is-turned': args.turned }">${SB}<div class="cam"><span class="cam-pill" style="left:8px;top:8px"><span>☺</span><span>▣</span><span>7M</span></span><span class="cam-sq" style="right:8px;top:8px">${ico('torch', 26)}</span>
      <span class="cam-focus"></span><span class="cam-mode"><span>${ico('record', 26)}</span><span class="on">${ico('camera', 26)}</span></span><span class="cam-shutter">${ico('camera', 34)}</span><span class="cam-sq" style="right:8px;bottom:22px">${ico('photo', 26)}</span></div></div>` }),
} as S;
