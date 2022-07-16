// import axios from "axios";
import Link from "next/link";
import buildClient from "../api/build-client";

const LandingPage = ({ /*color,*/ currentUser, tickets }) => {
  const ticketsList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketsList}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };

  // const client = buildClient(context);
  // const response = await client.get("/api/users/currentuser").catch(err => {
  //   // console.error(err.message);
  // });
  // return response?.data || {};

  // if (typeof window === "undefined") {
  //     // const response = await axios.get("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser", {
  //     //     headers: req.headers
  //     //     // {
  //     //     //     Host: 'ticketing.dev'
  //     //     // }
  //     // }).catch(err => {
  //     //     console.log(err.message);
  //     // });
  //     // return response?.data;
  // } else {
  //     const { data } = await axios.get("/api/users/currentuser");
  //     return data;
  // }

  // return {};

  // console.log("I am on the Server!");

  // const response = await axios.get("/api/users/currentuser")
  // .catch(err => {
  //     console.log(err.message);
  // });

  // return { color: "red" };
  // return response.data;
};

export default LandingPage;
