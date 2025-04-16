import { getCollection } from "astro:content";
import { siteConfig } from "@/site.config";
import rss from "@astrojs/rss";

export const GET = async () => {
  const notes = await getCollection("note");

  // 按 publishDate 降序排序
  const sortedNotes = notes.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: import.meta.env.SITE,
    items: sortedNotes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.publishDate,
      link: `notes/${note.id}/`,
    })),
  });
};
