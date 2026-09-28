/**
 * PipelineVisual
 * ------------------------------------------------------------------
 * An original, dependency-free canvas component that renders the
 * hero's "skill pipeline": a sequence of stage nodes connected by a
 * flowing curve, with particles animating along it to suggest data
 * moving through a system (extract -> train -> deploy -> monitor).
 *
 * Hovering (or tabbing to) a stage highlights its node and writes a
 * short description into an associated caption element, so the
 * component is both decorative and informative rather than pure
 * animation.
 *
 * No external libraries are used: only the Canvas 2D API and native
 * event listeners.
 */
export class PipelineVisual {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLElement} captionEl - element updated with stage copy
   * @param {Array<{label: string, detail: string}>} stages
   */
  constructor(canvas, captionEl, stages) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.captionEl = captionEl;
    this.stages = stages;
    this.particles = [];
    this.activeStage = null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this._resize = this._resize.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._tick = this._tick.bind(this);

    window.addEventListener("resize", this._resize);
    canvas.addEventListener("pointermove", this._onPointerMove);
    canvas.addEventListener("pointerleave", this._onPointerLeave);
    canvas.addEventListener("focus", () => this._setStage(0), true);

    this._resize();
    this._seedParticles();
    this._tick();
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.width = rect.width;
    this.height = rect.height;
    this._layoutNodes();
  }

  _layoutNodes() {
    const margin = 36;
    const usableWidth = this.width - margin * 2;
    const count = this.stages.length;
    this.nodes = this.stages.map((stage, i) => {
      const t = count === 1 ? 0 : i / (count - 1);
      const x = margin + usableWidth * t;
      const wobble = Math.sin(t * Math.PI) * (this.height * 0.28);
      const y = this.height * 0.62 - wobble;
      return { ...stage, x, y, r: 8 };
    });
  }

  _seedParticles(count = 18) {
    this.particles = Array.from({ length: count }, (_, i) => ({
      t: i / count,
      speed: 0.0009 + Math.random() * 0.0007,
    }));
  }

  _pathPoint(t) {
    // Sample the same curve implied by _layoutNodes using linear
    // segments between consecutive nodes for a lightweight path.
    const nodes = this.nodes;
    const segments = nodes.length - 1;
    if (segments <= 0) return nodes[0];
    const scaled = t * segments;
    const i = Math.min(Math.floor(scaled), segments - 1);
    const localT = scaled - i;
    const a = nodes[i];
    const b = nodes[i + 1];
    return {
      x: a.x + (b.x - a.x) * localT,
      y: a.y + (b.y - a.y) * localT,
    };
  }

  _onPointerMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let nearest = null;
    let nearestDist = Infinity;
    this.nodes.forEach((node, index) => {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = index;
      }
    });
    if (nearest !== null && nearestDist < 40) {
      this._setStage(nearest);
    } else {
      this._setStage(null);
    }
  }

  _onPointerLeave() {
    this._setStage(null);
  }

  _setStage(index) {
    this.activeStage = index;
    if (index === null) {
      this.captionEl.textContent = this.defaultCaption || "";
      return;
    }
    const stage = this.nodes[index];
    this.captionEl.textContent = `${stage.label} — ${stage.detail}`;
  }

  _tick() {
    this._draw();
    if (!this.reducedMotion) {
      requestAnimationFrame(this._tick);
    }
  }

  _draw() {
    const { ctx, dpr, width, height } = this;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // connecting line
    ctx.beginPath();
    this.nodes.forEach((node, i) => {
      if (i === 0) ctx.moveTo(node.x, node.y);
      else ctx.lineTo(node.x, node.y);
    });
    ctx.strokeStyle = "#2a3548";
    ctx.lineWidth = 2;
    ctx.stroke();

    // particles flowing along the line
    if (!this.reducedMotion) {
      this.particles.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) p.t -= 1;
        const point = this._pathPoint(p.t);
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(63, 191, 173, 0.55)";
        ctx.fill();
      });
    }

    // stage nodes
    this.nodes.forEach((node, i) => {
      const isActive = i === this.activeStage;
      const radius = isActive ? node.r + 3 : node.r;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? "#e3a857" : "#3fbfad";
      ctx.fill();

      ctx.font =
        "600 12px Inter, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#8fa0be";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + radius + 16);
    });

    ctx.restore();
  }

  destroy() {
    window.removeEventListener("resize", this._resize);
  }
}
