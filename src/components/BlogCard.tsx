import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { CATEGORY_LABELS, type BlogPost } from '../lib/blog';
import BlogImage from './BlogImage';

function formatDate(date: string): string {
  const d = new Date(date);
  return isNaN(+d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group rounded-2xl bg-[#1A1D22] border border-white/5 overflow-hidden hover:border-[#FF7A00]/30 transition-colors duration-300 flex flex-col">
      <Link to={`/blog/${post.slug}`} className="block" aria-label={post.title}>
        <div className="relative aspect-[16/9] overflow-hidden bg-black/40">
          <BlogImage
            src={post.coverImage}
            alt={post.coverAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#FF7A00] text-black">
            {CATEGORY_LABELS[post.category]}
          </span>
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-white/40 text-xs mb-3">
          {formatDate(post.date) && <span>{formatDate(post.date)}</span>}
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {post.readingTime} min read
          </span>
        </div>
        <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-[#FF7A00] transition-colors">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="text-[#FF7A00] hover:text-[#FF9500] font-semibold text-sm transition-colors mt-auto"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}
