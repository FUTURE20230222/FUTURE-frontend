import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import IconCardsCarousel from '../../../containers/dashboards/IconCardsCarousel';
import QuickPost from '../../../containers/dashboards/QuickPost';
import BestSellers from '../../../containers/dashboards/BestSellers';
import Cakes from '../../../containers/dashboards/Cakes';
import GradientWithRadialProgressCard from '../../../components/cards/GradientWithRadialProgressCard';
import WebsiteVisitsChartCard from '../../../containers/dashboards/WebsiteVisitsChartCard';
import ConversionRatesChartCard from '../../../containers/dashboards/ConversionRatesChartCard';
import NewComments from '../../../containers/dashboards/NewComments';
import PTZJoystickSwitcher from '../../../components/common/PTZJoystickSwitcher';
//
import Jitsi from 'react-jitsi';
//
const ConferenceDefault = ({ intl, match }) => {
  const { messages } = intl;


  // const mainMenuOffset = document.querySelector(".main-menu").offsetWidth
  // const subMenuOffset = document.querySelector(".sub-menu").offsetWidth
  const mainMenuOffset = 0
  const subMenuOffset = 0

  const [state, setState] = useState({
    main: document.querySelector('main'),
    footer: document.querySelector('footer'),
    body: document.querySelector('body'),
    height: document.querySelector('body').offsetHeight - 110,
    width: document.querySelector('body').offsetWidth - mainMenuOffset - subMenuOffset,
  });

  useEffect((cb) => {
    console.log(state, cb);
    if (document.querySelector(".page-footer")) {
      document.querySelector(".page-footer").remove()
    }
  }, []);
  return (
    <>
      <Row style={{ overflowY: "hidden" }}>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.conference" match={match} />
          <Separator className="mb-5" />
        </Colxx>
        <Colxx xxs="12" style={{ justifyContent: "center", display: "flex" }}>
          {/* {state.width} {state.height} */}
          <Jitsi
            roomName="qecare"
            displayName="QE-CARE"
            domain="172.18.1.254"
            noSSL={false}
            containerStyle={{
              width: state.width + 'px',
              height: state.height + 'px',
            }}
          />
        </Colxx>
      </Row>
      <PTZJoystickSwitcher ROBOT_HOST="http://172.18.1.255:8080" />
    </>
  );
};
export default injectIntl(ConferenceDefault);
