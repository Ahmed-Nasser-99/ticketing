import Link from "next/link";

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig) // to remove the null elements from the array
    .map(({ label, href }) => {
      return (
        <Link href={href} key={href}>
          <a className="inline-block text-l px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 ml-5">
            {label}
          </a>
        </Link>
      );
    });

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-700 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link href="/">
          <a className="font-semibold text-3xl tracking-tight">Ticketing</a>
        </Link>
      </div>
      <div>
        {links}
        <Link href={currentUser ? "/tickets/new" : "/auth/signup"}>
          <a className="inline-block text-l px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 ml-5">
            Add Ticket
          </a>
        </Link>
      </div>
    </nav>
  );
};
