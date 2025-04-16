import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";
import type { Root } from "mdast";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

interface RemarkData {
  astro: {
    frontmatter: {
      readingTime?: string;
      [key: string]: unknown;
    };
  };
}

export const remarkReadingTime: RemarkPlugin = () => {
  return (tree: Root, { data }: { data: RemarkData }) => {
    const textOnPage = mdastToString(tree);
    const readingTime = getReadingTime(textOnPage);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    data.astro.frontmatter.readingTime = readingTime.text;
  };
}
