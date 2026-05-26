/* ── Copy email to clipboard ────────────────────────────── */
const copyBtn = document.querySelector('.footer__copy');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const email = copyBtn.dataset.email;
    navigator.clipboard.writeText(email).then(() => {
      const span = copyBtn.querySelector('span');
      span.textContent = 'Copied!';
      setTimeout(() => { span.textContent = email; }, 2000);
    });
  });
}


const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Mobile menu toggle ─────────────────────────────────── */
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  navLinks.classList.toggle('open', !open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

/* ── Scroll-reveal ──────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.project, .about__text, .about__skills, .process__step, .section__header'
);
revealEls.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}


(function () {
  if (window.innerWidth < 1024) return;

  const canvas = document.querySelector('.koi-canvas');

/* ── Name typewriter ─────────────────────────────────────── */
const nameEl = document.querySelector('.hero__watermark');
if (nameEl) {
  const fullName = 'catherine lin';
  nameEl.textContent = '';
  let i = 0;
  function typeName() {
    if (i <= fullName.length) {
      nameEl.textContent = fullName.slice(0, i);
      i++;
      setTimeout(typeName, 60);
    }
  }
  setTimeout(typeName, 300);
}

  const heroEl = document.querySelector('.hero');
  if (!canvas || !heroEl) return;
  const ctx = canvas.getContext('2d');

  // ── Typewriter word cycling ──────────────────────────────
  const words = ['turning strategy into clarity.', 'bridging business and design.', 'building experiences that grow.', 'making complexity feel effortless.', 'designing with intention.'];
  let wordIdx = 0;
  const wordEl = document.querySelector('.hero__changing-word');

  const TYPE_SPEED   = 80;   // ms per character typed
  const DELETE_SPEED = 45;   // ms per character deleted
  const PAUSE_AFTER  = 1800; // ms to hold the full word before deleting
  const PAUSE_BEFORE = 200;  // ms to pause on empty before typing next

  function typeWord() {
    if (!wordEl) return;
    const word = words[wordIdx];
    let i = 0;

    // Type characters one by one
    function typeChar() {
      if (i <= word.length) {
        wordEl.textContent = word.slice(0, i);
        i++;
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        // Finished typing — pause then start deleting
        setTimeout(deleteWord, PAUSE_AFTER);
      }
    }

    // Delete characters one by one
    function deleteWord() {
      const current = wordEl.textContent;
      if (current.length > 0) {
        wordEl.textContent = current.slice(0, -1);
        setTimeout(deleteWord, DELETE_SPEED);
      } else {
        // Finished deleting — move to next word
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(typeWord, PAUSE_BEFORE);
      }
    }

    typeChar();
  }

  // Start after a short initial delay
  setTimeout(typeWord, 800);

  // ── Resize ──────────────────────────────────────────────
  function resize() {
    canvas.width  = heroEl.offsetWidth;
    canvas.height = heroEl.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Ripples ──────────────────────────────────────────────
  const ripples = [];

  function spawnRipple(x, y) {
    ripples.push({ x, y, r: 0, maxR: 90, alpha: 0.55 });
  }

  // ── Custom cursor ────────────────────────────────────────
  const cursorEl = document.querySelector('.hero__cursor');

  heroEl.addEventListener('mousemove', e => {
    cursorEl.style.left = e.clientX + 'px';
    cursorEl.style.top  = e.clientY + 'px';
    cursorEl.classList.add('visible');
  });

  heroEl.addEventListener('mouseleave', () => {
    cursorEl.classList.remove('visible');
  });

  // ── Click to spawn ripple ────────────────────────────────
  heroEl.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
  });

  function updateRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r     += 1.4;
      rp.alpha -= 0.55 / (rp.maxR / 1.4);
      if (rp.r >= rp.maxR || rp.alpha <= 0) ripples.splice(i, 1);
    }
  }

  function drawRipples() {
    ripples.forEach(rp => {
      [1, 0.45].forEach((m, i) => {
        const r = rp.r - i * 14;
        if (r <= 0) return;
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, r * 1.6, r * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100,160,200,${rp.alpha * m})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
    });
  }

  // ── Swim paths ───────────────────────────────────────────
  function fish1PathAt(t) {
    const w = canvas.width, h = canvas.height;
    return {
      x: w * 0.5  + w * 0.34 * Math.sin(t),
      y: h * 0.62 + h * 0.17 * Math.sin(2 * t + 0.4),
    };
  }
  function fish2PathAt(t) {
    const w = canvas.width, h = canvas.height;
    return {
      x: w * 0.5  + w * 0.29 * Math.sin(t + 0.7),
      y: h * 0.69 + h * 0.13 * Math.sin(2 * t + 1.1),
    };
  }

  function makeFish(tStart, speed, pathFn, rippleInterval) {
    const p = pathFn(tStart);
    return { t: tStart, speed, x: p.x, y: p.y, prevX: p.x, prevY: p.y,
             angle: 0, tailPhase: 0, tailSpeed: 0.08,
             rippleTimer: 0, rippleInterval, pathFn };
  }

  const fishes = [
    makeFish(0,       0.0026, fish1PathAt, 280),
    makeFish(Math.PI, 0.0026, fish2PathAt, 340),
  ];

  // ── Body outline ─────────────────────────────────────────
  // Long slim koi: head at +L on x-axis, tail peduncle at -L.
  // Half-width W is the maximum girth, occurring ~35% back from snout.
  // Ratio L:W ≈ 4:1 — much more elongated than before.
  function bodyPath(L, W) {
    ctx.beginPath();
    // Top edge: peduncle → widest point (upper) → shoulder → snout tip
    ctx.moveTo(-L * 0.78, -W * 0.12);
    ctx.bezierCurveTo(-L * 0.50, -W * 0.78,
                      -L * 0.10, -W * 1.00,
                       L * 0.20, -W * 0.96);
    // Wider shoulder, head stays broad and blunt rather than tapering sharply
    ctx.bezierCurveTo( L * 0.52, -W * 0.82,
                       L * 0.80, -W * 0.52,
                       L * 0.88, -W * 0.22);
    // Broad rounded snout — flat nose cap instead of a point
    ctx.bezierCurveTo( L * 0.94, -W * 0.08,
                       L * 0.94,  W * 0.08,
                       L * 0.88,  W * 0.22);
    // Bottom edge: snout → shoulder → widest (lower) → peduncle
    ctx.bezierCurveTo( L * 0.80,  W * 0.52,
                       L * 0.52,  W * 0.82,
                       L * 0.20,  W * 0.96);
    ctx.bezierCurveTo(-L * 0.10,  W * 1.00,
                      -L * 0.50,  W * 0.78,
                      -L * 0.78,  W * 0.12);
    ctx.closePath();
  }

  // ── Draw koi — takes a palette object ────────────────────
  function drawKoi(x, y, angle, tailPhase, pal) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // L = body half-length, W = max half-width  → ratio ~4.2 : 1
    const L = 130, W = 31;
    const sw = Math.sin(tailPhase);

    // ── Drop shadow ───────────────────────────────────────
    ctx.save();
    ctx.translate(3, 7); ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.ellipse(0, 0, L * 0.55, W * 0.50, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#000'; ctx.fill();
    ctx.restore();

    // ── Caudal fin — broad rounded fan ───────────────────
    // Attaches at peduncle. In the reference it fans outward like a
    // butterfly wing rather than a deep fork — two rounded lobes.
    const tp = -L * 0.78;   // peduncle x
    const fl = L * 0.42;    // fin length — more compact
    const fs = W * 1.6;     // reduced spread — not as wide
    const sg = sw * W * 0.7;

    ctx.save();
    ctx.translate(tp, 0);

    // Upper lobe — tapers more, less rounded
    ctx.beginPath();
    ctx.moveTo(0,  W * 0.12);
    ctx.bezierCurveTo(-fl * 0.25, -W * 0.05 + sg * 0.30,
                      -fl * 0.62, -fs * 0.55 + sg,
                      -fl,        -fs + sg * 1.2);
    ctx.bezierCurveTo(-fl * 0.72, -fs * 0.38 + sg * 0.75,
                      -fl * 0.30,  W * 0.02 + sg * 0.08,
                       0,         -W * 0.12);
    ctx.closePath();
    ctx.fillStyle = pal.tailA; ctx.fill();
    ctx.strokeStyle = pal.tailStroke; ctx.lineWidth = 1.2; ctx.stroke();
    // Rays
    [[-fl*0.18, sg*0.05, -fl*0.72, -fs*0.58+sg*0.95],
     [-fl*0.36, sg*0.12, -fl*0.86, -fs*0.80+sg*1.10],
     [-fl*0.54, sg*0.18, -fl*0.98, -fs+sg*1.18]]
      .forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
        ctx.strokeStyle = pal.rayStroke; ctx.lineWidth = 0.7; ctx.stroke();
      });

    // Lower lobe
    ctx.beginPath();
    ctx.moveTo(0, -W * 0.12);
    ctx.bezierCurveTo(-fl * 0.25,  W * 0.05 - sg * 0.30,
                      -fl * 0.62,  fs * 0.55 - sg,
                      -fl,         fs - sg * 1.2);
    ctx.bezierCurveTo(-fl * 0.72,  fs * 0.38 - sg * 0.75,
                      -fl * 0.30, -W * 0.02 - sg * 0.08,
                       0,          W * 0.12);
    ctx.closePath();
    ctx.fillStyle = pal.tailB; ctx.fill();
    ctx.strokeStyle = pal.tailStroke; ctx.lineWidth = 1.2; ctx.stroke();
    [[-fl*0.18,-sg*0.05,-fl*0.72,fs*0.58-sg*0.95],
     [-fl*0.36,-sg*0.12,-fl*0.86,fs*0.80-sg*1.10],
     [-fl*0.54,-sg*0.18,-fl*0.98,fs-sg*1.18]]
      .forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
        ctx.strokeStyle = pal.rayStroke; ctx.lineWidth = 0.7; ctx.stroke();
      });

    ctx.restore();

    // ── Pectoral fins — narrow elongated leaf/paddle shape ───
    // Root at shoulder, tapers to a distant point swept back & outward
    // Lower fin
    ctx.beginPath();
    ctx.moveTo(L * 0.32,  W * 0.82);
    ctx.bezierCurveTo(L * 0.18,  W * 1.20,
                     -L * 0.18,  W * 1.85,
                     -L * 0.50,  W * 1.52);
    ctx.bezierCurveTo(-L * 0.30,  W * 1.10,
                       L * 0.10,  W * 0.72,
                       L * 0.32,  W * 0.82);
    ctx.fillStyle = pal.pectFill; ctx.fill();
    ctx.strokeStyle = pal.pectStroke; ctx.lineWidth = 1.0; ctx.stroke();
    [[L*0.24, W*0.88, -L*0.32, W*1.66],
     [L*0.14, W*0.90, -L*0.42, W*1.52],
     [L*0.04, W*0.86, -L*0.46, W*1.32]]
      .forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
        ctx.strokeStyle = pal.rayStroke; ctx.lineWidth = 0.65; ctx.stroke();
      });

    // Upper fin
    ctx.beginPath();
    ctx.moveTo(L * 0.32, -W * 0.82);
    ctx.bezierCurveTo(L * 0.18, -W * 1.20,
                     -L * 0.18, -W * 1.85,
                     -L * 0.50, -W * 1.52);
    ctx.bezierCurveTo(-L * 0.30, -W * 1.10,
                       L * 0.10, -W * 0.72,
                       L * 0.32, -W * 0.82);
    ctx.fillStyle = pal.pectFill; ctx.fill();
    ctx.strokeStyle = pal.pectStroke; ctx.lineWidth = 1.0; ctx.stroke();
    [[L*0.24,-W*0.88,-L*0.32,-W*1.66],
     [L*0.14,-W*0.90,-L*0.42,-W*1.52],
     [L*0.04,-W*0.86,-L*0.46,-W*1.32]]
      .forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
        ctx.strokeStyle = pal.rayStroke; ctx.lineWidth = 0.65; ctx.stroke();
      });

    // ── Main body — flat white base ───────────────────────
    bodyPath(L, W);
    ctx.fillStyle = pal.bodyBase; ctx.fill();
    ctx.strokeStyle = pal.outline; ctx.lineWidth = 2.0; ctx.stroke();

    // ── Markings + scales — clipped inside body ───────────
    bodyPath(L, W);
    ctx.save(); ctx.clip();

    // Draw each organic patch using bezier blobs (not ellipses)
    pal.patches.forEach(drawPatch => drawPatch(ctx, L, W));

    // Scale rows drawn ON TOP of patches so they read across both colours
    // Smaller, denser arcs — clearly visible but not dominating
    const sr = W * 0.22;
    ctx.strokeStyle = pal.scaleStroke; ctx.lineWidth = 0.9;
    for (let row = 0, sy = -W * 0.84; sy < W * 0.88; sy += sr * 0.82, row++) {
      const ox = (row % 2) * sr * 0.50;
      for (let sx = -L * 0.58 + ox; sx < L * 0.80; sx += sr * 1.05) {
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI); ctx.stroke();
      }
    }

    ctx.restore();

    // ── Dorsal fin — near head, organic spine-following ridge ─
    ctx.beginPath();
    ctx.moveTo( L * 0.42,  W * 0.08);   // starts close behind the head
    // Leading edge rises steeply from the front
    ctx.bezierCurveTo( L * 0.36, -W * 0.30,
                       L * 0.18, -W * 0.44,
                       L * 0.02, -W * 0.40);
    // Top ridge — irregular, dips then rises slightly before descending
    ctx.bezierCurveTo(-L * 0.08, -W * 0.38,
                      -L * 0.18, -W * 0.32,
                      -L * 0.28, -W * 0.22);
    // Trailing edge tapers gently back down to spine
    ctx.bezierCurveTo(-L * 0.34, -W * 0.14,
                      -L * 0.36, -W * 0.04,
                      -L * 0.34,  W * 0.08);
    // Base runs back along spine to start
    ctx.bezierCurveTo(-L * 0.10,  W * 0.04,
                       L * 0.22,  W * 0.04,
                       L * 0.42,  W * 0.08);
    ctx.closePath();
    ctx.fillStyle = pal.dorsalFill; ctx.fill();
    ctx.strokeStyle = pal.outline; ctx.lineWidth = 1.2; ctx.stroke();
    // Rays follow the lean of the fin
    [[ L*0.38, W*0.06,  L*0.32,-W*0.26],
     [ L*0.22, W*0.04,  L*0.16,-W*0.40],
     [ L*0.04, W*0.04,  L*0.00,-W*0.38],
     [-L*0.12, W*0.06, -L*0.16,-W*0.28],
     [-L*0.26, W*0.07, -L*0.30,-W*0.16]]
      .forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
        ctx.strokeStyle = pal.rayStroke; ctx.lineWidth = 0.75; ctx.stroke();
      });

    // ── Pelvic fin ────────────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(-L * 0.02,  W * 0.88);
    ctx.bezierCurveTo(-L * 0.08,  W * 1.48,
                      -L * 0.24,  W * 1.44,
                      -L * 0.28,  W * 0.90);
    ctx.bezierCurveTo(-L * 0.20,  W * 0.70,
                      -L * 0.08,  W * 0.72,
                      -L * 0.02,  W * 0.88);
    ctx.closePath();
    ctx.fillStyle = pal.pectFill; ctx.fill();
    ctx.strokeStyle = pal.pectStroke; ctx.lineWidth = 0.9; ctx.stroke();

    // ── Head ──────────────────────────────────────────────
    // Mouth
    ctx.beginPath();
    ctx.moveTo(L * 0.86, -W * 0.14);
    ctx.quadraticCurveTo(L * 0.94, 0, L * 0.86,  W * 0.14);
    ctx.strokeStyle = pal.outline; ctx.lineWidth = 1.5; ctx.stroke();
    // Barbels
    ctx.strokeStyle = pal.outline; ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.moveTo(L*0.87,-W*0.15); ctx.quadraticCurveTo(L*0.98,-W*0.36,L*0.92,-W*0.52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(L*0.87, W*0.15); ctx.quadraticCurveTo(L*0.98, W*0.36,L*0.92, W*0.52); ctx.stroke();
    // Eye socket — top
    ctx.beginPath(); ctx.arc(L*0.70, -W*0.48, 4.0, 0, Math.PI*2);
    ctx.fillStyle = pal.eyeWhite; ctx.fill();
    ctx.strokeStyle = pal.outline; ctx.lineWidth = 1.0; ctx.stroke();
    // Pupil — top
    ctx.beginPath(); ctx.arc(L*0.70, -W*0.48, 2.0, 0, Math.PI*2);
    ctx.fillStyle = pal.pupil; ctx.fill();
    // Gleam — top
    ctx.beginPath(); ctx.arc(L*0.706, -W*0.52, 0.7, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.82)'; ctx.fill();
    // Eye socket — bottom
    ctx.beginPath(); ctx.arc(L*0.70,  W*0.48, 4.0, 0, Math.PI*2);
    ctx.fillStyle = pal.eyeWhite; ctx.fill();
    ctx.strokeStyle = pal.outline; ctx.lineWidth = 1.0; ctx.stroke();
    // Pupil — bottom
    ctx.beginPath(); ctx.arc(L*0.70,  W*0.48, 2.0, 0, Math.PI*2);
    ctx.fillStyle = pal.pupil; ctx.fill();
    // Gleam — bottom
    ctx.beginPath(); ctx.arc(L*0.706,  W*0.44, 0.7, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.82)'; ctx.fill();

    ctx.restore();
  }

  // ── Palettes ─────────────────────────────────────────────
  // patches: array of functions (ctx, L, W) => void
  // Each draws one organic colour region using bezier blobs

  const orangePal = {
    bodyBase:   '#f8f6f2',
    outline:    'rgba(48,18,6,0.55)',
    tailA:      'rgba(195,38,18,0.88)',
    tailB:      'rgba(172,30,12,0.82)',
    tailStroke: 'rgba(120,20,6,0.45)',
    rayStroke:  'rgba(38,38,38,0.18)',
    dorsalFill: 'rgba(195,38,18,0.52)',
    analFill:   'rgba(195,38,18,0.48)',
    pectFill:   'rgba(236,246,244,0.55)',   // pale teal-white like reference
    pectStroke: 'rgba(100,140,130,0.30)',
    eyeWhite:   '#fff8f0',
    pupil:      '#0e0400',
    scaleStroke:'rgba(48,18,6,0.18)',
    patches: [
      // ── Large back saddle — wraps over the rear two-thirds ──
      function(ctx, L, W) {
        ctx.beginPath();
        ctx.moveTo(-L*0.68, -W*0.08);
        ctx.bezierCurveTo(-L*0.55, -W*0.92, -L*0.20, -W*1.00, L*0.00, -W*0.88);
        ctx.bezierCurveTo( L*0.10, -W*0.82,  L*0.08, -W*0.62, L*0.02, -W*0.30);
        ctx.bezierCurveTo(-L*0.08,  W*0.30, -L*0.08,  W*0.82,  L*0.02,  W*0.30);
        ctx.bezierCurveTo( L*0.08,  W*0.62,  L*0.10,  W*0.82,  L*0.00,  W*0.88);
        ctx.bezierCurveTo(-L*0.20,  W*1.00, -L*0.55,  W*0.92, -L*0.68,  W*0.08);
        ctx.closePath();
        ctx.fillStyle = 'rgba(196,32,16,0.90)'; ctx.fill();
      },
      // ── Head cap — blob of red on the snout/forehead ────────
      function(ctx, L, W) {
        ctx.beginPath();
        ctx.moveTo(L*0.88,  W*0.20);
        ctx.bezierCurveTo(L*0.84,  W*0.48,  L*0.72,  W*0.72,  L*0.42,  W*0.68);
        ctx.bezierCurveTo(L*0.26,  W*0.68,  L*0.20,  W*0.48,  L*0.26,  W*0.16);
        ctx.bezierCurveTo(L*0.22, -W*0.18,  L*0.26, -W*0.52,  L*0.40, -W*0.70);
        ctx.bezierCurveTo(L*0.70, -W*0.72,  L*0.84, -W*0.42,  L*0.88, -W*0.20);
        ctx.bezierCurveTo(L*0.94, -W*0.06,  L*0.94,  W*0.06,  L*0.88,  W*0.20);
        ctx.closePath();
        ctx.fillStyle = 'rgba(196,32,16,0.88)'; ctx.fill();
      },
      // ── White break / gap in the middle of the body ──────────
      // Paints white back over the join between saddle and head cap,
      // creating the characteristic broken-pattern look of a kohaku koi
      function(ctx, L, W) {
        ctx.beginPath();
        ctx.moveTo(L*0.25, -W*0.80);
        ctx.bezierCurveTo(L*0.18, -W*0.65, L*0.12, -W*0.40, L*0.20, -W*0.10);
        ctx.bezierCurveTo(L*0.28,  W*0.22,  L*0.22,  W*0.55,  L*0.28,  W*0.78);
        ctx.bezierCurveTo(L*0.38,  W*0.72,  L*0.45,  W*0.50,  L*0.42,  W*0.18);
        ctx.bezierCurveTo(L*0.38, -W*0.10,  L*0.44, -W*0.42,  L*0.48, -W*0.66);
        ctx.bezierCurveTo(L*0.40, -W*0.76,  L*0.30, -W*0.82,  L*0.25, -W*0.80);
        ctx.closePath();
        ctx.fillStyle = '#f8f6f2'; ctx.fill();
      },
    ],
  };

  const bwPal = {
    bodyBase:   '#f5f5f5',
    outline:    'rgba(10,10,10,0.65)',
    tailA:      'rgba(28,28,28,0.85)',
    tailB:      'rgba(48,48,48,0.78)',
    tailStroke: 'rgba(8,8,8,0.48)',
    rayStroke:  'rgba(20,20,20,0.18)',
    dorsalFill: 'rgba(38,38,38,0.52)',
    analFill:   'rgba(38,38,38,0.50)',
    pectFill:   'rgba(225,232,230,0.52)',
    pectStroke: 'rgba(80,100,95,0.28)',
    eyeWhite:   '#f0f0f0',
    pupil:      '#040404',
    scaleStroke:'rgba(18,18,18,0.16)',
    patches: [
      // ── Large black saddle ───────────────────────────────────
      function(ctx, L, W) {
        ctx.beginPath();
        ctx.moveTo(-L*0.68, -W*0.08);
        ctx.bezierCurveTo(-L*0.52, -W*0.90, -L*0.18, -W*0.98, L*0.02, -W*0.86);
        ctx.bezierCurveTo( L*0.12, -W*0.78,  L*0.10, -W*0.58,  L*0.04, -W*0.28);
        ctx.bezierCurveTo(-L*0.06,  W*0.28, -L*0.06,  W*0.80,  L*0.04,  W*0.28);
        ctx.bezierCurveTo( L*0.10,  W*0.58,  L*0.12,  W*0.78,  L*0.02,  W*0.86);
        ctx.bezierCurveTo(-L*0.18,  W*0.98, -L*0.52,  W*0.90, -L*0.68,  W*0.08);
        ctx.closePath();
        ctx.fillStyle = 'rgba(22,22,22,0.88)'; ctx.fill();
      },
      // ── Black head blotch ────────────────────────────────────
      function(ctx, L, W) {
        ctx.beginPath();
        ctx.moveTo(L*0.88,  W*0.20);
        ctx.bezierCurveTo(L*0.82,  W*0.46,  L*0.68,  W*0.66,  L*0.40,  W*0.64);
        ctx.bezierCurveTo(L*0.24,  W*0.64,  L*0.18,  W*0.44,  L*0.24,  W*0.14);
        ctx.bezierCurveTo(L*0.20, -W*0.18,  L*0.24, -W*0.48,  L*0.38, -W*0.66);
        ctx.bezierCurveTo(L*0.68, -W*0.68,  L*0.82, -W*0.40,  L*0.88, -W*0.18);
        ctx.bezierCurveTo(L*0.93, -W*0.06,  L*0.93,  W*0.06,  L*0.88,  W*0.20);
        ctx.closePath();
        ctx.fillStyle = 'rgba(22,22,22,0.86)'; ctx.fill();
      },
      // ── White break between saddle and head cap ──────────────
      function(ctx, L, W) {
        ctx.beginPath();
        ctx.moveTo(L*0.26, -W*0.76);
        ctx.bezierCurveTo(L*0.18, -W*0.60, L*0.12, -W*0.36, L*0.20, -W*0.08);
        ctx.bezierCurveTo(L*0.28,  W*0.20,  L*0.22,  W*0.52,  L*0.28,  W*0.74);
        ctx.bezierCurveTo(L*0.36,  W*0.68,  L*0.44,  W*0.48,  L*0.40,  W*0.16);
        ctx.bezierCurveTo(L*0.36, -W*0.12,  L*0.42, -W*0.40,  L*0.46, -W*0.62);
        ctx.bezierCurveTo(L*0.38, -W*0.74,  L*0.30, -W*0.78,  L*0.26, -W*0.76);
        ctx.closePath();
        ctx.fillStyle = '#f5f5f5'; ctx.fill();
      },
    ],
  };

  const palettes = [orangePal, bwPal];

  // ── Main loop ────────────────────────────────────────────
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateRipples();
    drawRipples();

    fishes.forEach((fish, i) => {
      fish.prevX = fish.x; fish.prevY = fish.y;
      fish.t += fish.speed;
      const pos = fish.pathFn(fish.t);
      fish.x = pos.x; fish.y = pos.y;

      const dx = fish.x - fish.prevX;
      const dy = fish.y - fish.prevY;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        const target = Math.atan2(dy, dx);
        let diff = target - fish.angle;
        while (diff >  Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        fish.angle += diff * 0.12;
      }

      fish.tailPhase += fish.tailSpeed;

      fish.rippleTimer++;
      if (fish.rippleTimer >= fish.rippleInterval) {
        fish.rippleTimer = 0;
        spawnRipple(fish.x, fish.y);
      }

      drawKoi(fish.x, fish.y, fish.angle, fish.tailPhase, palettes[i]);
    });

    requestAnimationFrame(loop);
  }

  loop();
})();
