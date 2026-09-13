## 2026-09-12T09:23:00Z

<USER_REQUEST>
You are Worker M2 implementing Milestone 2: i18n Expansion to Polish (pl), Czech (cs), and Spanish (es).
Working directory: /home/ator/Kader/.agents/worker_m2
Project root: /home/ator/Kader
Scope document: /home/ator/Kader/.agents/orchestrator/PROJECT.md
Explorer handoffs to review:
- /home/ator/Kader/.agents/explorer_1/handoff.md (Key parity, 938 leaf keys, 8 interpolation keys, dictionaries structure)
- /home/ator/Kader/.agents/explorer_3/handoff.md (Verification script design)

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Tasks:
1. Review the existing dictionaries in /home/ator/Kader/src/composables/useLocale.ts. Notice there are 7 dictionaries (sl, en, de, fr, it, sr, nl) each with exactly 938 leaf keys across 19 domain sections.
2. Generate genuine, natural, accurate, full translations for Polish (pl), Czech (cs), and Spanish (es) matching all 938 leaf keys in exact structural symmetry.
   - Preserve all 8 parameterized placeholders verbatim:
     * buyouts.inquiryMessagePrefill ({{tier}}, {{guests}})
     * buyouts.thankYou ({{name}})
     * buyouts.upTo ({{n}})
     * craft.phaseBadge ({{n}})
     * home.viewFullSizeAria ({{label}})
     * home.visitP ({{food}}, {{table}})
     * lightbox.showImageAria ({{n}}, {{label}})
     * lightbox.thumbnailAria ({{n}}, {{label}})
3. Update /home/ator/Kader/src/composables/useLocale.ts:
   - Add 'pl', 'cs', 'es' to SUPPORTED_LOCALES and Locale type.
   - Add 'pl', 'cs', 'es' to localeLabels:
     pl: { label: 'Polski', name: 'Polski', native: 'PL', flag: '🇵🇱' },
     cs: { label: 'Čeština', name: 'Čeština', native: 'CS', flag: '🇨🇿' },
     es: { label: 'Español', name: 'Español', native: 'ES', flag: '🇪🇸' }
   - Add dictionaries pl, cs, es.
   - Add flatDictionaries entries:
     pl: flattenDict(pl),
     cs: flattenDict(cs),
     es: flattenDict(es)
4. Update /home/ator/Kader/nuxt.config.ts:
   - Add alternate links for pl, cs, es in app.head.link with hreflang='pl', 'cs', 'es'.
5. Verify /home/ator/Kader/src/components/Header.vue works seamlessly with the new locales.
6. Create / execute verification script scripts/verify_i18n_parity.mjs to confirm:
   - All 10 languages (sl, en, de, fr, it, sr, nl, pl, cs, es) are present.
   - Exactly 938 leaf keys per language with 100.0% key parity (zero missing, zero extra).
   - Zero empty strings.
   - Parameter symmetry for all 8 interpolation keys.
7. Run `npm run typecheck` and `npm run build` and ensure exit code 0 with zero errors.
8. Record all changes in /home/ator/Kader/.agents/worker_m2/changes.md and write a comprehensive handoff to /home/ator/Kader/.agents/worker_m2/handoff.md. Send a completion message to the orchestrator when finished.
</USER_REQUEST>
