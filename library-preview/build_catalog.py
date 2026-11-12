#!/usr/bin/env python3
"""Build library-preview/data.js from the deployed playlist snapshot.

Source of truth for TOCs: hidden_files/library-refresh-2026-11-10/book_playlists.json
(the same snapshot the live bytebarhq.com/library pages were generated from,
2026-11-10). Chapter runtimes are not in the snapshot; the Library Edition
rebuild has not produced them yet, so course pages show counts, not runtimes.
Book totals on the home cards are the approved mock's "~" estimates and are
replaced by measured Library Edition runtimes as each book banks.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.expanduser(
    "~/workspace/goals/launch-a-passive-faceless-income-stream/"
    "hidden_files/library-refresh-2026-11-10/book_playlists.json")

# slug, playlist key, name, code, vendor, cat, accent, level, total(~), search
BOOKS = [
    ("secplus",  "secplus_sy0_701",   "Security+",                 "SY0-701",  "CompTIA",   "comptia", "#22D3EE", "Practitioner", "~7 h 24 m",  "security+ sy0-701 comptia security"),
    ("netplus",  "netplus_n10_009",   "Network+",                  "N10-009",  "CompTIA",   "comptia", "#60A5FA", "Practitioner", "~5 h 35 m",  "network+ n10-009 comptia networking"),
    ("aplus",    "aplus_combined",    "A+",                        "220-1201", "CompTIA",   "comptia", "#FBBF24", "Foundations",  "~3 h 05 m",  "a+ 220-1201 220-1202 comptia hardware"),
    ("linuxplus","linuxplus_xk0_006", "Linux+",                    "XK0-006",  "CompTIA",   "comptia", "#A78BFA", "Associate",    "~7 h 50 m",  "linux+ xk0-006 comptia linux"),
    ("ccna",     "ccna_200_301",      "CCNA",                      "200-301",  "Cisco",     "cisco",   "#3B82F6", "Associate",    "~3 h 40 m",  "ccna 200-301 cisco networking"),
    ("cissp",    "cissp",             "CISSP",                     "CISSP",    "ISC2",      "more",    "#F59E0B", "Expert",       "~2 h 35 m",  "cissp isc2 security management"),
    ("cysa",     "cysa_cs0_004",      "CySA+",                     "CS0-004",  "CompTIA",   "comptia", "#2DD4BF", "Expert",       "~2 h 50 m",  "cysa+ cs0-004 comptia analyst security"),
    ("pentest",  "pentest_pt0_003",   "PenTest+",                  "PT0-003",  "CompTIA",   "comptia", "#E879F9", "Expert",       "~3 h 10 m",  "pentest+ pt0-003 comptia penetration testing"),
    ("cka",      "cka",               "Kubernetes Administrator",  "CKA",      "CNCF",      "more",    "#F43F5E", "Expert",       "~3 h 00 m",  "cka kubernetes cncf administrator containers"),
    ("az104",    "az104",             "Azure Administrator",       "AZ-104",   "Microsoft", "more",    "#3896FF", "Associate",    "~3 h 25 m",  "az-104 azure administrator microsoft cloud"),
    ("aif",      "aif_c01",           "AI Practitioner",           "AIF-C01",  "AWS",       "aws",     "#FF9900", "Practitioner", "~2 h 15 m",  "aif-c01 aws ai practitioner artificial intelligence"),
    ("saa",      "saa_c03",           "Solutions Architect",       "SAA-C03",  "AWS",       "aws",     "#F97316", "Associate",    "~5 h 05 m",  "saa-c03 aws solutions architect associate"),
    ("clf",      "clf_c02",           "Cloud Practitioner",        "CLF-C02",  "AWS",       "aws",     "#4ADE80", "Foundations",  "~1 h 10 m",  "clf-c02 aws cloud practitioner foundations"),
]

TEALIGHT = [
    # slug, name, code, vendor, accent, level, meta line, search, units (None = TOC titles not in structured data)
    ("teas7",    "TEAS 7",    "TEAS 7",   "ATI",     "#F2C572", "Foundations",  "Start Here + 50-question marathon · ~1 h 05 m", "teas 7 ati nursing entrance",
     [("Start Here — TEAS 7, Mapped", None), ("TEAS 7 Marathon — 50 Questions, Every Answer Taught", None)]),
    ("nclex-rn", "NCLEX-RN",  "NCLEX-RN", "NCSBN",   "#F0A868", "Practitioner", "16 lessons · ~4 h 10 m", "nclex-rn nclex rn nursing registered nurse", None),
    ("nclex-pn", "NCLEX-PN",  "NCLEX-PN", "NCSBN",   "#E8A2B0", "Foundations",  "9 lessons · ~2 h 30 m", "nclex-pn nclex pn nursing practical nurse", None),
    ("hesi-a2",  "HESI A2",   "HESI A2",  "Elsevier","#D9A05B", "Foundations",  "Start Here + 50-question marathon · ~1 h 12 m", "hesi a2 nursing entrance exam",
     [("Start Here — HESI A2, Mapped", None), ("HESI A2 Marathon — 50 Questions, Every Answer Taught", None)]),
]

def main():
    playlists = json.load(open(SRC))
    books = []
    for slug, key, name, code, vendor, cat, acc, lvl, total, search in BOOKS:
        items = playlists[key]
        chapters = []
        for it in items:
            chapters.append({
                "n": it["pos"],                    # 0 = Start Here
                "title": it["title"],
                "yt": it.get("videoId"),
                "dur": None,                        # Library Edition runtime TBD
            })
        extra = " · covers 1201 & 1202" if slug == "aplus" else ""
        books.append({
            "slug": slug, "name": name, "code": code, "vendor": vendor,
            "cat": cat, "accent": acc, "level": lvl, "shelf": "it",
            "lessons": len(chapters), "total": total,
            "meta": "%d lessons · %s%s" % (len(chapters), total, extra),
            "search": search, "chapters": chapters,
        })
    for slug, name, code, vendor, acc, lvl, meta, search, units in TEALIGHT:
        chapters = None
        if units:
            chapters = [{"n": i, "title": t, "yt": None, "dur": None}
                        for i, (t, _) in enumerate(units)]
        books.append({
            "slug": slug, "name": name, "code": code, "vendor": vendor,
            "cat": "nursing", "accent": acc, "level": lvl, "shelf": "nursing",
            "lessons": 16 if slug == "nclex-rn" else (9 if slug == "nclex-pn" else 2),
            "total": None, "meta": meta, "search": search,
            "chapters": chapters,   # None → chapter list still being built
        })
    out = "// Generated by build_catalog.py — do not hand-edit.\n"
    out += "window.BB_BOOKS = " + json.dumps(books, ensure_ascii=False, indent=1) + ";\n"
    with open(os.path.join(HERE, "data.js"), "w") as f:
        f.write(out)
    print("books:", len(books), "| secplus chapters:", len(books[0]["chapters"]))

if __name__ == "__main__":
    main()
