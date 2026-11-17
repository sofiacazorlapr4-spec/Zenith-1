import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initHeroCanvas } from '../webgl/heroCanvas';
import { initSpecsCanvas } from '../webgl/specsCanvas';
import {
  FINISH_META,
  FinishId,
  STORAGE_OPTIONS,
  SiliconMode,
  StorageLabel,
  formatPrice,
} from '../types/zenith';
import { ResilientImage } from './ResilientImage';
import heroStudioImg from '../assets/images/zenith_hero_studio_1794950811220.jpg';
import showcaseChassisImg from '../assets/images/zenith_showcase_chassis_1794950811553.jpg';
import showcaseDisplayImg from '../assets/images/zenith_showcase_display_1794950812099.jpg';
import showcaseOpticsImg from '../assets/images/zenith_showcase_optics_1794950812620.jpg';
import showcaseTwilightImg from '../assets/images/zenith_showcase_twilight_1794950813995.jpg';
import compareNightImg from '../assets/images/zenith_compare_night_1794950814031.jpg';
import bentoSiliconImg from '../assets/images/zenith_bento_silicon_1794950814902.jpg';
import bentoProfileImg from '../assets/images/zenith_bento_profile_1794950815033.jpg';

gsap.registerPlugin(ScrollTrigger);

const SHOWCASE_STAGES = [
  {
    src: showcaseChassisImg,
    alt: 'Zenith 1 descansando sobre basalto oscuro mostrando su chasis unibody de titanio Grado 5',
    title: 'Titanio Grado 5',
    sub: 'Monolito unibody de 6,9 mm fresado en bloque sólido aeroespacial.',
  },
  {
    src: showcaseDisplayImg,
    alt: 'Pantalla LTPO AMOLED sin bordes de Zenith 1 iluminada en un estudio arquitectónico',
    title: 'Pantalla Infinita 144 Hz',
    sub: 'Panel LTPO AMOLED de 6,8 pulgadas con 3.200 nits de brillo pico real.',
  },
  {
    src: showcaseOpticsImg,
    alt: 'Detalle macro del módulo óptico periscópico triple con lentes de zafiro de Zenith 1',
    title: 'Óptica Periscópica',
    sub: 'Sensor principal de 1 pulgada con lentes de zafiro y revestimiento antirreflejo.',
  },
  {
    src: showcaseTwilightImg,
    alt: 'Zenith 1 sobre piedra húmeda al anochecer con sellado hidrofóbico IP68',
    title: 'Sellado Hidrofóbico IP68',
    sub: 'Diseñado para resistir lluvia, polvo y jornadas intensas sin concesiones.',
  },
];

export function HomeView({
  theme,
  onChangeTheme,
  finish,
  onSelectFinish,
  storage,
  price,
  onSelectStorage,
  onAddToBag,
  onOpenArchitecture,
  pendingAnchor,
  onClearPendingAnchor,
}: {
  theme: 'dark' | 'light';
  onChangeTheme: (next: 'dark' | 'light') => void;
  finish: FinishId;
  onSelectFinish: (next: FinishId) => void;
  storage: StorageLabel;
  price: number;
  onSelectStorage: (nextStorage: StorageLabel, nextPrice: number) => void;
  onAddToBag: () => void;
  onOpenArchitecture: () => void;
  pendingAnchor: string | null;
  onClearPendingAnchor: () => void;
}) {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [captionBlur, setCaptionBlur] = useState<boolean>(false);
  const [splitPct, setSplitPct] = useState<number>(50);
  const [splitAnimate, setSplitAnimate] = useState<boolean>(false);
  const [siliconMode, setSiliconMode] = useState<SiliconMode>('npu');

  const homeRootRef = useRef<HTMLDivElement | null>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const specsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const tiltWrapRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const showcaseRef = useRef<HTMLElement | null>(null);
  const frameRefs = useRef<(HTMLElement | null)[]>([]);
  const bentoGridRef = useRef<HTMLDivElement | null>(null);
  const compWrapRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const stageIdxRef = useRef<number>(0);
  const stageTimerRef = useRef<number | null>(null);
  const finishRef = useRef<FinishId>(finish);

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const cleanupHeroGl = initHeroCanvas(
      heroCanvasRef.current,
      () => FINISH_META[finishRef.current].accentRgb
    );
    const cleanupSpecsGl = initSpecsCanvas(specsCanvasRef.current);

    let lenis: InstanceType<typeof Lenis> | null = null;
    let lenisTicker: ((time: number) => void) | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      lenisTicker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let velX = 0;
    let velY = 0;
    let glareX = 50;
    let glareY = 30;
    let targetGlareX = 50;
    let targetGlareY = 30;
    let tiltTicker: (() => void) | null = null;

    const heroStage = heroStageRef.current;
    const onHeroMove = (e: PointerEvent) => {
      if (!heroStage) return;
      const rect = heroStage.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = nx * 13;
      targetRotX = -ny * 9;
      targetGlareX = 50 - nx * 35;
      targetGlareY = 35 - ny * 35;
    };
    const onHeroLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetGlareX = 50;
      targetGlareY = 30;
    };

    if (heroStage && tiltWrapRef.current && !prefersReduced) {
      heroStage.addEventListener('pointermove', onHeroMove);
      heroStage.addEventListener('pointerleave', onHeroLeave);
      tiltTicker = () => {
        const ax = (targetRotX - curRotX) * 0.08;
        const ay = (targetRotY - curRotY) * 0.08;
        velX = (velX + ax) * 0.82;
        velY = (velY + ay) * 0.82;
        curRotX += velX;
        curRotY += velY;
        glareX += (targetGlareX - glareX) * 0.1;
        glareY += (targetGlareY - glareY) * 0.1;

        if (tiltWrapRef.current) {
          tiltWrapRef.current.style.transform = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
        }
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(147, 197, 253, 0.28) 0%, rgba(255, 255, 255, 0.08) 28%, transparent 65%)`;
        }
        if (shadowRef.current) {
          shadowRef.current.style.transform = `translateX(${(-curRotY * 1.4).toFixed(1)}px) scale(${1 - Math.abs(curRotX) * 0.01})`;
        }
      };
      gsap.ticker.add(tiltTicker);
    }

    const gsapCtx = gsap.context(() => {
      if (prefersReduced) return;

      const frames = frameRefs.current.filter(
        (el): el is HTMLElement => el !== null
      );
      if (showcaseRef.current && frames.length === 4) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top top',
            end: '+=280%',
            pin: true,
            scrub: 0.65,
            onUpdate: (self: { progress: number }) => {
              const t = self.progress * 3.5;
              let nextIdx = 0;
              if (t >= 3.07) nextIdx = 3;
              else if (t >= 2.02) nextIdx = 2;
              else if (t >= 0.97) nextIdx = 1;

              if (nextIdx !== stageIdxRef.current) {
                stageIdxRef.current = nextIdx;
                setCaptionBlur(true);
                if (stageTimerRef.current !== null) {
                  window.clearTimeout(stageTimerRef.current);
                }
                stageTimerRef.current = window.setTimeout(() => {
                  stageTimerRef.current = null;
                  setActiveStage(nextIdx);
                  setCaptionBlur(false);
                }, 100);
              }
            },
          },
        });

        const wipeStarts = [0.25, 1.3, 2.35];
        frames.forEach((frame, i) => {
          if (i === 0) return;
          tl.fromTo(
            frame,
            { clipPath: 'inset(0 0 0 100%)' },
            { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: 0.8 },
            wipeStarts[i - 1]
          );
        });
        tl.set({}, {}, 3.5);
      }

      if (bentoGridRef.current) {
        gsap.from('.reveal-tile', {
          y: 28,
          scale: 0.96,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    }, homeRootRef);

    return () => {
      if (stageTimerRef.current !== null) {
        window.clearTimeout(stageTimerRef.current);
        stageTimerRef.current = null;
      }
      cleanupHeroGl();
      cleanupSpecsGl();
      gsapCtx.revert();
      if (tiltTicker) gsap.ticker.remove(tiltTicker);
      if (lenisTicker) gsap.ticker.remove(lenisTicker);
      lenis?.destroy();
      lenisRef.current = null;
      heroStage?.removeEventListener('pointermove', onHeroMove);
      heroStage?.removeEventListener('pointerleave', onHeroLeave);
    };
  }, []);

  useEffect(() => {
    if (!pendingAnchor) return;
    const timer = window.setTimeout(() => {
      const target = document.querySelector(pendingAnchor);
      if (target) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target as HTMLElement);
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
      onClearPendingAnchor();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pendingAnchor, onClearPendingAnchor]);

  const scrollToTarget = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el as HTMLElement);
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectStage = (idx: number) => {
    stageIdxRef.current = idx;
    setCaptionBlur(true);
    if (stageTimerRef.current !== null) {
      window.clearTimeout(stageTimerRef.current);
    }
    stageTimerRef.current = window.setTimeout(() => {
      stageTimerRef.current = null;
      setActiveStage(idx);
      setCaptionBlur(false);
    }, 110);
    frameRefs.current.forEach((frame, i) => {
      if (!frame) return;
      frame.style.clipPath =
        i <= idx ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)';
    });
  };

  const updateSplit = (pct: number, animate: boolean) => {
    const clamped = Math.max(0, Math.min(100, pct));
    setSplitAnimate(animate);
    setSplitPct(clamped);
  };

  const handleCompPointerDown = (e: {
    currentTarget: HTMLDivElement;
    pointerId: number;
    clientX: number;
  }) => {
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerMove = (e: {
    currentTarget: HTMLDivElement;
    clientX: number;
  }) => {
    if (!isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateSplit(((e.clientX - rect.left) / rect.width) * 100, false);
  };

  const handleCompPointerUp = () => {
    isDraggingRef.current = false;
  };

  const activeStorageMeta =
    STORAGE_OPTIONS.find((s) => s.storage === storage) ?? STORAGE_OPTIONS[1];

  return (
    <div className="home-view-root" ref={homeRootRef}>
      {/* SECTION 1: Asymmetric Split Hero with WebGL2 Optical Field & 3D Spring Stage */}
      <section id="hero" className="hero">
        <canvas
          ref={heroCanvasRef}
          id="hero-gl-canvas"
          className="hero-canvas"
          aria-hidden="true"
        />

        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="meta-kicker">
              <span>Titanio Grado 5</span>
              <span aria-hidden="true">·</span>
              <span>Chip Z1 de 3 nm</span>
              <span aria-hidden="true">·</span>
              <span>Óptica de 1"</span>
            </div>

            <h1 className="hero-title">El futuro en tus manos.</h1>
            <p className="hero-sub">
              Presentamos Zenith 1. Un monolito de titanio de 6,9 mm con
              inteligencia neuronal local, pantalla LTPO de 144 Hz y óptica
              periscópica de calibre cinematográfico.
            </p>

            <div className="hero-actions">
              <a
                href="#reservar"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('#reservar');
                }}
              >
                Configurar Zenith 1
              </a>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onOpenArchitecture}
              >
                Ver despiece e I+D
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17L17 7M17 7H8M17 7V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="hero-toolbar">
              <span className="toolbar-label">Iluminación de estudio</span>
              <div
                className="segmented-inline"
                role="group"
                aria-label="Cambiar iluminación de página"
              >
                <button
                  type="button"
                  className={`seg-inline-btn${theme === 'dark' ? ' is-active' : ''}`}
                  onClick={() => onChangeTheme('dark')}
                >
                  Obsidiana
                </button>
                <button
                  type="button"
                  className={`seg-inline-btn${theme === 'light' ? ' is-active' : ''}`}
                  onClick={() => onChangeTheme('light')}
                >
                  Titanio claro
                </button>
              </div>
            </div>
          </div>

          <div className="hero-stage" ref={heroStageRef} id="hero-stage">
            <div
              className="phone-tilt-wrap"
              ref={tiltWrapRef}
              id="phone-tilt-wrap"
            >
              <ResilientImage
                src={heroStudioImg}
                alt="Smartphone Zenith 1 en acabado titanio cepillado flotando en ángulo arquitectónico"
                className="phone-hero-img"
                dataFinish={finish}
              />
              <div
                className="phone-glare"
                ref={glareRef}
                aria-hidden="true"
              />
            </div>
            <div className="phone-shadow" ref={shadowRef} aria-hidden="true" />

            <div
              className="hero-swatches"
              role="radiogroup"
              aria-label="Seleccionar acabado de Zenith 1"
            >
              {(Object.keys(FINISH_META) as FinishId[]).map((key) => {
                const meta = FINISH_META[key];
                const isActive = finish === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    className={`swatch-btn${isActive ? ' is-active' : ''}`}
                    data-finish={key}
                    aria-checked={isActive}
                    aria-label={`Acabado ${meta.name}`}
                    onClick={() => onSelectFinish(key)}
                  >
                    <span
                      className="swatch-dot"
                      style={{ background: meta.dot }}
                    />
                    <span>{meta.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Pinned 4-Angle Environmental Showcase */}
      <div className="showcase-pin-host">
        <section id="diseno" ref={showcaseRef} className="showcase-pin">
          <div className="showcase-viewport" id="showcase-viewport">
            <div className="showcase-frames" id="showcase-frames">
              {SHOWCASE_STAGES.map((stage, i) => (
                <figure
                  key={stage.src}
                  ref={(el: HTMLElement | null) => {
                    frameRefs.current[i] = el;
                  }}
                  className={`showcase-frame${i === 0 ? ' is-active' : ''}`}
                  data-index={i}
                >
                  <ResilientImage
                    src={stage.src}
                    alt={stage.alt}
                    className="showcase-img"
                  />
                </figure>
              ))}
            </div>

            <div className="showcase-hud">
              <div
                className={`showcase-caption${captionBlur ? ' is-blurring' : ''}`}
                id="showcase-caption"
              >
                <span className="caption-index tabular">
                  0{activeStage + 1} / 0{SHOWCASE_STAGES.length}
                </span>
                <h2 className="caption-title" id="caption-title">
                  {SHOWCASE_STAGES[activeStage].title}
                </h2>
                <p className="caption-sub" id="caption-sub">
                  {SHOWCASE_STAGES[activeStage].sub}
                </p>
              </div>

              <div
                className="showcase-dots"
                role="tablist"
                aria-label="Ángulos de hardware"
              >
                {SHOWCASE_STAGES.map((stage, i) => (
                  <button
                    key={stage.title}
                    type="button"
                    role="tab"
                    aria-selected={activeStage === i}
                    className={`stage-dot${activeStage === i ? ' is-active' : ''}`}
                    aria-label={`Ver ${stage.title}`}
                    onClick={() => selectStage(i)}
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 3: Interactive Optical Night Comparison Slider */}
      <section id="optica" className="optical-section">
        <div className="container optical-grid">
          <div
            className="comparison-wrap"
            ref={compWrapRef}
            id="comparison-wrap"
            onPointerDown={handleCompPointerDown}
            onPointerMove={handleCompPointerMove}
            onPointerUp={handleCompPointerUp}
            onPointerCancel={handleCompPointerUp}
          >
            <div className="comparison-layer">
              <ResilientImage
                src={compareNightImg}
                alt="Captura nocturna con Motor Óptico Zenith RAW de 14 bits"
                className="comparison-img"
              />
              <span className="comparison-label comparison-label-right">
                Zenith RAW 14-bit
              </span>
            </div>

            <div
              className="comparison-layer comparison-std"
              id="comparison-std"
              style={{
                clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
                transition: splitAnimate
                  ? 'clip-path 360ms var(--ease-out)'
                  : 'none',
              }}
            >
              <ResilientImage
                src={compareNightImg}
                alt="Captura nocturna con sensor convencional sin motor computacional Zenith"
                className="comparison-img comparison-img-std"
              />
              <span className="comparison-label comparison-label-left">
                Sensor convencional
              </span>
            </div>

            <div
              className={`comparison-handle${
                splitPct <= 2 || splitPct >= 98 ? ' is-edge' : ''
              }`}
              id="comparison-handle"
              role="slider"
              tabIndex={0}
              aria-label="Comparar sensor convencional y motor óptico Zenith RAW"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(splitPct)}
              style={{
                left: `clamp(22px, ${splitPct}%, calc(100% - 22px))`,
                transition: splitAnimate
                  ? 'left 360ms var(--ease-out)'
                  : 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') updateSplit(splitPct - 8, true);
                if (e.key === 'ArrowRight') updateSplit(splitPct + 8, true);
              }}
            >
              <div className="handle-line" />
              <div className="handle-knob">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 7L3 12L8 17M16 7L21 12L16 17"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="optical-copy">
            <h2 className="section-title">Luz extrema sin ruido.</h2>
            <p className="section-sub">
              El sensor apilado de 1 pulgada captura un 140% más de fotones en
              baja luz, preservando reflejos reales y sombras limpias sin
              sobreprocesado artificial.
            </p>

            <div
              className="segmented-control"
              role="tablist"
              aria-label="Modo de comparación óptica"
            >
              <button
                type="button"
                role="tab"
                className={`seg-btn${splitPct <= 5 ? ' is-active' : ''}`}
                aria-selected={splitPct <= 5}
                onClick={() => updateSplit(0, true)}
              >
                Zenith RAW 14-bit
              </button>
              <button
                type="button"
                role="tab"
                className={`seg-btn${splitPct >= 95 ? ' is-active' : ''}`}
                aria-selected={splitPct >= 95}
                onClick={() => updateSplit(100, true)}
              >
                Sensor estándar
              </button>
            </div>

            <div className="optical-metrics">
              <div className="metric-item">
                <span className="metric-value">f/1,4</span>
                <span className="metric-label">Apertura variable</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">1,0"</span>
                <span className="metric-label">Sensor principal</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">5×</span>
                <span className="metric-label">Zoom periscópico</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Asymmetric 3-Tile Engineering Bento */}
      <section id="rendimiento" className="bento-section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-header-stack">
              <h2 className="section-title">Arquitectura sin límites.</h2>
              <p className="section-sub">
                Silicio propio de 3 nanómetros, batería de alta densidad y
                chasis estructural en titanio. Arrastra el plano 3D para
                inspeccionar el chasis.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onOpenArchitecture}
            >
              Ficha técnica completa
            </button>
          </div>

          <div className="bento-grid" ref={bentoGridRef}>
            <article className="bento-tile bento-tall reveal-tile">
              <ResilientImage
                src={bentoSiliconImg}
                alt="Procesador móvil Zenith Z1 de 3 nanómetros sobre disipador de cámara de vapor"
                className="bento-img"
              />
              <div className="bento-footer bento-footer-tall">
                <div>
                  <h3 className="bento-title">
                    {siliconMode === 'npu'
                      ? 'Motor Neuronal Z1 · 85 TOPS'
                      : 'GPU Ray Tracing · 120 fps'}
                  </h3>
                  <p className="bento-sub">
                    {siliconMode === 'npu'
                      ? 'Arquitectura de 3 nm con inferencia local privada sin latencia en la nube.'
                      : 'Sombreado por hardware sostenido gracias a su cámara de vapor de grafeno.'}
                  </p>
                </div>

                <div
                  className="bento-mode-switch"
                  role="tablist"
                  aria-label="Modo de rendimiento del chip Z1"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={siliconMode === 'npu'}
                    className={`bento-mode-btn${siliconMode === 'npu' ? ' is-active' : ''}`}
                    onClick={() => setSiliconMode('npu')}
                  >
                    NPU 85 TOPS
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={siliconMode === 'gpu'}
                    className={`bento-mode-btn${siliconMode === 'gpu' ? ' is-active' : ''}`}
                    onClick={() => setSiliconMode('gpu')}
                  >
                    GPU 120 fps
                  </button>
                </div>
              </div>
            </article>

            <article className="bento-tile bento-top reveal-tile">
              <ResilientImage
                src={bentoProfileImg}
                alt="Perfil ultrafino de 6,9 mm del chasis de titanio de Zenith 1"
                className="bento-img"
              />
              <div className="bento-footer">
                <h3 className="bento-title">5.600 mAh Silicio-Carbono</h3>
                <p className="bento-sub">
                  Hasta 42 horas de autonomía real y carga al 80% en 18 minutos.
                </p>
              </div>
            </article>

            <article className="bento-tile bento-bottom reveal-tile">
              <canvas
                ref={specsCanvasRef}
                id="specs-gl-canvas"
                className="specs-canvas"
                aria-label="Modelo wireframe 3D interactivo del chasis de Zenith 1"
              />
              <div className="bento-footer bento-footer-specs">
                <div>
                  <h3 className="bento-title">6,9 mm · 184 g</h3>
                  <p className="bento-sub">Arrastra para rotar el chasis 3D</p>
                </div>
                <span className="spec-meta-text">Titanio Gr. 5</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 5: Interactive Finish & Storage Configurator + Order */}
      <section id="reservar" className="order-section">
        <div className="container order-grid">
          <div className="order-preview" id="order-preview">
            <div className="order-plinth" aria-hidden="true" />
            <ResilientImage
              src={heroStudioImg}
              alt="Vista previa configurada de Zenith 1"
              className="order-phone-img"
              dataFinish={finish}
              style={{ transform: `scale(${activeStorageMeta.scale})` }}
            />
            <span className="order-preview-meta">
              {FINISH_META[finish].name} · {activeStorageMeta.shortLabel}
            </span>
          </div>

          <div className="order-panel">
            <h2 className="section-title">Zenith 1</h2>
            <p className="order-price" id="order-price">
              {formatPrice(price)}
            </p>

            <div className="config-group">
              <span className="config-label">Acabado de titanio</span>
              <div className="option-row" id="order-finish-row">
                {(Object.keys(FINISH_META) as FinishId[]).map((key) => {
                  const meta = FINISH_META[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`config-option${
                        finish === key ? ' is-active' : ''
                      }`}
                      onClick={() => onSelectFinish(key)}
                    >
                      <span
                        className="dot"
                        style={{ background: meta.dot }}
                      />
                      <span>{meta.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="config-group">
              <span className="config-label">Almacenamiento y memoria</span>
              <div className="option-row" id="order-storage-row">
                {STORAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.storage}
                    type="button"
                    className={`config-option${
                      storage === opt.storage ? ' is-active' : ''
                    }`}
                    onClick={() => {
                      onSelectStorage(opt.storage, opt.price);
                    }}
                  >
                    <span className="tabular">{opt.storage}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="spec-list">
              <div className="spec-row">
                <span className="spec-key">Pantalla</span>
                <span className="spec-val">6,8" LTPO AMOLED · 1–144 Hz</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">Procesador</span>
                <span className="spec-val">Zenith Z1 3 nm · 85 TOPS</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">Garantía</span>
                <span className="spec-val">3 años Zenith Care incluida</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-full"
              id="add-to-bag-btn"
              onClick={onAddToBag}
            >
              <span className="tabular">
                Añadir a la bolsa — {formatPrice(price)}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
