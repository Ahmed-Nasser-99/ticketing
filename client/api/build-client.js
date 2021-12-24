import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we are on the server
    // request can be made with http://ingress-srv.....
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
    // a pre configured version of axios
  } else {
    //we are on the browser
    //request can be made with the base URL
    return axios.create({
      baseURL: "/",
    });
  }
};
