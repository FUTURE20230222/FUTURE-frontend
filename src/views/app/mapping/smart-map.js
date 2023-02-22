import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import {Colxx, Separator} from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import MapImage from "../../../components/MapImage";
import {v4 as uuidv4} from 'uuid';
import HttpRequestHelper from "../../../helpers/HttpRequestHelper";
import {adminRoot} from "../../../constants/defaultValues";
import {connect} from "react-redux";

let data1 = [{
  "id": uuidv4(),
  "mapName": "roborn811", "mapInfo": {
    "gridHeight": 608,
    "gridWidth": 512,
    "originX": -3.35,
    "originY": -3.7371307373046876,
    "resolution": 0.05000000074505806
  },
  "robots": [{
    "rid": "gs1003",
    "mapOffset": {
      "rotation": 0,
      "x": 0,
      "y": 0
    }
  },]
},
  {
    "id": uuidv4(),
    "mapName": "hhhhh", "mapInfo": {
      "gridHeight": 1120,
      "gridWidth": 672,
      "originX": -13.55,
      "originY": -38.22969055175781,
      "resolution": 0.05000000074505806
    },
    "robots": [{
      "rid": "gs1003",
      "mapOffset": {
        "rotation": 0,
        "x": 0,
        "y": 0
      }
    }]
  }]

const SmartMapPage = (props) => {

  const data = props.smartMaps
  const [modalBasic, setModalBasic] = useState(false);
  const [selected, setSelected] = useState(0);

  // useEffect(() => {
  //   HttpRequestHelper.getDb().then(res => {
  //     console.log(res.data.data[0].smartmaps)
  //     setData(res.data.data[0].smartmaps)
  //   })
  // }, [])

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="mapping.smart-map" match={props.match}/>
          <Separator className="mb-5"/>
        </Colxx>
      </Row>

      <Row>
        <Colxx xxs="12" className="mb-4">
          <Button onClick={() => {
            props.history.push("/app/mapping/create-smart-map")
          }} className="mb-2">
            <IntlMessages id="mapping.create-smart-map"/>
          </Button>
        </Colxx>
      </Row>
      <Row>
        {data.map((x, i) => {
          return (
            <Colxx xl="3" lg="6" className="mb-4" key={x.mapName + i}>
              <Card>
                <CardHeader className="p-0 position-relative">
                  <MapImage mapName={x.mapName} rid={x.robots[0].rid}/>
                </CardHeader>
                <CardBody>
                  <CardTitle className="mb-0">{`Map Name: ${x.mapName}`}</CardTitle>
                  <CardTitle className="mb-0">{`Robots: ${x.robots.length}`}</CardTitle>
                  <Row className="mt-4 justify-content-end">
                    <Button onClick={() => {
                      props.history.push(adminRoot + "/mapping/add-smart-map/" + x.id)
                    }} className="mr-2">
                      <IntlMessages id="add"/>
                    </Button>
                    <Button onClick={() => {
                      setModalBasic(true)
                      setSelected(i)
                    }}>
                      <IntlMessages id="delete"/>
                    </Button>
                  </Row>
                </CardBody>
              </Card>
            </Colxx>
          );
        })}
        {data.length ? <Modal
          isOpen={modalBasic}
          toggle={() => setModalBasic(!modalBasic)}
        >
          <ModalHeader>
            DELETE SMART MAP
            {/*<IntlMessages id="modal.modal-title" />*/}
          </ModalHeader>
          <ModalBody>
            {`Confirm delete smartmap ${data[selected].mapName}?`}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => setModalBasic(false)}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={async () => {
                data.splice(selected, 1)
                await HttpRequestHelper.updateDb({
                  "conditions": {"name": "admin"},
                  "collection": "users",
                  "update": {"smartmaps": data}
                })
                props.dispatch({
                  type: 'SET_SMART_MAPS',
                  payload: data
                })
                setModalBasic(false)
              }}>
              Delete
            </Button>{' '}
          </ModalFooter>
        </Modal> : null}
      </Row>
    </>
  );
};

const mapStateToProps = ({smartMaps}) => {
  return {
    smartMaps,
  };
};
export default connect(mapStateToProps)(SmartMapPage);