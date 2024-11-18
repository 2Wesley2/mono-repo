function updateOrderStatus(order) {
  if (order.status === 'Stand By') {
    order.status = 'In Progress';
  }
}
export default updateOrderStatus;
