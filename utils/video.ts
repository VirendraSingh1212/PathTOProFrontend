export function getEmbedUrl(url: string) {
  if (!url) return "";

  // Convert YouTube watch URL
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  // Convert short youtu.be URL
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}
