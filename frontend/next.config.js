const nextConfig = {
  serverExternalPackages: ["pdf-parse", "tesseract.js", "canvas", "pdfjs-dist"],
  transpilePackages: ["pdf-img-convert"],
  experimental: {
    turbopack: false,
  },
};

module.exports = nextConfig;
