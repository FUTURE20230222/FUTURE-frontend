import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, Row, Tooltip} from 'reactstrap';
import HttpRequestHelper, {API} from "../../helpers/HttpRequestHelper";
import {Colxx} from "./CustomBootstrap";

const TooltipItem = (props) => {
  const {rid} = props
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (rid.includes("gs")) {
      HttpRequestHelper.instance(rid).get(API.device_status).then(res => {
        if (res.data.msg !== "request timeout") {
          setStatus(res.data.data.data)
        }
      })
    }
    return () => {
    }
  }, [rid])


  return (
    <span {...props} >
      <div className="mr-1 mb-2" color="secondary" id={`tooltip_${rid}`}>
        {rid}
      </div>
      <Tooltip
        isOpen={tooltipOpen}
        target={`tooltip_${rid}`}
        toggle={() => setTooltipOpen(!tooltipOpen)}
      >
        {status ?
          <Card>
            <CardBody>
              <Row>
                <Colxx>
                  <h4>{rid}</h4>
                </Colxx>
                <Colxx>
                  {`Battery: ${parseInt(status.battery)}%`}
                </Colxx>
                <Colxx>
                  {`Speed: ${status.speed} m/s`}
                </Colxx>
              </Row>
            </CardBody>
          </Card>
          : "Loading"}
      </Tooltip>
    </span>
  );
};
export default TooltipItem;
