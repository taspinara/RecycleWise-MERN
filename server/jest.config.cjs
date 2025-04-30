// server/jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  transform: {}, // hiçbir dönüşüm (Babel vs.) uygulama
};
// Jest, ESM modüllerini destekler, ancak bazı ayarlar gerekebilir.
// Bu ayarlar, Jest'in ESM modüllerini doğru bir şekilde işlemesini sağlar.
