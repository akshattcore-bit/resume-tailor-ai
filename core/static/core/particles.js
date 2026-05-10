/* ═══════════════════════════════════════════════
   RESUME TAILOR AI — particles.js
   Neural network particle background
═══════════════════════════════════════════════ */
(function () {
  'use strict';

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;
  const COLORS = ['rgba(110,231,247,', 'rgba(167,139,250,', 'rgba(34,211,238,'];
  const COUNT  = Math.min(Math.floor(window.innerWidth / 12), 100);

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -8;
      this.vx = (Math.random() - .5) * .3;
      this.vy = Math.random() * .25 + .1;
      this.r  = Math.random() * 1.5 + .3;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const p = this.life / this.maxLife;
      this.alpha = p < .15 ? p / .15 : p > .75 ? 1 - (p - .75) / .25 : 1;
      this.alpha *= .5;
      if (this.life >= this.maxLife || this.y > H + 10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          const a = (1 - d / 100) * .04;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(110,231,247,${a})`;
          ctx.lineWidth   = .5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
    loop();
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
})();