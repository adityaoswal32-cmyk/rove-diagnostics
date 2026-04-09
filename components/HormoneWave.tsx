'use client';

import { useEffect, useRef, useState } from 'react';

export default function HormoneWave() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [activePhase, setActivePhase] = useState(0);
  const tooltipRef = useRef({ visible: false, x: 0, y: 0, label: '', value: '' });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let animFrame;
    let progress = 0;
    let targetProgress = 0;
    
    // Store logical dimensions
    let logicalW = canvas.clientWidth || 800;
    let logicalH = canvas.clientHeight || 350;

    let lastW = 0, lastH = 0;
    const resize = () => {
      logicalW = canvas.clientWidth;
      logicalH = canvas.clientHeight;
      if (logicalW === 0 || logicalH === 0) return;
      if (logicalW === lastW && Math.abs(logicalH - lastH) < 80) return;
      lastW = logicalW; lastH = logicalH;
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Set actual size in memory (scaled for retina)
      canvas.width = logicalW * dpr;
      canvas.height = logicalH * dpr;
      
      // Normalize coordinate system to use css pixels
      ctx.scale(dpr, dpr);
    };

    resize();
    // Use ResizeObserver for more robust resizing
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    // Hormone curve data (normalized across 28-day cycle)
    const hormones = {
      FSH: {
        color: '#A3B18A',
        fillColor: 'rgba(163, 177, 138, 0.06)',
        label: 'FSH',
        curve: (x) => {
          // Broad early peak + smaller mid-cycle peak
          return 0.15 + 
                 0.3 * Math.exp(-Math.pow((x - 0.12) / 0.08, 2)) + 
                 0.18 * Math.exp(-Math.pow((x - 0.48) / 0.06, 2));
        },
        annotations: [
          { x: 0.12, label: 'FSH Peak', desc: 'Follicular recruitment' },
        ],
      },
      LH: {
        color: '#B08968',
        fillColor: 'rgba(176, 137, 104, 0.05)',
        label: 'LH',
        curve: (x) => {
          // Baseline + sharp ovulatory surge
          return 0.12 + 0.75 * Math.exp(-Math.pow((x - 0.48) / 0.025, 2));
        },
        annotations: [
          { x: 0.48, label: 'LH Surge', desc: 'Triggers ovulation' },
        ],
      },
      E3G: {
        color: '#D4A574',
        fillColor: 'rgba(212, 165, 116, 0.04)',
        label: 'E3G',
        curve: (x) => {
          // Gradual rise to pre-ovulatory peak, then sharp drop, then smaller luteal rise
          const w = x < 0.43 ? 0.18 : 0.06;
          return 0.15 + 
                 0.55 * Math.exp(-Math.pow((x - 0.43) / w, 2)) +
                 0.15 * Math.exp(-Math.pow((x - 0.7) / 0.15, 2));
        },
        annotations: [
          { x: 0.43, label: 'E3G Peak', desc: 'Pre-ovulatory window' },
        ],
      },
      PDG: {
        color: '#8B7D6B',
        fillColor: 'rgba(139, 125, 107, 0.04)',
        label: 'PDG',
        curve: (x) => {
          // Flat baseline, sharp rise post-ovulation, broad luteal peak
          const w = x < 0.72 ? 0.09 : 0.18;
          return 0.08 + 0.65 * Math.exp(-Math.pow((x - 0.72) / w, 2));
        },
        annotations: [
          { x: 0.72, label: 'PDG Peak', desc: 'Confirms ovulation' },
        ],
      },
    };

    const phases = [
      { name: 'Menstrual', start: 0, end: 0.18 },
      { name: 'Follicular', start: 0.18, end: 0.46 },
      { name: 'Ovulatory', start: 0.46, end: 0.57 },
      { name: 'Luteal', start: 0.57, end: 1 },
    ];

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const sectionTop = rect.top;
      const sectionH = rect.height;
      const scrollStart = viewH * 0.8;
      const scrollEnd = -sectionH * 0.3;

      if (sectionTop <= scrollStart && sectionTop >= scrollEnd) {
        const rawProgress = (scrollStart - sectionTop) / (scrollStart - scrollEnd);
        targetProgress = Math.max(0, Math.min(1, rawProgress));
      }

      const phaseIdx = phases.findIndex(
        (p) => targetProgress >= p.start && targetProgress < p.end
      );
      if (phaseIdx >= 0) setActivePhase(phaseIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const draw = () => {
      const w = logicalW;
      const h = logicalH;
      if (w === 0 || h === 0) {
        animFrame = requestAnimationFrame(draw);
        return;
      }
      
      ctx.clearRect(0, 0, w, h);

      // Smooth interpolation
      progress += (targetProgress - progress) * 0.08;

      const padX = 40;
      const padTop = 30;
      const padBottom = 40;
      const chartW = w - padX * 2;
      const chartH = h - padTop - padBottom;

      // Y-axis label
      ctx.save();
      ctx.fillStyle = 'rgba(28, 28, 28, 0.25)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(14, padTop + chartH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Concentration', 0, 0);
      ctx.restore();

      // X-axis (days)
      ctx.fillStyle = 'rgba(28, 28, 28, 0.25)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      for (let day = 1; day <= 28; day += 3) {
        const x = padX + ((day - 1) / 27) * chartW;
        ctx.fillText(`D${day}`, x, h - 10);
      }

      // Horizontal grid lines
      ctx.strokeStyle = 'rgba(214, 204, 194, 0.2)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 4; i++) {
        const y = padTop + (i / 4) * chartH;
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(padX + chartW, y);
        ctx.stroke();
      }

      // Phase backgrounds
      phases.forEach((phase, idx) => {
        const x1 = padX + phase.start * chartW;
        const x2 = padX + phase.end * chartW;
        ctx.fillStyle = idx === activePhase
          ? 'rgba(163, 177, 138, 0.06)'
          : 'transparent';
        ctx.fillRect(x1, padTop, x2 - x1, chartH);

        // Phase separator lines
        if (idx > 0) {
          ctx.strokeStyle = 'rgba(214, 204, 194, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(x1, padTop);
          ctx.lineTo(x1, padTop + chartH);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw progress line
      const progX = padX + progress * chartW;
      ctx.strokeStyle = 'rgba(176, 137, 104, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(progX, padTop);
      ctx.lineTo(progX, padTop + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw hormone curves with gradient fills
      const maxX = progress;
      Object.values(hormones).forEach((hormone) => {
        // Draw gradient fill under curve
        ctx.beginPath();
        let firstPoint = true;
        for (let px = 0; px <= chartW; px++) {
          const x = px / chartW;
          if (x > maxX) break;
          const y = hormone.curve(x);
          const canvasX = padX + px;
          const canvasY = padTop + chartH - y * chartH;
          if (firstPoint) {
            ctx.moveTo(canvasX, padTop + chartH);
            ctx.lineTo(canvasX, canvasY);
            firstPoint = false;
          } else {
            ctx.lineTo(canvasX, canvasY);
          }
        }
        // Close the fill area
        const lastPx = Math.min(maxX * chartW, chartW);
        ctx.lineTo(padX + lastPx, padTop + chartH);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
        gradient.addColorStop(0, hormone.fillColor);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw the line
        ctx.strokeStyle = hormone.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();

        for (let px = 0; px <= chartW; px++) {
          const x = px / chartW;
          if (x > maxX) break;
          const y = hormone.curve(x);
          const canvasX = padX + px;
          const canvasY = padTop + chartH - y * chartH;
          if (px === 0) ctx.moveTo(canvasX, canvasY);
          else ctx.lineTo(canvasX, canvasY);
        }
        ctx.stroke();

        // Draw glowing dot at current position
        if (maxX > 0.01) {
          const dotX = padX + maxX * chartW;
          const dotY = padTop + chartH - hormone.curve(maxX) * chartH;

          // Glow
          ctx.beginPath();
          ctx.arc(dotX, dotY, 8, 0, Math.PI * 2);
          ctx.fillStyle = hormone.color.replace(')', ', 0.12)').replace('rgb', 'rgba').replace('#', '');
          // Use a solid glow approach
          const glowGrad = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 10);
          glowGrad.addColorStop(0, hormone.fillColor);
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Dot
          ctx.fillStyle = hormone.color;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
          ctx.fill();

          // White center
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;

        // Draw annotations
        hormone.annotations.forEach(ann => {
          if (progress >= ann.x) {
            const annX = padX + ann.x * chartW;
            const annY = padTop + chartH - hormone.curve(ann.x) * chartH;

            // Annotation line
            ctx.strokeStyle = 'rgba(28, 28, 28, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(annX, annY - 8);
            ctx.lineTo(annX, annY - 28);
            ctx.stroke();
            ctx.setLineDash([]);

            // Annotation label bg
            ctx.fillStyle = 'rgba(28, 28, 28, 0.85)';
            const labelW = ctx.measureText(ann.label).width + 12;
            const labelH = 18;
            const labelX = annX - labelW / 2;
            const labelY = annY - 28 - labelH;

            // Rounded rect
            ctx.beginPath();
            const r = 3;
            ctx.moveTo(labelX + r, labelY);
            ctx.lineTo(labelX + labelW - r, labelY);
            ctx.arc(labelX + labelW - r, labelY + r, r, -Math.PI / 2, 0);
            ctx.lineTo(labelX + labelW, labelY + labelH - r);
            ctx.arc(labelX + labelW - r, labelY + labelH - r, r, 0, Math.PI / 2);
            ctx.lineTo(labelX + r, labelY + labelH);
            ctx.arc(labelX + r, labelY + labelH - r, r, Math.PI / 2, Math.PI);
            ctx.lineTo(labelX, labelY + r);
            ctx.arc(labelX + r, labelY + r, r, Math.PI, 3 * Math.PI / 2);
            ctx.closePath();
            ctx.fill();

            // Label text
            ctx.fillStyle = '#F7F5F2';
            ctx.font = '600 9px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ann.label, annX, labelY + 12.5);
          }
        });
      });

      if (isVisible) {
        animFrame = requestAnimationFrame(draw);
      }
    };

    let isVisible = false;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (animFrame) cancelAnimationFrame(animFrame);
        draw();
      }
    }, { threshold: 0 });
    visibilityObserver.observe(section);

    handleScroll();

    return () => {
      cancelAnimationFrame(animFrame);
      visibilityObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [activePhase]);

  const phases = [
    { name: 'Menstrual', days: 'Days 1–5' },
    { name: 'Follicular', days: 'Days 6–13' },
    { name: 'Ovulatory', days: 'Days 14–16' },
    { name: 'Luteal', days: 'Days 17–28' },
  ];

  const legend = [
    { name: 'FSH', color: '#A3B18A' },
    { name: 'LH', color: '#B08968' },
    { name: 'E3G', color: '#D4A574' },
    { name: 'PDG', color: '#8B7D6B' },
  ];

  return (
    <section className="hormone-wave" ref={sectionRef}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <p className="section-label" style={{ justifyContent: 'center' }}>Hormone Dynamics</p>
          <h2 className="section-title">
            Your cycle, <span className="text-highlight">visualized</span>.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Scroll to watch hormones shift across the menstrual cycle.
            Each line represents a different biomarker — revealing the intricate orchestration of your endocrine system.
          </p>
        </div>

        <canvas ref={canvasRef} className="hormone-wave__canvas" />

        <div className="hormone-wave__phases">
          {phases.map((phase, i) => (
            <div
              className={`hormone-wave__phase ${i === activePhase ? 'active' : ''}`}
              key={i}
            >
              <p className="hormone-wave__phase-name">{phase.name}</p>
              <p className="hormone-wave__phase-days">{phase.days}</p>
            </div>
          ))}
        </div>

        <div className="hormone-wave__legend">
          {legend.map((item, i) => (
            <div className="hormone-wave__legend-item" key={i}>
              <span
                className="hormone-wave__legend-dot"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
