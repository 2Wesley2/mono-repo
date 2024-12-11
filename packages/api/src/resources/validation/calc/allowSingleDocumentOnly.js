export function allowSingleDocumentOnly(schema) {
  schema.pre('save', async function (next) {
    console.log('Middleware pre-save chamado');

    if (this.isNew) {
      const count = await this.constructor.countDocuments();
      console.log(`Documentos existentes: ${count}`);

      if (count >= 1) {
        const error = new Error('Apenas um documento é permitido no banco de dados.');
        error.status = 400;
        return next(error);
      }
    }
    next();
  });

  schema.pre('insertMany', async function (docs, next) {
    console.log('Middleware pre-insertMany chamado');
    const count = await this.model.countDocuments();
    if (count > 0) {
      const error = new Error('Operação não permitida. Apenas um documento pode existir.');
      error.status = 400;
      return next(error);
    }
    if (docs.length > 1) {
      const error = new Error('Operação não permitida. Apenas um documento pode ser inserido.');
      error.status = 400;
      return next(error);
    }
    next();
  });

  schema.pre('updateOne', async function (next) {
    const update = this.getUpdate();
    if (update.$setOnInsert) {
      const count = await this.model.countDocuments();
      if (count >= 1) {
        const error = new Error('Não é permitido criar novos documentos.');
        error.status = 403;
        return next(error);
      }
    }
    next();
  });
}
