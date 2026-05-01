import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  // Generate JSON-LD for BreadcrumbList
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.auto-cleanse.co.uk/'
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: item.path ? `https://www.auto-cleanse.co.uk${item.path}` : undefined
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto whitespace-nowrap">
        <ol className="flex items-center text-sm text-white/50">
          <li>
            <Link to="/" className="hover:text-[#FF7A00] transition-colors flex items-center">
              <Home size={14} className="mr-1" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={item.name} className="flex items-center">
                <ChevronRight size={14} className="mx-2 text-white/30" />
                {isLast || !item.path ? (
                  <span className="text-white/90 font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link to={item.path} className="hover:text-[#FF7A00] transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
