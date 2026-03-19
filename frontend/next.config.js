const nextConfig = {
  serverExternalPackages: ["pdf-parse", "tesseract.js", "canvas", "pdfjs-dist"],
  transpilePackages: ["pdf-img-convert"],
  experimental: {},
};

module.exports = nextConfig;
