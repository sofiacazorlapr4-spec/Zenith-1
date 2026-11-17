import { useEffect, useState } from 'react';

export interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  personalization: boolean;
  analytics: boolean;
  updatedAt: string;
}

const STORAGE_KEY = 'zenith_cookie_prefs_v1';

const DEFAULT_PREFS: CookiePreferences = {
  essential: true,
  performance: true,
  personalization: true,
  analytics: false,
  updatedAt: '',
};

interface CookieMeta {
  key: keyof Pick<CookiePreferences, 'essential' | 'performance' | 'personalization' | 'analytics'>;
  cookieName: string;
  title: string;
  duration: string;
  description: string;
  locked?: boolean;
}

const COOKIE_CATALOG: CookieMeta[] = [
  {
    key: 'essential',
    cookieName: 'zenith_session_core',
    title: 'Cookies técnicas esenciales',
    duration: 'Sesión',
    description:
      'Mantienen activa la bolsa de reserva, la navegación entre vistas y el modo de iluminación elegido.',
    locked: true,
  },
  {
    key: 'performance',
    cookieName: 'zenith_webgl_profile',
    title: 'Rendimiento gráfico y WebGL',
    duration: '30 días',
    description:
      'Recuerda la densidad de píxeles óptima y la fluidez de los shaders 3D en tu dispositivo.',
  },
  {
    key: 'personalization',
    cookieName: 'zenith_hardware_cfg',
    title: 'Memoria del configurador',
    duration: '90 días',
    description:
      'Conserva tu último acabado de titanio, capacidad seleccionada y artículos guardados.',
  },
  {
    key: 'analytics',
    cookieName: 'zenith_lab_telemetry',
    title: 'Analítica simulada de producto',
    duration: '180 días',
    description:
      'Registra qué subsistemas técnicos y comparativas despiertan mayor interés (simulado localmente).',
  },
];

function writeSimulatedCookies(prefs: CookiePreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    const maxAge = 60 * 60 * 24 * 30;
    document.cookie = `zenith_session_core=active; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `zenith_webgl_profile=${prefs.performance ? 'high' : 'off'}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `zenith_hardware_cfg=${prefs.personalization ? 'saved' : 'off'}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `zenith_lab_telemetry=${prefs.analytics ? 'enabled' : 'off'}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {
    // Storage unavailable in restricted context
  }
}

function readStoredPrefs(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
    return {
      essential: true,
      performance: Boolean(parsed.performance),
      personalization: Boolean(parsed.personalization),
      analytics: Boolean(parsed.analytics),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    };
  } catch {
    return null;
  }
}

export function CookieConsent({
  modalOpen,
  onOpenModal,
  onCloseModal,
}: {
  modalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
}) {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFS);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const existing = readStoredPrefs();
    if (existing) {
      setPrefs(existing);
      setBannerVisible(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setBannerVisible(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseModal();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalOpen, onCloseModal]);

  const commitPreferences = (next: CookiePreferences) => {
    const stamped: CookiePreferences = {
      ...next,
      essential: true,
      updatedAt: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setPrefs(stamped);
    writeSimulatedCookies(stamped);
    setBannerVisible(false);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2200);
    onCloseModal();
  };

  const acceptAll = () => {
    commitPreferences({
      essential: true,
      performance: true,
      personalization: true,
      analytics: true,
      updatedAt: '',
    });
  };

  const acceptEssentialOnly = () => {
    commitPreferences({
      essential: true,
      performance: false,
      personalization: false,
      analytics: false,
      updatedAt: '',
    });
  };

  const activeCookieCount = [
    prefs.essential,
    prefs.performance,
    prefs.personalization,
    prefs.analytics,
  ].filter(Boolean).length;

  return (
    <>
      {bannerVisible && !modalOpen && (
        <aside
          className="cookie-toast"
          aria-label="Aviso de cookies simuladas"
          role="region"
        >
          <div className="cookie-toast-body">
            <span className="cookie-toast-title">Preferencias de cookies</span>
            <p className="cookie-toast-text">
              Usamos cookies simuladas en tu navegador para guardar tu
              configuración de Zenith 1 y el rendimiento WebGL.
            </p>
          </div>
          <div className="cookie-toast-actions">
            <button
              type="button"
              className="cookie-btn-ghost"
              onClick={onOpenModal}
            >
              Configurar
            </button>
            <button
              type="button"
              className="cookie-btn-ghost"
              onClick={acceptEssentialOnly}
            >
              Solo esenciales
            </button>
            <button
              type="button"
              className="cookie-btn-primary"
              onClick={acceptAll}
            >
              Aceptar todas
            </button>
          </div>
        </aside>
      )}

      {savedNotice && (
        <div className="cookie-saved-pill" role="status" aria-live="polite">
          Preferencias guardadas · {activeCookieCount} de 4 cookies simuladas activas
        </div>
      )}

      {modalOpen && (
        <>
          <div
            className="cookie-modal-backdrop"
            onClick={onCloseModal}
            aria-hidden="true"
          />
          <section
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
          >
            <div className="cookie-modal-header">
              <div>
                <h2 id="cookie-modal-title" className="cookie-modal-title">
                  Centro de cookies simuladas
                </h2>
                <p className="cookie-modal-sub">
                  Controla las cookies almacenadas localmente en esta sesión de demostración.
                </p>
              </div>
              <button
                type="button"
                className="icon-btn"
                aria-label="Cerrar preferencias de cookies"
                onClick={onCloseModal}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="cookie-modal-list">
              {COOKIE_CATALOG.map((item) => {
                const checked = prefs[item.key];
                return (
                  <div key={item.key} className="cookie-row">
                    <div className="cookie-row-copy">
                      <div className="cookie-row-head">
                        <span className="cookie-row-title">{item.title}</span>
                        <span className="cookie-row-meta">
                          {item.cookieName} · {item.duration}
                        </span>
                      </div>
                      <p className="cookie-row-desc">{item.description}</p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={checked}
                      aria-label={item.title}
                      disabled={item.locked}
                      className={`cookie-switch${checked ? ' is-on' : ''}${item.locked ? ' is-locked' : ''}`}
                      onClick={() => {
                        if (item.locked) return;
                        setPrefs((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }));
                      }}
                    >
                      <span className="cookie-switch-thumb" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cookie-modal-footer">
              <span className="cookie-status-note tabular">
                {activeCookieCount} / 4 activas
                {prefs.updatedAt ? ` · Actualizado ${prefs.updatedAt}` : ''}
              </span>
              <div className="cookie-modal-buttons">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={acceptEssentialOnly}
                >
                  Solo esenciales
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => commitPreferences(prefs)}
                >
                  Guardar selección
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
