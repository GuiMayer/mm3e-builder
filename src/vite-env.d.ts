/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

// Allow importing binary files (PDF, etc.) as URLs via Vite's ?url suffix.
// The resolved URL is fully qualified for both dev and production (incl. GitHub Pages base path).
declare module '*.pdf?url' {
  const url: string;
  export default url;
}
