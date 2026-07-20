// WebMCP (declarative form-tool metadata) attributes.
//
// These are experimental HTML attributes read by AI agent tooling to understand
// what a form does and how to fill it. They are plain lowercase attributes that
// React renders straight to the DOM. TypeScript/JSX does not know them, so we
// augment React's base HTMLAttributes with just these three optional string
// attributes - narrowly scoped, no `any`, no suppression.
import 'react';

declare module 'react' {
  // The <T> type parameter is required to merge with React's own
  // HTMLAttributes<T>; it is unused by the added string attributes.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    /** Unique, machine-readable tool name for this form (e.g. "requestDpfCleaningQuote"). */
    toolname?: string;
    /** Human-readable description of exactly what submitting this form does. */
    tooldescription?: string;
    /** Description of an individual field's expected value (on input/textarea/select). */
    toolparamdescription?: string;
  }
}
