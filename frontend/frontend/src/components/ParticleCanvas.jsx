import { useEffect, useRef } from 'react';

const PALETTE = ['#534AB7','#7F77DD','#1D9E75','#5DCAA5','#3C3489','#AFA9EC'];

export default function ParticleCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, W, H, particles = [], rings = [], tick = 0;
    const rand = (a, b) => Math.random() * (b - a) + a;
    const color = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

    class Particle {
      reset(init = false) {
        this.x  = rand(0, W);
        this.y  = init ? rand(0, H) : (Math.random() > 0.5 ? -4 : H + 4);
        this.r  = rand(0.8, 2.6);
        this.vx = rand(-0.4, 0.4);
        this.vy = rand(-0.4, 0.4);
        this.c  = color();
        this.a  = rand(0.28, 0.7);
        this.ph = rand(0, Math.PI * 2);
        this.ps = rand(0.018, 0.036);
      }
      constructor() { this.reset(true); }
      update() {
        this.x += this.vx; this.y += this.vy; this.ph += this.ps;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        const a = this.a * (0.65 + 0.35 * Math.sin(this.ph));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.c + Math.round(a * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
    }

    class Ring {
      constructor() {
        this.x = rand(0, W); this.y = rand(0, H);
        this.r = 0; this.max = rand(55, 120);
        this.spd = rand(0.4, 0.7); this.c = color(); this.dead = false;
      }
      update() {
        this.r += this.spd;
        this.a = 0.22 * (1 - this.r / this.max);
        if (this.r >= this.max) this.dead = true;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.strokeStyle = this.c + Math.round(this.a * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 0.9; ctx.stroke();
      }
    }

    function connections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 115) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(127,119,221,${(0.13*(1-d/115)).toFixed(3)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.fillStyle = '#080519';
      ctx.fillRect(0, 0, W, H);
      connections();
      particles.forEach(p => { p.update(); p.draw(); });
      tick++;
      if (tick % 90 === 0) rings.push(new Ring());
      rings = rings.filter(r => !r.dead);
      rings.forEach(r => { r.update(); r.draw(); });
      raf = requestAnimationFrame(loop);
    }

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    resize();
    for (let i = 0; i < 90; i++) particles.push(new Particle());
    loop();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}