import React, {Suspense} from 'react';
import {Route, withRouter, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import AppLayout from '../../layout/AppLayout';
// import { ProtectedRoute, UserRole } from '../../helpers/authHelper';

const Dashboards = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './dashboards')
);
const Pages = React.lazy(() =>
  import(/* webpackChunkName: "pages" */ './pages')
);
const Applications = React.lazy(() =>
  import(/* webpackChunkName: "applications" */ './applications')
);
const Ui = React.lazy(() => import(/* webpackChunkName: "ui" */ './ui'));
const Menu = React.lazy(() => import(/* webpackChunkName: "menu" */ './menu'));
const BlankPage = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './blank-page')
);
const CareDashboards = React.lazy(() =>
  import(/* webpackChunkName: "care-dashboards" */ './care-dashboards')
);
const Robots = React.lazy(() =>
  import(/* webpackChunkName: "care-dashboards" */ './robots')
);
const Mapping = React.lazy(() => import(/* webpackChunkName: "ui" */ './mapping'));
const Patrol = React.lazy(() =>
import(/* webpackChunkName: "blank-page" */ './patrol')
);
const IoTest = React.lazy(() => import(/* webpackChunkName: "ui" */ './io-test'));

const App = ({match}) => {
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading"/>}>
          <Switch>
            <Redirect
              exact
              from={`${match.url}/`}
              to={`${match.url}/care-panel`}
            />
            <Route
              path={`${match.url}/care-panel`}
              render={(props) => <CareDashboards {...props} />}
            />
            <Route
              path={`${match.url}/robots`}
              render={(props) => <Robots {...props} />}
            />
            <Route
              path={`${match.url}/mapping`}
              render={(props) => <Mapping {...props} />}
            />
            <Route
              path={`${match.url}/dashboards`}
              render={(props) => <Dashboards {...props} />}
            />
            <Route
              path={`${match.url}/applications`}
              render={(props) => <Applications {...props} />}
            />
            {/* <ProtectedRoute
                    path={`${match.url}/applications`}
                    component={Applications}
                    roles={[UserRole.Admin]}
            /> */}
            <Route
              path={`${match.url}/pages`}
              render={(props) => <Pages {...props} />}
            />
            <Route
              path={`${match.url}/ui`}
              render={(props) => <Ui {...props} />}
            />
            <Route
              path={`${match.url}/menu`}
              render={(props) => <Menu {...props} />}
            />
            <Route
              path={`${match.url}/blank-page`}
              render={(props) => <BlankPage {...props} />}
            />
            <Route
              path={`${match.url}/patrol`}
              render={(props) => <Patrol {...props} />}
            />
            <Route
              path={`${match.url}/io-test`}
              render={(props) => <IoTest {...props} />}
            />
            {/* <Redirect to="/error" /> */}
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({menu}) => {
  const {containerClassnames} = menu;
  return {containerClassnames};
};

export default withRouter(connect(mapStateToProps, {})(App));
