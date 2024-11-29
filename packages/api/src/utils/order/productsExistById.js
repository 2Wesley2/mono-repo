function productsExistById(ids, products) {
  const returnedIds = products.map((product) => product._id.toString());
  return ids.every((id) => returnedIds.includes(id));
}

export default productsExistById;
