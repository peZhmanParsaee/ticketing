import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState([]);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, 
        {
          ...body,
          ...props
        }  
      );

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops ....</h4>
          <ul>{err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}</ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
