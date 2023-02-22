import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
// import { ProtectedRoute, UserRole } from '../../../helpers/authHelper';

const DashboardDefault = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './default')
);
const ConferenceDefault = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-content" */ './conference')
);
const MapDefault = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-ecommerce" */ './newMap')
);
const TestCreateMapDefault = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-ecommerce" */ './testCreateMap')
)
const PatrolDefault = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-ecommerce" */ './patrol')
);
const CareDashboards = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/qecare`} />
      <Route
        path={`${match.url}/qecare`}
        render={(props) => <DashboardDefault {...props} />}
      />
      <Route
        path={`${match.url}/conference`}
        render={(props) => <ConferenceDefault {...props} />}
      />
      <Route
        path={`${match.url}/map`}
        render={(props) => <MapDefault {...props} />}
      />
      <Route
        path={`${match.url}/testCreateMap`}
        render={(props) => <TestCreateMapDefault {...props} />}
      />
      <Route
        path={`${match.url}/patrol`}
        render={(props) => <PatrolDefault {...props} />}
      />

      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default CareDashboards;
