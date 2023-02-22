import React, { useState, useEffect, useRef, useContext } from 'react';

import { findDOMNode } from 'react-dom';
import { injectIntl } from 'react-intl';
import { Row, Button, Input, Form, Label } from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
//  custom comp
import { ReactComponent as IConAutoFocus } from '../../../assets/roborn-icons/rb-icon-auto-focus.svg';
import { ReactComponent as IConFocusMinus } from '../../../assets/roborn-icons/rb-icon-focus-minus.svg';
import { ReactComponent as IConFocusPlus } from '../../../assets/roborn-icons/rb-icon-focus-plus.svg';
import { ReactComponent as IConFocusManual } from '../../../assets/roborn-icons/rb-icon-manual-focus.svg';
import { ReactComponent as IConUV } from '../../../assets/roborn-icons/rb-icon-uv.svg';
import { ReactComponent as IConLED } from '../../../assets/roborn-icons/rb-icon-led.svg';
import { Joystick } from 'react-joystick-component';
import MovementController from '../../../components/common/MovementController/MovementController'
import 'rc-switch/assets/index.css';
import axios from 'axios';
import './style.css';
import './default.css'
import default_button_value from './config/default_button_value';
import { DataSocketContext, ActionSocketContext } from '../../../App'

const uid = 'Eric'
const ROBOT_STREAM_HOST = 'http://172.18.1.255:8000'
const RPASS_HOST = 'http://172.18.1.254:18080'
const ROBOT_HOST = 'http://172.18.1.255:8080'
const ROBOT_NAME = 'aobo1001'
const TouchableImage = (props) => {
  const imageRef = useRef();
  let [isFrameReload, setIsFrameReload] = useState(false)
  let [state, setState] = useState({
    naturalWidth: null,
    naturalHeight: null,
    clientWidth: null,
    clientHeight: null,
    scaleX: null,
    scaleY: null,
    offsetX: null,
    offsetY: null,
    naturalX: null,
    naturalY: null,
    imgOnloaded: null,
  });
  document.body.style.overflow = 'hidden';

  const renewImageData = () => {
    const data = {
      ...state,
      naturalWidth: imageRef.current.naturalWidth,
      naturalHeight: imageRef.current.naturalHeight,
      clientWidth: imageRef.current.clientWidth,
      clientHeight: imageRef.current.clientHeight,
      scaleX:
        1 +
        (imageRef.current.naturalWidth - imageRef.current.clientWidth) /
        imageRef.current.clientWidth,
      scaleY:
        1 +
        (imageRef.current.naturalHeight - imageRef.current.clientHeight) /
        imageRef.current.clientHeight,
      imgOnloaded: true,
    };
    setState(data);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      renewImageData()
    }, 300);
    return () => clearInterval(interval)
  }, [])
  const _onMouseMove = (e) => { };

  const _onClick = (e) => {
    console.log('_onClick', e);
    return props._onClick({
      ...state,
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
      naturalX: state.scaleX * e.nativeEvent.offsetX,
      naturalY: state.scaleY * e.nativeEvent.offsetY,
    });

  };
  const onLoad = (e) => {
    const data = {
      ...state,
      naturalWidth: imageRef.current.naturalWidth,
      naturalHeight: imageRef.current.naturalHeight,
      clientWidth: imageRef.current.clientWidth,
      clientHeight: imageRef.current.clientHeight,
      scaleX:
        1 +
        (imageRef.current.naturalWidth - imageRef.current.clientWidth) /
        imageRef.current.clientWidth,
      scaleY:
        1 +
        (imageRef.current.naturalHeight - imageRef.current.clientHeight) /
        imageRef.current.clientHeight,
      imgOnloaded: true,
    };
    setState(data);
  };
  return (
    <div style={{ flex: 1 }}>
      <div style={{ position: 'relative', height: '100%' }}>
        <img
          ref={imageRef}
          onMouseMove={_onMouseMove}
          onMouseDown={_onClick}
          onLoad={onLoad}
          src={props.src}
          width={props.width}
          autoPlay
          style={{
            width: '100%',
            height: '100%',
            minWidth: '200px',
            maxHeight: '300px',
            borderRadius: '8px',
            ...props.style,
          }}
        />
        {props.children}
        <div>{/* {JSON.stringify(state)} */}</div>
      </div>
    </div>
  );
};
const DefaultDashboard = ({ intl, match }) => {
  const [checkedPrimary, setCheckedPrimary] = useState(false);
  const [robotJoystick, setRobotJoystick] = useState({
    lastMove: { data: null, time: null },
    start: false,
    interval: null,
  });
  const [camPTZJoystick, setCamPTZJoystick] = useState({
    lastMove: { data: null, time: null },
    start: false,
    interval: null,
  });
  const [joystickTimer, setJoystickTimer] = useState();
  const dataSocket = useContext(DataSocketContext);
  const actionSocket = useContext(ActionSocketContext);
  const { messages } = intl;
  const upperPTZCamera = default_button_value;

  // CSS for orientation & fullscreen sizing @non desktop devices
  useEffect(() => {
    const style = document.querySelector('html').style
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent)) {
      if (window.screen.orientation.type === 'portrait-primary' || window.screen.orientation.type === 'portrait-secondary') {
        style.height = '800px'
        style.width = '1208px'
        style.overflowX = 'hidden';
        style.overflowY = 'hidden';
        style.position = 'absolute';
        style.top = '1208px';
        style.transform = 'rotate(-90deg)';
        style.transformOrigin = 'left top';
        if (document.fullscreenElement) {
          style.width = '1232px'
          style.top = '1232px'
        }
        return () => {
          document.querySelector('html').style.top = '0';
          document.querySelector('html').style.height = '100%';
          document.querySelector('html').style.width = '100%';
          document.querySelector('html').style.transform = 'none';
        }
      } else {
        document.querySelector('html').style.top = '0';
        document.querySelector('html').style.height = '100vh';
        document.querySelector('html').style.width = '100vw';
        document.querySelector('html').style.transform = 'none';
      }
    }
  }, [window.screen.orientation.type, document.fullscreenElement])

  useEffect(() => {
    const time = new Date().getTime()
    if (camPTZJoystick.start == true) {
      let e = camPTZJoystick.lastMove.data;
      let requestParam = '';
      let requestLink = `${ROBOT_HOST}/`;
      if (e.direction.toLowerCase() == 'forward') {
        requestParam = 'ptzRaiseUp';
      } else if (e.direction.toLowerCase() == 'backward') {
        requestParam = 'ptzRaiseDown';
      } else if (e.direction.toLowerCase() == 'right') {
        requestParam = 'ptzRightMove';
      } else if (e.direction.toLowerCase() == 'left') {
        requestParam = 'ptzLeftMove';
      }
      requestLink += requestParam + '?time=' + time;
      console.log(requestLink);

      const timer = setInterval(() => {
        console.log(
          'robotJoystick timer',
          e.direction.toLowerCase(),
          requestLink
        );
        fetch(requestLink)
      }, 800);
      return () => clearInterval(timer);
    } else {
      let requestLink = `${ROBOT_HOST}/release`
      requestLink += '?time=' + time
      console.log(requestLink);
      fetch(requestLink);
    }
  }, [camPTZJoystick]);
  useEffect(() => {

    // Fetch function with Timeout
    async function fetchWithTimeout(resource, options) {
      const { timeout = 6000 } = options;

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(resource, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);

      return response
    }

    if (robotJoystick.start == true) {
      let e = robotJoystick.lastMove.data;
      let requestParam = '';
      let requestLink = `${RPASS_HOST}/aobo-robot/moveBy?`;
      if (e.direction.toLowerCase() == 'forward') {
        requestParam = 'dir=0';
      } else if (e.direction.toLowerCase() == 'backward') {
        requestParam = 'dir=1';
      } else if (e.direction.toLowerCase() == 'right') {
        requestParam = 'dir=2';
      } else if (e.direction.toLowerCase() == 'left') {
        requestParam = 'dir=3';
      }
      requestLink += requestParam;

      const timer = setInterval(() => {
        console.log(
          'robotJoystick timer',
          e.direction.toLowerCase(),
          `${RPASS_HOST}/aobo-robot/moveBy?` + requestParam
        );
        actionSocket.send({
          request: "move",
          params: e,
          rid: ROBOT_NAME,
        })
      }, 500);
      return () => clearInterval(timer);
    }
  }, [robotJoystick]);

  const onMouseEvent = (e, request) => {
    if (e.type == 'mouseup' || e.type == 'touchend') {
      console.log(e, `${ROBOT_HOST}/release`);
      fetch(`${ROBOT_HOST}/release`);
    } else if (e.type == 'mousedown' || e.type == 'touchstart') {
      console.log(`${ROBOT_HOST}/${request}`);
      fetch(`${ROBOT_HOST}/${request}`);
    }
  };

  const sendCalibrate = (e) => {
    e.preventDefault();
    const data = new FormData(document.getElementById("calibrate"))
    const zIndex = data.get('z-index')
    if (zIndex === '') {
      alert('Please enter a number')
      return
    }
    fetch(`${ROBOT_HOST}/calibrate?z=${zIndex}`)
  }

  const getImage = () => {
    const src =
      `${ROBOT_HOST}/gs-robot/data/map_png?mapName=roborn811`;
    const options = {
      headers: {
        rid: 'ROBOT_NAME',
        uid: uid,
      },
    };
    fetch(src, options)
      .then((r) => r.arrayBuffer())
      .then((buffer) => {
        // note this is already an ArrayBuffer
        // there is no buffer.data here
        const blob = new Blob([buffer]);
        const url = URL.createObjectURL(blob);
        const img = document.getElementById('test_gs_img');
        img.src = url;
        // So the Blob can be Garbage Collected
        img.onload = (e) => URL.revokeObjectURL(url);
        // ... do something else with 'buffer'
      });
  };

  const numberFocus = () => {
    window.location.href = '#z-index'
    return true;
  }

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.qecare" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>

      <div
        style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}
      >
        {/* <TouchableImage
          demosrc="/assets/ptzCam_img.png" */}
        <TouchableImage _onClick={(e) => { }} src={`${ROBOT_STREAM_HOST}/camera/mjpeg`} />
        {/* /assets/cropPannel.png */}
        <TouchableImage
          src={`${ROBOT_HOST}/video_feed_panel`}
          _onClick={(e) => {
            console.log(
              'video_feed_panel',
              `${ROBOT_HOST}/setCoord?x=${parseInt(e.naturalX)}&y=${parseInt(
                e.naturalY
              )}`
            );
            fetch(
              `${ROBOT_HOST}/setCoord?x=${parseInt(e.naturalX)}&y=${parseInt(
                e.naturalY
              )}`
            );
          }}
        />
      </div>
      <hr style={{ width: '100%', marginTop: '25px' }}></hr>
      {/* <Row>
        <Colxx style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IConFocusMinus
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConFocusMinus')}
            // onMouseUp={(e) => onMouseEvent()}
          />
          <IConFocusPlus
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConFocusPlus')}
            // onMouseUp={(e) => onMouseEvent()}
          />
          <IConAutoFocus
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConAutoFocus')}
            // onMouseUp={(e) => onMouseEvent()}
          />
          <IConFocusManual
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConFocusManual')}
            // onMouseUp={(e) => onMouseEvent()}
          />
          <IConUV
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConUV')}
            // onMouseUp={(e) => onMouseEvent()}
          />
          <IConLED
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConLED')}
            // onMouseUp={(e) => onMouseEvent()}
          />
        </Colxx>
      </Row> */}
      <Row>
        <Colxx md="4">
          <Row>
            <div style={{ margin: '10px' }}>
              <MovementController actionSocket={actionSocket} rid={ROBOT_NAME} />
            </div>
            <div>
              <div className="hand-btn">
                {[
                  {
                    event: 'finished',
                    request: 'finished',
                    icon: 'simple-icon-social-steam',
                    link: '',
                    iconSize: '18px',
                  },
                  {
                    event: 'stop-now',
                    request: 'stop-now',
                    icon: 'iconsminds-stop-music',
                    link: '',
                    iconSize: '18px',
                  },
                ].map((val, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <Button
                        style={{ width: '100%' }}
                        outline
                        color="dark"
                        className="mb-2"
                        key={idx}
                        onMouseDown={(e) => {
                          onMouseEvent(e, val.request);
                        }}
                        onMouseUp={(e) => {
                          // onMouseEvent(e, val.request);
                        }}
                        onTouchStart={(e) => {
                          onMouseEvent(e, val.request);
                        }}
                        onTouchEnd={(e) => {
                          // onMouseEvent(e, val.request);
                        }}
                        id={val.request}
                      >
                        {val.iconSize ? (
                          <div
                            className={`glyph-icon ${val.icon}`}
                            style={{ fontSize: val.iconSize }}
                          ></div>
                        ) : (
                          <div className={`glyph-icon ${val.icon}`}></div>
                        )}
                      </Button>

                      {idx == 2 && (
                        <hr style={{ width: '100%', margin: '0px' }}></hr>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </Row>

          <Row style={{ marginTop: '10px' }}>
            <Colxx style={{ width: '100%' }}>
              <Form id='calibrate' style={{ display: 'flex', alignItems: 'center' }} encType="multipart/form-data">
                <Label style={{ marginRight: "5px", marginBottom: "0px" }}>Calibrate:</Label>
                <Input onFocus={numberFocus} type="number" id='z-index' name={'z-index'} style={{ border: "1px solid black", width: "100%", marginRight: '5px', background: 'transparent' }} />
                <Label style={{ marginRight: "5px", marginBottom: "0px" }}>mm</Label>
                <Button
                  outline
                  type="submit"
                  onClick={sendCalibrate}
                  color="dark"
                  className={`glyph-icon iconsminds-scroller`}
                  style={{ fontSize: '18px' }}>
                </Button>
              </Form>
            </Colxx>
          </Row>

        </Colxx>
        <Colxx
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <IConFocusMinus
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConFocusMinus')}
          // onMouseUp={(e) => onMouseEvent()}
          />
          <IConFocusPlus
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConFocusPlus')}
          // onMouseUp={(e) => onMouseEvent()}
          />
          <IConAutoFocus
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConAutoFocus')}
          // onMouseUp={(e) => onMouseEvent()}
          />
          <div id="break" style={{ flexBasis: '100%', height: 0 }}></div>
          <IConFocusManual
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConFocusManual')}
          // onMouseUp={(e) => onMouseEvent()}
          />
          <IConUV
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConUV')}
          // onMouseUp={(e) => onMouseEvent()}
          />
          {/* <IConLED
            className="rb-svg-icon"
            onMouseDown={(e) => onMouseEvent(e, 'IConLED')}
          // onMouseUp={(e) => onMouseEvent()}
          /> */}
        </Colxx>
        <Colxx
          md="4"
          style={{
            flexDirection: 'row',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
        >
          <Row>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10px',
              }}
            >
              {[
                {
                  event: 'zoom-in',
                  request: 'ptzZoomIn',
                  icon: 'simple-icon-magnifier-add',
                  link: '',
                  iconSize: '18px',
                },
                {
                  event: 'counterclockwise',
                  request: 'counterclockwise',
                  icon: 'iconsminds-turn-down-from-right',
                  link: '',
                  iconSize: '18px',
                },
              ].map((val, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <Button
                      outline
                      color="dark"
                      className="mb-2"
                      key={idx}
                      onMouseDown={(e) => {
                        onMouseEvent(e, val.request);
                      }}
                      onMouseUp={(e) => {
                        onMouseEvent(e, val.request);
                      }}
                      onTouchStart={(e) => {
                        onMouseEvent(e, val.request);
                      }}
                      onTouchEnd={(e) => {
                        onMouseEvent(e, val.request);
                      }}
                      id={val.request}
                    >
                      {val.iconSize ? (
                        <div
                          className={`glyph-icon ${val.icon}`}
                          style={{ fontSize: val.iconSize }}
                        ></div>
                      ) : (
                        <div className={`glyph-icon ${val.icon}`}></div>
                      )}
                    </Button>

                    {idx == 2 && (
                      <hr style={{ width: '100%', margin: '0px' }}></hr>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div style={{ margin: '10px' }}>
              <Joystick
                size={100}
                baseColor="rgb(111 111 111)"
                stickColor="rgb(214 214 214)"
                move={(e) => {
                  if (!camPTZJoystick.lastMove.data) {
                    setCamPTZJoystick({
                      ...camPTZJoystick,
                      lastMove: { data: e, time: Date.now() },
                      start: true,
                    });
                    return;
                  }
                  if (camPTZJoystick.lastMove.data.direction !== e.direction) {
                    setCamPTZJoystick({
                      ...camPTZJoystick,
                      lastMove: { data: e, time: Date.now() },
                      start: true,
                    });
                  }
                }}
                stop={(e) => {
                  setCamPTZJoystick({
                    ...camPTZJoystick,
                    lastMove: { data: e, time: Date.now() },
                    start: false,
                  });
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '10px',
              }}
            >
              {[
                {
                  event: 'zoom-out',
                  request: 'ptzZoomOut',
                  icon: 'simple-icon-magnifier-remove',
                  link: '',
                  iconSize: '18px',
                },
                {
                  event: 'clockwise',
                  request: 'clockwise',
                  icon: 'iconsminds-turn-down-from-left',
                  link: '',
                  iconSize: '18px',
                },
              ].map((val, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <Button
                      outline
                      color="dark"
                      className="mb-2"
                      key={idx}
                      onMouseDown={(e) => {
                        onMouseEvent(e, val.request);
                      }}
                      onMouseUp={(e) => {
                        onMouseEvent(e, val.request);
                      }}
                      onTouchStart={(e) => {
                        onMouseEvent(e, val.request);
                      }}
                      onTouchEnd={(e) => {
                        onMouseEvent(e, val.request);
                      }}
                      id={val.request}
                    >
                      {val.iconSize ? (
                        <div
                          className={`glyph-icon ${val.icon}`}
                          style={{ fontSize: val.iconSize }}
                        ></div>
                      ) : (
                        <div className={`glyph-icon ${val.icon}`}></div>
                      )}
                    </Button>
                  </React.Fragment>
                );
              })}
            </div>
          </Row>
          <Row style={{ width: '100%' }}>
            <Colxx>
              <div>
                {[
                  {
                    event: 'releaseTwist',
                    request: 'releaseTwist',
                    icon: 'iconsminds-unlock-2',
                    link: '',
                    iconSize: '18px',
                  }, {
                    event: 'ptzGoHome',
                    request: 'ptzGoHome',
                    icon: 'simple-icon-home',
                    link: '',
                    iconSize: '18px',
                  },
                ].map((val, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <Button
                        style={{ width: '100%', height: '40px' }}
                        outline
                        color="dark"
                        className="mb-2"
                        key={idx}
                        onMouseDown={(e) => {
                          onMouseEvent(e, val.request);
                        }}
                        onMouseUp={(e) => {
                          // onMouseEvent(e, val.request);
                        }}
                        onTouchStart={(e) => {
                          onMouseEvent(e, val.request);
                        }}
                        onTouchEnd={(e) => {
                          // onMouseEvent(e, val.request);
                        }}
                        id={val.request}
                      >
                        {val.iconSize ? (
                          <div
                            className={`glyph-icon ${val.icon}`}
                            style={{ fontSize: val.iconSize }}
                          ></div>
                        ) : (
                          <div className={`glyph-icon ${val.icon}`}></div>
                        )}
                      </Button>

                      {idx == 2 && (
                        <hr style={{ width: '100%', margin: '0px' }}></hr>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </Colxx>
          </Row>
        </Colxx>
      </Row>
    </>
  );
};
export default injectIntl(DefaultDashboard);
