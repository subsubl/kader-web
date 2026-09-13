# scripts/assemble_and_verify.py
import json
import re

from scripts.i18n_data.part1_common_nav_header_footer_hero import (
    common_translations, nav_translations, header_translations, footer_translations, hero_translations
)
from scripts.i18n_data.part2_home_seo import home_translations, seo_translations
from scripts.i18n_data.part3_events_misc import (
    events_translations, shop_translations, reservation_translations,
    modal_translations, lightbox_translations, pretix_translations, player_translations
)
from scripts.i18n_data.part4_craft import craft_translations
from scripts.i18n_data.part5_provenance import provenance_translations
from scripts.i18n_data.part6_buyouts import buyouts_translations
from scripts.i18n_data.part7_club import club_translations
from scripts.i18n_data.part8_pizzeria import pizzeria_translations

def assemble_dict(loc):
    return {
        "common": common_translations[loc],
        "nav": nav_translations[loc],
        "header": header_translations[loc],
        "footer": footer_translations[loc],
        "hero": hero_translations[loc],
        "home": home_translations[loc],
        "seo": seo_translations[loc],
        "pizzeria": pizzeria_translations[loc],
        "club": club_translations[loc],
        "events": events_translations[loc],
        "buyouts": buyouts_translations[loc],
        "shop": shop_translations[loc],
        "reservation": reservation_translations[loc],
        "modal": modal_translations[loc],
        "lightbox": lightbox_translations[loc],
        "pretix": pretix_translations[loc],
        "player": player_translations[loc],
        "craft": craft_translations[loc],
        "provenance": provenance_translations[loc]
    }

def flatten_dict(d, prefix=''):
    res = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            res.update(flatten_dict(v, key))
        else:
            res[key] = str(v)
    return res

def main():
    with open('src/composables/useLocale.ts', 'r', encoding='utf-8') as f:
        text = f.read()

    m_sl = re.search(r'const sl: Dict = (\{.*?^\})', text, re.MULTILINE | re.DOTALL)
    sl = json.loads(m_sl.group(1))
    flat_sl = flatten_dict(sl)
    sl_keys = set(flat_sl.keys())

    print(f"Base 'sl' leaf key count: {len(sl_keys)}")
    assert len(sl_keys) == 938, f"Expected 938 keys, got {len(sl_keys)}"

    # Check 8 parameterized keys in sl
    param_regex = re.compile(r'\{\{([a-zA-Z0-9_-]+)\}\}')
    param_map = {}
    for k, v in flat_sl.items():
        matches = param_regex.findall(v)
        if matches:
            param_map[k] = sorted(matches)
    
    print(f"Parameterized keys in sl ({len(param_map)}): {sorted(param_map.keys())}")
    assert len(param_map) == 8, f"Expected 8 parameterized keys, got {len(param_map)}"

    for loc in ['pl', 'cs', 'es']:
        d = assemble_dict(loc)
        flat_loc = flatten_dict(d)
        loc_keys = set(flat_loc.keys())

        # 1. Key count and parity
        assert len(loc_keys) == 938, f"Locale {loc} leaf key count is {len(loc_keys)}, expected 938"
        missing = sl_keys - loc_keys
        extra = loc_keys - sl_keys
        assert not missing, f"Locale {loc} missing keys: {missing}"
        assert not extra, f"Locale {loc} extra keys: {extra}"

        # 2. Value integrity (no empty or whitespace-only strings)
        empty = [k for k, v in flat_loc.items() if not v or not v.strip()]
        assert not empty, f"Locale {loc} has empty values: {empty}"

        # 3. Parameter parity
        for k, expected_params in param_map.items():
            val = flat_loc[k]
            actual_params = sorted(param_regex.findall(val))
            assert actual_params == expected_params, (
                f"Locale {loc} key '{k}' parameter mismatch: expected {expected_params}, got {actual_params}"
            )

        print(f"✔ [PASS] {loc}: 938 keys, 100% parity, 0 empty, 8/8 parameterized placeholders match verbatim")

if __name__ == '__main__':
    main()
