import { useEffect, useRef, useState } from 'react';
import { HomeView } from './components/HomeView';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  AppView,
  BagItem,
  FINISH_META,
  FinishId,
  StorageLabel,
  formatPrice,
} from './types/zenith';
import { ResilientImage } from './components/ResilientImage';
import heroStudioImg from './assets/images/zenith_hero_studio_1794950811220.jpg';

export default function App() {
  const [view, setView] = useState<AppView>(() =>
    window.location.hash === '#/arquitectura' ? 'architecture' : 'home'
  );
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [finish, setFinish] = useState<FinishId>('obsidian');
  const [storage, setStorage] = useState<StorageLabel>('512 GB · 16 GB');
  const [price, setPrice] = useState<number>(1149);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [checkedOut, setCheckedOut] = useState<boolean>(false);
  const [cookieModalOpen, setCookieModalOpen] = useState<boolean>(false);
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  const checkoutTimerRef = useRef<number | null>(null);
  const selectedConfigRef = useRef<{
    finish: FinishId;
    storage: StorageLabel;
    price: number;
  }>({ finish: 'obsidian', storage: '512 GB · 16 GB', price: 1149 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onHashChange = () => {
      const nextView: AppView =
        window.location.hash === '#/arquitectura' ? 'architecture' : 'home';
      setView(nextView);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  useEffect(() => {
    return () => {
      if (checkoutTimerRef.current !== null) {
        window.clearTimeout(checkoutTimerRef.current);
      }
    };
  }, []);

  const navigateToHome = (anchor?: string) => {
    if (view !== 'home') {
      window.history.pushState(null, '', '#/');
      setView('home');
      window.scrollTo({ top: 0, behavior: 'auto' });
      if (anchor) {
        setPendingAnchor(anchor);
      }
      return;
    }

    if (anchor) {
      setPendingAnchor(anchor);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToArchitecture = () => {
    if (view !== 'architecture') {
      window.history.pushState(null, '', '#/arquitectura');
      setView('architecture');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const selectFinish = (nextFinish: FinishId) => {
    selectedConfigRef.current.finish = nextFinish;
    setFinish(nextFinish);
  };

  const selectStorage = (nextStorage: StorageLabel, nextPrice: number) => {
    selectedConfigRef.current.storage = nextStorage;
    selectedConfigRef.current.price = nextPrice;
    setStorage(nextStorage);
    setPrice(nextPrice);
  };

  const cancelPendingCheckout = () => {
    if (checkoutTimerRef.current !== null) {
      window.clearTimeout(checkoutTimerRef.current);
      checkoutTimerRef.current = null;
      setCheckedOut(false);
    }
  };

  const addToBag = () => {
    cancelPendingCheckout();
    const activeCfg = selectedConfigRef.current;
    setBag((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.finish === activeCfg.finish && item.storage === activeCfg.storage
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          finish: activeCfg.finish,
          storage: activeCfg.storage,
          price: activeCfg.price,
          qty: 1,
        },
      ];
    });
    setDrawerOpen(true);
  };

  const updateBagQty = (idx: number, delta: number) => {
    cancelPendingCheckout();
    setBag((prev) => {
      const next = [...prev];
      const updatedQty = next[idx].qty + delta;
      if (updatedQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], qty: updatedQty };
      }
      return next;
    });
  };

  const handleCheckout = () => {
    if (checkedOut) return;
    if (checkoutTimerRef.current !== null) {
      window.clearTimeout(checkoutTimerRef.current);
    }
    setCheckedOut(true);
    checkoutTimerRef.current = window.setTimeout(() => {
      checkoutTimerRef.current = null;
      setBag([]);
      setCheckedOut(false);
      setDrawerOpen(false);
    }, 1200);
  };

  const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = bag.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4 Nav Links) — Zone 3 (1 Primary Action) */}
      <header className="site-header" id="site-header">
        <div className="container header-inner">
          <a
            href="#/"
            className="brand-wordmark"
            aria-label="Zenith Inicio"
            onClick={(e) => {
              e.preventDefault();
              navigateToHome();
            }}
          >
            <svg
              className="brand-mark"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 8.5H25L8 23.5H25"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Zenith</span>
          </a>

          <nav className="header-nav" aria-label="Navegación principal">
            <a
              href="#diseno"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome('#diseno');
              }}
            >
              Diseño
            </a>
            <a
              href="#optica"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome('#optica');
              }}
            >
              Óptica
            </a>
            <a
              href="#/arquitectura"
              className={`nav-link${view === 'architecture' ? ' is-current' : ''}`}
              aria-current={view === 'architecture' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateToArchitecture();
              }}
            >
              Arquitectura
            </a>
            <a
              href="#reservar"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome('#reservar');
              }}
            >
              Reservar
            </a>
          </nav>

          <div className="header-action">
            <button
              type="button"
              className="bag-btn"
              id="bag-trigger"
              aria-label="Abrir bolsa de reserva"
              onClick={() => setDrawerOpen(true)}
            >
              <span>Bolsa</span>
              <span className="bag-count" id="bag-count">
                {totalQty}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <ErrorBoundary onReset={() => navigateToHome()}>
          {view === 'home' ? (
            <HomeView
              theme={theme}
              onChangeTheme={setTheme}
              finish={finish}
              onSelectFinish={selectFinish}
              storage={storage}
              price={price}
              onSelectStorage={selectStorage}
              onAddToBag={addToBag}
              onOpenArchitecture={navigateToArchitecture}
              pendingAnchor={pendingAnchor}
              onClearPendingAnchor={() => setPendingAnchor(null)}
            />
          ) : (
            <ArchitecturePage
              onGoToReserve={() => navigateToHome('#reservar')}
            />
          )}
        </ErrorBoundary>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">Zenith</span>
          <div className="footer-links">
            <button
              type="button"
              className="footer-link-btn"
              onClick={navigateToArchitecture}
            >
              Componentes e I+D
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => setCookieModalOpen(true)}
            >
              Preferencias de cookies
            </button>
          </div>
          <span>© 2026 Zenith Labs</span>
        </div>
      </footer>

      <CookieConsent
        modalOpen={cookieModalOpen}
        onOpenModal={() => setCookieModalOpen(true)}
        onCloseModal={() => setCookieModalOpen(false)}
      />

      {/* Slide-Over Reservation Bag Drawer */}
      <div
        className="drawer-backdrop"
        id="drawer-backdrop"
        hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className="bag-drawer"
        id="bag-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        hidden={!drawerOpen}
      >
        <div className="drawer-header">
          <h2 id="drawer-title" className="drawer-title">
            Bolsa de reserva
          </h2>
          <button
            type="button"
            className="icon-btn"
            id="drawer-close"
            aria-label="Cerrar bolsa"
            onClick={() => setDrawerOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="drawer-body" id="drawer-body">
          <div className="drawer-empty" id="drawer-empty" hidden={bag.length > 0}>
            <p>Tu bolsa de reserva está vacía.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              id="drawer-empty-cta"
              onClick={() => {
                setDrawerOpen(false);
                navigateToHome('#reservar');
              }}
            >
              Configurar Zenith 1
            </button>
          </div>

          <div className="drawer-items" id="drawer-items" hidden={bag.length === 0}>
            {bag.map((item, idx) => (
              <div key={`${item.finish}-${item.storage}`} className="bag-item">
                <ResilientImage
                  src={heroStudioImg}
                  alt={`Zenith 1 ${FINISH_META[item.finish].name}`}
                  className="bag-item-thumb"
                  dataFinish={item.finish}
                />
                <div className="bag-item-info">
                  <div className="bag-item-name">Zenith 1</div>
                  <div className="bag-item-meta">
                    {FINISH_META[item.finish].name} · {item.storage} ({formatPrice(item.price)})
                  </div>
                  <div className="bag-qty-row">
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label="Reducir cantidad"
                      onClick={() => updateBagQty(idx, -1)}
                    >
                      −
                    </button>
                    <span className="bag-qty">{item.qty}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label="Aumentar cantidad"
                      onClick={() => updateBagQty(idx, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="drawer-footer" id="drawer-footer" hidden={bag.length === 0}>
          <div className="drawer-total-row">
            <span>Total</span>
            <span className="drawer-total" id="drawer-total">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-full"
            id="checkout-btn"
            disabled={checkedOut}
            onClick={handleCheckout}
          >
            {checkedOut ? 'Reserva confirmada' : 'Confirmar reserva'}
          </button>
        </div>
      </aside>
    </>
  );
}
