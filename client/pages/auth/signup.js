import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [errors, setErrors] = useState([]);
  const { errors, doRequest } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email, password
    },
    onSuccess: () => Router.push("/")
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    // Router.push("/");

    await doRequest();

    // try {
    //     const response = await axios.post("/api/users/signup", {
    //         email,
    //         password
    //     });

    //     console.log(response.data);
    // } catch (err) {
    //     console.log(err.response.data);
    //     setErrors(err.response.data.errors);
    // }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email Address:</label>
        <input
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {/* {errors.length && <div className="alert alert-danger">
                <h4>Oooops ....</h4>
                <ul>
                {errors.map(err => <li key={err.message}>{err.message}</li>)}
                </ul>
            </div>} */}
      {errors}
      <button className="btn btn-primary">
        Sign Up
      </button>
    </form>
  )
};

export default SignUp;
