import Router from "next/router";
import { useState } from "react";
import useRequest from "../../hooks/use-request";

const newTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      // if the user enters letters in the price input
      return;
    }
    setPrice(value.toFixed(2));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <form
      className="absolute top-1/4 left-1/4 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2 bg-gray-700"
      onSubmit={onSubmit}
    >
      <h1 className="block text-white font-bold mb-2 text-4xl">New Ticket</h1>
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          Ticket Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />
      </div>
      <div className="mb-6">
        <label className="block text-white text-sm font-bold mb-2">Price</label>
        <input
          className="shadow appearance-none border border-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          placeholder="$$$"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          onBlur={onBlur} // when the user deselect the input field
          value={price}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>{errors}</div>
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default newTicket;
