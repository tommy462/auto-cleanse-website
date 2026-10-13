// National AdBlue guide pages (fault codes, components, symptoms, legal, process).
// One file per page in this folder, each exporting a single AdBlueGuide.
// Rendered by src/pages/AdBlueGuide.tsx and prerendered via entry-server routes.
//
// House rules for every guide (checked before publishing):
// - No prices or £ figures anywhere: quotes are given on the phone only.
// - Repair only. Deletes, emulators and countdown-only resets are mentioned only
//   to explain why we don't do them.
// - No invented jobs, vehicles, readings or reviews. Real job evidence goes in
//   once Tom supplies it (see firstHandTodo).
// - No "24/7", "same day" promises, "free diagnosis", "no fix no fee" or
//   "lifetime warranty".
// - Competitors are never named.

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  steps?: { title: string; body: string }[];
  /** Short highlighted aside under the section (one or two sentences). */
  note?: string;
}

export interface GuideFaq {
  q: string;
  a: string;
}

export type GuideKind = 'hub' | 'fault-code' | 'component' | 'vehicle' | 'symptom' | 'legal' | 'process';

export interface AdBlueGuide {
  /** Absolute path, e.g. '/adblue-fault-codes/p20ee'. */
  path: string;
  kind: GuideKind;
  /** <title>: about 50-60 characters, ends with "| Auto-Cleanse". */
  seoTitle: string;
  /** Meta description: 140-155 characters. */
  metaDescription: string;
  /** Short label for breadcrumbs and related links. */
  breadcrumb: string;
  /** H1 lead text; h1Accent (optional) is rendered after it in orange. */
  h1: string;
  h1Accent?: string;
  /** Answer-first opening, 2-3 sentences. */
  intro: string;
  /** "The short answer" box: 3-5 label/text pairs a reader can act on. */
  quickAnswer: { label: string; text: string }[];
  sections: GuideSection[];
  /** "What affects the cost": factors only, never figures. */
  costFactors?: string[];
  faqs: GuideFaq[];
  /** Paths of related guides or existing pages, most relevant first. */
  related: string[];
  /** Plain "Organisation - subject" citations. No URLs. */
  sources: string[];
  /** ISO date the content was last checked. */
  updated: string;
  /** Pre-filled WhatsApp/SMS topic, e.g. 'Fault code P20EE'. */
  messageTopic: string;
  /** Not rendered: real job evidence Tom should add before or after launch. */
  firstHandTodo: string[];
}
