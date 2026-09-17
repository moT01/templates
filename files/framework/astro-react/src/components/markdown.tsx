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

  return <img src={src} alt={alt} {...props} />;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ th: TableHeaderCell, img: MarkdownImage }}>
      {children}
    </ReactMarkdown>
  );
}
