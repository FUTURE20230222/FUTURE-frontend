import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardBody, CardTitle, Row} from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import {Colxx, Separator} from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import HttpRequestHelper, {API} from "../../../helpers/HttpRequestHelper";
import {Image, Layer, Stage} from "react-konva";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {connect} from "react-redux";

// const userRobots = ["gs1001", "gs1003", "aobo1001"]

const CreateSmartMapPage = (props) => {
  const {userRobots} = props

  const mapContainer = useRef(null);

  const [selectedRobot, setSelectedRobot] = useState(0);
  const [mapList, setMapList] = useState([]);
  const [map, setMap] = useState();
  const [scale, setScale] = useState(1);
  const [image, setImage] = useState();
  const [data, setData] = useState([])


  useEffect(() => {
    HttpRequestHelper.getDb().then(res => {
      setData(res.data.data[0].smartmaps)
    })
  }, [])

  useEffect(() => {
    let cancelToken = axios.CancelToken.source();

    setMapList([])
    setMap(null)
    setImage(null)
    console.log("call")
    HttpRequestHelper.instance(userRobots[selectedRobot], cancelToken.token).get(API.maps).then(result => {
      if (result.data.msg !== "request timeout") {
        setMapList(result.data.data.data)
      }
    })

    return () => {
      cancelToken.cancel()
    };
  }, [selectedRobot]);

  useEffect(() => {
    let cancelToken = axios.CancelToken.source();

    function handleResize() {
      setScale((mapContainer.current.clientWidth - 56) / map.mapInfo.gridWidth)
    }

    if (map) {
      window.addEventListener("resize", handleResize);
      handleResize();
      setImage(null)
      HttpRequestHelper.instance(userRobots[selectedRobot], cancelToken.token).get(API.map_png, {
        params: {mapName: map.name},
        responseType: 'blob'
      }).then(result => {
        let image = new window.Image();
        image.src = URL.createObjectURL(result.data)
        image.addEventListener('load', () => {
          setImage(image)
          image.removeEventListener('load', () => {
            console.log("remove")
          })
        })
      })
    }
    return () => {
      cancelToken.cancel()
      window.removeEventListener("resize", handleResize);
    }

  }, [map]);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="mapping.create-smart-map" match={props.match}/>
          <Separator className="mb-5"/>
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="4">
          <Card className="mb-4">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="select-robot"/>
                </CardTitle>
                {userRobots.map((r, i) => <Row className="icon-cards-row mb-2" onClick={() => {
                  setSelectedRobot(i)
                }}>
                  <Card>{r}</Card>
                </Row>)}
              </CardBody>
            </Card>
          </Card>
          <Row>
            <Colxx md="12" className="mb-4">
              <Card>
                <CardBody>
                  <CardTitle>
                    <div>{`Map List of ${userRobots[selectedRobot]}`}</div>
                  </CardTitle>
                  {mapList.map((map, i) => <Row className="icon-cards-row mb-2" onClick={() => {
                      setMap(map)
                    }}>
                      <Card>{map.name}</Card>
                    </Row>
                  )}
                  {image ? <Button onClick={() => {
                      data.push({
                        "id": uuidv4(),
                        "mapName": map.name,
                        "mapInfo": map.mapInfo,
                        "userRobots": [{
                          "rid": userRobots[selectedRobot],
                          "mapOffset": {
                            "rotation": 0,
                            "x": 0,
                            "y": 0
                          }
                        }]
                      })
                      HttpRequestHelper.updateDb({
                        "conditions": {"name": "admin"},
                        "collection": "users",
                        "update": {"smartmaps": data}
                      }).then(res => {
                        props.dispatch({type: 'SET_SMART_MAPS', payload: data})
                        props.history.goBack()
                      })
                    }
                    } size="lg">Finish</Button>
                    : null}
                </CardBody>
              </Card>
            </Colxx>
          </Row>
        </Colxx>
        <Colxx xxs="8" className="mb-4">
          <Card>
            <CardBody innerRef={mapContainer}>
              {map ?
                <Stage height={map.mapInfo.gridHeight * scale}
                       width={map.mapInfo.gridWidth * scale}
                       scaleX={scale}
                       scaleY={scale}>
                  <Layer>
                    <Image image={image}/>
                  </Layer>
                </Stage> : <div>No selection</div>}
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};
const mapStateToProps = ({userRobots}) => {
  return {
    userRobots,
  };
};
export default connect(mapStateToProps)(CreateSmartMapPage);