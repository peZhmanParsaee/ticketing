import { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: payment => Router.push("/orders")
  });

  useEffect(() => {
    const findTimesLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimesLeft();
    const timerId = setInterval(findTimesLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  return <div>Time left to pay {timeLeft} seconds
    <StripeCheckout
      token={({ id }) => doRequest({ token: id })}
      stripeKey="pk_test_51LLXT4Cmiw83XnkLtdlAEnE8PyWTvybGAry6HqbUXJWE2wGolahWKNJeDYjXPwynXesde2pVOgCa035ZrWq81xXo00daRTVo3f"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>;
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  console.log(data)

  return { order: data };
} 

export default OrderShow;
