import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRecentByCategory, type BlogCategory } from '../lib/blog';
import BlogCard from './BlogCard';

interface LatestPostsProps {
  category: BlogCategory;
  heading?: React.ReactNode;
  max?: number;
}

// "Latest from the workshop" block for service pages. Renders nothing when the
// category has no published posts yet, so it is safe to drop onto any page.
export default function LatestPosts({ category, heading, max = 3 }: LatestPostsProps) {
  const posts = getRecentByCategory(category, max);
  if (!posts.length) return null;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {heading ?? (
            <>
              <span className="text-white">Latest from the </span>
              <span className="text-[#FF7A00]">workshop</span>
            </>
          )}
        </h2>
        <Link
          to="/blog"
          className="text-[#FF7A00] hover:text-[#FF9500] font-semibold text-sm transition-colors inline-flex items-center gap-1 shrink-0"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
