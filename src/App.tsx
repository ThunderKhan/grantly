import { lazy, Suspense, useLayoutEffect } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
// avoid-ai-design-ignore: I3 -- CheckCircle2 announces a successful local state change; it is not an AI badge.
import {
  LayoutGrid,
  Compass,
  Layers,
  UserRound,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "./store";
import { Logo, Empty, ButtonLink } from "./components";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
const Dashboard = lazy(() =>
  import("./Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Discovery = lazy(() =>
  import("./Discovery").then((m) => ({ default: m.Discovery })),
);
const Detail = lazy(() =>
  import("./Detail").then((m) => ({ default: m.Detail })),
);
const Applications = lazy(() =>
  import("./Applications").then((m) => ({ default: m.Applications })),
);
const Profile = lazy(() =>
  import("./Profile").then((m) => ({ default: m.Profile })),
);
export function App() {
  const { state, storageError, notice } = useStore();
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const title = location.pathname.startsWith("/discover")
      ? "Discover scholarships"
      : location.pathname.startsWith("/profile")
        ? "Student profile"
        : location.pathname.startsWith("/applications")
          ? "My applications"
          : location.pathname.startsWith("/scholarships")
            ? "Scholarship details"
            : "Your workspace";
    document.title = `${title} — GRANTLY`;
    const main = document.getElementById("main-content");
    main?.focus({ preventScroll: true });
  }, [location.pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-container">
          <Logo />
          <nav aria-label="Main navigation">
            {[
              { to: "/", label: "Dashboard", Icon: LayoutGrid },
              { to: "/discover", label: "Discover", Icon: Compass },
              { to: "/applications", label: "My Applications", Icon: Layers },
            ].map(({ to, label, Icon }) => (
              <NavLink
                to={to}
                end={to === "/"}
                key={to}
                aria-label={
                  to === "/applications"
                    ? `My Applications${Object.keys(state.tracked).length ? ` ${Object.keys(state.tracked).length}` : ""}`
                    : undefined
                }
              >
                <Icon size={17} />
                {to === "/applications" ? (
                  <>
                    <span className="nav-label-full">{label}</span>
                    <span className="nav-label-short" aria-hidden="true">
                      Applications
                    </span>
                  </>
                ) : (
                  <span>{label}</span>
                )}
                {to === "/applications" &&
                  Object.keys(state.tracked).length > 0 && (
                    <span className="nav-count">
                      {Object.keys(state.tracked).length}
                    </span>
                  )}
              </NavLink>
            ))}
          </nav>
          <NavLink
            to="/profile"
            className="profile-link"
            aria-label="My profile"
          >
            <span className="nav-avatar">
              {state.profile.name ? (
                state.profile.name.slice(0, 1).toUpperCase()
              ) : (
                <UserRound size={17} />
              )}
            </span>
            <span>{state.profile.name || "My profile"}</span>
          </NavLink>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <div className="container">
          {storageError && (
            <div className="storage-warning" role="alert">
              <Info size={19} />
              {storageError}
            </div>
          )}
          <RouteErrorBoundary key={location.pathname}>
            <Suspense
              fallback={
                <div className="route-loading" role="status">
                  Loading your workspace…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/discover" element={<Discovery />} />
                <Route path="/scholarships/:id" element={<Detail />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="*"
                  element={
                    <Empty
                      title="A small detour."
                      description="This page doesn’t exist. Your scholarship workspace is one click away."
                    >
                      <ButtonLink to="/">Back to dashboard</ButtonLink>
                    </Empty>
                  }
                />
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </div>
      </main>
      <footer className="site-footer">
        <div className="container">
          <span>
            grantly<span className="logo-dot">.</span>{" "}
            <span className="footer-tagline">Opportunity, organized.</span>
          </span>
          <Link to="/profile">Profile & preferences</Link>
        </div>
      </footer>
      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice && (
          <>
            <CheckCircle2 size={20} />
            {notice}
          </>
        )}
      </div>
    </>
  );
}
