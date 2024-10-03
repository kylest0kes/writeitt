const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple dashes with a single dash
        .trim(); // Trim spaces
};

export default generateSlug;
