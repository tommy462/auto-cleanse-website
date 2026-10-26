/// <reference types="vite/client" />

// Injected by vite.config.ts `define`. The UK date the build ran (YYYY-MM-DD),
// and whether scheduled (future-dated) blog posts should be shown anyway.
declare const __BLOG_BUILD_DATE__: string;
declare const __BLOG_SHOW_SCHEDULED__: boolean;
