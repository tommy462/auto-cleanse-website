import { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import BlogCard from '../components/BlogCard';
import { PUBLISHED_POSTS, CATEGORY_LABELS, type BlogCategory } from '../lib/blog';

type Filter = 'All' | BlogCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'DPF', label: CATEGORY_LABELS.DPF },
  { key: 'ECU', label: CATEGORY_LABELS.ECU },
  { key: 'AdBlue', label: CATEGORY_LABELS.AdBlue },
];

const PAGE_SIZE = 9;

export default function BlogIndex() {
  const [filter, setFilter] = useState<Filter>('All');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (filter === 'All' ? PUBLISHED_POSTS : PUBLISHED_POSTS.filter((p) => p.category === filter)),
    [filter]
  );
  const shown = filtered.slice(0, visible);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Auto-Cleanse Workshop Blog',
    url: 'https://www.auto-cleanse.co.uk/blog',
    description:
      'Real workshop write-ups and practical advice on DPF cleaning, AdBlue and SCR faults, and ECU remapping from Auto-Cleanse in Devon.',
  };

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title="Workshop Blog | DPF, AdBlue & Remapping Advice | Auto-Cleanse"
        description="Real workshop write-ups and practical advice on DPF cleaning, AdBlue and SCR faults, and ECU remapping from Auto-Cleanse, Devon. Symptoms, fault codes and fixes explained."
        path="/blog"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ name: 'Blog' }]} />

        <header className="mb-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05] mb-5">
            <span className="text-white">Workshop </span>
            <span className="text-[#FF7A00]">Blog</span>
          </h1>
          <p className="text-lg text-white/55 max-w-3xl leading-relaxed font-medium">
            Real jobs, symptoms, fault codes and fixes from our Devon workshop, plus practical advice
            on DPF cleaning, AdBlue and SCR faults, and ECU remapping.
          </p>
        </header>

        {/* Category filters (client-side, keyboard focusable) */}
        <div role="tablist" aria-label="Filter posts by category" className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(f.key);
                  setVisible(PAGE_SIZE);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] ${
                  active
                    ? 'bg-[#FF7A00] text-black'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:text-white hover:border-[#FF7A00]/30'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="text-white/50 text-lg">No posts in this category yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {shown.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {visible < filtered.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="btn-shine px-8 py-4 rounded-xl font-bold text-white"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
