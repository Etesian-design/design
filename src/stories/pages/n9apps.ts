/* The N9 system apps (Examples/System apps (N9)): styles, helpers and screen templates, in N9 px (480 x 854);
   .ap zooms a screen to 2/3. Measured side by side against the user's N9 captures (2026-11-20).
   Apps.stories.ts imports CSS / comps (the camera stories use them too) and one template per story. */
import HdIcon from '../../components/HdIcon.vue';
import HdFastScroll from '../../components/HdFastScroll.vue';
import HdKeyboard from '../../components/HdKeyboard.vue';
import { squircleRectPath } from '../../squircle';

export const comps = { HdIcon, HdFastScroll, HdKeyboard };

/** An n = 2.8 squircle path stretched to w x h, for small inline SVG glyphs. */
const sq = (w: number, h: number, x = 0, y = 0) => squircleRectPath(w, h, 5, x, y, 64); // the N9 toolbar glyph tiles measure n = 5 at 30px

export const CSS = `<component is="style">
.ap { width: 480px; height: 854px; zoom: .666667; display: flex; flex-direction: column; overflow: hidden; position: relative; font-family: var(--hd-font-family-base); }
.ap--light { background: #000; color: #222; } .ap--dark { background: #000; color: #fff; }
/* the window under the status bar: its top corners are squircle quarters (n = 2.8, 12px), not rounded rect corners */
.ap-win { flex: 1; min-height: 0; display: flex; flex-direction: column; position: relative; overflow: hidden;
  -webkit-mask: var(--hd-squircle-mask) left top / 24px 24px no-repeat, var(--hd-squircle-mask) right top / 24px 24px no-repeat, linear-gradient(#000 0 0) center top / calc(100% - 22px) 14px no-repeat, linear-gradient(#000 0 0) left 0 top 10px / 100% calc(100% - 10px) no-repeat;
  mask: var(--hd-squircle-mask) left top / 24px 24px no-repeat, var(--hd-squircle-mask) right top / 24px 24px no-repeat, linear-gradient(#000 0 0) center top / calc(100% - 22px) 14px no-repeat, linear-gradient(#000 0 0) left 0 top 10px / 100% calc(100% - 10px) no-repeat; }
.ap--light .ap-win { background: #DEE2E6; }
.ap-win.full { -webkit-mask: none; mask: none; }
.ap-body { flex: 1; min-height: 0; overflow: hidden; position: relative; }
/* status bar: 36px, black; indicators left, the time right (regular 22px) */
.n9-sb { flex: none; height: 36px; display: flex; align-items: center; gap: 10px; padding: 0 8px; background: #000; color: #E6E2E6; font: 400 22px/1 var(--hd-font-family-base); }
.n9-sb .bat { width: 30px; height: 17px; border: 2px solid currentColor; border-radius: 2px; position: relative; } .n9-sb .bat::before { content: ''; position: absolute; left: 2px; top: 2px; bottom: 2px; width: 20px; background: currentColor; }
.n9-sb .bat::after { content: ''; position: absolute; right: -5px; top: 3px; width: 3px; height: 7px; background: currentColor; }
.n9-sb .t { margin-left: auto; }
/* title bar: 70px colour, a darker line, a white highlight; light 32px */
.n9-title { flex: none; height: 72px; display: flex; align-items: center; padding: 0 17px 2px; font: 300 32px/1 var(--hd-font-family-light); color: #fff;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.12), inset 0 -1px 0 #fff; }
/* sheet header: grey, Cancel / Save as squircle-ended buttons (hd-sqf), 160 x 41 */
.n9-sheet { flex: none; height: 72px; display: flex; justify-content: space-between; align-items: center; padding: 0 17px 2px; background: #D3D1D3; box-shadow: inset 0 -2px 0 #BDBEBD, inset 0 -1px 0 #D5D6D5; }
.n9-pill { width: 160px; height: 41px; --hd-sqf-h: 41px; display: grid; place-items: center; font: 700 22px/1 var(--hd-font-family-base); }
.n9-pill--grey { --hd-sqf-edge: #A9A8AC; --hd-sqf-fill: linear-gradient(#FFFFFF, #ECECEE 50%, #DADADC); color: #111; }
.n9-pill--blue { --hd-sqf-edge: #6B9FD0; --hd-sqf-fill: linear-gradient(#9CC6EE, #7BB1E2 50%, #6AA2D8); color: #fff; } .n9-pill--blue.dim { opacity: .75; color: #E8F0F8; }
.n9-pill--orange { --hd-sqf-edge: #D86A08; --hd-sqf-fill: linear-gradient(#FCA244, #F58220 50%, #EE7308); color: #fff; }
/* toolbar: 72px, a shadow over it, a white highlight, light grey down to mid grey; 40px glyphs */
.n9-tb svg { stroke-width: 2.6; } .n9-tb { flex: none; height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 1px 22px 0; position: relative; color: #2A2A2A;
  background: linear-gradient(#FFFFFF 0 1px, #D8D8DD 1px, #C3C3C6 50%, #A9AAAD); }
.n9-tb::before { content: ''; position: absolute; left: 0; right: 0; top: -6px; height: 6px; background: linear-gradient(transparent, rgba(0,0,0,.3)); }
.n9-tb--dark { color: #fff; background: linear-gradient(#3A3A3A 0 1px, #232323 1px, #141414); }
.n9-tb--tabs { padding: 1px 0 0; } .n9-tb--tabs > span { flex: 1; height: 100%; display: grid; place-items: center; }
.n9-tb--tabs > span.on { background: linear-gradient(#FFFFFF 0 1px, #E6E3E6 1px, #D8D5D8); box-shadow: inset 1px 0 #D5D6DE, inset -1px 0 #D5D6DE; }
.n9-tb--dark.n9-tb--tabs > span { color: #8E8E8E; } .n9-tb--dark.n9-tb--tabs > span.on { color: #E8E8E8; background: linear-gradient(#3E3E3E 0 1px, #2C2C2C 1px, #222); box-shadow: none; }
/* search field: 44px, white, squircle ends, an inner shadow */
.n9-field { margin: 16px 16px; height: 44px; --hd-sqf-h: 44px; --hd-sqf-edge: #9EA0A3; --hd-sqf-fill: linear-gradient(rgba(0,0,0,.18), transparent 5px), #fff;
  display: flex; align-items: center; justify-content: space-between; padding: 0 12px 0 16px; color: #A0A0A0; font: 300 24px/1 var(--hd-font-family-light); }
.n9-field svg { color: #111; stroke-width: 3; }
/* group header: a line, the label at its right end (the fast scroll strip draws the letters in Contacts) */
.n9-group { display: flex; align-items: center; gap: 22px; height: 24px; margin: 15px 16px 9px; font: 700 17px/1 var(--hd-font-family-base); color: #8C8C8C; }
.n9-group::before { content: ''; flex: 1; height: 1px; background: #B8BABD; box-shadow: 0 1px #fff; }
.n9-group.fs { margin-right: 70px; }
.ap--dark .n9-group::before { background: #3A3A3A; box-shadow: none; }
.n9-row { display: flex; align-items: center; gap: 18px; height: 80px; padding: 0 16px; }
.n9-row > .t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.n9-row b { font: 600 26px/1.1 var(--hd-font-family-base); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.n9-row small { font: 400 21px/1.1 var(--hd-font-family-base); color: #6E6E6E; } .ap--dark .n9-row small { color: #A0A0A0; }
.n9-av { flex: none; width: 62px; height: 62px; display: grid; place-items: center; color: #fff; font: 600 30px/1 var(--hd-font-family-base); background: linear-gradient(#3C3C3C, #101010); }
.n9-chev { flex: none; width: 18px; height: 30px; }
/* phone */
.ph-head { flex: none; height: 216px; padding: 0 16px; background: linear-gradient(#222020, #1E1A1A 60%, #181414); color: #fff; box-shadow: inset 0 -1px #5A5D5A; }
.ph-sel { display: flex; justify-content: space-between; align-items: center; height: 64px; font: 300 32px/1 var(--hd-font-family-light); border-bottom: 2px solid #8A858A; }
.ph-sel svg { margin-right: 14px; }
.ph-num { display: flex; justify-content: flex-end; align-items: center; gap: 24px; height: 150px; padding-right: 2px; font: 300 84px/1 var(--hd-font-family-light); }
.ph-bs { width: 36px; height: 23px; background: #A5A3A5; color: #202020; display: grid; place-items: center; clip-path: polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%); font: 700 16px/1 sans-serif; padding-left: 8px; }
.ph-pad { flex: none; display: grid; grid-template-columns: repeat(3, 150px); justify-content: center; grid-auto-rows: 102px; padding-top: 26px; background: #D8D5D8; color: #202820; }
.ph-pad > span { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 14px; font: 700 60px/.75 var(--hd-font-family-base); }
.ph-pad small { margin-top: 9px; font: 400 18px/1 var(--hd-font-family-base); color: #4A4A4A; }
.ph-act { flex: 1; display: flex; align-items: center; justify-content: space-between; padding: 0 58px 8px 58px; background: #D8D5D8; }
.ph-call { width: 212px; height: 61px; --hd-sqf-h: 61px; --hd-sqf-edge: #4C8E22; --hd-sqf-fill: linear-gradient(#80C44E, #66B22C 50%, #55A321); display: grid; place-items: center; color: #fff; }
.ph-add { width: 62px; height: 62px; background: linear-gradient(#A4A5AB, #8E9397 50%, #85868A); display: grid; place-items: center; color: #F2F4F6; }
/* calculator: regular weight glyphs */
.ca-out { flex: none; display: flex; justify-content: flex-end; align-items: center; gap: 29px; height: 189px; padding: 30px 61px 0 0; font: 400 126px/1 var(--hd-font-family-base); color: #EE9508; }
.ca-bs { width: 46px; height: 28px; background: #7B797B; color: #000; display: grid; place-items: center; clip-path: polygon(28% 0, 100% 0, 100% 100%, 28% 100%, 0 50%); font: 700 18px/1 sans-serif; padding-left: 10px; }
.ca-line { flex: none; height: 2px; margin: 0 70px; background: #333233; }
.ca-keys { flex: 1; display: grid; grid-template-columns: repeat(3, 140px); justify-content: center; grid-template-rows: 94px 94px 25px 112px 112px 112px 112px; font: 500 66px/1 var(--hd-font-family-base); color: #fff; }
.ca-keys > span { display: grid; place-items: center; } .ca-keys .op { color: #D0CDD0; font-weight: 500; font-size: 64px; } .ca-keys .op:first-child { font-size: 72px; font-weight: 400; } .ca-keys .eq { color: #EE9508; font-weight: 700; } .ca-keys .gap { grid-column: 1 / -1; }
/* clock */
.cl-top { flex: none; height: 509px; background: #ECEFF0; position: relative; }
.cl-tz { position: absolute; top: 32px; left: 0; right: 0; text-align: center; font: 400 18px/1 var(--hd-font-family-base); color: #555; }
.cl-dial { position: absolute; left: 50px; top: 70px; width: 380px; height: 380px; }
.cl-date { position: absolute; left: 78px; top: 250px; font: 400 17px/1 var(--hd-font-family-base); color: #555; } .cl-date b { display: block; margin-top: 10px; font: 300 46px/1 var(--hd-font-family-light); color: #222; }
.cl-low { flex: 1; background: #E6E6E6; box-shadow: inset 0 3px 3px -1px #BFC4C8; }
.cl-head { display: flex; justify-content: space-between; align-items: center; height: 84px; padding: 4px 16px 0 17px; font: 300 36px/1 var(--hd-font-family-light); color: #222; }
.cl-plus { width: 42px; height: 42px; display: grid; place-items: center; background: linear-gradient(#FFFFFF, #E4E4E6); color: #111; }
.cl-plus-sh { filter: drop-shadow(0 1px 1px rgba(0,0,0,.4)); }
.cl-row { display: flex; align-items: center; gap: 16px; height: 110px; padding: 0 22px 0 16px; border-top: 1px solid #CFCFCF; box-shadow: inset 0 1px #fff; }
.cl-row.first { border-top: 0; box-shadow: none; }
.cl-row .t { flex: 1; display: flex; flex-direction: column; gap: 8px; } .cl-row b { font: 600 26px/1 var(--hd-font-family-base); } .cl-row small { font: 400 20px/1 var(--hd-font-family-base); color: #6E6E6E; }
/* N9 light switch: a wide squircle track (64 x 40, n = 3.6) with a white squircle knob */
.n9-sw { flex: none; width: 64px; height: 40px; display: block; }
/* alarm editor */
.al-field { margin: 10px 16px 0; height: 44px; --hd-sqf-h: 44px; --hd-sqf-edge: #A4A6A8; --hd-sqf-fill: linear-gradient(rgba(0,0,0,.14), transparent 5px), #fff; display: flex; align-items: center; padding: 0 14px; color: #9A9A9A; font: 300 22px/1 var(--hd-font-family-light); }
.al-time { margin-top: 20px; text-align: center; font: 300 62px/1 var(--hd-font-family-light); color: #222; }
.al-wheel { position: relative; margin: 26px auto 0; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle at 50% 40%, #E6E6E6, #CFCFD0 70%, #BDBDBF); box-shadow: inset 0 0 0 1px #A9A9AB, inset 0 0 0 3px #FFFFFF, 0 2px 4px rgba(0,0,0,.2); display: grid; place-items: center; }
.al-wheel::before { content: ''; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle at 50% 35%, #2C2C2C, #141414); box-shadow: 0 0 0 2px #fff; }
.al-knob { position: absolute; width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center; font: 300 30px/1 var(--hd-font-family-light); }
.al-more { position: absolute; left: 0; right: 0; bottom: 110px; display: flex; justify-content: space-between; align-items: center; padding: 0 22px 0 16px; font: 600 26px/1 var(--hd-font-family-base); color: #222; }
/* contact editor */
.ce-img { display: flex; align-items: center; gap: 18px; height: 88px; margin: 11px 16px 0; padding-bottom: 6px; border-bottom: 1px solid #fff; box-shadow: 0 -1px #C8C8CC inset; font: 300 26px/1 var(--hd-font-family-light); color: #444; }
.ce-ph { flex: none; width: 78px; height: 78px; display: grid; place-items: center; background: linear-gradient(#DADADC, #C3C4C6); color: #111; }
.ce-f { position: relative; display: flex; gap: 8px; align-items: baseline; height: 60px; padding: 18px 16px 0; font: 300 26px/1 var(--hd-font-family-light); color: #333; }
.ce-f u { text-underline-offset: 4px; } .ce-f i { font-style: normal; color: #3F8FD6; } .ce-f.focus { color: #3F8FD6; } .ce-f.focus i { color: #B0B0B0; }
.ce-f.focus i::before { content: ''; display: inline-block; width: 2px; height: 30px; margin: 0 4px -5px 0; background: #111; }
.ce-f.focus::before { content: ''; position: absolute; left: 0; top: 23px; border: 8px solid transparent; border-left: 9px solid #111; }
.ce-more { display: grid; place-items: center; height: 40px; margin: 22px 0 0; border-bottom: 1px solid #B8BABD; box-shadow: 0 1px #fff; }
.ce-more span { width: 56px; height: 22px; --hd-sqf-h: 22px; --hd-sqf-edge: #A9A8AC; --hd-sqf-fill: linear-gradient(#FFFFFF, #E4E4E6); display: grid; place-items: center; font-size: 13px; margin-bottom: -10px; }
/* calendar */
.cg-bar { flex: none; height: 40px; display: flex; align-items: center; justify-content: flex-end; padding: 0 17px; font: 600 18px/1 var(--hd-font-family-base); }
.cg-bar.today { background: #EE5500; color: #fff; } .cg-bar.next { background: #D3D4D6; color: #222; }
.cg-none { flex: none; height: 102px; padding: 18px 17px 0; font: 600 23px/1 var(--hd-font-family-base); color: #A3A6A9; }
.cg-ev { position: relative; padding: 12px 17px 18px; } .cg-ev b { display: block; font: 600 24px/1.2 var(--hd-font-family-base); color: #222; }
.cg-ev span { display: block; margin-top: 4px; font: 400 20px/1.25 var(--hd-font-family-base); color: #222; } .cg-ev span + span { color: #6E6E6E; margin-top: 2px; }
.cg-ev i { position: absolute; right: 17px; top: 16px; width: 7px; height: 20px; background: #FFD630; }
.cm { flex: none; height: 456px; background: radial-gradient(ellipse at 50% 0, #F4F4F4, #E6E6E6 80%); box-shadow: 0 2px 0 #fff, 0 3px 6px rgba(0,0,0,.2); position: relative; z-index: 1; }
.cm-h { display: flex; justify-content: space-between; align-items: center; height: 68px; padding: 4px 30px 0; font: 300 34px/1 var(--hd-font-family-light); color: #222; }
.cm-h i { width: 0; height: 0; border: 9px solid transparent; } .cm-h i.l { border-right: 18px solid #EE5500; border-left: 0; } .cm-h i.r { border-left: 18px solid #EE5500; border-right: 0; }
.cm-g { display: grid; grid-template-columns: repeat(7, 66px); grid-template-rows: 30px; grid-auto-rows: 59px; padding: 0 0 0 4px; text-align: center; }
.cm-g .d { height: 24px; font: 600 16px/1 var(--hd-font-family-base); color: #666; } .cm-g .we { color: #EE5500; }
.cm-g span { position: relative; display: grid; place-items: center; font: 400 25px/1 var(--hd-font-family-base); color: #222; } .cm-g .o { color: #A0A0A0; }
.cm-g span.dot::after { content: ''; position: absolute; left: 50%; bottom: 7px; width: 6px; height: 6px; margin-left: -3px; border-radius: 50%; background: #8C8C8C; }
.cm-g .t > em { width: 50px; height: 50px; display: grid; place-items: center; font-style: normal; font-weight: 600; color: #fff; background: linear-gradient(#F79A55, #EC6A1C 50%, #E25A0C); }
.cm-g .t > em.ring { filter: drop-shadow(0 0 1px #9A6A4A); }
.cm-none { padding-top: 140px; text-align: center; font: 300 30px/1 var(--hd-font-family-light); color: #8C8C8C; }
.cw-h { flex: none; height: 28px; display: grid; place-items: center; background: linear-gradient(#3A393A, #2A292A); color: #E6E6E6; font: 600 17px/1 var(--hd-font-family-base); }
.cw-day { flex: none; display: flex; height: 44px; border-top: 2px solid #EE5500; }
.cw-day::before { content: ''; width: 68px; background: linear-gradient(#FFFFFF, #E8E8E8); }
.cw-day span { flex: 1; display: flex; align-items: center; padding: 0 12px; background: linear-gradient(#F26A1A, #E85400); color: #fff; font: 300 26px/1 var(--hd-font-family-light); }
.cw-rows { border-top: 1px solid #838183; }
.cw-row { display: flex; height: 69px; background: #F4F4F4; } .cw-row:nth-child(odd) { background: #EEEAEE; }
.cw-row > span { width: 68px; padding: 12px 0 0 8px; font: 300 20px/1 var(--hd-font-family-light); color: #333; border-right: 1px solid #A8A8A8; }
.cw-row > i { flex: 1; font-style: normal; }
.cw-row.now { background: #E6E1D6; } .cw-row.now > span { background: #F6EAE2; box-shadow: inset 4px 0 #F28A1C; }
.cw-row > i.ev { margin: 3px 6px 3px 3px; background: linear-gradient(#3D8AE0, #2A76D0); color: #fff; font: 600 20px/1 var(--hd-font-family-base); padding: 9px 10px; }
/* the N9 object menu: the page dims, a light panel with squircle corners rises above where the toolbar was */
.n9-dim { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 40%, rgba(0,0,0,.28), rgba(0,0,0,.5)); z-index: 4; }
.n9-menu { position: absolute; left: 17px; right: 17px; bottom: 18px; z-index: 5; filter: drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
.n9-menu > div { --hd-sqf-h: 48px; --hd-sqf-edge: #B9B6BC; --hd-sqf-fill: linear-gradient(#FBF8FC, #F1EEF2); color: #222; }
.n9-menu p { margin: 0; display: flex; align-items: center; justify-content: space-between; height: 80px; padding: 0 22px; font: 600 25px/1 var(--hd-font-family-base); border-top: 1px solid #DCD8DE; }
.n9-menu p:first-child { border-top: 0; } .n9-menu p small { display: block; margin-top: 8px; font: 400 20px/1 var(--hd-font-family-base); color: #666; }
/* gallery, music */
.ga-grid { display: grid; grid-template-columns: repeat(3, 159px); justify-content: space-between; grid-auto-rows: 159px; row-gap: 1.5px; }
.ga-grid i { display: block; position: relative; } .ga-grid i small { position: absolute; left: 0; right: 0; bottom: 0; height: 30px; padding: 6px 8px 0; text-align: right; background: rgba(0,0,0,.55); font: 400 18px/1 var(--hd-font-family-base); font-style: normal; color: #fff; }
.ga-tb { position: absolute; left: 0; right: 0; bottom: 0; }
.ga-info { position: absolute; left: 0; right: 0; top: 0; padding: 14px 16px 16px; background: rgba(20,20,20,.82); }
.ga-info b { font: 600 26px/1.2 var(--hd-font-family-base); } .ga-info div { display: flex; justify-content: space-between; margin-top: 8px; font: 400 20px/1 var(--hd-font-family-base); color: #CCC; }
.mu-wall { display: grid; grid-template-columns: repeat(3, 156px); grid-auto-rows: 156px; gap: 6px; }
.mu-wall .big { grid-column: span 2; grid-row: span 2; }
.cv { position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-start; padding: 6px 6px; font: 800 26px/1.12 var(--hd-font-family-base); text-transform: uppercase; letter-spacing: -.01em; word-break: break-all; }
.cv::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 35% 20%, rgba(255,255,255,.16), transparent 55%), radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.45)); }
.cv.big { font-size: 46px; padding: 8px 10px; }
.cv .ghost { opacity: .3; }
.mu-play { position: absolute; left: 6px; right: 6px; bottom: 6px; z-index: 1; height: 26px; --hd-sqf-h: 26px; --hd-sqf-edge: #E254C8; --hd-sqf-fill: linear-gradient(#D21FB4, #B4009A); display: flex; align-items: center; gap: 14px; padding: 0 12px; color: #fff; font: 600 17px/1 var(--hd-font-family-base); text-transform: none; letter-spacing: 0; }
.mu-play::before { content: ''; border: 8px solid transparent; border-left: 13px solid #fff; border-right: 0; }
.mu-rows { background: radial-gradient(ellipse at 40% 30%, #2C2C2C, #0A0A0A 75%); }
.mu-row { display: flex; justify-content: space-between; align-items: center; height: 73px; padding: 0 22px 0 17px; font: 600 25px/1 var(--hd-font-family-base); color: #fff; }
.mu-now { padding: 14px 17px 0; } .mu-now b { display: flex; justify-content: space-between; font: 600 21px/1.1 var(--hd-font-family-base); } .mu-now b span { font-weight: 400; color: #A8A8A8; }
.mu-now p { position: relative; margin: 12px 0 0; font: 300 21px/1.55 var(--hd-font-family-light); color: #B0B0B0; }
.mu-now p i { position: absolute; right: 0; top: 2px; width: 32px; height: 32px; display: grid; place-items: center; background: #EDEDED; color: #111; font: 900 18px/1 sans-serif; font-style: normal; letter-spacing: 1px; }
.mu-ctl { display: flex; justify-content: space-between; align-items: center; padding: 14px 30px 0; color: #C8C8C8; }
.mu-prog { margin: 28px 28px 0; height: 8px; background: #2E2E2E; box-shadow: inset 0 1px #1A1A1A; position: relative; }
.mu-prog::before { content: ''; position: absolute; left: 0; top: 0; height: 8px; width: 37%; background: linear-gradient(#D61BB8, #B4009A); }
.mu-prog::after { content: ''; position: absolute; left: 37%; top: 2px; width: 4px; height: 4px; margin-left: -4px; background: #fff; }
.mu-back { width: 56px; height: 56px; display: grid; place-items: center; background: linear-gradient(#4A4A4A, #262626); box-shadow: inset 0 0 0 2px #6A6A6A; }
.mu-t { display: flex; justify-content: space-between; padding: 10px 28px; font: 300 21px/1 var(--hd-font-family-light); color: #C8C8C8; }
/* browser */
.br-top { flex: none; height: 72px; padding-top: 12px; background: linear-gradient(#F2EFF2, #E6E3E6); border-bottom: 1px solid #D0D0D0; }
.br-top .n9-field { margin: 0 15px; height: 48px; --hd-sqf-h: 48px; font-size: 22px; }
.br-label { display: flex; align-items: center; gap: 16px; height: 40px; padding: 0 17px; background: #EEEFF0; font: 600 17px/1 var(--hd-font-family-base); color: #222; } .br-label::before { content: ''; flex: 1; height: 1px; background: #C2C2C2; box-shadow: 0 1px #fff; }
.br-site { height: 87px; display: flex; align-items: center; gap: .26em; padding: 0 30px; border-bottom: 1px solid #ECECEC; background: #fff; font: 300 46px/1 var(--hd-font-family-light); color: #111; white-space: nowrap; overflow: hidden; }
.br-site b { font-weight: 700; font-family: var(--hd-font-family-base); color: #1A3D8F; }
.br-hist { display: flex; align-items: center; gap: 22px; height: 80px; padding: 0 17px 0 22px; background: #EEEFF0; } .br-hist .t { min-width: 0; } .br-hist b { display: block; font: 600 25px/1.2 var(--hd-font-family-base); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.br-hist small { display: block; margin-top: 4px; font: 400 19px/1.2 var(--hd-font-family-base); color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.br-glb { flex: none; width: 50px; height: 50px; display: grid; place-items: center; background: linear-gradient(#FFFFFF, #DCDCDE); color: #333; }
/* documents */
.ap-win.dc { background: #EEF0F1; }
.dc-ic { flex: none; width: 62px; height: 62px; display: grid; place-items: center; background: linear-gradient(#E4E4E6, #CDCDD0); }
.dc-size { flex: none; align-self: flex-end; padding-bottom: 14px; font: 400 21px/1 var(--hd-font-family-base); color: #666; }
/* settings (black, N9 look; the ROM's entries) */
.st-h { flex: none; margin: 0 16px; padding: 16px 0 14px; font: 300 32px/1 var(--hd-font-family-light); color: #fff; border-bottom: 1px solid #5A5A5A; }
.st-row { display: flex; align-items: center; gap: 18px; height: 80px; padding: 0 22px 0 16px; color: #fff; font: 600 26px/1 var(--hd-font-family-base); }
.st-row > .n { flex: 1; min-width: 0; }
.st-row.ic { padding-left: 16px; }
.st-ic { flex: none; width: 62px; height: 62px; display: grid; place-items: center; background: linear-gradient(#3A3A3A, #262626); color: #fff; }
.st-i { flex: none; width: 30px; height: 30px; display: grid; place-items: center; background: #3A3A3A; color: #fff; font: 700 20px/1 serif; }
.st-rule { margin: 0 16px; height: 1px; background: #5A5A5A; }
.st-br { padding: 12px 16px 20px; } .st-br b { font: 600 26px/1 var(--hd-font-family-base); color: #fff; }
.st-sl { display: flex; align-items: center; gap: 26px; margin-top: 28px; color: #fff; }
.st-track { flex: 1; height: 8px; position: relative; background: #2A2A2A; box-shadow: inset 0 1px #111; }
.st-track::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 52%; background: linear-gradient(#3A92E6, #1F72CC); }
.st-knob { position: absolute; left: 52%; top: 50%; width: 42px; height: 42px; margin: -21px 0 0 -21px; background: linear-gradient(#FFFFFF, #DADADA); }
/* toolbar glyphs are filled and embossed, as the N9 drew them: dark with a white lip on the light bar, light with a dark lip on the dark one */
.n9-tb:not(.n9-tb--dark) svg { filter: drop-shadow(0 1.5px 0 rgba(255,255,255,.9)); }
.n9-tb--dark svg { filter: drop-shadow(0 -1px 0 rgba(0,0,0,.7)); }
/* contact editor keyboard: the N9 portrait keyboard is 320px, not HdKeyboard's 360 (story-local) */
.ce-kb .hd-kb.hd-kb { height: 213.333px; }
/* FM radio (no N9 app: the port's dark media look, N9 blue #00A5E5) */
.fm-freq { margin-top: 44px; text-align: center; font: 200 150px/1 var(--hd-font-family-light); color: #fff; letter-spacing: -.02em; }
.fm-freq small { font: 300 34px/1 var(--hd-font-family-light); color: #8C8C8C; margin-left: 8px; letter-spacing: 0; }
.fm-name { margin-top: 14px; text-align: center; font: 600 26px/1 var(--hd-font-family-base); color: #00A5E5; } .fm-rds { margin-top: 10px; text-align: center; font: 400 20px/1 var(--hd-font-family-base); color: #8C8C8C; }
.fm-dial { position: relative; height: 80px; margin: 36px 0 0; background: repeating-linear-gradient(90deg, #6A6A6A 0 2px, transparent 2px 96px) -1px 30px / 100% 34px no-repeat, repeating-linear-gradient(90deg, #3A3A3A 0 1px, transparent 1px 9.6px) 0 44px / 100% 20px no-repeat; }
.fm-dial span { position: absolute; top: 4px; font: 400 18px/1 var(--hd-font-family-base); color: #8C8C8C; transform: translateX(-50%); }
.fm-dial::after { content: ''; position: absolute; left: 50%; top: 26px; bottom: 6px; width: 4px; margin-left: -2px; background: #00A5E5; box-shadow: 0 0 8px rgba(0,165,229,.7); }
.fm-ctl { display: flex; justify-content: center; gap: 22px; margin-top: 30px; }
.fm-btn { width: 96px; height: 96px; display: grid; place-items: center; color: #fff; background: linear-gradient(#3A3A3A, #2A2A2A); box-shadow: inset 0 1px #5A5A5A; }
.fm-btn.on { color: #00A5E5; }
.fm-fav { display: flex; gap: 12px; padding: 0 16px; margin-top: 8px; }
.fm-fav span { flex: 1; height: 74px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 6px; background: linear-gradient(#2E2E2E, #1E1E1E); box-shadow: inset 0 1px #4A4A4A; font: 300 28px/1 var(--hd-font-family-light); color: #fff; }
.fm-fav span small { font: 400 16px/1 var(--hd-font-family-base); color: #8C8C8C; } .fm-fav span.on { color: #00A5E5; }
/* recorder (light, the ROM's static palette) */
.ap-win.rc { background: #E9E9E9; }
.rc-state { margin-top: 60px; text-align: center; font: 300 30px/1 var(--hd-font-family-light); color: #8C8C8C; }
.rc-time { margin-top: 18px; text-align: center; font: 200 110px/1 var(--hd-font-family-light); color: #191919; }
.rc-wave { display: flex; align-items: center; justify-content: center; gap: 4px; height: 150px; margin: 34px 16px 0; border-top: 1px solid #D6D6D6; border-bottom: 1px solid #D6D6D6; box-shadow: 0 1px #fff, inset 0 1px #fff; }
.rc-wave i { width: 5px; background: #00A5E5; }
.rc-ctl { display: flex; justify-content: center; align-items: center; gap: 46px; margin-top: 58px; }
.rc-rec { width: 120px; height: 120px; display: grid; place-items: center; background: linear-gradient(#E4504C, #D42D2A 55%, #BC2220); box-shadow: inset 0 1px rgba(255,255,255,.45), 0 2px 4px rgba(0,0,0,.25); }
.rc-sm { width: 76px; height: 76px; display: grid; place-items: center; color: #00A5E5; background: linear-gradient(#FFFFFF, #E4E4E6); box-shadow: inset 0 0 0 1px #C3C3C6, 0 1px 2px rgba(0,0,0,.2); }
/* AudioFX (black, N9 blue accent, #2A2A2A controls) */
.fx-head { display: flex; justify-content: space-between; align-items: center; height: 84px; margin: 0 16px; border-bottom: 1px solid #3A3A3A; font: 300 32px/1 var(--hd-font-family-light); color: #fff; }
.fx-dev { display: flex; justify-content: space-between; align-items: center; height: 72px; margin: 14px 16px 0; padding: 0 16px; background: #2A2A2A; font: 600 24px/1 var(--hd-font-family-base); color: #fff; }
.fx-dev small { color: #8C8C8C; font-weight: 400; font-size: 20px; }
.fx-pre { display: flex; justify-content: space-between; align-items: center; height: 60px; margin: 18px 16px 0; font: 600 22px/1 var(--hd-font-family-base); color: #8C8C8C; } .fx-pre b { font: 300 30px/1 var(--hd-font-family-light); color: #fff; }
.fx-eq { position: relative; display: flex; justify-content: space-around; height: 250px; margin: 6px 16px 0; padding: 0 6px; background: repeating-linear-gradient(#1A1A1A 0 1px, transparent 1px 50px); border-top: 1px solid #1A1A1A; }
.fx-eq > span { position: relative; width: 56px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.fx-eq > span i { width: 46px; background: linear-gradient(rgba(0,165,229,.95), rgba(0,165,229,.55)); box-shadow: inset 0 3px #6CCEF4; }
.fx-eq > span small { position: absolute; bottom: -30px; font: 400 17px/1 var(--hd-font-family-base); color: #8C8C8C; }
.fx-knobs { display: flex; justify-content: space-around; margin-top: 58px; }
.fx-knob { display: flex; flex-direction: column; align-items: center; gap: 10px; font: 400 19px/1 var(--hd-font-family-base); color: #C8C8C8; }
/* permission prompt (packages_modules_Permission: a 90% black backdrop, a lit green squircle, stacked 280dp N9 buttons) */
.pm { position: absolute; inset: 0; z-index: 5; background: rgba(0,0,0,.9); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 30px; text-align: center; }
.pm-ic { width: 118px; height: 118px; display: grid; place-items: center; color: #fff; background: linear-gradient(#9BDB1C, #3A9A00); }
.pm h2 { margin: 22px 0 0; font: 300 35px/1.25 var(--hd-font-family-light); color: #fff; }
.pm-btns { display: flex; flex-direction: column; gap: 19px; margin-top: 38px; }
.pm-b { width: 374px; height: 70px; --hd-sqf-h: 70px; --hd-sqf-edge: #4A4A4C; --hd-sqf-fill: linear-gradient(#3A3A3C, #232325 50%, #1A1A1C); display: grid; place-items: center; font: 700 24px/1 var(--hd-font-family-base); color: #fff; }
.pm-b.allow { --hd-sqf-edge: #2E64C0; --hd-sqf-fill: linear-gradient(#5AA0FF, #3A7BE0); }
/* Files (DocumentsUI): opens on Documents, every document on the phone */
.ap-win.fl { background: #F4F4F4; }
.fl-title { flex: none; height: 72px; display: flex; align-items: center; padding: 0 17px 2px; background: #F26F17; color: #fff; font: 300 32px/1 var(--hd-font-family-light); }
.fl-pill { margin: 14px 16px 6px; height: 46px; display: flex; align-items: center; gap: 12px; padding: 0 16px; border-radius: 23px; background: #E6E6E6; border: 1px solid #D6D6D6; font: 300 22px/1 var(--hd-font-family-light); color: #8C8C8C; }
.fl-row { display: flex; align-items: center; gap: 18px; height: 88px; padding: 0 16px; border-bottom: 1px solid #D6D6D6; box-shadow: 0 1px #fff; }
.fl-row .t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; } .fl-row b { font: 600 25px/1.1 var(--hd-font-family-base); color: #191919; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .fl-row small { font: 400 19px/1 var(--hd-font-family-base); color: #8C8C8C; }
.fl-ic { flex: none; width: 64px; height: 64px; display: grid; place-items: center; background: #fff; box-shadow: inset 0 0 0 1px #D6D6D6; }
</component>`;

/* ---- glyphs ---- */
export const ico = (name: string, size = 32) => `<HdIcon name="${name}" :size="${size}" />`;
/** The N9 list chevron: bold, 18 x 30. */
export const chev = (c = 'currentColor') => `<svg class="n9-chev" viewBox="0 0 18 30" aria-hidden="true"><path d="M4 4 14 15 4 26" fill="none" stroke="${c}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
/** The N9 on/off switch: a wide squircle track (n = 3.6) and a squircle knob; dark for black pages. */
const sw = (dark = false) => `<svg class="n9-sw" viewBox="0 0 64 40" aria-hidden="true"><defs><linearGradient id="swk${dark ? 'd' : 'l'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6E6E8"/></linearGradient></defs>
  <path d="${squircleRectPath(64, 40, 3.6)}" fill="${dark ? '#2C2C2C' : '#C9D0D4'}" stroke="${dark ? '#4A4A4A' : '#A9B0B4'}" stroke-width="1"/>
  <path d="${squircleRectPath(32, 32, 2.8, 4, 4)}" fill="url(#swk${dark ? 'd' : 'l'})"/></svg>`;
/** N9 dark-tile toolbar glyphs (Calendar's tabs): a dark squircle with a white pattern. */
const tile = (inner: string) => `<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="${sq(30, 30, 2, 2)}" fill="#2E2E2E"/>${inner}</svg>`;
const G = {
  month: tile([0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => `<rect x="${8 + c * 7}" y="${8 + r * 7}" width="4" height="4" fill="#fff"/>`)).join('')),
  week: tile([0, 1, 2].map((c) => `<rect x="${9 + c * 6}" y="8" width="3" height="18" fill="#fff"/>`).join('')),
  agenda: tile([0, 1, 2].map((r) => `<rect x="8" y="${9 + r * 6}" width="3" height="3" fill="#fff"/><rect x="13" y="${9 + r * 6}" width="13" height="3" fill="#fff"/>`).join('')),
  add: '<svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 4v28M4 18h28" stroke="currentColor" stroke-width="5"/></svg>',
  menu: '<svg width="34" height="30" viewBox="0 0 34 30" aria-hidden="true"><path d="M3 5h28M3 15h28M3 25h28" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
  dial: `<svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">${[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => `<rect x="${3 + c * 9}" y="${2 + r * 8}" width="6" height="5" rx="1" fill="currentColor"/>`)).join('')}<rect x="12" y="26" width="6" height="5" rx="1" fill="currentColor"/></svg>`,
  log: '<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M10 30V6M3 13l7-8 7 8M24 4v24M17 21l7 8 7-8" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linejoin="round"/></svg>',
  person: '<svg width="32" height="34" viewBox="0 0 32 34" aria-hidden="true"><circle cx="16" cy="10" r="7.5" fill="currentColor"/><path d="M2 33c0-9 6-13 14-13s14 4 14 13z" fill="currentColor"/></svg>',
  updown: '<svg width="20" height="26" viewBox="0 0 20 26" aria-hidden="true"><path d="M10 1 18 10H2zM10 25 2 16h16z" fill="#fff"/></svg>',
  sun: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 1v4M13 21v4M1 13h4M21 13h4M4.5 4.5l3 3M18.5 18.5l3 3M4.5 21.5l3-3M18.5 7.5l3-3" stroke="currentColor" stroke-width="2"/></svg>',
  prev: '<svg width="32" height="26" viewBox="0 0 32 26" aria-hidden="true"><rect x="2" y="2" width="5" height="22" fill="currentColor"/><path d="M30 2v22L8 13z" fill="currentColor"/></svg>',
  pause: '<svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true"><rect x="2" y="1" width="6" height="24" fill="currentColor"/><rect x="14" y="1" width="6" height="24" fill="currentColor"/></svg>',
  shuffle: '<svg width="34" height="28" viewBox="0 0 34 28" aria-hidden="true"><path d="M2 7h7c8 0 8 14 16 14h5M2 21h7c3 0 4.5-2 6-4.5M19 10.5C20.5 8.5 22 7 25 7h5M26 2l5 5-5 5M26 16l5 5-5 5" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
  bag: '<svg width="26" height="34" viewBox="0 0 26 34" aria-hidden="true"><path d="M8 9V6a5 5 0 0 1 10 0v3" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M1 9h24v24H1z" fill="#fff"/><path d="M15 15v10.5a3 3 0 1 1-2-2.8V15h5v3h-3" fill="#111"/></svg>',
};

/** A filled five-point star path, centred in a w x w box. */
const starPath = (w: number) => { const c = w / 2; return Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? c * 0.42 : c * 0.98; const a = -Math.PI / 2 + i * Math.PI / 5; return `${i ? 'L' : 'M'}${(c + r * Math.cos(a)).toFixed(1)} ${(c + 1 + r * Math.sin(a)).toFixed(1)}`; }).join('') + 'z'; };
/** Filled N9 toolbar glyphs (currentColor): the N9 drew every toolbar glyph as a solid shape, never a thin outline. */
const F = {
  star: `<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="${starPath(34)}" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  pictures: '<svg width="38" height="32" viewBox="0 0 38 32" aria-hidden="true"><path fill-rule="evenodd" fill="currentColor" d="M1 3h36v26H1zM5 25h28l-9-11-6 7-4-4zM11 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>',
  share: '<svg width="32" height="34" viewBox="0 0 32 34" aria-hidden="true"><path fill="currentColor" d="M16 1 26 11h-6.5v12h-7V11H6zM2 19h6v8h16v-8h6v14H2z"/></svg>',
  delete: '<svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true"><path fill="currentColor" d="M10 1h10v3h9v5H1V4h9zM3 11h24l-2 22H5z"/></svg>',
  back: '<svg width="36" height="32" viewBox="0 0 36 32" aria-hidden="true"><path fill="currentColor" d="M1 16 16 1v9h19v12H16v9z"/></svg>',
  list: '<svg width="34" height="30" viewBox="0 0 34 30" aria-hidden="true"><path fill="currentColor" d="M1 2h6v6H1zM11 2h22v6H11zM1 12h6v6H1zM11 12h22v6H11zM1 22h6v6H1zM11 22h22v6H11z"/></svg>',
  grid: '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M1 1h13v13H1zM18 1h13v13H18zM1 18h13v13H1zM18 18h13v13H18z"/></svg>',
  search: '<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="5"/><path d="M21 21l10 10" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>',
  folder: '<svg width="38" height="32" viewBox="0 0 38 32" aria-hidden="true"><path fill="currentColor" d="M1 3h13l4 4h19v24H1z"/></svg>',
  newFolder: '<svg width="38" height="32" viewBox="0 0 38 32" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M1 3h13l4 4h19v24H1zM17 12v5h-5v4h5v5h4v-5h5v-4h-5v-5z"/></svg>',
  sort: '<svg width="34" height="32" viewBox="0 0 34 32" aria-hidden="true"><path fill="currentColor" d="M8 1l8 9h-5.5v21h-5V10H0zM26 31l8-9h-5.5V1h-5v21H18z"/></svg>',
  mic: '<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><rect x="7" y="1" width="14" height="22" rx="7" fill="currentColor"/><path d="M2 16c0 7 5 12 12 12s12-5 12-12" fill="none" stroke="currentColor" stroke-width="3.5"/><path fill="currentColor" d="M12 27h4v6h6v3H6v-3h6z"/></svg>',
  record: '<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="14" fill="currentColor"/></svg>',
  speaker: '<svg width="36" height="32" viewBox="0 0 36 32" aria-hidden="true"><path fill="currentColor" d="M1 10h7l10-9v30L8 22H1z"/><path d="M23 9c3 4 3 10 0 14M28 5c5 6 5 16 0 22" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>',
  power: '<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><path d="M13 9a14 14 0 1 0 14 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M20 3v17" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
  location: '<svg width="28" height="34" viewBox="0 0 28 34" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M14 33C5 22 1 16 1 13a13 13 0 0 1 26 0c0 3-4 9-13 20zM14 8a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>',
  camera: '<svg width="36" height="32" viewBox="0 0 34 32" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M1 8h7l3-5h12l3 5h7v22H1zM17 11a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z"/></svg>',
  stop: '<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="5" width="30" height="30" rx="5" fill="currentColor"/></svg>',
};

/* ---- shells ---- */
export const SB = `<div class="n9-sb"><span class="bat"></span><HdIcon name="wifi" :size="22" /><span class="t">18:21</span></div>`;
/** A screen: the status bar, then the window (squircle top corners). */
export const app = (inner: string, cls = 'ap--light', statusBar = true, win = '') => `${CSS}<div class="ap hd-squircle-free ${cls}">${statusBar ? SB : ''}<div class="ap-win ${statusBar ? '' : 'full'} ${win}">${inner}</div></div>`;
const COVERS = [
  { bg: 'linear-gradient(160deg,#141414,#2A0E2A)', fg: '#7A2BC0', t: 'Unknown album <span class="ghost">unknown album unknown</span>' },
  { bg: 'linear-gradient(135deg,#F5E8C8,#DCC9A0)', fg: '#2F5C83', t: 'Coastal <span class="ghost" style="opacity:.5">lines</span>' },
  { bg: 'linear-gradient(135deg,#9FCB3A,#4E7A1C)', fg: '#E8F5C8', t: '<span style="font-size:60px;line-height:1">&#x2227;&#x2227;</span>' },
  { bg: 'radial-gradient(circle at 50% 45%,#5A2A10,#140A06 70%)', fg: '#F2A23A', t: 'Northern <br>rocks' },
  { bg: 'linear-gradient(135deg,#F7C6E0,#E04A9A)', fg: '#fff', t: '<span style="margin-top:auto;font-size:20px">Call on me</span>' },
  { bg: 'linear-gradient(135deg,#F4EC2A,#E2D20C)', fg: '#B0186A', t: '<span style="font-size:18px;color:#111">The five</span>' },
  { bg: 'linear-gradient(135deg,#E9DCC4,#B49A70)', fg: '#5A3A1A', t: '<span style="font-size:18px">Land of</span>' },
  { bg: 'linear-gradient(160deg,#4A4A4A,#111)', fg: '#DDD', t: '<span style="margin-top:auto;font-size:18px">Live</span>' },
];
const cover = (i: number, cls = '') => `<i class="cv ${cls}" style="background:${COVERS[i].bg};color:${COVERS[i].fg};font-style:normal">${COVERS[i].t}</i>`;
const PIC = ['#8A5A3A,#C9A57E', '#2F5C83,#9CC3DF', '#D6B07A,#7D4F2C', '#4E6B3C,#A9C27A', '#C9C1B8,#7C6F66', '#B03A48,#E8A0A6', '#3C4A63,#9EB0CC', '#DCCB9E,#8B7A4F', '#2B2B2B,#8D8D8D'];
/** A sample picture: a soft scene (sky, a horizon, ground) rather than a flat gradient. */
export const pic = (i: number) => { const [a, b] = PIC[i % PIC.length].split(','); return `radial-gradient(ellipse at ${20 + (i * 37) % 60}% ${30 + (i * 23) % 30}%, rgba(255,255,255,.35), transparent 45%), linear-gradient(${150 + (i * 29) % 60}deg, ${a} 0 55%, ${b} 56%)`; };
/** A squircle (n = 2.8), the N9's shape for avatars, buttons and tiles. */
export const SQ = 'hd-squircle';
export const toolbar = (left: string, right: string, dark = false) => `<div class="n9-tb${dark ? ' n9-tb--dark' : ''}"><span>${left}</span><span>${right}</span></div>`;
export const tabs = (icons: string[], on: number, dark = false) => `<div class="n9-tb n9-tb--tabs${dark ? ' n9-tb--dark' : ''}">${icons.map((ic, i) => `<span class="${i === on ? 'on' : ''}">${ic.startsWith('<') ? ic : `<HdIcon name="${ic}" :size="40" />`}</span>`).join('')}</div>`;
const CAL_TABS = [G.add, G.month, G.week, G.agenda, G.menu];

/* ---- screens ---- */
export const DOCS = {
  phone: 'A **dark header** 216px under the window\'s squircle corners: the call type ("Mobile call" with ▲▼, an N9 selection dialog of the call services, light 32px over a 2px rule) and the number in large light type with ⌫. Then the pad on #D8D5D8: **no key boxes**, bold 60px digits with 18px letters close under them, 3 columns of 150px, rows 102px apart. A wide green **call button** (212 × 61, squircle ends) and a 62px contact-add squircle. The toolbar is three **tabs**: Call log, Dial pad (the lighter cell), Contacts.',
  contacts: 'A **blue title bar** (#1085D5, 72px, light 32px title), a 44px search field (squircle ends), then the alphabet as **group headers**: a line that stops at the fast scroll strip, whose letters sit at the right edge (HdFastScroll at rest). Each row 80px: a 62px squircle picture (initials of the first and last name when there is none) and the name, semibold 26px. The strip turns into the grey bar only while the list moves. Toolbar: **+** (new contact) and the menu.',
  contactEditor: 'Editors are **sheets**: Cancel (grey) and Save (blue, pale until something changed), squircle-ended 160 × 41, on a grey 72px header: the one place N9 puts buttons up there, because a sheet is a separate task with its own frame. A 78px picture squircle with "Add image", a rule, then fields as **label: value** lines 60px apart, light 26px: the focused one blue with a ▸ at the left edge and the cursor, phone and email labels underlined, empty values a blue hint. A small ▾ button shows more fields. No toolbar (the N9 keyboard takes the bottom).',
  calculator: 'Full screen, black, no status bar. The result in **orange** (#EE9508), 126px, right-aligned with a grey ⌫ tag beside it, over a 2px rule inset 70px. Keys are **bare glyphs, no boxes**, regular weight: C ÷ ×, ± − + in light grey on two 94px rows, a 25px gap, then the digits in white on 112px rows, **=** bold orange. Nothing else: no scientific panel, no menu, no toolbar.',
  clock: 'One page. The top 509px (#ECEFF0) holds the **analogue clock**, 380px: a matt grey face with a soft rim, a thick white hour hand and a thinner light minute hand (rounded ends, soft shadows), an orange second hand, the weekday and date on its left, the time zone above. Below, under a soft shadow, **Alarms** (light 36px) with a + squircle, then 110px rows: the N9 switch (a wide squircle track, a squircle knob), the time semibold with its name under it, ›. No tabs and no toolbar: the N9 clock has only alarms.',
  alarmEditor: 'A sheet, Cancel and an **orange Save** (the N9 positive colour in editors). A title field, the time in light 62px type, and the 400px **time wheel**: drag the dark minute knob (72px) round the outer ring and the light hour knob round the inner one. Then More options › (repeat, snooze, tone as N9 selection rows).',
  month: 'The month is a light panel (456px, a soft shadow under it) with orange ◀ ▶ around the light 34px month name, weekday names with **Saturday and Sunday in orange**, days on a 66 × 59px grid (a grey dot under days with events), today a 50px **orange squircle**, other months\' days grey. Under it, the chosen day\'s events, or "No events". Toolbar tabs (N9 dark tile glyphs): + (new event), Month, Week, Agenda, menu.',
  week: 'The week tab. A dark 28px strip "Week 47 - November 2026", an orange rule, the day in an **orange bar** (light white type) beside a 68px hours column; hour rows 69px in **alternating** light bands, the hours light 20px; events are **solid blue** blocks with bold white titles; the current hour a warm beige band with an orange mark.',
  agenda: 'The agenda has **no header at the top**. Its first row is **today\'s orange bar** (#EE5500, 40px: "Today - Thursday, 19 November 2026", white semibold 18px, right-aligned), then today\'s events, or a grey line **No events for today**. Right under it, the **next day with events**, however far ahead (a quiet calendar can jump weeks): a **grey bar** of the same kind with its date, and its events (title semibold 24px, time, place 20px, the calendar\'s colour mark at the right). Nothing older than today. With few days the list does not scroll, so **no fast scroll**. The ≡ opens the N9 menu (next story).',
  calendarMenu: 'The ≡ on the toolbar opens the **N9 object menu** (n9-toolbar-menu.png): the page dims and a **light panel** with squircle corners rises from the bottom over the toolbar, 17px in from the sides, one 80px row per action, semibold 25px, thin rules between; a selection row shows its value under it with ▲▼. Tapping outside closes it. Calendar: Today, Go to date, Search, Refresh, Import, Settings, About.',
  gallery: 'Full screen, black, the pictures **edge to edge, 159px squares, hairline seams** (videos show their length on a dark strip). The toolbar is **tabs** on a dark bar: All, Captures, Favourites, People and the menu; the glyphs grey, the current one light on a lighter cell.',
  photo: 'The picture fills the screen; a tap shows a translucent **info band** on top (name, date, place) and the dark toolbar: Back, ★, Share, Delete, menu. Another tap hides both.',
  music: 'The wall of **album covers** (156px, 6px seams, the playing album 2 × 2 with a magenta ▶ bar on it); each cover is art, lit from the top left and shaded at its edges. Under it semibold 25px rows Artists, Albums, Songs, Playlists › and the Music Store, 73px apart, on black with a soft grey glow; the page scrolls under the dark toolbar. Etesian keeps the **status bar** and the **toolbar** (the N9 hid both here). Album art stays square (rule 22).',
  nowPlaying: 'The art, square, edge to edge; the title semibold with "2/3" in grey, artist and album light grey with the ••• details button; filled ⏮ ⏸ ⏭ in light grey; a thick **magenta** progress bar with a white tick, and the times; the dark toolbar: Back, ★, shuffle, repeat, menu.',
  browser: 'The address field "Go to web address or search" (48px, squircle ends) is the only thing on top, on a light band. Then **Top sites** as huge type in 87px rows on white, each site its name set large (the brand bold and blue, the rest light), then the history on light grey grouped by date: a globe squircle, the title semibold and the address. On a page, the N9 browser put Back, the address and its menu in a bar at the top that scrolls away: **Etesian moves those to the bottom toolbar** (rule 1); the toolbar hides as you scroll down and comes back as you scroll up.',
  documents: 'An **orange title bar** (72px), then every document, newest first, grouped by **age** ("Today", "Yesterday", "5 years ago" at the right end of a line) on #EEF0F1. Each 80px row: a light squircle with the file\'s glyph and type, the name semibold, the kind under it, the size at the bottom right. No folders, no tabs. Toolbar: the menu only.',
  settings: 'The N9 Settings main list (n9-settings-main.png) on black, with the ROM\'s entries: "Settings" light 32px over a rule, **Flight mode** with an (i) squircle and the dark N9 switch, Network and internet ›, Mobile network ›, a rule, **Brightness** with its slider (blue fill, a white squircle knob, a sun at each end), a rule, then the sections as 80px rows: a 62px dark **squircle** with a white glyph, the name semibold 26px, ›. No title bar, no toolbar.',
  fmRadio: '**No N9 reference**: the N9 shipped no FM radio, so this follows the port\'s N9 media look (packages_apps_FMRadio patch): black window, white text, secondary grey #8C8C8C, the N9 blue #00A5E5 as the only accent. "FM Radio" light 32px over a rule, the frequency in huge light type with MHz in grey, the station and its RDS text; a tuning strip with a glowing blue needle; the round FAB becomes **dark squircle buttons** (#3A3A3A → #2A2A2A): seek back, power (blue when on), seek on; favourites as dark squircle tiles, the tuned one blue. Dark toolbar, filled glyphs: speaker / headset output, record, menu.',
  recorder: '**No N9 reference** (the N9 had no sound recorder app); the packages_apps_Recorder patch pins a static light palette: window #E9E9E9, text #191919, secondary #8C8C8C, rules #D6D6D6 with a white lip. While recording: "Recording" in grey light type, the elapsed time 110px light, the level bars in N9 blue, then the record button turned **red** (#D42D2A, a white stop square; blue #00A5E5 with a mic when ready) between two light squircles (pause, discard). Light toolbar, filled glyphs: recordings list, menu.',
  audioFx: '**No N9 reference**; the packages_apps_AudioFX patch makes it black with the N9 blue: the output (speaker) on a #2A2A2A row with the N9 switch, the preset (popup #2A2A2A, 4dp corners), the equaliser bands as **blue bars** (#00A5E5, the old white bars recoloured), and the Bass / Virtualizer / Reverb knobs with a #2A2A2A track and a blue arc. etesian-text everywhere. Dark toolbar: back and menu.',
  permission: 'The runtime permission prompt as packages_modules_Permission styles it (an N9 QueryDialog, mock 15): the dialog fills the screen over a **90% black backdrop** (no card, no dim), the permission\'s glyph in white on a **lit green squircle** (88dp, n = 2.8, #9BDB1C → #3A9A00), the question centred in large **light** type (no bold app name), then **stacked** 280dp N9 buttons, 52dp, 7dp apart: **Allow** blue (#5AA0FF → #3A7BE0), Only this time and Don\'t allow dark (#3A3A3C → #1A1A1C); bold 18sp, not all caps. "Allow" grants while in use, as the stock foreground button did.',
  files: 'Files (DocumentsUI) as the ROM ships it: it **opens on Documents**, every document on the phone (default_root_uri = documents_root), as the N9\'s Documents did, not on a folder. The N9 Documents **orange title bar** (#F26F17, white light title), a grey rounded search pill, then flat rows on #F4F4F4: a white squircle icon tile with a hairline edge, the name bold #191919, "size | date" in grey #8C8C8C, an engraved rule (grey + white). The options menu is mirrored on the **Etesian toolbar**, filled glyphs: locations, search, new folder, sort, grid (list when in grid).',
};

export const phone = () => app(`
    <div class="ph-head"><div class="ph-sel">Mobile call${G.updown}</div><div class="ph-num"><span><span style="color:#9A9A9A">33</span>9</span><span class="ph-bs">✕</span></div></div>
    <div class="ph-pad">${[['1', '<svg width="22" height="10" viewBox="0 0 22 10"><circle cx="5" cy="5" r="3.5" fill="none" stroke="#666" stroke-width="2"/><circle cx="17" cy="5" r="3.5" fill="none" stroke="#666" stroke-width="2"/><path d="M5 8.5h12" stroke="#666" stroke-width="2"/></svg>'], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', '+'], ['0', ''], ['#', '']].map(([d, l]) => `<span>${d}<small>${l || '&nbsp;'}</small></span>`).join('')}</div>
    <div class="ph-act"><span class="ph-call hd-sqf">${ico('phone', 36)}</span><span class="ph-add ${SQ}">${G.person}</span></div>
    ${tabs([G.log, G.dial, G.person], 1)}`);

const CONTACTS = [['A', ['A Zel Marie', 'Ana Carla Martins', 'Ana Lidia la Cruz', 'Angela Turner', 'Anita Ahamad', 'AreYou Mulya Wardhani']], ['C', ['Carla Ferreira', 'Chris Ober']]] as const;
const initials = (n: string) => { const w = n.split(' '); return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase(); };
/* section tops in the list, in HdFastScroll's css px (the overlay is zoomed back to 1:1, so n9 px / 1.5) */
const FS = [{ letter: 'A', top: 27 / 1.5 }, { letter: 'C', top: (48 + 6 * 80 + 27) / 1.5 }];
export const contacts = () => ({ components: comps, setup: () => ({ FS }), template: app(`
    <div class="n9-title" style="background:linear-gradient(#1A8FDB,#0F82D2)">Contacts</div>
    <div class="n9-field hd-sqf">Search${ico('search', 30)}</div>
    <div class="ap-body" style="border-top:1px solid #C9CCCF;box-shadow:inset 0 1px #fff">
      ${CONTACTS.map(([, names]) => `<div class="n9-group fs"></div>${names.map((n) => `<div class="n9-row"><span class="n9-av ${SQ}">${initials(n)}</span><span class="t"><b>${n}</b></span></div>`).join('')}`).join('')}
      <div style="position:absolute;inset:0;zoom:1.5;--hd-fast-scroll-width:46.7px"><HdFastScroll :sections="FS" :position="0" /></div>
    </div>
    ${toolbar(G.add, G.menu)}`) });

export const contactEditor = () => app(`
    <div class="n9-sheet"><span class="n9-pill n9-pill--grey hd-sqf">Cancel</span><span class="n9-pill n9-pill--blue dim hd-sqf">Save</span></div>
    <div class="ap-body">
      <div class="ce-img"><span class="ce-ph ${SQ}"><svg width="42" height="46" viewBox="0 0 32 34" aria-hidden="true"><circle cx="16" cy="10" r="7.5" fill="currentColor"/><path d="M2 33c0-9 6-13 14-13s14 4 14 13z" fill="currentColor"/></svg></span>Add image</div>
      <div class="ce-f focus">First name: <i>Add first name</i></div>
      <div class="ce-f">Last name: <i>Add last name</i></div>
      <div class="ce-f"><u>Mobile:</u> <i>Add number</i></div>
      <div class="ce-f"><u>Home:</u> <i>Add email address</i></div>
      <div class="ce-more"><span class="hd-sqf">▼</span></div>
    </div>
    <div class="ce-kb" style="flex:none;zoom:1.5;width:320px"><HdKeyboard /></div>`);

export const calculator = () => app(`
    <div class="ca-out">0<span class="ca-bs">✕</span></div><div class="ca-line"></div>
    <div class="ca-keys">${['C', '÷', '×', '±', '−', '+'].map((k) => `<span class="op">${k}</span>`).join('')}<span class="gap"></span>${['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((k) => `<span>${k}</span>`).join('')}<span class="eq">=</span></div>`, 'ap--dark', false);

/** The analogue face: a matt grey squircle-ish disc (n = 2.9 measures as a circle at this size), soft rim, white hands. */
const dial = `<svg class="cl-dial" viewBox="0 0 380 380" aria-hidden="true"><defs>
  <radialGradient id="cf" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#D6D6D7"/><stop offset="1" stop-color="#C2C2C4"/></radialGradient>
  <filter id="hs" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity=".35"/></filter></defs>
  <circle cx="190" cy="190" r="190" fill="#DADADA"/><circle cx="190" cy="190" r="188" fill="url(#cf)" stroke="#A9A9AB" stroke-width="1"/>
  <g filter="url(#hs)" stroke-linecap="round"><line x1="190" y1="190" x2="268" y2="330" stroke="#E4E4E4" stroke-width="10"/>
  <line x1="190" y1="190" x2="162" y2="326" stroke="#FFFFFF" stroke-width="24"/></g>
  <line x1="190" y1="190" x2="372" y2="226" stroke="#F0622A" stroke-width="2"/></svg>`;
export const clock = () => app(`
    <div class="cl-top"><span class="cl-tz">London GMT+0:00</span>${dial}<span class="cl-date">THU<b>19</b></span></div>
    <div class="cl-low"><div class="cl-head">Alarms<span class="cl-plus-sh"><span class="cl-plus ${SQ}"><svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M11 2v18M2 11h18" stroke="currentColor" stroke-width="4"/></svg></span></span></div>
      <div class="cl-row first">${sw()}<span class="t"><b>8:00</b><small>Alarm</small></span>${chev('#111')}</div>
      <div class="cl-row">${sw()}<span class="t"><b>11:08</b><small>Alarm</small></span>${chev('#111')}</div></div>`);

export const alarmEditor = () => app(`
    <div class="n9-sheet"><span class="n9-pill n9-pill--grey hd-sqf">Cancel</span><span class="n9-pill n9-pill--orange hd-sqf">Save</span></div>
    <div class="ap-body"><div class="al-field hd-sqf">Alarm title</div><div class="al-time">11:08</div>
      <div class="al-wheel"><span class="al-knob" style="top:62px;right:52px;background:radial-gradient(circle at 50% 35%,#3E2E26,#1A120E);color:#fff;box-shadow:0 0 0 2px #fff">08</span><span class="al-knob" style="top:104px;left:130px;background:radial-gradient(circle at 50% 35%,#E8E8E8,#ABABAD);color:#222;box-shadow:0 0 0 2px rgba(255,255,255,.6)">11</span></div>
      <div class="al-more">More options${chev('#111')}</div></div>`);

const MONTH = Array.from({ length: 42 }, (_, i) => i - 5);
export const calendarMonth = () => ({ components: comps, setup: () => ({ MONTH }), template: app(`
    <div class="cm"><div class="cm-h"><i class="l"></i>November 2026<i class="r"></i></div>
      <div class="cm-g">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => `<span class="d ${i > 4 ? 'we' : ''}">${d}</span>`).join('')}
        <span v-for="n in MONTH" :key="n" :class="{ o: n < 1 || n > 30, t: n === 19, dot: n === -3 || n === 30 }"><em v-if="n === 19" class="${SQ}">19</em><template v-else>{{ n < 1 ? 31 + n : n > 30 ? n - 30 : n }}</template></span></div></div>
    <div class="ap-body"><div class="cm-none">No events</div></div>
    ${tabs(CAL_TABS, 1)}`) });

export const calendarWeek = () => app(`
    <div class="cw-h">Week 47 - November 2026</div><div class="cw-day"><span>Thursday 19</span></div>
    <div class="ap-body cw-rows">${['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((h, i) => `<div class="cw-row ${i === 4 ? 'now' : ''}"><span>${h}</span><i class="${i === 1 ? 'ev' : ''}">${i === 1 ? 'Meeting' : ''}</i></div>`).join('')}</div>
    ${tabs(CAL_TABS, 2)}`);

const agendaBody = `<div class="cg-bar today">Today - Thursday, 19 November 2026</div><div class="cg-none">No events for today</div>
    <div class="cg-bar next">Monday, 30 November 2026</div>
    <div class="cg-ev"><b>St. Andrew's Day (Scotland)</b><span>All day</span><span>United Kingdom</span><i></i></div>
    <div class="ap-body"></div>`;
export const calendarAgenda = () => app(`${agendaBody}${tabs(CAL_TABS, 3)}`);
export const calendarMenu = () => app(`${agendaBody}${tabs(CAL_TABS, 3)}
    <div class="n9-dim"></div>
    <div class="n9-menu"><div class="hd-sqf">${['Today', 'Go to date', 'Search', 'Refresh', 'Import', 'Settings', 'About'].map((m) => `<p>${m}</p>`).join('')}</div></div>`);

export const gallery = () => ({ components: comps, setup: () => ({ pic }), template: app(`
    <div class="ap-body"><div class="ga-grid"><i v-for="i in 15" :key="i" :style="{ background: pic(i) }"><small v-if="i < 3">00:{{ i === 1 ? '01' : '19' }}</small></i></div>
    <div class="ga-tb">${tabs([F.pictures, F.camera, F.star, G.person, G.menu], 0, true)}</div></div>`, 'ap--dark', false) });

export const photo = () => app(`
    <div class="ap-body" style="background:${pic(1)}"><div class="ga-info"><b>IMG_0412</b><div><span>9 May 2026 10:56</span><span>Athens, Greece</span></div></div></div>
    ${toolbar(F.back, `${F.star}&emsp;&emsp;${F.share}&emsp;&emsp;${F.delete}&emsp;&emsp;${G.menu}`, true)}`, 'ap--dark');

export const music = () => app(`
    <div class="ap-body"><div class="mu-wall">
      <i class="cv big" style="background:radial-gradient(circle at 30% 30%,#2A1206,#0A0402);color:#FF6A10;font-style:normal">In search of sunrise 5 <span class="ghost">insearchof sunrise5</span><span class="mu-play hd-sqf">In Search Of Sunrise 5 (CD 1)</span></i>
      ${cover(0)}${cover(7)}${cover(2)}${cover(3)}${cover(4)}</div>
      <div class="mu-rows">${['Artists', 'Albums', 'Songs', 'Playlists'].map((r) => `<div class="mu-row">${r}${chev('#fff')}</div>`).join('')}<div class="mu-row">Music Store${G.bag}</div></div></div>
    ${toolbar('', G.menu, true)}`, 'ap--dark');

export const nowPlaying = () => app(`
    <div class="ap-body"><div style="height:480px;display:flex"><i class="cv big" style="flex:1;font-size:64px;word-break:normal;background:${COVERS[3].bg};color:${COVERS[3].fg};font-style:normal">Northern rocks</i></div>
      <div class="mu-now"><b>Episode 264 (The Best Of 2013)<span>2/3</span></b><p>Sample artist<br>Sample album<i class="${SQ}">···</i></p></div>
      <div class="mu-ctl">${G.prev}${G.pause}<span style="transform:scaleX(-1);display:inline-grid">${G.prev}</span></div><div class="mu-prog"></div><div class="mu-t"><span>43:39</span><span>2:00:00</span></div></div>
    <div class="n9-tb n9-tb--dark" style="padding:1px 16px 0 10px"><span class="mu-back ${SQ}">${F.back}</span>${ico('star', 32)}<span style="opacity:.35">${G.shuffle}</span>${ico('restart', 32)}${G.menu}</div>`, 'ap--dark');

export const browser = () => app(`
    <div class="br-top"><div class="n9-field hd-sqf">Go to web address or search</div></div>
    <div class="ap-body" style="background:#EEEFF0"><div class="br-label">Top sites</div>
      <div class="br-site">Latest on <b>Etesian</b></div><div class="br-site"><b>Etesian</b> Features</div><div class="br-site"><b style="font-size:50px">Etesian</b> <span style="color:#1E7A3A">Design</span></div><div class="br-site" style="font-size:52px"><b>Etesian</b> Support</div><div class="br-site"><b>Etesian</b> <span style="color:#555">Community</span></div><div class="br-site" style="gap:0"><b>Etesian</b>.org</div>
      <div class="br-label">13/05/2026</div>
      <div class="br-hist"><span class="br-glb ${SQ}">${ico('globe', 32)}</span><span class="t"><b>Design language: the squircle</b><small>https://etesian.example.org/design</small></span></div>
      <div class="br-hist"><span class="br-glb ${SQ}">${ico('globe', 32)}</span><span class="t"><b>Release notes</b><small>https://etesian.example.org/releases</small></span></div></div>`);

const docIc = (t: string) => `<span class="dc-ic ${SQ}"><svg width="26" height="34" viewBox="0 0 26 34" aria-hidden="true"><path d="M1 1h16l8 8v24H1z" fill="#111"/><path d="M17 1v8h8" fill="#555"/><text x="13" y="27" fill="#fff" font-size="8" font-weight="700" text-anchor="middle" font-family="sans-serif">${t}</text></svg></span>`;
export const documents = () => app(`
    <div class="n9-title" style="background:linear-gradient(#F5821E,#EE6A0A)">Documents</div>
    <div class="ap-body"><div class="n9-group" style="margin-right:30px">Today</div>
      ${[['PDF', 'Report 2026', 'PDF', '139 kB'], ['XLS', 'Budget', 'Spreadsheet', '22 kB'], ['PDF', 'Tickets', 'PDF', '10.3 MB']].map(([t, n, k, s]) => `<div class="n9-row">${docIc(t)}<span class="t"><b>${n}</b><small>${k}</small></span><span class="dc-size">${s}</span></div>`).join('')}
      <div class="n9-group" style="margin-right:30px">Yesterday</div>
      <div class="n9-row">${docIc('TXT')}<span class="t"><b>Notes for the trip</b><small>Text file</small></span><span class="dc-size">1 kB</span></div>
      <div class="n9-group" style="margin-right:30px">5 years ago</div>
      <div class="n9-row">${docIc('PDF')}<span class="t"><b>Manual</b><small>PDF</small></span><span class="dc-size">2.2 MB</span></div></div>
    ${toolbar('', G.menu)}`, 'ap--light', true, 'dc');

const stIc = (name: string) => `<span class="st-ic ${SQ}">${ico(name, 36)}</span>`;
export const settings = () => app(`
    <div class="st-h">Settings</div>
    <div class="ap-body">
      <div class="st-row"><span class="n">Flight mode</span><span class="st-i ${SQ}">i</span>${sw(true)}</div>
      <div class="st-row"><span class="n">Network and internet</span>${chev('#fff')}</div>
      <div class="st-row"><span class="n">Mobile network</span>${chev('#fff')}</div>
      <div class="st-rule"></div>
      <div class="st-br"><b>Brightness</b><div class="st-sl">${G.sun}<span class="st-track"><span class="st-knob ${SQ}"></span></span><span style="transform:scale(1.25);display:inline-grid">${G.sun}</span></div></div>
      <div class="st-rule"></div>
      ${[['bluetooth', 'Connected devices'], ['grid', 'Apps'], ['info', 'Notifications'], ['speaker', 'Sound and vibration'], ['photo', 'Display and wallpaper'], ['battery', 'Battery']].map(([i, n]) => `<div class="st-row ic">${stIc(i)}<span class="n">${n}</span>${chev('#fff')}</div>`).join('')}
    </div>`, 'ap--dark');

export const fmRadio = () => app(`
    <div class="st-h">FM Radio</div>
    <div class="ap-body">
      <div class="fm-freq">98.5<small>MHz</small></div><div class="fm-name">Radio Etesian</div><div class="fm-rds">Morning show - news at 9</div>
      <div class="fm-dial">${[['97', 20], ['98', 40], ['99', 60], ['100', 80]].map(([f, x]) => `<span style="left:${x}%">${f}</span>`).join('')}</div>
      <div class="fm-ctl"><span class="fm-btn ${SQ}">${G.prev}</span><span class="fm-btn on ${SQ}">${F.power}</span><span class="fm-btn ${SQ}"><span style="transform:scaleX(-1);display:inline-grid">${G.prev}</span></span></div>
      <div class="st-h" style="font-size:26px;margin-top:28px;padding:10px 0;border:0;color:#8C8C8C">Favourites</div>
      <div class="fm-fav">${[['91.3', 'Classic'], ['98.5', 'Etesian'], ['102.1', 'Jazz'], ['105.8', 'News']].map(([f, n]) => `<span class="${SQ} ${f === '98.5' ? 'on' : ''}">${f}<small>${n}</small></span>`).join('')}</div>
    </div>
    ${toolbar(F.speaker, `${F.record}&emsp;&emsp;&emsp;${G.menu}`, true)}`, 'ap--dark');

export const recorder = () => app(`
    <div class="n9-title" style="background:linear-gradient(#1AAFEA,#00A0E0)">Recorder</div>
    <div class="ap-body"><div class="rc-state">Recording</div><div class="rc-time">0:42</div>
      <div class="rc-wave">${[18, 34, 60, 42, 88, 120, 96, 70, 104, 132, 90, 54, 76, 110, 84, 46, 62, 98, 72, 40, 28, 52, 80, 64, 36, 22, 14, 10, 8, 6].map((h, i) => `<i style="height:${h}px;opacity:${i > 25 ? .35 : 1}"></i>`).join('')}</div>
      <div class="rc-ctl"><span class="rc-sm ${SQ}">${G.pause}</span><span class="rc-rec ${SQ}"><span style="color:#fff;display:inline-grid">${F.stop}</span></span><span class="rc-sm ${SQ}" style="color:#8C8C8C">${F.delete}</span></div></div>
    ${toolbar(F.list, G.menu)}`, 'ap--light', true, 'rc');

/** The N9 switch turned on: a blue track, the knob at the right. */
const swOn = `<svg class="n9-sw" viewBox="0 0 64 40" aria-hidden="true"><path d="${squircleRectPath(64, 40, 3.6)}" fill="#00A5E5" stroke="#0088C0" stroke-width="1"/><path d="${squircleRectPath(32, 32, 2.8, 28, 4)}" fill="#F2F2F4"/></svg>`;
const knob = (label: string, v: number) => { const r = 44, c = 2 * Math.PI * r, arc = 0.75 * c; return `<span class="fx-knob"><svg width="116" height="116" viewBox="0 0 116 116" aria-hidden="true"><g transform="rotate(135 58 58)"><circle cx="58" cy="58" r="${r}" fill="none" stroke="#2A2A2A" stroke-width="10" stroke-dasharray="${arc} ${c}"/><circle cx="58" cy="58" r="${r}" fill="none" stroke="#00A5E5" stroke-width="10" stroke-dasharray="${arc * v} ${c}"/></g><circle cx="58" cy="58" r="30" fill="#1E1E1E" stroke="#3A3A3A"/><text x="58" y="65" fill="#fff" font-size="20" text-anchor="middle" font-family="sans-serif">${Math.round(v * 100)}%</text></svg>${label}</span>`; };
export const audioFx = () => app(`
    <div class="fx-head">AudioFX${swOn}</div>
    <div class="ap-body">
      <div class="fx-dev">Speaker<small>Effects on</small></div>
      <div class="fx-pre">Preset<b>Rock ▾</b></div>
      <div class="fx-eq">${[['60', 150], ['230', 110], ['910', 70], ['3.6k', 120], ['14k', 170]].map(([f, h]) => `<span><i style="height:${h}px"></i><small>${f} Hz</small></span>`).join('')}</div>
      <div class="fx-knobs">${knob('Bass', 0.6)}${knob('Virtualizer', 0.35)}${knob('Reverb', 0.15)}</div>
    </div>
    ${toolbar(F.back, G.menu, true)}`, 'ap--dark');

/** The permission prompt over the app that asked (Recorder, dimmed by the 90% backdrop). */
export const permission = () => app(`
    <div class="n9-title" style="background:linear-gradient(#1AAFEA,#00A0E0)">Recorder</div><div class="ap-body" style="background:#E9E9E9"></div>${toolbar(F.list, G.menu)}
    <div class="pm"><span class="pm-ic ${SQ}"><svg width="54" height="62" viewBox="0 0 28 36" aria-hidden="true"><rect x="7" y="1" width="14" height="22" rx="7" fill="#fff"/><path d="M2 16c0 7 5 12 12 12s12-5 12-12" fill="none" stroke="#fff" stroke-width="3.5"/><path fill="#fff" d="M12 27h4v6h6v3H6v-3h6z"/></svg></span>
      <h2>Allow Recorder to record audio?</h2>
      <div class="pm-btns"><span class="pm-b allow hd-sqf">Allow</span><span class="pm-b hd-sqf">Only this time</span><span class="pm-b hd-sqf">Don't allow</span></div></div>`);

const flIc = (t: string, c: string) => `<span class="fl-ic ${SQ}"><svg width="30" height="38" viewBox="0 0 26 34" aria-hidden="true"><path d="M1 1h16l8 8v24H1z" fill="${c}"/><path d="M17 1v8h8" fill="rgba(255,255,255,.5)"/><text x="13" y="27" fill="#fff" font-size="8" font-weight="700" text-anchor="middle" font-family="sans-serif">${t}</text></svg></span>`;
export const files = () => app(`
    <div class="fl-title">Documents</div>
    <div class="ap-body"><div class="fl-pill">${F.search.replace('width="34" height="34"', 'width="24" height="24"')}Search documents</div>
      ${[['PDF', '#D42D2A', 'Report 2026.pdf', '139 kB | 18:02'], ['XLS', '#2E8B3A', 'Budget.xlsx', '22 kB | 12:40'], ['PDF', '#D42D2A', 'Tickets.pdf', '10.3 MB | 09:15'], ['TXT', '#5A5A5A', 'Notes for the trip.txt', '1 kB | Yesterday'], ['DOC', '#2A6BD0', 'Letter.docx', '48 kB | 2 Nov'], ['PDF', '#D42D2A', 'Manual.pdf', '2.2 MB | 2021']].map(([t, c, n, m]) => `<div class="fl-row">${flIc(t, c)}<span class="t"><b>${n}</b><small>${m}</small></span></div>`).join('')}</div>
    <div class="n9-tb">${[F.location, F.search, F.newFolder, F.sort, F.grid].map((g) => `<span>${g}</span>`).join('')}</div>`, 'ap--light', true, 'fl');
