import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import HttpRequestHelper, {API} from "../helpers/HttpRequestHelper";
import {Button, CardBody, Container, Row} from "reactstrap";
import {Arrow, Circle, Group, Image, Label, Layer, Rect, Stage, Tag, Text} from "react-konva";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}


const RobotsMap = (props) => {
  const {selectedRobot, data, isSingle} = props
  const mapContainer = useRef(null);
  const stage = useRef(null);

  const [scale, setScale] = useState(1);
  let [baseImage, setBaseImage] = useState();
  let [robots, setRobots] = useState([])
  const [image, setImage] = useState()
  let [baseImageInfo, setBaseImageInfo] = useState()

  useEffect(() => {
    let image = new window.Image();
    image.src = require("../assets/image/test.bmp")
    image.addEventListener('load', () => {
      setImage(image)
    })
  }, [])

  useEffect(() => {
    robots = []
    baseImage = null
    setBaseImage(null)
    if (isSingle) {
      robots.push({
        id: selectedRobot,
        color: stringToColor(selectedRobot),
      })

    } else {
      baseImageInfo = data.mapInfo
      setBaseImageInfo(data.mapInfo)
      for (let r of data.robots) {
        robots.push({
          id: r.rid,
          color: stringToColor(r.rid),
        })
      }
    }

    let cancelToken = axios.CancelToken.source();

    window.addEventListener("resize", handleResize);
    handleResize();
    if (!isSingle) {
      HttpRequestHelper.instance(data.robots[0].rid, cancelToken.token).get(API.map_png, {
        params: {mapName: data.mapName},
        responseType: 'blob'
      }).then(result => {
        baseImage = result.data
        getBaseImage(result.data)
      })

    }
    getData().then(() => {
      setRobots(robots)
    })

    return () => {
      cancelToken.cancel()
      window.removeEventListener("resize", handleResize);
    }
  }, [isSingle, selectedRobot, data])

  const handleResize = () => {
    if (baseImageInfo) {
      setScale(Math.min(((mapContainer.current.clientWidth - 56) / baseImageInfo.gridWidth), window.innerHeight * 0.5 / baseImageInfo.gridHeight))
    }
  }


  const getData = async () => {
    for (let r of robots) {
      let index = robots.indexOf(r)
      if (r.id.includes("aobo")) {
        let res1 = await HttpRequestHelper.instance(r.id).get(API.aobo_getPosition)
        robots[index].position = res1.data.data
        let res2 = await HttpRequestHelper.instance(r.id).get(API.aobo_getLaserScan)
        robots[index].laserPhit = res2.data.data
      } else {
        let res1 = await HttpRequestHelper.instance(r.id).get(API.position)
        robots[index].position = res1.data.data
        if (baseImage == null) {
          let res = await HttpRequestHelper.instance(r.id).get(API.maps)
          let find = res.data.data.data.find(item => JSON.stringify(item.mapInfo) === JSON.stringify(res1.data.data.mapInfo))
          baseImageInfo = find.mapInfo
          setBaseImageInfo(find.mapInfo)
          handleResize()
          HttpRequestHelper.instance(r.id).get(API.map_png, {
            params: {mapName: find.name},
            responseType: 'blob'
          }).then(result => {
            getBaseImage(result.data)
          })
        }
        let res2 = await HttpRequestHelper.instance(r.id).get(API.laser_phit)
        robots[index].laserPhit = res2.data.data
      }
    }
    console.log(robots)
  }

  const getBaseImage = (data) => {
    let image = new window.Image();
    image.src = URL.createObjectURL(data)
    image.addEventListener('load', () => {
      setBaseImage(image)
    })
  }

  return (
    <CardBody innerRef={mapContainer}>
      <Row className='justify-content-end mb-4 mr-2'>
        <Button onClick={() => {
          stage.current.to({scaleY: scale, scaleX: scale, x: 0, y: 0})
        }} className='mr-2'>
          <div className={`glyph-icon iconsminds-direction-east`}/>
        </Button>
        <Button onClick={() => {
          if (stage.current.scaleX() < 3) {
            const mousePointTo = {
              x: stage.current.size().width / 2 / stage.current.scaleX() - stage.current.x() / stage.current.scaleX(),
              y: stage.current.size().height / 2 / stage.current.scaleX() - stage.current.y() / stage.current.scaleX()
            };
            let newScale = stage.current.scaleX() * 1.2
            stage.current.to({
              scaleY: newScale,
              scaleX: newScale,
              x: -(mousePointTo.x - stage.current.size().width / 2 / newScale) * newScale,
              y: -(mousePointTo.y - stage.current.size().height / 2 / newScale) * newScale,
            })
          }
        }} className='mr-2'>
          <div className={`glyph-icon simple-icon-magnifier-add`}/>
        </Button>
        <Button onClick={() => {
          const mousePointTo = {
            x: stage.current.size().width / 2 / stage.current.scaleX() - stage.current.x() / stage.current.scaleX(),
            y: stage.current.size().height / 2 / stage.current.scaleX() - stage.current.y() / stage.current.scaleX()
          };
          let newScale = stage.current.scaleX() / 1.2
          stage.current.to({
            scaleY: newScale,
            scaleX: newScale,
            x: -(mousePointTo.x - stage.current.size().width / 2 / newScale) * newScale,
            y: -(mousePointTo.y - stage.current.size().height / 2 / newScale) * newScale,
          })
        }} className='mr-2'>
          <div className={`glyph-icon simple-icon-magnifier-remove`}/>
        </Button>
      </Row>
      <Stage
        ref={stage}
        draggable={true}
        height={baseImageInfo ? baseImageInfo.gridHeight * scale : 100}
        width={baseImageInfo ? baseImageInfo.gridWidth * scale : 100}
        onWheel={evt => {
          evt.evt.preventDefault()
          evt.evt.stopPropagation()
          const scaleBy = 1.2;
          const mousePointTo = {
            x: evt.currentTarget.getPointerPosition().x / evt.currentTarget.scaleX() - evt.currentTarget.x() / evt.currentTarget.scaleX(),
            y: evt.currentTarget.getPointerPosition().y / evt.currentTarget.scaleX() - evt.currentTarget.y() / evt.currentTarget.scaleX()
          };

          const newScale = evt.evt.deltaY < 0 ? evt.currentTarget.scaleX() * scaleBy : evt.currentTarget.scaleX() / scaleBy;
          if (newScale < 3) {
            evt.currentTarget.to({
              scaleX: newScale,
              scaleY: newScale,
              x: -(mousePointTo.x - evt.currentTarget.getPointerPosition().x / newScale) * newScale,
              y: -(mousePointTo.y - evt.currentTarget.getPointerPosition().y / newScale) * newScale,
              duration: 0.25
            });
            // if (this.zoomTimeout) {
            //   clearTimeout(this.zoomTimeout)
            // }
            // this.zoomTimeout = setTimeout(() => {
            //   this.validatePos(0.2)
            // }, 300)
          }
        }}
        scaleX={scale}
        scaleY={scale}>
        <Layer>
          <Image image={baseImage}/>
          {robots.filter(r => r.laserPhit && r.position).map((r, i) => {
            if (!robots[i]) {
              return <Group/>
            }
            let offset = isSingle ? {x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0} : data.robots[i].mapOffset
            let mapInfo = r.position.mapInfo
            return <Group key={`${r.id}-group-${i}`}
                          width={mapInfo.gridWidth}
                          height={mapInfo.gridHeight}
                          x={i === 0 ? 0 : offset.x} y={i === 0 ? 0 : offset.y}
                          onDragEnd={evt => {
                            console.log(evt.currentTarget.getPosition())
                          }}
                          scaleX={offset.scaleX}
                          scaleY={offset.scaleY}
                          offsetY={i === 0 ? 0 : mapInfo.gridHeight / 2}
                          offsetX={i === 0 ? 0 : mapInfo.gridWidth / 2}
                          rotation={offset.rotation}
            >
              {i === 0 ? null : <Image image={image}
                                       width={mapInfo.gridWidth}
                                       height={mapInfo.gridHeight}
                                       opacity={0.2}/>}
              <Arrow
                x={r.position.gridPosition.x}
                y={-r.position.gridPosition.y + mapInfo.gridHeight}
                onClick={() => {
                  // this.onSelectAgv(agv)
                }}
                onTap={() => {
                  // this.onSelectAgv(agv)
                }}
                rotation={r.position.angle + 180}
                fill={r.color}
                strokeWidth={1}
                stroke={"black"}
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.6}
              />
              {/*<Label>*/}
              {/*  <Tag pointerDirection={'down'} pointerWidth={0} pointerHeight={5}/>*/}
              {/*  <Text*/}
              {/*    text={r.id + i}*/}
              {/*    fill={r.color}*/}
              {/*    fontSize={16 / scale}*/}
              {/*    fontStyle={"bold"}*/}
              {/*  />*/}
              {/*</Label>*/}
              {
                r.laserPhit.gridPhits.map((grid, index) => {
                  return <Circle key={`${r.rid}-${i}-${index}`} fill={r.color}
                                 x={grid.x}
                                 y={-grid.y + mapInfo.gridHeight}
                                 radius={2}/>
                })
              }
            </Group>
          })}
        </Layer>
      </Stage>
    </CardBody>
  );
};


export default RobotsMap;
