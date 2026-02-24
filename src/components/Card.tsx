import './Card.css';
import BookmarkButton from './BookmarkButton';
import { isRecentlyAdded } from '../utils/dates';

interface CardProps {
    href: string;
    title: string;
    body: string;
    tag?: string | undefined;
    dateAdded?: string | undefined;
    slug?: string | undefined;
    category?: string | undefined;
    image?: string | undefined;
}

export default function Card({
    href,
    title,
    body,
    tag,
    dateAdded,
    slug,
    image,
}: CardProps) {
    const linkUrl = slug ? `/articles/${slug}` : href;
    const isNew = isRecentlyAdded(dateAdded, 30);
    const coverImage = image || 'https://pbs.twimg.com/media/HBYKYqjbcAI9_Jp.jpg';

    return (
        <li className="link-card">
            <div className="card-cover">
                <img style={{ objectFit: 'cover' }} src={coverImage} alt={title} />
                <p className="distribution">
                    {isNew && (
                        <span
                            className="tag nu-u-me-2 tag-new"
                            title="Recently added"
                            aria-label="New item"
                        >
                            🔥
                        </span>
                    )}
                    <span className="tag">{tag}</span>
                </p>
            </div>
            <a
                href={linkUrl}
                onClick={() => {
                    window.dispatchEvent(new CustomEvent('articles:save-state'));
                }}
            >
                {/*<strong className="nu-c-fs-normal nu-u-mt-1 nu-u-mb-1">{title}</strong>*/}
                <strong className="nu-c-helper-text nu-u-mt-1 nu-u-mb-1">{body}</strong>
            </a>
            {slug && (
                <div className="card-bookmark">
                    <BookmarkButton slug={slug} title={title} variant="small" />
                </div>
            )}
        </li>
    );
}
