// Interactive 3D Rotating Titanium Unibody & Triple Periscope Wireframe of Zenith 1
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function initSpecsCanvas(canvas: HTMLCanvasElement | null): () => void {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let yaw = 0.55;
  let pitch = -0.22;
  let targetYaw = 0.55;
  let targetPitch = -0.22;
  let isDragging = false;
  let isHovering = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let rafId = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const parent = canvas.parentElement;

  const onPointerDown = (e: PointerEvent) => {
    isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    parent?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      targetYaw += dx * 0.012;
      targetPitch = Math.max(-0.85, Math.min(0.85, targetPitch + dy * 0.01));
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
    } else if (isHovering && parent) {
      const rect = parent.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetPitch = -0.22 + ny * 0.35;
      targetYaw += nx * 0.025;
    }
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  const onEnter = () => {
    isHovering = true;
  };

  const onLeave = () => {
    isHovering = false;
    isDragging = false;
  };

  parent?.addEventListener('pointerdown', onPointerDown);
  parent?.addEventListener('pointermove', onPointerMove);
  parent?.addEventListener('pointerup', onPointerUp);
  parent?.addEventListener('pointercancel', onPointerUp);
  parent?.addEventListener('pointerenter', onEnter);
  parent?.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Build rounded rectangle perimeter points in XY at given Z
  const buildRoundedSlabLoop = (
    halfW: number,
    halfH: number,
    radius: number,
    z: number,
    segmentsPerCorner = 6
  ): Vec3[] => {
    const pts: Vec3[] = [];
    const corners = [
      { cx: halfW - radius, cy: -halfH + radius, start: -Math.PI / 2 },
      { cx: halfW - radius, cy: halfH - radius, start: 0 },
      { cx: -halfW + radius, cy: halfH - radius, start: Math.PI / 2 },
      { cx: -halfW + radius, cy: -halfH + radius, start: Math.PI },
    ];
    for (const c of corners) {
      for (let i = 0; i <= segmentsPerCorner; i++) {
        const a = c.start + (i / segmentsPerCorner) * (Math.PI / 2);
        pts.push({
          x: c.cx + Math.cos(a) * radius,
          y: c.cy + Math.sin(a) * radius,
          z,
        });
      }
    }
    return pts;
  };

  const buildCircleLoop = (
    cx: number,
    cy: number,
    z: number,
    r: number,
    segs = 20
  ): Vec3[] => {
    const pts: Vec3[] = [];
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, z });
    }
    return pts;
  };

  const frontOuter = buildRoundedSlabLoop(0.46, 0.96, 0.1, 0.045);
  const backOuter = buildRoundedSlabLoop(0.46, 0.96, 0.1, -0.045);
  const screenLoop = buildRoundedSlabLoop(0.42, 0.92, 0.08, 0.047);
  const vaporChamber = buildRoundedSlabLoop(0.28, 0.44, 0.04, 0.0);

  // Triple periscope camera rings on rear Z = -0.052
  const camModule = buildRoundedSlabLoop(0.2, 0.22, 0.06, -0.048);
  const lens1 = buildCircleLoop(-0.18, -0.66, -0.058, 0.068);
  const lens2 = buildCircleLoop(-0.18, -0.49, -0.058, 0.068);
  const lens3 = buildCircleLoop(-0.02, -0.575, -0.058, 0.062);

  const project = (v: Vec3, cx: number, cy: number, scale: number) => {
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    // Rotate Y (yaw)
    const x1 = v.x * cosY - v.z * sinY;
    const z1 = v.x * sinY + v.z * cosY;

    // Rotate X (pitch)
    const y2 = v.y * cosP - z1 * sinP;
    const z2 = v.y * sinP + z1 * cosP;

    const fov = 3.2;
    const persp = fov / (fov - z2);
    return {
      x: cx + x1 * scale * persp,
      y: cy + y2 * scale * persp,
      z: z2,
    };
  };

  const drawLoop = (
    pts: Vec3[],
    cx: number,
    cy: number,
    scale: number,
    stroke: string,
    lineWidth: number
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    for (let i = 0; i < pts.length; i++) {
      const p = project(pts[i], cx, cy, scale);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const draw = () => {
    resize();
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const strokeMain = isDark
      ? 'rgba(244, 246, 250, 0.24)'
      : 'rgba(13, 16, 23, 0.22)';
    const strokeSoft = isDark
      ? 'rgba(244, 246, 250, 0.12)'
      : 'rgba(13, 16, 23, 0.1)';
    const strokeAccent = isDark
      ? 'rgba(59, 130, 246, 0.88)'
      : 'rgba(37, 99, 235, 0.85)';

    if (!prefersReduced) {
      if (!isDragging && !isHovering) {
        targetYaw += 0.0055;
      }
      yaw += (targetYaw - yaw) * 0.1;
      pitch += (targetPitch - pitch) * 0.1;
    }

    const cx = w * 0.69;
    const cy = h * 0.45;
    const scale = Math.min(w, h) * 0.36;
    const lw = Math.max(1.2, w / 460);

    // Draw structural struts connecting front and back chassis
    ctx.beginPath();
    ctx.strokeStyle = strokeSoft;
    ctx.lineWidth = lw * 0.85;
    for (let i = 0; i < frontOuter.length; i += 4) {
      const pf = project(frontOuter[i], cx, cy, scale);
      const pb = project(backOuter[i], cx, cy, scale);
      ctx.moveTo(pf.x, pf.y);
      ctx.lineTo(pb.x, pb.y);
    }
    ctx.stroke();

    // Draw back shell & internal vapor chamber
    drawLoop(backOuter, cx, cy, scale, strokeMain, lw);
    drawLoop(vaporChamber, cx, cy, scale, strokeAccent, lw * 1.15);

    // Offset camera array slightly to top-left corner of back plate
    const shiftCam = (pts: Vec3[]) =>
      pts.map((p) => ({ x: p.x - 0.14, y: p.y - 0.57, z: p.z }));
    drawLoop(shiftCam(camModule), cx, cy, scale, strokeMain, lw);
    drawLoop(lens1, cx, cy, scale, strokeAccent, lw * 1.25);
    drawLoop(lens2, cx, cy, scale, strokeAccent, lw * 1.25);
    drawLoop(lens3, cx, cy, scale, strokeAccent, lw * 1.25);

    // Draw front chassis & bezel-less display
    drawLoop(frontOuter, cx, cy, scale, strokeMain, lw * 1.1);
    drawLoop(screenLoop, cx, cy, scale, strokeSoft, lw * 0.9);

    if (!prefersReduced) {
      rafId = requestAnimationFrame(draw);
    }
  };

  rafId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(rafId);
    parent?.removeEventListener('pointerdown', onPointerDown);
    parent?.removeEventListener('pointermove', onPointerMove);
    parent?.removeEventListener('pointerup', onPointerUp);
    parent?.removeEventListener('pointercancel', onPointerUp);
    parent?.removeEventListener('pointerenter', onEnter);
    parent?.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('resize', resize);
  };
}
