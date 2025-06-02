const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // tu configuración de Next.js aquí
  allowedDevOrigins: ['http://192.168.1.16:3001'],
});
