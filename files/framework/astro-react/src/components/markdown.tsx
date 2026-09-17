import './markdown.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import type { ComponentPropsWithoutRef } from 'react';

type MarkdownProps = {
  children: string;
};

type TableHeaderCellProps = ComponentPropsWithoutRef<'th'> & { node?: unknown };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TableHeaderCell({ node, ...props }: TableHeaderCellProps) {
  return <th scope="col" {...props} />;
}

const AUDIO_EXTENSION = /\.(mp3|wav|ogg|m4a)$/i;
const VIDEO_EXTENSION = /\.(mp4|webm|mov|ogv)$/i;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

function extractYouTubeId(src: string): string | null {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  let id: string | null = null;

  if (host === 'youtu.be') {
    id = url.pathname.slice(1);
  } else if (host === 'youtube.com') {
    if (url.pathname === '/watch') {
      id = url.searchParams.get('v');
    } else if (url.pathname.startsWith('/embed/')) {
      id = url.pathname.slice('/embed/'.length);
    } else if (url.pathname.startsWith('/shorts/')) {
      id = url.pathname.slice('/shorts/'.length);
    }
  }

  return id && YOUTUBE_ID.test(id) ? id : null;
}

type MarkdownImageProps = ComponentPropsWithoutRef<'img'> & { node?: unknown };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MarkdownImage({ node, src, alt, ...props }: MarkdownImageProps) {
  if (typeof src === 'string' && AUDIO_EXTENSION.test(src)) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls src={src} aria-label={alt}>
        Your browser doesn't support the audio element.
      </audio>
    );
  }

  if (typeof src === 'string' && VIDEO_EXTENSION.test(src)) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video controls src={src} aria-label={alt}>
        Your browser doesn't support the video element.
      </video>
    );
  }

  const youtubeId = typeof src === 'string' ? extractYouTubeId(src) : null;
  if (youtubeId) {
    return (
      <div className="video-embed">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return <img src={src} alt={alt} {...props} />;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypePrism]}
      components={{ th: TableHeaderCell, img: MarkdownImage }}
    >
      {children}
    </ReactMarkdown>
  );
}
