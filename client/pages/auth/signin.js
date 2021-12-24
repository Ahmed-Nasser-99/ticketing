import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import Link from "next/link";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email: email,
      password: password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };
  return (
    <form
      className=" absolute top-1/4 left-1/4 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2 bg-gray-700"
      onSubmit={onSubmit}
    >
      <h1 className="block text-white font-bold mb-2 text-4xl">Sign In</h1>
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2">
          Email Address
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="mb-6">
        <label className="block text-white text-sm font-bold mb-2">
          Password
        </label>
        <input
          className="shadow appearance-none border border-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="*********"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      {errors}
      <span className="text-white text-xl font-bold mb-2">
        Don't have an account yet ?? {"  "}
      </span>
      <Link href="/auth/signup">
        <a className="text-xl text-white font-extrabold underline">Sign Up</a>
      </Link>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};
