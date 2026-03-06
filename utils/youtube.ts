export function convertToEmbed(url?: string | null): string {
  if (!url) return "";

  if (url.includes("/embed/")) return url;

  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=1`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=1`;
  }

  return "";
}

/** Backward-compatible alias */
export const toEmbed = convertToEmbed;
