const OrdersIndex = ({ orders }) => {
  const ordersList = orders.map(order => {
    return <tr>
      <td>{order.ticket.title}</td>
      <td>{order.ticket.price}</td>
      <td>{order.status}</td>
    </tr>
  });

  return <div>
    <h1>My Orders</h1>
    <table className="table">
      <thead>
        <th>Title</th>
        <th>Price</th>
        <th>Status</th>
      </thead>
      <tbody>
        {ordersList}
      </tbody>
    </table>
  </div>
};

OrdersIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrdersIndex;
