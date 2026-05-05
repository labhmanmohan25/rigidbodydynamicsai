"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

export type HomeTheme = "dark" | "light";

const STORAGE_KEY = "rbd-home-theme";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type HomeAppearanceContextValue = {
  homeTheme: HomeTheme;
  setHomeTheme: (t: HomeTheme) => void;
  showHomeThemeToggle: boolean;
};

const HomeAppearanceContext =
  createContext<HomeAppearanceContextValue | null>(null);

export function useHomeAppearance() {
  const ctx = useContext(HomeAppearanceContext);
  if (!ctx) {
    throw new Error(
      "useHomeAppearance must be used within HomeAppearanceProvider",
    );
  }
  return ctx;
}

/** Next.js `usePathname()` omits `basePath`; paths are `/`, `/about`, etc. */
export function isLandingThemePath(pathname: string) {
  return pathname === "/" || pathname === "/about";
}

function readStoredTheme(): HomeTheme | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "light" || raw === "dark") return raw;
  return null;
}

function syncMainDarkClass(pathname: string, theme: HomeTheme) {
  const main = document.getElementById("main");
  if (!main) return;
  if (!isLandingThemePath(pathname)) {
    main.classList.remove("dark");
    return;
  }
  main.classList.toggle("dark", theme === "dark");
}

export function HomeThemeBootScript() {
  const homeUrlPath = JSON.stringify(
    basePath ? basePath.replace(/\/$/, "") || "/" : "/",
  );
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  try {
    var m = document.getElementById("main");
    if (!m) return;
    var path = location.pathname.replace(/\\/+$/, "") || "/";
    var home = ${homeUrlPath};
    var aboutPath = home === "/" ? "/about" : home + "/about";
    var isLandingTheme = path === home || path === aboutPath;
    if (!isLandingTheme) { m.classList.remove("dark"); return; }
    var t = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    if (t === "dark") m.classList.add("dark");
    else m.classList.remove("dark");
  } catch (e) {}
})();`,
      }}
    />
  );
}

export function HomeAppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHomeThemeToggle = isLandingThemePath(pathname);
  const [homeTheme, setHomeThemeState] = useState<HomeTheme>("light");

  // Read persisted theme after mount; SSR/first paint default is light unless key exists.
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
      setHomeThemeState(stored);
    }
  }, []);

  const setHomeTheme = useCallback((t: HomeTheme) => {
    setHomeThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  useLayoutEffect(() => {
    syncMainDarkClass(pathname, homeTheme);
  }, [pathname, homeTheme]);

  const value = useMemo(
    () => ({
      homeTheme,
      setHomeTheme,
      showHomeThemeToggle,
    }),
    [homeTheme, setHomeTheme, showHomeThemeToggle],
  );

  return (
    <HomeAppearanceContext.Provider value={value}>
      {children}
    </HomeAppearanceContext.Provider>
  );
}
