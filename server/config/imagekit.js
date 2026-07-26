import ImageKit from 'imagekit';

// Lazy for the same reason as config/ai.js: ImageKit's constructor throws on missing keys, which
// at import time would prevent the server from booting at all.
let client;

const getImagekit = () => {
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    const err = new Error('Image storage is not configured (IMAGEKIT_* missing).');
    err.status = 503;
    throw err;
  }
  client ??= new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT
  });
  return client;
};

export default getImagekit;
