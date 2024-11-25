function mergeDuplicateProducts(products) {
  console.debug('mergeDuplicateProducts: Initial products array:', JSON.stringify(products, null, 2));

  const mergedProducts = [];

  products.forEach((product) => {
    // Log para inspecionar cada produto
    console.debug('mergeDuplicateProducts: Processing product:', JSON.stringify(product, null, 2));

    // Validação: Verificar se o produto é válido
    if (!product || !product.product) {
      console.error('mergeDuplicateProducts: Invalid product object encountered:', JSON.stringify(product, null, 2));
      throw new Error('Invalid product data: missing "product" property');
    }

    const existingProduct = mergedProducts.find((p) => {
      // Certifique-se de que p e p.product são válidos antes de acessar `toString`
      if (!p || !p.product) {
        console.warn('mergeDuplicateProducts: Skipping invalid entry in mergedProducts:', JSON.stringify(p, null, 2));
        return false;
      }
      return p.product.toString() === product.product.toString();
    });

    if (existingProduct) {
      console.debug(
        `mergeDuplicateProducts: Found duplicate. Adding quantity: ${product.quantity} to existing quantity: ${existingProduct.quantity}`,
      );
      existingProduct.quantity += product.quantity;
    } else {
      console.debug('mergeDuplicateProducts: Adding new product to merged array:', JSON.stringify(product, null, 2));
      mergedProducts.push({ ...product });
    }
  });

  console.debug('mergeDuplicateProducts: Final merged products array:', JSON.stringify(mergedProducts, null, 2));

  return mergedProducts;
}

export default mergeDuplicateProducts;
