// Procedural WebGL2 Optical Field & Precision Titanium Wave Interference Shader
export function initHeroCanvas(
  canvas: HTMLCanvasElement | null,
  getAccentColor?: () => [number, number, number]
): () => void {
  if (!canvas) return () => {};
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
  });
  if (!gl) return () => {};

  const vsSource = `#version 300 es
  in vec2 a_pos;
  out vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }`;

  const fsSource = `#version 300 es
  precision highp float;
  in vec2 v_uv;
  out vec4 outColor;

  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_res;
  uniform float u_isDark;
  uniform vec3 u_accent;
  uniform float u_scroll;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_res.x / max(u_res.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    vec2 mPos = (u_mouse - 0.5) * vec2(aspect, 1.0);
    float dist = length(p - mPos);

    // Subtle harmonic wave field + precision contour rings
    float n1 = noise(p * 2.1 + vec2(u_time * 0.05, -u_time * 0.03 + u_scroll * 0.4));
    float n2 = noise(p * 4.6 - vec2(u_time * 0.035, u_time * 0.02));
    float field = n1 * 0.62 + n2 * 0.38;

    // Mouse-reactive optical ripple
    float ripple = sin(dist * 18.0 - u_time * 1.4) * exp(-dist * 2.4) * 0.08;
    float contour = abs(fract((field + ripple) * 8.0) - 0.5);
    float line = smoothstep(0.475, 0.496, contour);

    // Precision architectural coordinate grid fades in near cursor
    vec2 gridUv = fract(p * 12.0);
    float gridLine = step(0.975, max(gridUv.x, gridUv.y)) * exp(-dist * dist * 3.8);

    float glow = exp(-dist * dist * 2.1);
    float halo = exp(-dist * dist * 7.5);

    vec3 darkBg = vec3(0.031, 0.035, 0.047);     // #08090C
    vec3 lightBg = vec3(0.961, 0.965, 0.973);    // #F5F6F8
    vec3 baseCol = mix(lightBg, darkBg, u_isDark);

    vec3 col = baseCol;
    col = mix(col, u_accent, glow * (u_isDark > 0.5 ? 0.24 : 0.12));
    col += u_accent * halo * (u_isDark > 0.5 ? 0.14 : 0.07);
    col += u_accent * line * (u_isDark > 0.5 ? 0.11 : 0.065);
    col += u_accent * gridLine * (u_isDark > 0.5 ? 0.12 : 0.08);

    outColor = vec4(col, 1.0);
  }`;

  const compile = (type: number, src: string): WebGLShader | null => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };

  const prog = gl.createProgram();
  if (!prog) return () => {};
  const vs = compile(gl.VERTEX_SHADER, vsSource);
  const fs = compile(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    gl.deleteProgram(prog);
    return () => {};
  }
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteProgram(prog);
    return () => {};
  }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');
  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uIsDark = gl.getUniformLocation(prog, 'u_isDark');
  const uAccent = gl.getUniformLocation(prog, 'u_accent');
  const uScroll = gl.getUniformLocation(prog, 'u_scroll');

  let mouseX = 0.68;
  let mouseY = 0.52;
  let targetX = 0.68;
  let targetY = 0.52;
  let curAccent: [number, number, number] = [0.231, 0.51, 0.965];
  let rafId = 0;

  const resize = () => {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    targetX = (e.clientX - rect.left) / rect.width;
    targetY = 1.0 - (e.clientY - rect.top) / rect.height;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = performance.now();

  const render = (now: number) => {
    resize();
    mouseX += (targetX - mouseX) * 0.075;
    mouseY += (targetY - mouseY) * 0.075;

    const targetAcc = getAccentColor ? getAccentColor() : [0.231, 0.51, 0.965];
    curAccent[0] += (targetAcc[0] - curAccent[0]) * 0.08;
    curAccent[1] += (targetAcc[1] - curAccent[1]) * 0.08;
    curAccent[2] += (targetAcc[2] - curAccent[2]) * 0.08;

    const isDark =
      document.documentElement.getAttribute('data-theme') !== 'light' ? 1.0 : 0.0;
    const t = prefersReduced ? 0.0 : (now - start) * 0.001;
    const scrollProgress = Math.min(1, window.scrollY / Math.max(window.innerHeight, 1));

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(prog);
    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, mouseX, mouseY);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uIsDark, isDark);
    gl.uniform3f(uAccent, curAccent[0], curAccent[1], curAccent[2]);
    gl.uniform1f(uScroll, scrollProgress);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!prefersReduced) {
      rafId = requestAnimationFrame(render);
    }
  };

  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('resize', resize);
  };
}
