import { InstagramPost } from '../services/instagram-feed.service';

// "Live", "live-Folge", "Livestream", but not "Oliver" or "Liverpool"
const LIVE = /\blive(stream)?\b/i;

const HASHTAG = /#[\p{L}\p{N}_]+/gu;

// Pictographs plus the joiners, skin tones, flags and keycaps they are built from
const EMOJI = /[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}‍️⃣]/gu;

// End of the first sentence; a full stop after a digit is an ordinal ("1. FC Köln")
const SENTENCE_END = /(?:(?<!\d)\.|[!?…])(?=\s|$)/u;

/** Chip label from the media type; posts about a live event are marked as such */
export function chipLabel(post: Pick<InstagramPost, 'mediaType' | 'caption'>): string {
  if (LIVE.test(post.caption)) {
    return '● Live';
  }
  switch (post.mediaType) {
    case 'VIDEO':
      return 'Reel';
    case 'CAROUSEL_ALBUM':
      return 'Galerie';
    default:
      return 'Post';
  }
}

/** First line or first sentence of a caption, without hashtags and emoji */
export function headlineCaption(caption: string): string {
  const firstLine = caption.split('\n').map(line => clean(line)).find(line => line) ?? '';
  const end = SENTENCE_END.exec(firstLine);
  const sentence = end ? firstLine.slice(0, end.index + (end[0] === '.' ? 0 : 1)) : firstLine;
  return clean(sentence);
}

/** Shortens a text at a word boundary to about the given number of characters */
export function shorten(text: string, maxLength = 60): string {
  const characters = Array.from(text);
  if (characters.length <= maxLength) {
    return text;
  }
  const cut = characters.slice(0, maxLength - 1).join('');
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s\-–—|:·,;]+$/u, '')}…`;
}

function clean(text: string): string {
  return text
    .replace(HASHTAG, '')
    .replace(EMOJI, '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s\-–—|:·,;]+|[\s\-–—|:·,;]+$/gu, '');
}
