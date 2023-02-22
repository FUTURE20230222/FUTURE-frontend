import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardBody, CardTitle, Row} from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import {Colxx, Separator} from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import HttpRequestHelper, {API} from "../../../helpers/HttpRequestHelper";
import {Circle, Image, Layer, Stage, Transformer} from "react-konva";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {SliderTooltip} from "../../../components/common/SliderTooltips";
import {useParams} from "react-router-dom";
import {adminRoot} from "../../../constants/defaultValues";
import {connect} from "react-redux";

// const userRobots = ["gs1001", "gs1003", "aobo1001"]
const data2 = {
  "id": uuidv4(),
  "mapName": "hhhhh",
  "mapInfo": {
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
}

const AddSmartMapPage = (props) => {
  const {userRobots} = props
  const mapContainer = useRef(null);
  const trRef = useRef(null);
  const mapRef = useRef(null);

  const [selectedRobot, setSelectedRobot] = useState(0);
  const [mapList, setMapList] = useState([]);
  const [map, setMap] = useState();
  const [scale, setScale] = useState(1);
  const [image, setImage] = useState();
  const [baseImage, setBaseImage] = useState();
  const [rotation, setRotation] = useState(0);
  const [smartMaps, setSmartMaps] = useState()
  const [data, setData] = useState()

  let {id} = useParams();

  useEffect(() => {
    HttpRequestHelper.getDb().then(res => {
      setSmartMaps(res.data.data[0].smartmaps)
      setData(res.data.data[0].smartmaps.find(m => m.id === id))

    })
  }, [])


  useEffect(() => {
    if (data == null) {
      return
    }
    let cancelToken = axios.CancelToken.source();

    function handleResize() {
      setScale((mapContainer.current.clientWidth - 56) / data.mapInfo.gridWidth)
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    setImage(null)

    HttpRequestHelper.instance(data.robots[0].rid, cancelToken.token).get(API.map_png, {
      params: {mapName: data.mapName},
      responseType: 'blob'
    }).then(result => {
      let image = new window.Image();
      image.src = URL.createObjectURL(result.data)
      image.addEventListener('load', () => {
        setBaseImage(image)
        image.removeEventListener('load', () => {
          console.log("remove")
        })
      })
    })
    return () => {
      cancelToken.cancel()
      window.removeEventListener("resize", handleResize);
    }
  }, [data])

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
    let image = new window.Image();
    if (map) {
      setImage(null)
      HttpRequestHelper.instance(userRobots[selectedRobot], cancelToken.token).get(API.map_png, {
        params: {mapName: map.name},
        responseType: 'blob'
      }).then(result => {
        image.src = URL.createObjectURL(result.data)
        image.addEventListener('load', () => {
          setImage(image)
          trRef.current.nodes([mapRef.current])
        })
      })
    }
    return () => {
      cancelToken.cancel()
      image.removeEventListener('load', () => {
        console.log("remove")
      })
    }
  }, [map]);

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="mapping.add-smart-map" match={props.match}/>
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
                  setImage(null)
                  setMap(null)
                  if (userRobots[i].includes("aobo")) {
                    HttpRequestHelper.instance(userRobots[i]).get(API.aobo_getPosition).then((res) => {
                      setMap(res.data.data)
                      // HttpRequestHelper.instance(userRobots[i]).get(API.aobo_getMap).then(result => {
                      //   console.log(result)
                      let image = new window.Image();
                      // image.src = URL.createObjectURL(new Blob(Buffer.from(result.data.data, 'binary')))
                      image.src = require("../../../assets/image/test.bmp")
                      image.addEventListener('load', () => {
                        setImage(image)
                        trRef.current.nodes([mapRef.current])
                      })

                      // })
                    })
                  } else {
                    setSelectedRobot(i)
                  }
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
                    <div>{`${userRobots[selectedRobot].includes("gs") ? "Map List of" : "Current Map of"} ${userRobots[selectedRobot]}`}</div>
                  </CardTitle>
                  {mapList.map((map, i) => <Row className="icon-cards-row mb-2" onClick={() => {
                      setMap(map)
                    }}>
                      <Card>{map.name}</Card>
                    </Row>
                  )}
                  {image ? <Button onClick={async () => {
                      smartMaps.find(data => data.id === id).robots.push({
                        "rid": userRobots[selectedRobot],
                        "mapOffset": {
                          "rotation": mapRef.current.rotation(),
                          "x": mapRef.current.x(),
                          "y": mapRef.current.y(),
                          "scaleX": mapRef.current.scaleX(),
                          "scaleY": mapRef.current.scaleY()
                        }
                      })

                      await HttpRequestHelper.updateDb({
                        "conditions": {"name": "admin"},
                        "collection": "users",
                        "update": {"smartmaps": smartMaps}
                      })

                      props.dispatch({type: 'SET_SMART_MAPS', payload: smartMaps})

                      props.history.push(adminRoot + "/mapping")
                    }} size="lg">Finish</Button>
                    : null}
                </CardBody>
              </Card>
            </Colxx>
          </Row>
        </Colxx>
        <Colxx xxs="8" className="mb-4">
          <Card>
            <CardBody innerRef={mapContainer}>
              {data ?
                <Stage height={data.mapInfo.gridHeight * scale}
                       width={data.mapInfo.gridWidth * scale}
                       scaleX={scale}
                       scaleY={scale}>
                  <Layer>
                    <Image image={baseImage}/>
                    {map ? <Image x={map.mapInfo.gridWidth / 2} y={map.mapInfo.gridHeight / 2}
                                  offsetX={map.mapInfo.gridWidth / 2}
                                  offsetY={map.mapInfo.gridHeight / 2}
                                  height={map.mapInfo.gridHeight}
                                  width={map.mapInfo.gridWidth}
                                  rotation={rotation}
                                  onTransform={evt => {
                                    setRotation(evt.currentTarget.getAbsoluteRotation())
                                  }}
                                  onDragEnd={evt => {
                                    console.log(evt.currentTarget.getPosition())
                                  }}
                                  draggable={true} ref={mapRef} image={image} opacity={0.5}/> : null}
                    <Transformer
                      ref={trRef}
                      resizeEnable={true}
                      anchorSize={20}
                      // centeredScaling={true}
                    />
                  </Layer>
                </Stage> : null}
              {image ? <Row className="mt-5">
                <Colxx xxs="12">
                  <label>
                    <IntlMessages id="Rotation"/>
                  </label>
                  <SliderTooltip
                    value={rotation}
                    min={-180}
                    max={180}
                    defaultValue={0}
                    className="mb-5"
                    step={1}
                    onChange={(value) => {
                      mapRef.current.rotation(value)
                      setRotation(value)
                    }}
                  />
                </Colxx>
              </Row> : null}
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
export default connect(mapStateToProps)(AddSmartMapPage);
