/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { FormGroup, Label, CustomInput } from 'reactstrap';
import { colors } from '../../constants/defaultValues';
import {
  getCurrentColor,
  setCurrentColor,
  getCurrentRadius,
  setCurrentRadius,
} from '../../helpers/Utils';
import { Joystick } from 'react-joystick-component';
import { Button } from 'reactstrap';
import fetchWithTimeoutAndHandling from './fetch';

const PTZJoystickSwitcher = ({ROBOT_HOST}) => {
  const containerRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor] = useState(getCurrentColor());
  const [radius, setRadius] = useState(getCurrentRadius());
  //
  const [camPTZJoystick, setCamPTZJoystick] = useState({
    lastMove: { data: null, time: null },
    start: false,
    interval: null,
  });
  //  useeffect area
  useEffect(() => {
    if (radius === 'flat') {
      document.body.classList.remove('rounded');
    } else {
      document.body.classList.add('rounded');
    }
    setCurrentRadius(radius);
    if (isOpen) setIsOpen(false);
  }, [radius]);

  useEffect(() => {
    ['click', 'touchstart'].forEach((event) =>
      document.addEventListener(event, handleDocumentClick, false)
    );

    return () => {
      ['click', 'touchstart'].forEach((event) =>
        document.removeEventListener(event, handleDocumentClick, false)
      );
    };
  }, [isOpen]);

  useEffect(() => {
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
      requestLink += requestParam;
      console.log(requestLink);
      fetchWithTimeoutAndHandling(requestLink);
    } else {
      console.log(`${ROBOT_HOST}/release`);
      fetchWithTimeoutAndHandling(`${ROBOT_HOST}/release`);
    }
  }, [camPTZJoystick]);
  //  functions area
  const onMouseEvent = (e, request) => {
    console.log('ROBOT_HOST',ROBOT_HOST)
    if (e.type == 'mouseup' || e.type == 'touchend') {
      console.log(e, `${ROBOT_HOST}/release`);
      fetchWithTimeoutAndHandling(`${ROBOT_HOST}/release`);
    } else if (e.type == 'mousedown' || e.type == 'touchstart') {
      console.log(`${ROBOT_HOST}/${request}`);
      fetchWithTimeoutAndHandling(`${ROBOT_HOST}/${request}`);
    }
  };
  const handleDocumentClick = (e) => {
    if (isOpen) {
      const container = containerRef.current;
      if (container.contains(e.target) || container === e.target) {
        return;
      }
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ top: '80%' }}
      className={`theme-colors ${isOpen ? 'shown' : ''}`}
    >
      <div className="p-4">
        <p className="text-muted mb-2" style={{ textAlign: 'center' }}>
          PTZ Camera Control
        </p>
        <div className="d-flex flex-row justify-content-between mb-4">
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
                event: 'zoom-out',
                request: 'ptzZoomOut',
                icon: 'simple-icon-magnifier-remove',
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
          <div style={{ marginRight: '30px' }}>
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
        </div>
      </div>

      <a
        href="#section"
        className="theme-button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <i className="simple-icon-camera" />
      </a>
    </div>
  );
};

export default PTZJoystickSwitcher;
