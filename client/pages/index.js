//due to using nextJS the file names are used as pages names (as routers)
//in react the index.js file (page) is the root file

import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id} className="border-b border-gray-700">
        <td className="py-4 text-2xl text-center text-gray-100">
          {ticket.title}
        </td>
        <td className="py-4 text-2xl text-center text-gray-100">
          {ticket.price}
        </td>
        <td className="py-4 text-2xl text-center text-gray-100">
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>VIEW</a>
          </Link>
        </td>
      </tr>
    );
    // <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
    // href is the page path in the project the browser will display
    // as is the real URL the browser navigates to
  });

  if (tickets.length !== 0) {
    return (
      <div className="text-white">
        <h1 className="text-6xl mt-5 ml-5 font-bold">Tickets</h1>
        <table className=" mt-5  w-full ">
          <thead className=" mt-5">
            <tr className="border-b border-t text-4xl border-gray-700">
              <th className="py-5 w-auto">Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="text-white">
        <h1 className="text-6xl mt-5 ml-5 font-bold">Tickets</h1>
        <h1 className="text-4xl mt-5 ml-5 font-bold">
          No Tickets Have Been Offered Yet
        </h1>
      </div>
    );
  }
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
  // return tickets and save it in a variable called data
};

// every time the landing page gets rendered the getInitialProps will be called

// here we are attempting to fetch the data

// any data that returns from this function we can use it in the component

// we here used axios not the useRequest because useRequest is a hook that works
// with react component and the getInitialProps is a plane JS code

export default LandingPage;
