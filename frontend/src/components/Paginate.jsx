import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Paginate = ({ pages, page, keyword = '' }) => {
  if (pages <= 1) return null;

  const createLink = (pageNum) => {
    if (keyword) {
      return `/search/${keyword}/page/${pageNum}`;
    }
    return `/page/${pageNum}`;
  };

  return (
    <div className="flex items-center gap-2">
      {page > 1 && (
        <Link
          to={createLink(page - 1)}
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <ChevronLeft size={20} />
        </Link>
      )}

      {[...Array(pages).keys()].map((x) => {
        const p = x + 1;
        return (
          <Link
            key={p}
            to={createLink(p)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition ${
              p === page
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p}
          </Link>
        );
      })}

      {page < pages && (
        <Link
          to={createLink(page + 1)}
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <ChevronRight size={20} />
        </Link>
      )}
    </div>
  );
};

export default Paginate;