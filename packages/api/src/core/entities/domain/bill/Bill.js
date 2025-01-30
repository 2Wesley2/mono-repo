class Bill {
  static #filterByBill(ownerId, billNumber) {
    return { $match: { ownerId, billNumber } };
  }
  static #joinWithProducts() {
    return {
      $lookup: {
        from: 'products',
        localField: 'products.name',
        foreignField: '_id',
        as: 'matchedProducts',
      },
    };
  }

  static #updateProductQuantities(updatedProducts) {
    return {
      $set: {
        products: updatedProducts.map((newProd) => ({
          name: newProd.name,
          quantity: newProd.quantity,
        })),
      },
    };
  }

  static #recalculateTotalAmount() {
    return {
      $set: {
        amount: {
          $reduce: {
            input: '$products',
            initialValue: 0,
            in: {
              $add: [
                '$$value',
                {
                  $multiply: [
                    {
                      $ifNull: [
                        {
                          $getField: {
                            field: 'price',
                            input: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: '$matchedProducts',
                                    as: 'prodDetail',
                                    cond: { $eq: ['$$prodDetail._id', '$$this.name'] },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                        },
                        0, // Se não encontrar o produto, assume preço 0
                      ],
                    },
                    '$$this.quantity',
                  ],
                },
              ],
            },
          },
        },
      },
    };
  }

  static #saveUpdatedBill() {
    return {
      $merge: {
        into: 'bills',
        whenMatched: 'merge',
        whenNotMatched: 'fail',
      },
    };
  }

  static buildUpdateBillPipeline({ ownerId, billNumber, updatedProducts }) {
    return [
      this.#filterByBill(ownerId, billNumber),
      this.#joinWithProducts(),
      this.#updateProductQuantities(updatedProducts),
      this.#recalculateTotalAmount(),
      this.#saveUpdatedBill(),
    ];
  }

  static #selectProductDetails() {
    return {
      $project: {
        'productDetails._id': 1,
        'productDetails.name': 1,
        'productDetails.price': 1,
        'productDetails.category': 1,
        'products.quantity': 1,
      },
    };
  }

  static buildFetchProductsPipeline(ownerId, billNumber) {
    return [this.#filterByBill(ownerId, billNumber), this.#joinWithProducts(), this.#selectProductDetails()];
  }
}

export default {
  buildUpdateBillPipeline: (...args) => Bill.buildUpdateBillPipeline(...args),
  buildFetchProductsPipeline: (...args) => Bill.buildFetchProductsPipeline(...args),
};
