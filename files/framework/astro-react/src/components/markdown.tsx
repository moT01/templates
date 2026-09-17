import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      // No captions track yet - unlike a short audio clip, video captions
      // are often genuinely worth having, so revisit this once a video with
      // real spoken content actually shows up.
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video controls src={src} aria-label={alt}>
        Your browser doesn't support the video element.
      </video>
    );
  }

  return <img src={src} alt={alt} {...props} />;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ th: TableHeaderCell, img: MarkdownImage }}>
      {children}
    </ReactMarkdown>
  );
}
