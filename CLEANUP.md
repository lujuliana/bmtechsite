# Confirmed Unused File Cleanup

Cleanup dates: 2026-07-13 and 2026-07-14

## Scope and verification

Only files with zero references across every local HTML, CSS, and JavaScript file were deleted. The check included ordinary asset URLs and filename occurrences in responsive `srcset` markup and Webflow-generated JavaScript.

No referenced asset, stylesheet, script, HTML page, or video was removed. Total space removed across both cleanups: **34,255,472 bytes (about 32.67 MiB)**.

## Deleted files

| Deleted file | Size | Why deletion was safe |
| --- | ---: | --- |
| `images/5ea21f15a489a1cf697b9edc0f97b0e4_bess-gemini_compressed-p-500.png` | 67,081 bytes | Unreferenced Webflow responsive derivative; zero references in HTML, CSS, or JavaScript. |
| `images/5ea21f15a489a1cf697b9edc0f97b0e4_bess-gemini_compressed-p-800.png` | 166,176 bytes | Unreferenced Webflow responsive derivative; zero references in HTML, CSS, or JavaScript. |
| `images/5ea21f15a489a1cf697b9edc0f97b0e4_bess-gemini_compressed-p-1080.png` | 300,594 bytes | Unreferenced Webflow responsive derivative; zero references in HTML, CSS, or JavaScript. |
| `images/5ea21f15a489a1cf697b9edc0f97b0e4_bess-gemini_compressed-p-1600.png` | 658,877 bytes | Unreferenced Webflow responsive derivative; zero references in HTML, CSS, or JavaScript. |
| `images/5ea21f15a489a1cf697b9edc0f97b0e4_bess-gemini_compressed-p-2000.png` | 1,028,325 bytes | Unreferenced Webflow responsive derivative; zero references in HTML, CSS, or JavaScript. |
| `images/power-network-p-500.jpg` | 27,176 bytes | Unreferenced Webflow responsive derivative; zero references in HTML, CSS, or JavaScript. The referenced base image `images/power-network.jpg` was retained. |
| `images/power-network-p-800.jpg` | 56,204 bytes | Unreferenced Webflow responsive derivative; zero references in HTML, CSS, or JavaScript. The referenced base image `images/power-network.jpg` was retained. |
| `videos/windfarm2-1.mp4` | 29,077,930 bytes | Exact filename had zero references across all 24 HTML, CSS, and JavaScript files scanned on 2026-07-14. The referenced `videos/windfarm2-1_mp4.mp4`, WebM, and poster files were verified separately and retained. |
| `videos/39991-424360905_small.mp4` | 2,873,109 bytes | Exact filename had zero references across all 24 HTML, CSS, and JavaScript files scanned on 2026-07-14. The referenced `videos/39991-424360905_small_mp4.mp4`, WebM, and poster files were verified separately and retained. |

## Video cleanup verification — 2026-07-14

Before deletion, an exact filename search was run against every `*.html`, `*.css`, and `*.js` file in the repository: 19 HTML files, three CSS files, and two JavaScript files (24 source files total).

The two requested deletion targets existed and each returned zero exact filename references:

- `videos/windfarm2-1.mp4` — 29,077,930 bytes; zero references.
- `videos/39991-424360905_small.mp4` — 2,873,109 bytes; zero references.

The similarly named files were checked independently before deletion. Each existed and returned four exact filename references, so none was deleted:

- `videos/windfarm2-1_mp4.mp4`
- `videos/windfarm2-1_webm.webm`
- `videos/windfarm2-1_poster.0000000.jpg`
- `videos/39991-424360905_small_mp4.mp4`
- `videos/39991-424360905_small_webm.webm`
- `videos/39991-424360905_small_poster.0000000.jpg`

After deletion, both requested paths were confirmed absent and all six protected files were confirmed present.

## Intentionally retained

- `images/bess-gemini_compressed.png` and `images/power-network.jpg` remain because the site references them.
- The referenced `_mp4.mp4`, WebM, and poster video assets remain because the site uses them.
- All other responsive image variants remain because they are referenced by HTML `srcset` attributes.
- All CSS and local JavaScript files remain because the current Webflow layout or behavior depends on them.
- Conditional cleanup candidates such as `security-old.html`, `ja/security-old.html`, and stale CSS/interaction rules remain because their removal requires redirect, coverage, or behavior decisions rather than a simple zero-reference asset check.
