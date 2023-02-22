import React, { useEffect, useState, Suspense } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AuthCheck from './authCheck'
import useToken from './useToken';

const ViewUnauthorized = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ '../../unauthorized')
);

const App = () => {
  const { token, setToken } = useToken();
  const [loginState, setLoginState] = useState(false)

  if (loginState) {
    return <BrowserRouter>
      <Route
        path="/unauthorized"
        render={(props) => <ViewUnauthorized {...props} />}
      />
      <Redirect to="/unauthorized" />
    </BrowserRouter>
  }
  if (!token) {
    return <AuthCheck setToken={setToken} setLoginState={setLoginState} />
  }

  return (
    <div className="h-100">
      <>
        <Suspense fallback={<div className="loading" />}>
          <BrowserRouter>
            <Switch>
              <Route
                path="/IoTest"
                render={() => <IoTest />}
              />
              <Route
                path="/unauthorized"
                render={(props) => <ViewUnauthorized {...props} />}
              />
              <Redirect to="/IoTest" />
            </Switch>
          </BrowserRouter>
        </Suspense>
      </>
    </div>
  );
}
const mapStateToProps = ({ authUser, settings, robots }) => {
  const { currentUser } = authUser;
  const { locale } = settings;
  return { currentUser, locale, robots };
};

export default connect(mapStateToProps)(App);
