import React, {Suspense} from 'react';
import {Route, withRouter, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

const SmartMapPage = React.lazy(() =>
  import(/* webpackChunkName: "pages-profile" */ './smart-map')
);
const CreateSmartMapPage = React.lazy(() =>
  import(/* webpackChunkName: "pages-profile" */ './create-smart-map')
);
const AddSmartMapPage = React.lazy(() =>
  import(/* webpackChunkName: "pages-profile" */ './add-smart-map')
);

const Mapping = ({match}) => {
  return (
    <Suspense fallback={<div className="loading"/>}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/smart-map`}/>
        <Route
          path={`${match.url}/smart-map`}
          render={(props) => <SmartMapPage {...props} />}
        />
        <Route
          path={`${match.url}/create-smart-map`}
          render={(props) => <CreateSmartMapPage {...props} />}
        />
        <Route
          path={`${match.url}/add-smart-map/:id`}
          render={(props) => <AddSmartMapPage {...props} />}
        />
        <Redirect to="/error"/>
      </Switch>
    </Suspense>
  );
};

const mapStateToProps = ({menu}) => {
  const {containerClassnames} = menu;
  return {containerClassnames};
};

export default withRouter(connect(mapStateToProps, {})(Mapping));
