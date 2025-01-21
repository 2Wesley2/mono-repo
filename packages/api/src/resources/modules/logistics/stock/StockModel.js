import Model from '../../../../core/entities/system/base/Model.js';
import { STOCK, SHOW_ROOM, BACK_STOCK } from '../../../collections/index.js';
import loaders from '../../../../core/loaders/index.js';

const stockSchema = {
  backStock: { type: Model.objectIdType, ref: BACK_STOCK, required: true },
  showRoom: { type: Model.objectIdType, ref: SHOW_ROOM, required: true },
};

export default class StockModel extends Model {
  constructor() {
    super(stockSchema, STOCK);
  }

  async updateManyProducts(idStock, updates, stockType) {
    const collectionMap = {
      backStock: BACK_STOCK,
      showRoom: SHOW_ROOM,
    };

    if (!collectionMap[stockType]) {
      throw new Error(`Invalid stock type: ${stockType}`);
    }

    const operations = updates.map(({ productId, delta }) =>
      loaders.stock.createProductUpdateOperation(idStock, productId, delta),
    );

    const model = this.model.db.collection(collectionMap[stockType]);
    await model.bulkWrite(operations);
  }

  async generateStockReport() {
    const [backStock, showRoom] = await Promise.all([
      this.model.db.collection(BACK_STOCK).find().toArray(),
      this.model.db.collection(SHOW_ROOM).find().toArray(),
    ]);

    const productIds = [
      ...new Set([
        ...backStock.flatMap((stock) => stock.products.map((p) => p.product.toString())),
        ...showRoom.flatMap((stock) => stock.products.map((p) => p.product.toString())),
      ]),
    ];

    const productsDetails = await ProductModel.find({ _id: { $in: productIds } }).lean();

    const backStockData = loaders.stock.aggregateStockData(
      backStock.map((stock) => loaders.stock.formatStockData(stock, productsDetails)),
    );

    const showRoomData = loaders.stock.aggregateStockData(
      showRoom.map((stock) => loaders.stock.formatStockData(stock, productsDetails)),
    );

    const stockData = loaders.stock.mergeStockData(backStockData, showRoomData);

    return {
      backStock: backStockData,
      showRoom: showRoomData,
      stock: stockData,
    };
  }
}
