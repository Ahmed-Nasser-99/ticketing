import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  const buyOwnTicket = () => {
    if (currentUser.id !== ticket.userId) {
      return (
        <button
          onClick={() => doRequest()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Purchase
        </button>
      );
    } else {
      return (
        <h1 className="text-gray-100 text-5xl mt-5 font-extrabold text-center">
          You Already Own That Ticket
        </h1>
      );
    }
  };

  return (
    <div className="text-gray-100 text-center">
      <h1 className="text-gray-100 text-5xl mb-5 font-extrabold">
        {ticket.title}
      </h1>
      <h4 className="text-gray-100 text-3xl mb-5 font-medium">
        Price: {ticket.price} $
      </h4>
      {errors}
      {buyOwnTicket()}
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
