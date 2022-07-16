import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const response = await client.get("/api/users/currentuser").catch(f => f);

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, response.data.currentUser);
  }

  // console.log(Object.keys(appContext));
  // console.log(response?.data);
  // console.log(pageProps);

  return {
    pageProps,
    currentUser: response?.data ? response.data.currentUser : null
  };

  // return response?.data || {};
};

export default AppComponent;
