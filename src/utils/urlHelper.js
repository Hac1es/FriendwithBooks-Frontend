export const convertToSlug = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD") // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[đĐ]/g, "d") // Handle special case for Vietnamese 'd'
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove whitespace from both ends
};

export const buildProductUrl = (categoryPath, bookId) => {
  if (!categoryPath?.length) return `/Products/${bookId}`;
  const encodedPath = categoryPath.map((cat) => encodeURIComponent(cat));
  return `/products/${encodedPath.join("/")}/${bookId}`;
};
