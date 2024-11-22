import rawBody from 'raw-body';
const captureRawBody = (req) => {
  return new Promise((resolve, reject) => {
    rawBody(req, { encoding: 'utf-8' })
      .then((body) => {
        req.rawBody = body;
        console.log('[DEBUG] Raw body recebido:', req.rawBody);
        resolve();
      })
      .catch((err) => {
        console.error('Erro ao capturar raw body:', err);
        reject(err);
      });
  });
};

export default captureRawBody;
