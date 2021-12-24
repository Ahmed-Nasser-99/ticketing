// this is used to send requests from the pages component

import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  //method = post ||  get || patch

  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    // do request may receive some more args. called props and it is empty object
    // by default
    try {
      setErrors(null);
      const response = await axios[method](url, {
        ...body,
        ...props,
        // send the body and the props tog ether
      });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      setErrors(
        <div className="bg-red-200 border-l-4 border-red-500 text-orange-700 p-4 mb-2 text-black">
          <h4 className="font-bold">Ooopps...</h4>
          <ul>
            <div>
              {error.response.data.errors.map((err) => (
                <li key={err.message}>{err.message}</li>
              ))}
            </div>
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

//this hook is to printout any errors that occur at any place in the app
//rather than duplicate the code
