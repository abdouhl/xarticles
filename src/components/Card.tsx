import './Card.css';
import BookmarkButton from './BookmarkButton';
import { isRecentlyAdded } from '../utils/dates';

interface CardProps {
    href: string;
    title: string;
    body: string;
    screen_name?: string | undefined;
    dateAdded?: string | undefined;
    slug?: string | undefined;
    category?: string | undefined;
    image?: string | undefined;
}

export default function Card({
    href,
    title,
    body,
    screen_name,
    dateAdded,
    slug,
    category,
    image,
}: CardProps) {
    const linkUrl = slug ? `/articles/${slug}` : href;
    const isNew = isRecentlyAdded(dateAdded, 30);
    const coverImage = image || 'https://pbs.twimg.com/media/HBYKYqjbcAI9_Jp.jpg';

    return (
        <li className="link-card">
            <div className="card-cover">
                <img src={coverImage} alt={title} loading="lazy" decoding="async" />
                <p className="distribution">
                    {isNew && (
                        <span className="tag tag-new" title="Recently added" aria-label="New item">
                            🔥
                        </span>
                    )}
                    {category && (
                        <span className="tag">{category}</span>
                    )}
                    {screen_name && (
                        <span className="tag">@{screen_name}</span>
                    )}
                </p>
            </div>
            <a
                href={linkUrl}
                aria-label={`Read article: ${title}`}
                onClick={() => {
                    window.dispatchEvent(new CustomEvent('articles:save-state'));
                }}
            >
                <strong className="nu-c-helper-text nu-u-mt-1 nu-u-mb-1">{title}</strong>
            </a>
            {slug && (
                <div className="card-bookmark">
                    <BookmarkButton slug={slug} title={title} variant="small" />
                </div>
            )}
        </li>
    );
}