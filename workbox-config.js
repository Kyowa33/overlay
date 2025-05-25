// workbox-config.js
module.exports = {
  globDirectory: './',
  globPatterns: [
    '**/*.{html,js,css,jpeg,jpg,png,svg}'
  ],
  swDest: 'service-worker.js',
  clientsClaim: true,
  skipWaiting: true,
};