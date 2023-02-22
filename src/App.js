import React, { Suspense, useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './helpers/Firebase';
import AppLocale from './lang';
import { getDirection } from './helpers/Utils';
import { adminRoot } from './constants/defaultValues'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './views/app/care-dashboards/control.css'
import { IntlProvider } from 'react-intl'
import FutureAppUI from './views/app/pages/default'
import { useRobornSpeechRecognition } from './helpers/RobornSpeechRecognition'
import ReactHub from './views/app/pages/reactHub/reactHub'
import ProjectionApp from './views/app/pages/reactHub/projectionApp.js'
import zIndex from '@material-ui/core/styles/zIndex';
import { lang } from 'moment';

const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);
const ViewUnauthorized = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/unauthorized')
);

export const MyProtectedRoute = ({ component: Component, ...rest }) => {
  const isLogin = sessionStorage.getItem('token')
  return (
    <Route {...rest}
      render={props => (isLogin ? <Component {...rest} {...props} /> :
        <Redirect to='/login' />)}
    />
  )
}
// Language Modification (Temporary)

class App extends React.Component {

  constructor(props) {
    super(props);

    this.myCarouselRef = React.createRef();
    this.state = { language: 'zh-HK' };
    sessionStorage.setItem('lang', 'zh-HK');

    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    this.hrjlhy1 = this.hrjlhy1.bind(this);
    this.hrjlhy2 = this.hrjlhy2.bind(this);
    this.hrjlhy3 = this.hrjlhy3.bind(this);
    this.hrjlhy4 = this.hrjlhy4.bind(this);
  }

  setCarousel(carousel) {
    this.setState({ carousel: carousel })
    console.log(carousel)
  }

  // Language Modification (Temporary)

  hrjlhy1(e) {
    e.stopPropagation();
    document.querySelector('#hrjlhy2').style.display = document.querySelector('#hrjlhy2').style.display == 'none' ? 'initial' : 'none'
    document.querySelector('#hrjlhy3').style.display = document.querySelector('#hrjlhy3').style.display == 'none' ? 'initial' : 'none'
    document.querySelector('#hrjlhy4').style.display = document.querySelector('#hrjlhy4').style.display == 'none' ? 'initial' : 'none'
  }
  hrjlhy2(e) {
    e.stopPropagation();
    this.setState({ language: "en-US" });
    sessionStorage.setItem('lang', 'en-US');
    document.querySelector('#hrjlhy1').click()
    console.log('Change language:', "en-US")
  }
  hrjlhy3(e) {
    e.stopPropagation();
    this.setState({ language: "cmn-Hans-CN" });
    sessionStorage.setItem('lang', 'cmn-Hans-CN');
    document.querySelector('#hrjlhy1').click()
    console.log('Change language:', "cmn-Hans-CN")
  }
  hrjlhy4(e) {
    e.stopPropagation();
    this.setState({ language: "zh-HK" });
    sessionStorage.setItem('lang', 'zh-HK');
    document.querySelector('#hrjlhy1').click()
    console.log('Change language:', "zh-HK")
  }

  render() {
    const { locale } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <Suspense fallback={<div className="loading" />}>
          <Router>
            {/* [Coding] */}
            <div style={{ position: "absolute", left: "calc(100vw - 150px)", width: "150px", height: "100px", cursor: 'pointer', zIndex: 999 }} id="hrjlhy1" onClick={this.hrjlhy1}></div>
            <div style={{ position: "absolute", left: "calc(100vw - 150px)", top: "100px", width: "150px", height: "100px", background: "#eee", cursor: 'pointer', fontSize: "32px", textAlign: 'center', display: 'none', zIndex: 999 }} id="hrjlhy2" onClick={this.hrjlhy2}><span style={{ lineHeight: '100px' }}>English</span></div>
            <div style={{ position: "absolute", left: "calc(100vw - 150px)", top: "200px", width: "150px", height: "100px", background: "#eee", cursor: 'pointer', fontSize: "32px", textAlign: 'center', display: 'none', zIndex: 999 }} id="hrjlhy3" onClick={this.hrjlhy3}><span style={{ lineHeight: '100px' }}>普通话</span></div>
            <div style={{ position: "absolute", left: "calc(100vw - 150px)", top: "300px", width: "150px", height: "100px", background: "#eee", cursor: 'pointer', fontSize: "32px", textAlign: 'center', display: 'none', zIndex: 999 }} id="hrjlhy4" onClick={this.hrjlhy4}><span style={{ lineHeight: '100px' }}>粤语</span></div>
            <SpeechRecognition myCarouselRef={this.myCarouselRef} language={this.state.language}></SpeechRecognition>
            <Switch>
              <MyProtectedRoute
                path={adminRoot}
                component={() => <FutureAppUI isLogin={true} carouselRef={this.myCarouselRef} />}
              />
              <Route
                path="/reactHub"
                exact
                render={(props) => <ReactHub {...props} />}
              />
              <Route
                path="/projectionApp"
                exact
                render={(props) => <ProjectionApp {...props} />}
              />
              <Route
                path="/error"
                exact
                render={(props) => <ViewError {...props} />}
              />
              <Route
                path="/unauthorized"
                exact
                render={(props) => <ViewUnauthorized {...props} />}
              />
              <Route
                path="/login"
                exact
                render={() => <FutureAppUI isLogin={false} />}
              />
              <Redirect exact from="/" to={adminRoot} />
              <Redirect to="/error" />
            </Switch>
          </Router>
        </Suspense>
      </IntlProvider>
    );
  }
}

const SpeechRecognition = ({ myCarouselRef, language }) => {
  useRobornSpeechRecognition({ myCarouselRef, language })
  return <></>
}

const mapStateToProps = ({ authUser, settings }) => {
  const { currentUser } = authUser;
  const { locale } = settings;
  return { currentUser, locale };
};
const mapActionsToProps = {};
export default connect(mapStateToProps, mapActionsToProps)(App);
