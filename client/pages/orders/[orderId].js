import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      // get the time left until the order expires
      setTimeLeft(Math.round(msLeft / 1000));
      // set the timeLeft to the msLeft
    };

    findTimeLeft();
    // invoke the function first manually to avoid waiting 1 secs before setInterval
    // actually start working
    const timer = setInterval(findTimeLeft, 1000);
    // repeat invoking findTimeLeft every 1000 secs

    return () => clearInterval(timer);
    // to stop the interval function of running fo ever by just leaving the
    // component so it will clearInterval
  }, [order]);

  return timeLeft > 0 ? (
    <div className="ml-10 mt-10">
      <h1 className="text-white text-5xl font-extrabold mb-5">
        {order.ticket.title}{" "}
      </h1>
      <h2 className="text-white text-2xl mb-7">
        {timeLeft} seconds left to complete the payment
      </h2>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })} // call back function when the payment is done
        stripeKey="pk_test_51K9E2ALtvkqnn0aXgi4zmy4jxLpCXLfPPPG4uzsJ9fPwn4eYCF0M9SRlV0VY8Mh3yVH5NmScNo1Xcry2qdFXm5MU00TMXdMy6D"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  ) : (
    <h1 className="text-white text-4xl">OOPS!! The Order Has Been Expired</h1>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
