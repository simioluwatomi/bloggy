function sluggify(text) {
    if (!text) {
        return null
    };
  
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/[^\w\s-]/g, '') // Remove non-word, non-space, and non-hyphen characters
      .replace(/\s+/g, '-') // Replace whitespace with hyphens
      .replace(/-+$/, ''); // Remove trailing hyphens
}

module.exports = sluggify;