import { useState } from 'react';
import { ResilientImage } from '../components/ResilientImage';
import heroStudioImg from '../assets/images/zenith_hero_studio_1794950811220.jpg';
import showcaseChassisImg from '../assets/images/zenith_showcase_chassis_1794950811553.jpg';
import showcaseDisplayImg from '../assets/images/zenith_showcase_display_1794950812099.jpg';
import showcaseOpticsImg from '../assets/images/zenith_showcase_optics_1794950812620.jpg';
import bentoSiliconImg from '../assets/images/zenith_bento_silicon_1794950814902.jpg';
import bentoProfileImg from '../assets/images/zenith_bento_profile_1794950815033.jpg';

type LoadProfile = 'daily' | 'cinema' | 'neural';
type AdvantageCategory = 'all' | 'hardware' | 'optics' | 'ai';

interface ComponentSpec {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  image: string;
  alt: string;
  summary: string;
  specs: { label: string; value: string }[];
  telemetry: Record<LoadProfile, { power: string; temp: string; efficiency: string }>;
}

const COMPONENTS: ComponentSpec[] = [
  {
    id: 'soc',
    index: '01',
    name: 'SoC Neuronal Zenith Z1',
    subtitle: 'Litografía GAA de 3 nanómetros · 85 TOPS locales',
    image: bentoSiliconImg,
    alt: 'Microchip Zenith Z1 de 3 nanómetros junto a cámara de vapor de titanio',
    summary:
      'Diseñado desde cero para ejecutar modelos generativos, traducción simultánea y procesamiento RAW de 14 bits directamente en el dispositivo sin enviar datos a servidores externos.',
    specs: [
      { label: 'Arquitectura CPU', value: '12 núcleos (4 Prime 3,85 GHz + 8 Eficiencia)' },
      { label: 'Acelerador Neuronal', value: 'NPU de 24 núcleos · 85 TOPS INT8' },
      { label: 'Gráficos GPU', value: 'Ray Tracing por hardware · 120 fps sostenidos' },
      { label: 'Memoria Unificada', value: 'LPDDR5X-9600 · 76,8 GB/s' },
      { label: 'Caché del sistema', value: '48 MB compartidos de baja latencia' },
    ],
    telemetry: {
      daily: { power: '1,4 W', temp: '31,2 °C', efficiency: '99%' },
      cinema: { power: '6,8 W', temp: '37,4 °C', efficiency: '96%' },
      neural: { power: '5,9 W', temp: '36,1 °C', efficiency: '98%' },
    },
  },
  {
    id: 'optics',
    index: '02',
    name: 'Sistema Óptico Periscópico',
    subtitle: 'Sensor principal de 1,0" · Prisma flotante 5×',
    image: showcaseOpticsImg,
    alt: 'Módulo óptico periscópico triple con recubrimiento antirreflejo de zafiro',
    summary:
      'Tres sensores apilados de gran superficie acoplados a elementos asféricos de cristal de zafiro con 12 capas de deposición atómica para eliminar destellos nocturnos.',
    specs: [
      { label: 'Sensor Principal', value: '50 MP · 1,0" · Apertura variable f/1,4–f/4,0' },
      { label: 'Teleobjetivo Periscópico', value: '50 MP · Zoom óptico 5× · Macro a 12 cm' },
      { label: 'Ultra Gran Angular', value: '48 MP · 122° · Corrección óptica sin recorte' },
      { label: 'Estabilización', value: 'Suspensión magnética 5 ejes (10.000 corr./s)' },
      { label: 'Captura de vídeo', value: '4K a 120 fps Log de 10 bits · Dolby Vision' },
    ],
    telemetry: {
      daily: { power: '0,8 W', temp: '29,8 °C', efficiency: '99%' },
      cinema: { power: '4,6 W', temp: '36,5 °C', efficiency: '97%' },
      neural: { power: '2,4 W', temp: '33,0 °C', efficiency: '98%' },
    },
  },
  {
    id: 'display',
    index: '03',
    name: 'Pantalla LTPO Micro-Lens',
    subtitle: '6,82" 1–144 Hz · PWM 3.840 Hz sin parpadeo',
    image: showcaseDisplayImg,
    alt: 'Pantalla LTPO AMOLED sin bordes de Zenith 1 sobre mesa arquitectónica',
    summary:
      'Una matriz microscópica de lentes (MLA) redirige los fotones emitidos hacia el observador, logrando 3.200 nits reales al aire libre con un 28% menos de consumo eléctrico.',
    specs: [
      { label: 'Resolución', value: '3200 × 1440 px · 515 ppp · 10 bits nativos' },
      { label: 'Refresco Dinámico', value: 'LTPO 4.0 adaptativo de 1 Hz a 144 Hz' },
      { label: 'Brillo Pico / HBM', value: '3.200 nits pico · 1.850 nits sostenidos' },
      { label: 'Confort Ocular', value: 'Atenuación PWM de alta frecuencia a 3.840 Hz' },
      { label: 'Precisión de Color', value: '100% DCI-P3 · Calibración ΔE < 0,4' },
    ],
    telemetry: {
      daily: { power: '1,1 W', temp: '30,4 °C', efficiency: '98%' },
      cinema: { power: '2,9 W', temp: '34,8 °C', efficiency: '95%' },
      neural: { power: '1,5 W', temp: '31,8 °C', efficiency: '97%' },
    },
  },
  {
    id: 'chassis',
    index: '04',
    name: 'Chasis Titanio Grado 5',
    subtitle: 'Aleación Ti-6Al-4V · Fresado CNC de 74 minutos',
    image: showcaseChassisImg,
    alt: 'Chasis de titanio cepillado Grado 5 de Zenith 1 sobre basalto',
    summary:
      'Mecanizado a partir de un bloque sólido de titanio aeroespacial unido por difusión en estado sólido a un núcleo interno de aluminio reciclado para optimizar la rigidez y el reparto térmico.',
    specs: [
      { label: 'Material Externo', value: 'Titanio Grado 5 (Ti-6Al-4V) cepillado PVD' },
      { label: 'Dimensiones y Peso', value: '6,9 mm de grosor · 184 g balanceados 50/50' },
      { label: 'Protección Frontal', value: 'Cristal nanocerámico de doble intercambio iónico' },
      { label: 'Sellado Ambiental', value: 'IP68 presurizado hasta 6 m durante 45 min' },
      { label: 'Reparabilidad', value: 'Tapa trasera y batería con fijación mecánica sin pegamento' },
    ],
    telemetry: {
      daily: { power: '0,0 W', temp: '28,5 °C', efficiency: '100%' },
      cinema: { power: '0,0 W', temp: '35,2 °C', efficiency: '96%' },
      neural: { power: '0,0 W', temp: '33,9 °C', efficiency: '98%' },
    },
  },
  {
    id: 'battery',
    index: '05',
    name: 'Batería Silicio-Carbono',
    subtitle: '5.600 mAh en 6,9 mm · 1.600 ciclos de vida útil',
    image: bentoProfileImg,
    alt: 'Perfil ultrafino de 6,9 mm de Zenith 1 que alberga la batería de silicio-carbono',
    summary:
      'El ánodo de silicio-carbono de tercera generación almacena un 22% más de densidad energética que las celdas convencionales de grafito, permitiendo superar los dos días de uso sin engrosar el chasis.',
    specs: [
      { label: 'Capacidad Típica', value: '5.600 mAh · Química Silicio-Carbono 3.ª gen' },
      { label: 'Carga por Cable', value: '100 W USB-C PD · 0 a 80% en 18 minutos' },
      { label: 'Carga Inalámbrica', value: '50 W magnética bidireccional de alta eficiencia' },
      { label: 'Longevidad', value: '> 90% de capacidad tras 1.600 ciclos completos' },
      { label: 'Gestión Térmica', value: 'Controlador dual con corte adaptativo nocturno' },
    ],
    telemetry: {
      daily: { power: '2,2 W', temp: '29,2 °C', efficiency: '99%' },
      cinema: { power: '9,4 W', temp: '36,9 °C', efficiency: '94%' },
      neural: { power: '7,1 W', temp: '35,0 °C', efficiency: '96%' },
    },
  },
  {
    id: 'thermal',
    index: '06',
    name: 'Cámara de Vapor y Grafeno',
    subtitle: '0,35 mm de grosor · Disipación de 1.950 W/m·K',
    image: heroStudioImg,
    alt: 'Vista arquitectónica completa de Zenith 1 con disipación térmica integrada',
    summary:
      'Un circuito bifásico sellado al vacío distribuye el calor del SoC Z1 a través de nueve láminas de grafeno pirolítico, evitando caídas de rendimiento tras 45 minutos de renderizado o grabación 4K.',
    specs: [
      { label: 'Área de Cobertura', value: '4.820 mm² cubriendo SoC, RAM y módulo óptico' },
      { label: 'Láminas Conductoras', value: '9 capas de grafeno de 1.950 W/m·K' },
      { label: 'Reducción Térmica', value: '-6,4 °C en superficie frente a chasis de vidrio' },
      { label: 'Fluido Interno', value: 'Microcámara capilar de titanio de 0,35 mm' },
      { label: 'Estabilidad Sostenida', value: '97% de rendimiento continuo en test de estrés 1h' },
    ],
    telemetry: {
      daily: { power: '0,0 W', temp: '29,0 °C', efficiency: '100%' },
      cinema: { power: '0,0 W', temp: '37,1 °C', efficiency: '97%' },
      neural: { power: '0,0 W', temp: '35,4 °C', efficiency: '98%' },
    },
  },
];

const RD_PHASES = [
  {
    phase: 'Fase 01',
    period: 'Meses 01 — 10',
    title: 'Metalurgia y unión en estado sólido',
    detail:
      'Se evaluaron 42 aleaciones experimentales para resolver el problema histórico del titanio: su baja conductividad térmica. La solución fue fusionar por presión en vacío un marco exterior de Titanio Grado 5 con un núcleo interior de aluminio reciclado de alta transferencia térmica.',
    metric: '42 aleaciones probadas',
  },
  {
    phase: 'Fase 02',
    period: 'Meses 11 — 22',
    title: 'Co-diseño óptico de prisma flotante',
    detail:
      'Para incorporar un sensor de 1 pulgada sin crear un módulo trasero voluminoso, doblamos la trayectoria de la luz mediante un prisma de vidrio de fluorita suspendido magnéticamente. El silicio Z1 y los sensores se calibraron conjuntamente para leer señales RAW de 14 bits en tiempo real.',
    metric: '10.000 ajustes/seg en OIS',
  },
  {
    phase: 'Fase 03',
    period: 'Meses 23 — 32',
    title: 'Laboratorio de estrés y pruebas extremas',
    detail:
      'Más de 1.400 unidades de preproducción fueron sometidas a cámaras climáticas árticas, desiertos salinos, caídas repetitivas sobre granito y ciclos de torsión continua antes de aprobar la geometría definitiva de 6,9 mm.',
    metric: '1.400 prototipos validados',
  },
  {
    phase: 'Fase 04',
    period: 'Meses 33 — 36',
    title: 'Calibración interferométrica unitaria',
    detail:
      'Cada Zenith 1 que sale de ensamblaje pasa por una estación óptica láser que mide la distancia focal exacta de su módulo triple y calibra el perfil colorimétrico de su panel AMOLED con una desviación máxima ΔE menor a 0,4.',
    metric: 'ΔE < 0,4 garantizado por unidad',
  },
];

const LAB_TESTS = [
  {
    id: 'thermal-shock',
    title: 'Choque térmico extremo',
    summary: 'Transición rápida de -30 °C a +65 °C con humedad controlada del 95%.',
    result: '1.000 horas continuas · Cero condensación en lentes',
    standard: 'Supera IEC 60068-2-14',
  },
  {
    id: 'granite-drop',
    title: 'Impacto sobre granito natural',
    summary: 'Caídas controladas en 6 caras, 12 aristas y 8 esquinas desde 1,8 metros.',
    result: '120 impactos · Integridad estructural 100%',
    standard: 'Protocolo interno Z-Drop v4',
  },
  {
    id: 'ip68-pressure',
    title: 'Inmersión presurizada IP68',
    summary: 'Sumersión estática a 6 metros y rociado de agua salina nebulizada.',
    result: '45 minutos a 0,6 bar · Sellado hermético verificado',
    standard: '3× por encima del estándar habitual',
  },
  {
    id: 'mechanical-fatigue',
    title: 'Fatiga mecánica y botones',
    summary: 'Prensa automatizada sobre botones de titanio, puerto USB-C y torsión de chasis.',
    result: '300.000 pulsaciones · 15.000 ciclos de flexión',
    standard: 'Equivalente a 8 años de uso diario',
  },
];

const MARKET_ADVANTAGES: {
  id: string;
  category: Exclude<AdvantageCategory, 'all'>;
  feature: string;
  zenith: string;
  market: string;
  impact: string;
}[] = [
  {
    id: 'battery-density',
    category: 'hardware',
    feature: 'Batería y grosor',
    zenith: '5.600 mAh en 6,9 mm (Silicio-Carbono)',
    market: '4.800–5.000 mAh en 8,3–8,9 mm (Grafito)',
    impact: '+14% de autonomía con un chasis un 20% más delgado y ligero (184 g).',
  },
  {
    id: 'battery-lifespan',
    category: 'hardware',
    feature: 'Degradación a largo plazo',
    zenith: '> 90% de salud tras 1.600 ciclos',
    market: '80% de salud tras 800–1.000 ciclos',
    impact: 'Doble vida útil real antes de requerir sustitución de celda.',
  },
  {
    id: 'repairability',
    category: 'hardware',
    feature: 'Arquitectura reparable',
    zenith: 'Batería y cristal con fijación mecánica',
    market: 'Adhesivos permanentes sellados con calor',
    impact: 'Sustitución de batería en menos de 15 minutos sin comprometer el IP68.',
  },
  {
    id: 'optics-macro',
    category: 'optics',
    feature: 'Periscopio y macro cercano',
    zenith: 'Sensor 1,0" + Prisma 5× (enfoque 12 cm)',
    market: 'Sensor 1/1,3" + enfoque mínimo 30–50 cm',
    impact: 'Retratos comprimidos a 120 mm y fotografía macro sin acercarse al sujeto.',
  },
  {
    id: 'optics-coating',
    category: 'optics',
    feature: 'Control de reflejos nocturnos',
    zenith: 'Zafiro con 12 capas atómicas ALD',
    market: 'Vidrio mineral con recubrimiento simple',
    impact: 'Elimina halos verdosos y reflejos parásitos frente a farolas o neones.',
  },
  {
    id: 'ai-privacy',
    category: 'ai',
    feature: 'Inteligencia Artificial local',
    zenith: '85 TOPS en NPU local · 0 envío a la nube',
    market: 'Dependencia de servidores externos y suscripción',
    impact: 'Transcripción, edición generativa y resumen privado sin conexión ni cuotas.',
  },
  {
    id: 'display-pwm',
    category: 'ai',
    feature: 'Salud visual OLED y fluidez',
    zenith: 'LTPO 1–144 Hz · PWM 3.840 Hz · 3.200 nits',
    market: 'LTPO 1–120 Hz · PWM 240–480 Hz · 2.400 nits',
    impact: 'Reduce drásticamente la fatiga ocular en lectura nocturna con brillo mínimo.',
  },
];

export function ArchitecturePage({
  onGoToReserve,
}: {
  onGoToReserve: () => void;
}) {
  const [selectedCompId, setSelectedCompId] = useState<string>('soc');
  const [loadProfile, setLoadProfile] = useState<LoadProfile>('daily');
  const [selectedTestId, setSelectedTestId] = useState<string>('thermal-shock');
  const [advFilter, setAdvFilter] = useState<AdvantageCategory>('all');

  const activeComp =
    COMPONENTS.find((c) => c.id === selectedCompId) ?? COMPONENTS[0];
  const activeTelemetry = activeComp.telemetry[loadProfile];
  const activeTest =
    LAB_TESTS.find((t) => t.id === selectedTestId) ?? LAB_TESTS[0];

  const filteredAdvantages =
    advFilter === 'all'
      ? MARKET_ADVANTAGES
      : MARKET_ADVANTAGES.filter((row) => row.category === advFilter);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="arch-page">
      {/* Subpage Intro & Quick Section Anchors */}
      <section className="arch-hero">
        <div className="container">
          <div className="meta-kicker">
            <span>Monografía Técnica</span>
            <span aria-hidden="true">·</span>
            <span>Zenith 1</span>
            <span aria-hidden="true">·</span>
            <span>36 meses de ingeniería</span>
          </div>

          <h1 className="arch-title">Cada micra tiene un propósito.</h1>
          <p className="arch-sub">
            Explora el despiece completo de cada subsistema interno, los
            protocolos de validación extrema en laboratorio y las ventajas
            técnicas reales de Zenith 1 frente al resto del mercado.
          </p>

          <div
            className="arch-anchor-bar"
            role="navigation"
            aria-label="Secciones de arquitectura"
          >
            <button
              type="button"
              className="arch-anchor-btn"
              onClick={() => scrollToSection('componentes')}
            >
              01. Componentes internos
            </button>
            <button
              type="button"
              className="arch-anchor-btn"
              onClick={() => scrollToSection('innovacion')}
            >
              02. Proceso I+D y pruebas
            </button>
            <button
              type="button"
              className="arch-anchor-btn"
              onClick={() => scrollToSection('novedades')}
            >
              03. Novedades frente a otros teléfonos
            </button>
          </div>
        </div>
      </section>

      {/* 01. Interactive Component Blueprint Inspector */}
      <section id="componentes" className="arch-section">
        <div className="container">
          <div className="arch-section-head">
            <span className="arch-kicker">01. Despiece de hardware</span>
            <h2 className="section-title">Seis subsistemas sincronizados.</h2>
            <p className="section-sub">
              Selecciona cada componente para examinar sus especificaciones de
              ingeniería y simula su comportamiento térmico bajo distintas
              cargas de trabajo.
            </p>
          </div>

          <div className="comp-inspector">
            <div
              className="comp-list"
              role="tablist"
              aria-label="Subsistemas de Zenith 1"
            >
              {COMPONENTS.map((comp) => {
                const isSelected = comp.id === activeComp.id;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`comp-tab${isSelected ? ' is-active' : ''}`}
                    onClick={() => setSelectedCompId(comp.id)}
                  >
                    <span className="comp-tab-idx tabular">{comp.index}</span>
                    <span className="comp-tab-text">
                      <span className="comp-tab-name">{comp.name}</span>
                      <span className="comp-tab-sub">{comp.subtitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="comp-detail" role="tabpanel">
              <div className="comp-media-wrap">
                <ResilientImage
                  src={activeComp.image}
                  alt={activeComp.alt}
                  className="comp-media-img"
                />
                <div className="comp-media-scrim" aria-hidden="true" />
                <div className="comp-media-caption">
                  <span className="comp-media-idx tabular">
                    Subsistema {activeComp.index} / 06
                  </span>
                  <h3 className="comp-detail-title">{activeComp.name}</h3>
                </div>
              </div>

              <div className="comp-body">
                <p className="comp-summary">{activeComp.summary}</p>

                {/* Interactive Workload Simulator */}
                <div className="sim-panel">
                  <div className="sim-header">
                    <span className="sim-label">Simulador de carga</span>
                    <div
                      className="segmented-inline"
                      role="group"
                      aria-label="Perfil de carga del componente"
                    >
                      <button
                        type="button"
                        className={`seg-inline-btn${loadProfile === 'daily' ? ' is-active' : ''}`}
                        onClick={() => setLoadProfile('daily')}
                      >
                        Uso diario
                      </button>
                      <button
                        type="button"
                        className={`seg-inline-btn${loadProfile === 'cinema' ? ' is-active' : ''}`}
                        onClick={() => setLoadProfile('cinema')}
                      >
                        RAW 4K120
                      </button>
                      <button
                        type="button"
                        className={`seg-inline-btn${loadProfile === 'neural' ? ' is-active' : ''}`}
                        onClick={() => setLoadProfile('neural')}
                      >
                        IA Local
                      </button>
                    </div>
                  </div>

                  <div className="sim-metrics">
                    <div className="sim-metric">
                      <span className="sim-metric-val tabular">
                        {activeTelemetry.power}
                      </span>
                      <span className="sim-metric-key">Consumo activo</span>
                    </div>
                    <div className="sim-metric">
                      <span className="sim-metric-val tabular">
                        {activeTelemetry.temp}
                      </span>
                      <span className="sim-metric-key">Temperatura estable</span>
                    </div>
                    <div className="sim-metric">
                      <span className="sim-metric-val tabular">
                        {activeTelemetry.efficiency}
                      </span>
                      <span className="sim-metric-key">Retención sostenida</span>
                    </div>
                  </div>
                </div>

                <div className="spec-list comp-spec-list">
                  {activeComp.specs.map((row) => (
                    <div key={row.label} className="spec-row">
                      <span className="spec-key">{row.label}</span>
                      <span className="spec-val">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. Innovation Timeline & Extreme Testing Protocols */}
      <section id="innovacion" className="arch-section arch-section-tinted">
        <div className="container">
          <div className="arch-section-head">
            <span className="arch-kicker">02. Desarrollo y validación</span>
            <h2 className="section-title">
              Del primer bloque de titanio al laboratorio.
            </h2>
            <p className="section-sub">
              Tres años de iteración entre metalurgia, óptica y microelectrónica
              antes de certificar el primer Zenith 1 de producción.
            </p>
          </div>

          <div className="rd-timeline">
            {RD_PHASES.map((item) => (
              <article key={item.phase} className="rd-card">
                <div className="rd-card-top">
                  <span className="rd-phase tabular">{item.phase}</span>
                  <span className="rd-period tabular">{item.period}</span>
                </div>
                <h3 className="rd-title">{item.title}</h3>
                <p className="rd-detail">{item.detail}</p>
                <div className="rd-metric tabular">{item.metric}</div>
              </article>
            ))}
          </div>

          <div className="lab-grid">
            <div className="lab-selector" role="tablist" aria-label="Protocolos de prueba">
              {LAB_TESTS.map((test) => {
                const active = test.id === activeTest.id;
                return (
                  <button
                    key={test.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`lab-btn${active ? ' is-active' : ''}`}
                    onClick={() => setSelectedTestId(test.id)}
                  >
                    <span className="lab-btn-title">{test.title}</span>
                    <span className="lab-btn-std">{test.standard}</span>
                  </button>
                );
              })}
            </div>

            <div className="lab-panel" role="tabpanel">
              <span className="arch-kicker">Protocolo verificado</span>
              <h3 className="lab-panel-title">{activeTest.title}</h3>
              <p className="lab-panel-desc">{activeTest.summary}</p>
              <div className="lab-panel-result tabular">{activeTest.result}</div>
              <div className="lab-panel-std">{activeTest.standard}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. Market Comparison & Innovations vs Other Smartphones */}
      <section id="novedades" className="arch-section">
        <div className="container">
          <div className="adv-head-row">
            <div>
              <span className="arch-kicker">03. Ventajas frente al mercado</span>
              <h2 className="section-title">
                Por qué Zenith 1 marca una generación aparte.
              </h2>
            </div>

            <div
              className="segmented-control"
              role="tablist"
              aria-label="Filtrar novedades por categoría"
            >
              <button
                type="button"
                role="tab"
                aria-selected={advFilter === 'all'}
                className={`seg-btn${advFilter === 'all' ? ' is-active' : ''}`}
                onClick={() => setAdvFilter('all')}
              >
                Todas
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={advFilter === 'hardware'}
                className={`seg-btn${advFilter === 'hardware' ? ' is-active' : ''}`}
                onClick={() => setAdvFilter('hardware')}
              >
                Hardware
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={advFilter === 'optics'}
                className={`seg-btn${advFilter === 'optics' ? ' is-active' : ''}`}
                onClick={() => setAdvFilter('optics')}
              >
                Óptica
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={advFilter === 'ai'}
                className={`seg-btn${advFilter === 'ai' ? ' is-active' : ''}`}
                onClick={() => setAdvFilter('ai')}
              >
                IA y Pantalla
              </button>
            </div>
          </div>

          <div className="adv-table-wrap">
            <table className="adv-table">
              <thead>
                <tr>
                  <th>Aspecto clave</th>
                  <th>Zenith 1</th>
                  <th>Teléfonos insignia actuales</th>
                  <th>Beneficio real</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvantages.map((row) => (
                  <tr key={row.id}>
                    <td className="adv-col-feature">{row.feature}</td>
                    <td className="adv-col-zenith tabular">{row.zenith}</td>
                    <td className="adv-col-market tabular">{row.market}</td>
                    <td className="adv-col-impact">{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="arch-cta-banner">
            <div>
              <h3 className="arch-cta-title">Listo para dar el salto.</h3>
              <p className="arch-cta-sub">
                Elige tu acabado en titanio Grado 5 y reserva la primera tirada de Zenith 1.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onGoToReserve}
            >
              Configurar mi Zenith 1
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
