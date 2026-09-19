# Social round-trip — the acceptance test for gate 34

Founder ask (2026-09-06): "this template needs real testing on social media as
part of its acceptance — upload to Instagram, Twitter, YouTube, TikTok and
round-trip to see if we are good."

One marked master per aspect, upload, download the platform's copy, run the
verify template on it. The verdict card + `.watermarkCheck.json` are the record.

## 1. Mint the masters (one per aspect — never let a platform re-frame the picture)

```bash
# 16:9 master — YouTube, X/Twitter (hero_4 is the ledger default; swap your own clip via --props)
m0saic make packages/sandbox/production/forensic-watermark-video-v1/master_candidate-01.mosaicx \
  -o ~/Desktop/wm-16x9.mp4

# 9:16 master — Instagram Reels, TikTok, YouTube Shorts (a PORTRAIT source, e.g. a phone clip)
m0saic make @m0saic/forensic/watermark/video/v1 -o ~/Desktop/wm-9x16.mp4 \
  --props '{"videoPath":"/absolute/path/to/portrait-clip.mp4","payloadHex":"0badcafe","keyHex":"5a5a0002"}'
```

Each render writes `<name>.watermark.json` beside the mp4 — that sidecar is the
decoder's recipe. Keep it with the master; it never goes to the platform.

Give every recipient / platform its OWN `payloadHex` + `keyHex` (the payload is
what the verdict recovers, the key scatters the cells so one recovered mark
can't de-stamp another).

## 2. Upload, then download the platform's copy

| Platform | Upload | Expect |
|---|---|---|
| YouTube | 16:9 master | re-encode (VP9/AV1/H.264), same aspect. Download at the source resolution if offered; 720p/1080p variants are uniform rescales — fine. |
| X / Twitter | 16:9 master | heavy re-encode, capped ~720p–1080p, same aspect. |
| Instagram Reel | 9:16 master | re-encode to 1080×1920, same aspect. Do NOT upload the 16:9 master here — Reels crop or pad it. |
| Instagram Feed | 16:9 master as "original" | if IG crops to 4:5 / 1:1 the mark breaks (crop ≠ pad). Prefer Reels for the test. |
| TikTok | 9:16 master | re-encode to 1080×1920; sometimes a small pad. |

Downloads: the platform's own download, a browser extension, or `yt-dlp` — any
copy the public could obtain is a valid test subject.

## 3. Verify each copy

```bash
m0saic make @m0saic/forensic/watermark/verify/v1 -o ~/Desktop/check-youtube.png \
  --props '{"videoPath":"/path/to/downloaded.mp4","sidecarPath":"~/Desktop/wm-16x9.watermark.json"}'
cat ~/Desktop/check-youtube.watermarkCheck.json | head -20
```

Read the card: green PASS + recovered payload = the platform copy still carries
the mark. Amber MISMATCH = a clean mark with a *different* payload (someone
else's copy). Red FAIL = no clean codeword / no watermark energy.

### If the platform PADDED the copy (bars top/bottom or left/right)

The cells no longer line up with the frame. Find the picture rect and pass it:

```bash
# cropdetect prints "crop=W:H:X:Y" for the picture inside the bars
ffmpeg -hide_banner -i downloaded.mp4 -t 3 -vf cropdetect=24:2:0 -f null - 2>&1 | grep -o 'crop=[0-9:]*' | tail -1
# e.g. crop=1080:608:0:656  →  contentRect "0,656,1080,608"  (x,y,w,h)
m0saic make @m0saic/forensic/watermark/verify/v1 -o ~/Desktop/check-tiktok.png \
  --props '{"videoPath":"/path/to/tiktok.mp4","sidecarPath":"…/wm-9x16.watermark.json","contentRect":"0,656,1080,608"}'
```

(Auto-detecting the bars inside the template is the queued follow-up.)

## 4. What was already measured locally (pre-audit, 2026-09-06)

| Channel | Verdict | worst \|score\| |
|---|---|---|
| native render | PASS | 16.2 |
| libx264 4 Mbps | PASS | 16.3 |
| libx264 2 Mbps | PASS | 15.8 |
| libx264 1 Mbps | PASS | 14.2 |
| libx264 500 kbps | PASS | 12.8 |
| 4 Mbps twice (double re-encode) | PASS | 16.3 |
| uniform downscale 1280×720 → 960×540 | PASS | 16.2 |
| letterboxed into 9:16, no contentRect | FAIL | — |
| letterboxed into 9:16, contentRect set | PASS | — |

Defaults at the time of the test: 64×36 grid (18 cells/bit), adaptive α
[0.004, 0.02] with the texture mask, edge softness 0.15 — see the candidate note
for the tuning that produced them.

## 5. Record the outcome

Paste each card's verdict line (or the `.watermarkCheck.json`) into the
`response` of `master_candidate-01.mosaicx` (File Details in Make), one line per
platform. Anything red → I re-tune (grid / α floor) and re-mint as
`master_candidate-02`.
