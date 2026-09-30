// Reference site (klaproosamsterdam.nl) — 100% structural analysis, captured
// 2026-09-30 via Playwright (analyze_ref.mjs / analyze_flow.mjs).
//
// PURPOSE: record the layout metrics we borrowed, so the implementation can be
// checked against them. Nothing here is copied verbatim.
//
// HERO (y=0..897)
//   - Two 1440x960 photos, position:absolute, full-bleed, stacked
//   - header_d.png as a 1440x302 background layer (logo plate)
//   - logo image 383x585 at y=303
//   - Intro paragraph: 22px, weight 400, x=135 (LEFT column)
//   - Nav links: 40px, weight 400, x=1059..1208, white (RIGHT column)
//     "menu restaurant" y=370, "afhaalmenu" y=430, "reserveren" y=490,
//     "contact" y=550, "zaalverhuur" y=610
//   - Secondary links "groepen"/"Instagram": 22px, x=250..444 (LEFT column)
//   - moon clipart 305x161 at y=718
//   - cookie bar 14px, y=857
//
// DIVIDERS (the signature of the template)
//   - arrowdown_d.png  1440x232 at y=897   (full-bleed, between hero and block 1)
//   - arrowup_d.png    1440x179 at y=2062  (closing the block, pointing back up)
//   - circle_d.png      720x270 at y=2420  (centred inside the RESERVEREN block)
//   - maan2_d.png       432x52  at y=2887
//   - arrowdown_d2.png 1440x232 at y=3123
//
// BLOCK 1 — RESERVEREN (y=2240..3123)
//   - h1 "RESERVEREN" 44px white at x=216
//   - body 22px white at x=216; side notes 22px in the accent colour at x=864
//   - "Openingstijden" + day/hour list, with "gesloten" markers per closed day
//
// BLOCK 2 — zaalverhuur (y=4420..5018)
//   - h2 33px accent, then 22px body, then contact link
//
// FOOTER (y=5017)
//   - "© 2026 Klaproos" / "Website by" / "Privacy & cookies", 17.6px
//
// COLOUR: body background rgb(0,34,203) (a deep blue). We keep OUR signal red
// rgb(237,34,36) per the user's instruction; only the structure is borrowed.
//
// TYPE: "Open Sans Condensed" at 400. We keep self-hosted Inter per instruction.
//
// WHAT WE TAKE
//   - full-bleed hero, logo left / big menu links right
//   - full-bleed arrow dividers between blocks
//   - decorative moon + circle clipart in the background
//   - 40px menu links, 22px body, section heading 33-44px
//
// WHAT WE DROP (per user instruction)
//   - the RESERVEREN block (reservations are phone-only on our site)
//   - the cookie bar (we have no cookies)
//   - their blue and their typeface
export const REF = {
  hero: { heightPx: 897, logoW: 383, logoH: 585, linkFontPx: 40, bodyFontPx: 22, navRightX: 1059, textLeftX: 135 },
  dividers: { downH: 232, upH: 179, circleW: 720, circleH: 270, moonW: 305, moonH: 161, moon2W: 432, moon2H: 52 },
  h1Px: 44,
  h2Px: 33,
  footerPx: 17.6,
  color: { theirs: 'rgb(0,34,203)', ours: 'rgb(237,34,36)' }
}
export default REF
