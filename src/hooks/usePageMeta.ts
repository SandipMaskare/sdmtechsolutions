import { useEffect } from "react";

/** Sets the browser tab title and meta description for a page. */
export const usePageMeta = (title: string, description?: string) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    let el = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const prevDesc = el?.content;
    if (description && el) el.content = description;
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
      if (el && prevDesc !== undefined) el.content = prevDesc;
    };
  }, [title, description]);
};
