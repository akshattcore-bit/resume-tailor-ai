/* ═══════════════════════════════════════════════
   RESUME TAILOR AI — app.js
   Modular ResumeTailor object system
   Connects to Django /analyse/ endpoint
═══════════════════════════════════════════════ */
'use strict';

/* ──────────────────────────────────────────────
   CURSOR
────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-glow');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ──────────────────────────────────────────────
   NAVBAR SCROLL
────────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ──────────────────────────────────────────────
   CHAR COUNTER
────────────────────────────────────────────── */
(function initCounters() {
  const pairs = [
    ['resume-input', 'resume-count'],
    ['jd-input',     'jd-count'],
  ];
  pairs.forEach(([inputId, countId]) => {
    const input = document.getElementById(inputId);
    const count = document.getElementById(countId);
    if (!input || !count) return;
    input.addEventListener('input', () => {
      count.textContent = input.value.length.toLocaleString() + ' chars';
    });
  });
})();

/* ──────────────────────────────────────────────
   SAMPLE DATA
────────────────────────────────────────────── */
const SAMPLE_RESUME = `JOHN DOE
john.doe@email.com | +91-9876543210 | github.com/johndoe | linkedin.com/in/johndoe

EDUCATION
Bachelor of Computer Applications (BCA)
Galgotias University | 2025–2028 | CGPA: 8.5/10

EXPERIENCE
Software Developer Intern | WebCraft Solutions | Jan 2026–Present
• Worked on the company website and helped fix bugs
• Did backend work using Python
• Helped team with various projects
• Worked with databases

PROJECTS
Portfolio Website | HTML, CSS, JavaScript
• Made a personal portfolio website

Todo App | JavaScript
• Built a todo application with local storage

SKILLS
Python, JavaScript, HTML, CSS, Git, MySQL

CERTIFICATIONS
• freeCodeCamp Responsive Web Design`;

const SAMPLE_JD = `Frontend Developer — TechStartup Pvt. Ltd.

We are looking for a passionate Frontend Developer to join our growing engineering team.

REQUIREMENTS:
• 1+ years of experience with React.js and TypeScript
• Strong proficiency in Python and/or Node.js backend development
• Experience building and consuming REST APIs
• CI/CD pipeline experience (GitHub Actions, Jenkins)
• Containerisation with Docker
• AWS deployment experience (EC2, S3, Lambda)
• Unit Testing experience (Jest, pytest)
• Strong communication and teamwork skills
• Agile/Scrum methodology experience
• System Design fundamentals

RESPONSIBILITIES:
• Build scalable frontend features using React.js
• Collaborate with backend team on API integrations
• Write clean, testable, well-documented code
• Participate in code reviews and team standups
• Deploy and monitor applications on AWS`;

/* ──────────────────────────────────────────────
   TOAST
────────────────────────────────────────────── */
const Toast = {
  el:    document.getElementById('toast'),
  icon:  document.getElementById('toast-icon'),
  msg:   document.getElementById('toast-msg'),
  timer: null,
  show(icon, msg, duration = 3000) {
    if (!this.el) return;
    this.icon.textContent = icon;
    this.msg.textContent  = msg;
    this.el.classList.add('show');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.el.classList.remove('show'), duration);
  }
};

/* ──────────────────────────────────────────────
   LOADING SIMULATION
────────────────────────────────────────────── */
const Loader = {
  bar:   document.getElementById('loading-bar'),
  pct:   document.getElementById('loading-pct'),
  steps: ['ls1','ls2','ls3','ls4','ls5'],
  stepEls: null,
  _timer: null,
  _pct: 0,

  init() {
    this.stepEls = this.steps.map(id => document.getElementById(id));
    this.reset();
  },
  reset() {
    this._pct = 0;
    if (this.bar) this.bar.style.width = '0%';
    if (this.pct) this.pct.textContent = '0%';
    this.stepEls && this.stepEls.forEach((el, i) => {
      if (!el) return;
      el.className = 'ls-step' + (i === 0 ? ' active' : '');
    });
  },
  run(onComplete) {
    this.reset();
    const targets = [18, 35, 58, 78, 95];
    let stepIdx = 0;
    clearInterval(this._timer);

    this._timer = setInterval(() => {
      this._pct = Math.min(this._pct + Math.random() * 3 + 1, 95);
      const pct = Math.floor(this._pct);
      if (this.bar) this.bar.style.width = pct + '%';
      if (this.pct) this.pct.textContent = pct + '%';

      // Advance steps
      while (stepIdx < targets.length && pct >= targets[stepIdx]) {
        if (this.stepEls[stepIdx]) {
          this.stepEls[stepIdx].className = 'ls-step done';
        }
        stepIdx++;
        if (stepIdx < this.stepEls.length && this.stepEls[stepIdx]) {
          this.stepEls[stepIdx].className = 'ls-step active';
        }
      }

      if (pct >= 95) {
        clearInterval(this._timer);
        setTimeout(() => {
          if (this.bar) this.bar.style.width = '100%';
          if (this.pct) this.pct.textContent = '100%';
          onComplete && onComplete();
        }, 400);
      }
    }, 60);
  },
  stop() {
    clearInterval(this._timer);
  }
};

/* ──────────────────────────────────────────────
   RESULTS RENDERER
────────────────────────────────────────────── */
const Renderer = {
  renderScore(score) {
    // Animate number
    const numEl  = document.getElementById('score-num');
    const arcEl  = document.querySelector('.score-arc');
    const gradeEl = document.getElementById('score-grade');
    const descEl  = document.getElementById('score-desc');
    const fillEl  = document.getElementById('sbm-fill');

    if (!numEl) return;

    // Grade logic
    let grade, desc, color;
    if (score >= 85)      { grade = 'Excellent';  desc = 'Strong match! Your resume is highly optimised for this role.'; color = '#34d399'; }
    else if (score >= 70) { grade = 'Good';        desc = 'Good match with room to improve. Add the missing keywords.';  color = '#6ee7f7'; }
    else if (score >= 55) { grade = 'Fair';        desc = 'Moderate match. Significant improvements will boost interviews.'; color = '#fbbf24'; }
    else                  { grade = 'Needs Work';  desc = 'Low ATS match. Follow the suggestions to improve your score.';  color = '#f87171'; }

    if (gradeEl) { gradeEl.textContent = grade; gradeEl.style.color = color; }
    if (descEl)  descEl.textContent = desc;
    if (fillEl)  { fillEl.style.width = score + '%'; fillEl.style.background = `linear-gradient(90deg, ${color}, var(--violet))`; }

    // Animate number count up
    let cur = 0;
    const step = Math.ceil(score / 60);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, score);
      numEl.textContent = cur;
      if (cur >= score) clearInterval(timer);
    }, 25);

    // Animate arc: circumference = 2π×58 ≈ 364
    if (arcEl) {
      const offset = 364 - (364 * score / 100);
      setTimeout(() => { arcEl.style.strokeDashoffset = offset; }, 100);
    }
  },

  renderKeywords(matched, missing) {
    const mEl = document.getElementById('matched-chips');
    const xEl = document.getElementById('missing-chips');
    if (mEl) mEl.innerHTML = matched.map((kw, i) =>
      `<span class="kw-chip chip-match" style="animation-delay:${i * 40}ms">✓ ${kw}</span>`
    ).join('');
    if (xEl) xEl.innerHTML = missing.map((kw, i) =>
      `<span class="kw-chip chip-miss" style="animation-delay:${i * 40}ms">✗ ${kw}</span>`
    ).join('');
  },

  renderSuggestions(sugs) {
    const el = document.getElementById('suggestions-list');
    if (!el) return;
    el.innerHTML = sugs.map((s, i) => `
      <div class="sug-item" style="animation-delay:${i * 80}ms">
        <div class="sug-icon">${s.icon}</div>
        <div class="sug-body">
          <div class="sug-cat">${s.category}</div>
          <div class="sug-title">${s.title}</div>
          <div class="sug-detail">${s.detail}</div>
        </div>
      </div>
    `).join('');
  },

  renderRewrites(rewrites) {
    const el = document.getElementById('rewrites-list');
    if (!el) return;
    el.innerHTML = rewrites.map((r, i) => `
      <div class="rewrite-item" style="animation-delay:${i * 80}ms">
        <div class="rw-original">
          <div class="rw-label">✗ ORIGINAL (WEAK)</div>
          <div class="rw-text">${escHtml(r.original)}</div>
        </div>
        <div class="rw-rewritten">
          <div class="rw-label-new">✓ AI REWRITE (STRONG)</div>
          <div class="rw-text-new">${escHtml(r.rewritten)}</div>
        </div>
      </div>
    `).join('');
  },

  renderTailored(text) {
    const el = document.getElementById('tailored-output');
    if (el) el.textContent = text;
  }
};

/* ──────────────────────────────────────────────
   MAIN ResumeTailor OBJECT
────────────────────────────────────────────── */
const RT = {
  _tailoredText: '',

  init() {
    Loader.init();
    this._bindScroll();
  },

  _bindScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = document.getElementById('navbar')?.offsetHeight || 80;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 20, behavior: 'smooth' });
      });
    });
  },

  clearResume() { document.getElementById('resume-input').value = ''; document.getElementById('resume-count').textContent = '0 chars'; },
  clearJD()     { document.getElementById('jd-input').value = '';     document.getElementById('jd-count').textContent = '0 chars'; },

  loadSampleResume() {
    const el = document.getElementById('resume-input');
    el.value = SAMPLE_RESUME;
    document.getElementById('resume-count').textContent = SAMPLE_RESUME.length.toLocaleString() + ' chars';
    el.style.borderColor = 'rgba(110,231,247,.3)';
    setTimeout(() => el.style.borderColor = '', 800);
    Toast.show('📄', 'Sample resume loaded!');
  },

  loadSampleJD() {
    const el = document.getElementById('jd-input');
    el.value = SAMPLE_JD;
    document.getElementById('jd-count').textContent = SAMPLE_JD.length.toLocaleString() + ' chars';
    el.style.borderColor = 'rgba(167,139,250,.3)';
    setTimeout(() => el.style.borderColor = '', 800);
    Toast.show('🎯', 'Sample job description loaded!');
  },

  async analyse() {
    const resume  = document.getElementById('resume-input')?.value.trim();
    const jobDesc = document.getElementById('jd-input')?.value.trim();

    if (!resume)  { this._shake('resume-input'); return Toast.show('⚠️', 'Please paste your resume first.'); }
    if (!jobDesc) { this._shake('jd-input');     return Toast.show('⚠️', 'Please paste a job description.'); }
    if (resume.length < 80)  return Toast.show('⚠️', 'Resume seems too short. Please paste your full resume.');
    if (jobDesc.length < 50) return Toast.show('⚠️', 'Job description seems too short.');

    // Switch to loading
    this._showPanel('loading');

    // Scroll to tool
    const toolEl = document.getElementById('tool');
    if (toolEl) {
      const navH = document.getElementById('navbar')?.offsetHeight || 80;
      setTimeout(() => window.scrollTo({ top: toolEl.getBoundingClientRect().top + window.scrollY - navH - 20, behavior: 'smooth' }), 100);
    }

    // Disable button
    const btn = document.getElementById('analyse-btn');
    if (btn) btn.disabled = true;

    try {
      // Start loader animation
      let data = null;

      // Parallel: fetch + loader animation
      const [fetchResult] = await Promise.all([
        this._fetchAnalysis(resume, jobDesc),
        new Promise(resolve => Loader.run(resolve))
      ]);

      data = fetchResult;

      // Render results
      this._tailoredText = data.tailored_resume || '';
      Renderer.renderScore(data.ats_score);
      Renderer.renderKeywords(data.matched_keywords, data.missing_keywords);
      Renderer.renderSuggestions(data.suggestions);
      Renderer.renderRewrites(data.bullet_rewrites);
      Renderer.renderTailored(this._tailoredText);

      this._showPanel('results');
      Toast.show('✅', `Analysis complete! ATS Score: ${data.ats_score}%`, 4000);

    } catch (err) {
      console.error('Analysis error:', err);
      this._showPanel('input');
      Toast.show('❌', 'Analysis failed. Please try again.');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  async _fetchAnalysis(resume, jobDesc) {
    // Get Django CSRF token from cookie
    const csrf = this._getCookie('csrftoken') || '';

    const res = await fetch('/analyse/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken':  csrf,
      },
      body: JSON.stringify({ resume, job_desc: jobDesc }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  copyResume() {
    if (!this._tailoredText) return Toast.show('⚠️', 'No resume to copy yet.');
    navigator.clipboard.writeText(this._tailoredText).then(() => {
      const btn = document.getElementById('copy-btn');
      if (btn) {
        btn.classList.add('copied');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!`;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy Resume`;
        }, 2500);
      }
      Toast.show('✅', 'Tailored resume copied to clipboard!');
    }).catch(() => Toast.show('❌', 'Copy failed — please select and copy manually.'));
  },

  reset() {
    Loader.stop();
    this._showPanel('input');
    window.scrollTo({ top: document.getElementById('tool')?.offsetTop - 100 || 0, behavior: 'smooth' });
  },

  _showPanel(name) {
    const panels = {
      input:   document.getElementById('input-panel'),
      loading: document.getElementById('loading-screen'),
      results: document.getElementById('results-panel'),
    };
    Object.entries(panels).forEach(([key, el]) => {
      if (!el) return;
      el.style.display = key === name ? '' : 'none';
    });
  },

  _shake(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ], { duration: 400, easing: 'ease-in-out' });
    el.style.borderColor = 'var(--red)';
    setTimeout(() => el.style.borderColor = '', 600);
  },

  _getCookie(name) {
    const parts = document.cookie.split(';');
    for (const part of parts) {
      const [k, v] = part.trim().split('=');
      if (k === name) return decodeURIComponent(v || '');
    }
    return '';
  },
};

/* ──────────────────────────────────────────────
   SCROLL REVEAL
────────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.step-card, .feat-card, .result-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s var(--ease), transform .6s var(--ease)';
    observer.observe(el);
  });
})();

/* ──────────────────────────────────────────────
   HELPER
────────────────────────────────────────────── */
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

/* ──────────────────────────────────────────────
   BOOT
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => RT.init());
window.RT = RT; // Expose for inline onclick handlers

console.log('%c🧠 Resume Tailor AI — Ready', 'color:#6ee7f7;font-weight:bold;font-size:14px');