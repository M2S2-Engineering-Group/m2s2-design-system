import { Link } from 'react-router';
import { BlogCardConfig } from '@m2s2/models';
import './BlogCard.scss';

interface BlogCardProps {
  config: BlogCardConfig;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function BlogCard({ config }: BlogCardProps) {
  return (
    <div className="m2s2-blog-card">
      <div className="bc-cover">
        {config.coverImage ? (
          <img src={config.coverImage} alt={config.title} className="bc-cover-img" loading="lazy" />
        ) : (
          <div className="bc-cover-placeholder">
            <span className="bc-cover-tag">{config.tags[0]}</span>
          </div>
        )}
      </div>
      <div className="bc-inner">
        <div className="bc-meta">
          <time dateTime={config.date}>{formatDate(config.date)}</time>
          {config.readingTime && <span className="bc-reading-time">{config.readingTime} min read</span>}
        </div>
        <h2 className="bc-title">
          <Link to={`/blog/${config.slug}`}>{config.title}</Link>
        </h2>
        <p className="bc-summary">{config.summary}</p>
        <div className="bc-tags">
          {config.tags.map((tag) => (
            <span key={tag} className="bc-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
