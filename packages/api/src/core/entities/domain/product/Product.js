class Product {
  static filterByCategories(ownerId) {
    return {
      filter: { ownerId, category: { $ne: null } },
      projection: { _id: 1, name: 1, price: 1, category: 1 }
    };
  }

  static filterBySearch(ownerId, q) {
    return {
      filter: { ownerId, name: { $regex: `^${q}`, $options: 'i' } }
    };
  }
}
export default {
  filterByCategories: (...args) => Product.filterByCategories(...args),
  filterBySearch: (...args) => Product.filterBySearch(...args)
};
