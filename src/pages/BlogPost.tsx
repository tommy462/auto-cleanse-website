import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Clock, Calendar, User, Phone, ArrowRight, Wrench } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import BlogImage from '../components/BlogImage';
import BlogCard from '../components/BlogCard';
import NotFound from './NotFound';
import {
  getPostBySlug,
  getRelatedPosts,
  CATEGORY_LABELS,
  FALLBACK_COVER_IMAGE,
  type BlogPost as BlogPostType,
} from '../lib/blog';

const SITE = 'https://www.auto-cleanse.co.uk';

// Friendly labels for the money pages a post can link to.
const SERVICE_LABELS: Record<string, string> = {
  '/dpf-cleaning': 'DPF Cleaning',
  '/dpf-cleaning-devon': 'DPF Cleaning in Devon',
  '/dpf-cleaning-newton-abbot': 'DPF Cleaning Newton Abbot',
  '/dpf-diagnostics-devon': 'DPF Diagnostics',
  '/blocked-dpf-cleaning-devon': 'Blocked DPF Cleaning',
  '/adblue-repair-devon': 'AdBlue Repair & Diagnostics',
  '/ecu-remapping': 'ECU Remapping',
  '/stage-1-remaps-devon': 'Stage 1 Remaps in Devon',
  '/mobile-ecu-remapping-devon': 'Mobile ECU Remapping',
  '/bmw-m140i-remap': 'BMW M140i Remap',
  '/postal-dpf': 'Nationwide Postal DPF',
  '/vehicle-performance-lookup': 'Vehicle Performance Lookup',
  '/ecu-cloning': 'ECU Cloning',
  '/trade-file-service': 'Trade File Service',
  '/pricing': 'Pricing',
  '/contact': 'Contact Us',
};

function serviceLabel(path: string): string {
  return (
    SERVICE_LABELS[path] ||
    path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function formatDate(date: string): string {
  const d = new Date(date);
  return isNaN(+d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function JobPanel({ post }: { post: BlogPostType }) {
  const rows: { label: string; value: string }[] = [];
  if (post.vehicle) rows.push({ label: 'Vehicle', value: post.vehicle });
  if (post.mileage) rows.push({ label: 'Mileage', value: post.mileage });
  if (post.faultCodes?.length) rows.push({ label: 'Fault codes', value: post.faultCodes.join(', ') });
  if (post.symptoms) rows.push({ label: 'Symptoms', value: post.symptoms });
  if (post.fix) rows.push({ label: 'The fix', value: post.fix });
  if (!rows.length) return null;

  return (
    <aside className="my-10 rounded-2xl bg-[#FF7A00]/[0.06] border border-[#FF7A00]/25 p-6 md:p-8 not-prose">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/15 flex items-center justify-center text-[#FF7A00]">
          <Wrench size={18} />
        </div>
        <p className="text-[#FF7A00] text-xs font-bold uppercase tracking-widest">The job</p>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6 gap-y-3">
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <dt className="text-white/40 text-sm font-semibold sm:text-right">{r.label}</dt>
            <dd className="text-white/85 text-sm leading-relaxed">{r.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug ?? '');

  if (!post) return <NotFound />;

  const url = `${SITE}/blog/${post.slug}`;
  const coverPath = post.coverImage || FALLBACK_COVER_IMAGE;
  const coverAbs = coverPath.startsWith('http') ? coverPath : `${SITE}${coverPath}`;
  const related = getRelatedPosts(post, 3);
  const primaryService = post.relatedServices?.[0];

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [coverAbs],
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { '@type': 'Organization', name: post.author, url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'Auto-Cleanse',
      logo: { '@type': 'ImageObject', url: `${SITE}/favicon-512x512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: CATEGORY_LABELS[post.category],
  };

  return (
    <div className="pt-32 pb-24 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
      <SEO
        title={`${post.title} | Auto-Cleanse`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        ogImage={coverAbs}
        ogType="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />

      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }, { name: post.title }]} />

        <article>
          <header className="mb-8">
            <Link
              to="/blog"
              className="inline-block text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#FF7A00] text-black mb-5"
            >
              {CATEGORY_LABELS[post.category]}
            </Link>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.1] mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm">
              {formatDate(post.date) && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} /> {formatDate(post.date)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <User size={14} /> {post.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> {post.readingTime} min read
              </span>
            </div>
          </header>

          <div className="rounded-2xl overflow-hidden border border-white/5 mb-10 aspect-[16/9] bg-black/40">
            <BlogImage
              src={post.coverImage}
              alt={post.coverAlt}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <JobPanel post={post} />

          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          {/* Related-service CTA */}
          {primaryService && (
            <div className="mt-12 rounded-2xl bg-[#1A1D22] border border-[#FF7A00]/20 p-7 md:p-9 text-center">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Need help with this on your vehicle?
              </h2>
              <p className="text-white/55 mb-6">
                Auto-Cleanse can sort it. See our{' '}
                <Link to={primaryService} className="text-[#FF7A00] hover:text-[#FF9500] transition-colors">
                  {serviceLabel(primaryService)}
                </Link>{' '}
                service, or get in touch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={primaryService} className="btn-shine px-6 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center justify-center gap-2">
                  {serviceLabel(primaryService)} <ArrowRight size={15} />
                </Link>
                <a href="tel:01803269895" className="px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2">
                  <Phone size={15} className="text-[#FF7A00]" /> 01803 269895
                </a>
              </div>
              {post.relatedServices && post.relatedServices.length > 1 && (
                <p className="text-white/40 text-sm mt-5">
                  Related:{' '}
                  {post.relatedServices.slice(1).map((path, i) => (
                    <span key={path}>
                      {i > 0 && ' · '}
                      <Link to={path} className="text-white/70 hover:text-[#FF7A00] transition-colors">
                        {serviceLabel(path)}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
          )}
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">More on {CATEGORY_LABELS[post.category]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
