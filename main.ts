// Leonida Trophy Guide — the hand-in program (Node 22, standard library only).
// The guide itself is plain static files under app/ (index.html, style.css,
// app.js, data/trophies.json): no build step, nothing fetched over the network
// at runtime. This program's only job is to hand those files in: copy app/
// and screenshots/ from the folder beside this file into the output directory
// and write dossier.json there, using the vendored make.fun library. The
// dossier is the summary the judge reads — screenshots, first-load files and
// bytes, and the source — so it must be exactly what buildDossier writes from
// the same files; vendor/makefun-frontend.ts is left untouched for that reason.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_OUTPUT_DIR is unset and the output goes
// to /output. Run it twice into two different directories and diff them:
// both runs must write identical bytes. Nothing here depends on the clock,
// the network or the order the filesystem lists files, so the two runs agree
// byte for byte — the dossier carries no timestamps.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps: text_max_bytes shapes the dossier text; the screenshot
// and app caps refuse an entry the scorer would refuse (at most 4 screenshots,
// each at most 256 KiB; app/ at most 993 files and directories and 48 MiB —
// app/ shares /output's own 1000-entry cap with screenshots/ and dossier.json).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
