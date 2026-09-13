# scripts/update_use_locale.py
import json
import re

from scripts.assemble_and_verify import assemble_dict

def main():
    target_path = 'src/composables/useLocale.ts'
    with open(target_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update SUPPORTED_LOCALES
    old_supported = "export const SUPPORTED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl'] as const"
    new_supported = "export const SUPPORTED_LOCALES = ['sl', 'en', 'de', 'fr', 'it', 'sr', 'nl', 'pl', 'cs', 'es'] as const"
    assert old_supported in content, "old_supported string not found in useLocale.ts"
    content = content.replace(old_supported, new_supported, 1)

    # 2. Update localeLabels
    old_labels = """export const localeLabels: Record<Locale, { label: string; name: string; native: string; flag: string }> = {
  sl: { label: 'Slovenščina', name: 'Slovenščina', native: 'SL', flag: '🇸🇮' },
  en: { label: 'English (UK)', name: 'English', native: 'EN', flag: '🇬🇧' },
  de: { label: 'Deutsch', name: 'Deutsch', native: 'DE', flag: '🇩🇪' },
  fr: { label: 'Français', name: 'Français', native: 'FR', flag: '🇫🇷' },
  it: { label: 'Italiano', name: 'Italiano', native: 'IT', flag: '🇮🇹' },
  sr: { label: 'Srpski', name: 'Srpski', native: 'SR', flag: '🇷🇸' },
  nl: { label: 'Nederlands', name: 'Nederlands', native: 'NL', flag: '🇳🇱' }
}"""

    new_labels = """export const localeLabels: Record<Locale, { label: string; name: string; native: string; flag: string }> = {
  sl: { label: 'Slovenščina', name: 'Slovenščina', native: 'SL', flag: '🇸🇮' },
  en: { label: 'English (UK)', name: 'English', native: 'EN', flag: '🇬🇧' },
  de: { label: 'Deutsch', name: 'Deutsch', native: 'DE', flag: '🇩🇪' },
  fr: { label: 'Français', name: 'Français', native: 'FR', flag: '🇫🇷' },
  it: { label: 'Italiano', name: 'Italiano', native: 'IT', flag: '🇮🇹' },
  sr: { label: 'Srpski', name: 'Srpski', native: 'SR', flag: '🇷🇸' },
  nl: { label: 'Nederlands', name: 'Nederlands', native: 'NL', flag: '🇳🇱' },
  pl: { label: 'Polski', name: 'Polski', native: 'PL', flag: '🇵🇱' },
  cs: { label: 'Čeština', name: 'Čeština', native: 'CS', flag: '🇨🇿' },
  es: { label: 'Español', name: 'Español', native: 'ES', flag: '🇪🇸' }
}"""
    assert old_labels in content, "old_labels string not found in useLocale.ts"
    content = content.replace(old_labels, new_labels, 1)

    # 3. Serialize pl, cs, es dicts
    pl_dict = assemble_dict('pl')
    cs_dict = assemble_dict('cs')
    es_dict = assemble_dict('es')

    pl_str = f"const pl: Dict = {json.dumps(pl_dict, indent=2, ensure_ascii=False)}\n\n"
    cs_str = f"const cs: Dict = {json.dumps(cs_dict, indent=2, ensure_ascii=False)}\n\n"
    es_str = f"const es: Dict = {json.dumps(es_dict, indent=2, ensure_ascii=False)}\n\n"

    new_dicts_code = pl_str + cs_str + es_str

    old_dicts_line = "export const dictionaries: Record<Locale, Dict> = { sl, en, de, fr, it, sr, nl }"
    new_dicts_line = "export const dictionaries: Record<Locale, Dict> = { sl, en, de, fr, it, sr, nl, pl, cs, es }"
    assert old_dicts_line in content, "old_dicts_line not found in useLocale.ts"
    content = content.replace(old_dicts_line, new_dicts_code + new_dicts_line, 1)

    # 4. Update flatDictionaries
    old_flat = """export const flatDictionaries: Record<Locale, Record<string, string>> = {
  sl: flattenDict(sl),
  en: flattenDict(en),
  de: flattenDict(de),
  fr: flattenDict(fr),
  it: flattenDict(it),
  sr: flattenDict(sr),
  nl: flattenDict(nl)
}"""

    new_flat = """export const flatDictionaries: Record<Locale, Record<string, string>> = {
  sl: flattenDict(sl),
  en: flattenDict(en),
  de: flattenDict(de),
  fr: flattenDict(fr),
  it: flattenDict(it),
  sr: flattenDict(sr),
  nl: flattenDict(nl),
  pl: flattenDict(pl),
  cs: flattenDict(cs),
  es: flattenDict(es)
}"""
    assert old_flat in content, "old_flat not found in useLocale.ts"
    content = content.replace(old_flat, new_flat, 1)

    # Write updated content
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated src/composables/useLocale.ts with pl, cs, and es!")

if __name__ == '__main__':
    main()
