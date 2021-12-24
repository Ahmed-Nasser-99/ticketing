const OrderIndex = ({ orders }) => {
  const orderList = orders.map((order) => {
    return (
      <tr key={order.id} className="border-b border-gray-700">
        <td className="py-4 text-2xl text-center text-gray-100">
          {order.ticket.title}
        </td>
        <td className="py-4 text-2xl text-center text-gray-100">
          {order.ticket.price}
        </td>
        <td className="py-4 text-2xl text-center text-gray-100">
          {order.status}
        </td>
      </tr>
    );
    // <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
    // href is the page path in the project the browser will display
    // as is the real URL the browser navigates to
  });

  if (orders.length > 0) {
    return (
      <div className="text-white">
        <h1 className="text-6xl mt-5 ml-5 font-bold">Tickets</h1>
        <table className=" mt-5  w-full ">
          <thead className=" mt-5">
            <tr className="border-b border-t text-4xl border-gray-700">
              <th className="py-5 w-auto">Title</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{orderList}</tbody>
        </table>
      </div>
    );
  } else {
    return (
      <h1 className="text-gray-100 text-5xl mt-5 font-extrabold text-center">
        No Orders To Show
      </h1>
    );
  }
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
