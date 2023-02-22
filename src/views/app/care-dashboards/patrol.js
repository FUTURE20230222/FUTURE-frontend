import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Row,
} from 'reactstrap';
import MapDashboard from './map'
import IntlMessages from '../../../helpers/IntlMessages';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from '../../../containers/navs/Breadcrumb';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, Label, Input, Collapse } from 'reactstrap';
import { io } from 'socket.io-client'
import './patrol.css'
import MovementController from '../../../components/common/MovementController/MovementController'
import { DataSocketContext, ActionSocketContext } from '../../../App'

const scheduleSocketUrl = "http://localhost:3001"

const scheduleSocket = io(scheduleSocketUrl);

const EditPatrolPage = ({ match }) => {
  const mapContainer = useRef(null);

  // Map list without Points and Paths
  const [mapList, setMapList] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [pointList, setPointList] = useState([]);
  const [pathList, setPathList] = useState([]);
  const [points, setPoints] = useState(null);
  const [paths, setPaths] = useState(null);
  const [actionList, setActionList] = useState([]);
  const [robot, setRobot] = useState({ name: 'roborn811' });
  const [pointDropdownOpen, setPointDropdownOpen] = useState(false);
  const [pathDropdownOpen, setPathDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [mapDropdownOpen, setMapDropdownOpen] = useState(false);
  const [missionItems, setMissionItems] = useState([]);
  const [mapContainerSize, setMapContainerSize] = useState();
  const [collapse, setCollapse] = useState([]);
  const dataSocket = useContext(DataSocketContext);
  const actionSocket = useContext(ActionSocketContext);

  const id = 'aobo1001';
  // const id = 'gs1003';
  const base_url = "http://localhost:8080"
  const requestBody = {
    collection: 'robots',
    conditions: {
      rid: id,
    },
  };

  const togglePoint = () => setPointDropdownOpen(prevState => !prevState)
  const togglePath = () => setPathDropdownOpen(prevState => !prevState);
  const toggleAction = () => setActionDropdownOpen(prevState => !prevState);
  const toggleMap = () => setMapDropdownOpen(prevState => !prevState);
  const toggleCollapse = (index) => {
    let collapseCopy = [...collapse];
    collapseCopy[index] = !collapseCopy[index];
    setCollapse(collapseCopy);
  }
  const toggleSchedule = () => {
    if (robot != null) {

      // Dissociate changeable mission items with robot data
      const newItems = Object.assign({}, robot.schedules[0])
      setMissionItems([])

      // If no schedules
      if (!(robot.schedules) || robot.schedules.length === 0) {
        alert('No saved schedule');
        return;
      }

      const scheduleMapName = robot.schedules[0].mapName.name
      if (scheduleMapName !== selectedOption?.name && selectedOption) {
        if (window.confirm(`The schedule is different from the current map, load and go to map ${scheduleMapName}?`)) {
          setSelectedOption(robot.maps.find(elem => elem.name === scheduleMapName))
          setMissionItems(newItems.patrol)
        } else {
          return;
        }
      } else {
        setSelectedOption(robot.maps.find(elem => elem.name === scheduleMapName))
        setMissionItems(newItems.patrol)
      }
    }
  }

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${base_url}/db/get`
        const res = await fetchWithTimeout(url, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })
        const result = await res.json()
        setRobot(result.data[0])

        // Update action list
        setActionList(result.data[0].actions)
      } catch {
        setTimeout(fetchData, 2000)
      }
    }

    const fetchMapList = async () => {
      try {
        console.log("there")
        // const res = await fetchWithTimeout(`${base_url}/aobo-robot/getMapList`, {
        const res = await fetch(`http://192.168.31.250:8080/aobo-robot/getMapList`, {
        // const res = await fetch(`http://10.7.5.88:8080/gs-robot/data/maps`, {
        })
        const result = await res.json()
        console.log(result)
        if (result.maps.length !== 0) {
          let newMapList = result.maps.map((item, index) => ({
            ...item,
            label: item.name,
            key: index,
            value: item.name,
            name: item.name
          }));
          setMapList(newMapList)
        } else {
          // handle empty map list
        }
        // if (result.maps.length !== 0) {
        //   let newMapList = result.maps.map((item, index) => ({
        //     ...item,
        //     label: item.name,
        //     key: index,
        //     value: item.name,
        //     name: item.name
        //   }));
        //   setMapList(newMapList)
        // } else {
        //   // handle empty map list
        // }
      } catch {
        setTimeout(fetchMapList, 2000)
      }
    }

    setTimeout(() => {
      fetchData()
      fetchMapList()
    }, 1000)

  }, []);

  useEffect(() => {
    //Find the width of the map container
    let containerWidth = 400
    if (document.querySelector(".konvajs")) {
      containerWidth = document.querySelector(".konvajs").offsetWidth
    }
    let containerHeight = document.querySelector("#right-container").offsetHeight
    if (containerWidth < 400 && containerHeight > 550) {
      containerHeight = 550
    }
    setMapContainerSize({ width: containerWidth, height: containerHeight - 110 })
  }, [mapList, mapDropdownOpen]);

  useEffect(() => {
    if (selectedOption != null) {
      // show points and paths
      // update point list
      setPointList(selectedOption.points ? selectedOption.points : [])
      // update path list
      setPathList(selectedOption.paths ? selectedOption.paths : [])
    }
  }, [selectedOption]);

  // Update map point after edited in map panel
  useEffect(() => {
    const fetchData = async () => {
      const url = `${base_url}/db/get`
      const res = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })
      const result = await res.json()
      setRobot(result.data[0])

      if (selectedOption !== undefined) {
        const newMap = result.data[0].maps.find(elem => elem.name === selectedOption.name)
        setPointList(newMap.points ?? [])
        setPathList(newMap.paths ?? [])
      }
    }

    try {
      // Reload map data
      fetchData()
    } catch {
      setTimeout(() => fetchData(), 3000)
    }

    // Check if schedule contain the updated points
    // loadSchedule
  }, [points, paths])

  useEffect(() => {
    scheduleSocket.on("connect", () => {
      console.log("Connected with scheduleSocket id:", scheduleSocket.id);
    });
    dataSocket.on("connect", () => {
      console.log("Connected with dataSocket id:", dataSocket.id);
    });
    actionSocket.on("connect", () => {
      console.log("Connected with actionSocket id:", actionSocket.id);
    });
  }, []);

  // Call when need to update robot map data to DB
  // Will clear all points and paths
  // useEffect(() => {
  //   mapRobotToDB()
  // }, [])

  // Load map info from aobo robot to DB
  const mapRobotToDB = async () => {
    const res = await fetch(`${base_url}/aobo-robot/getMapList`, {
      method: 'POST',
      headers: {
        'uid': '12345',
        'rid': id,
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ "collection": "robots", "conditions": { "rid": id } })
    });
    const result = await res.json()
    console.log(result.data.maps)
    const res2 = await fetch(`${base_url}/db/update`, {
      method: 'POST',
      headers: {
        'uid': '12345',
        'rid': id,
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        "collection": "robots",
        "conditions": { "rid": id },
        "update": {
          "$set": {
            "maps": result.data.maps
          }
        }
      })
    })
    const result2 = await res2.json()
    console.log(result2)
  }

  const selectMap = (event) => {
    if (!robot || !robot.maps) {
      alert('cannot connect to server')
      return
    }
    let currentMap = robot.maps.filter(elem => elem.name == event.target.value)
    setSelectedOption(currentMap[0])
  }

  const addPoint = (event) => {
    // Get point info from point list
    let pointInfoArray = pointList.filter(elem => elem.name === event.target.value)
    let pointInfo = Object.assign({}, pointInfoArray[0])
    pointInfo.category = "point"

    // Add point to missionItems
    let newMissionItems = []
    newMissionItems = [...missionItems]
    newMissionItems.push(pointInfo)
    setMissionItems(newMissionItems)
  }

  const addPath = (event) => {
    // Add path info from path list
    let pathInfoArray = pathList.filter(elem => elem.name === event.target.value)
    let pathInfo = Object.assign({}, pathInfoArray[0])
    pathInfo.category = "path"

    let newMissionItems = []
    newMissionItems = [...missionItems]
    newMissionItems.push(pathInfo)
    setMissionItems(newMissionItems)
    // Add toggle to show Points
  }

  const addAction = (event) => {
    // Add Action for to missionItems for display
    let newMissionItems = []
    newMissionItems = [...missionItems]
    newMissionItems.push({ category: "action", name: event.target.value })
    setMissionItems(newMissionItems)
  }

  const handlePerform = (event) => {
    // Send to websocket 
    // Formulate form
    const data = new FormData(document.getElementById("submit-form"))

    let patrol = []

    for (let index in missionItems) {

      // Handle add Point
      if (missionItems[index].category === "point") {

        let pointInfo = missionItems[index]
        let startTime = data.get(`${missionItems[index].name}-${index}`)
        pointInfo.startTime = startTime
        pointInfo.mapName = selectedOption?.name
        patrol.push(pointInfo)

      } else if (missionItems[index].category === "path") {

        let pathInfo = missionItems[index]
        let startTime = data.get(`${missionItems[index].name}-${index}`)
        pathInfo.startTime = startTime
        pathInfo.mapName = selectedOption?.name
        patrol.push(pathInfo)

      } else if (missionItems[index].category === "action" && missionItems[index].name === "Pause") {

        let actionInfo = { name: missionItems[index].name }

        actionInfo.category = "action"
        let startTime = data.get(`${missionItems[index].name}-${index}`)
        actionInfo.startTime = startTime
        let hour = data.get(`${missionItems[index].name}-${index}-hour`).toString()
        let minute = data.get(`${missionItems[index].name}-${index}-minute`).toString()
        let pauseTime = `${hour ? hour : 0}:${minute ? minute : 0}`
        actionInfo.pauseTime = pauseTime
        actionInfo.mapName = selectedOption?.name

        patrol.push(actionInfo)

      } else if (missionItems[index].category === "action" && missionItems[index].name === "RotateTo2d") {

        let actionInfo = { name: missionItems[index].name }
        actionInfo.category = "action"
        let startTime = data.get(`${missionItems[index].name}-${index}`)
        actionInfo.startTime = startTime
        let degree = data.get(`${missionItems[index].name}-${index}-degree`)
        actionInfo.angle = parseInt(degree ? degree : 0)
        actionInfo.mapName = selectedOption?.name

        patrol.push(actionInfo)
      }
    }
    // Append patrol to request body
    let bodyToSubmit = {
      patrol: patrol,
      schedule_name: "Schedule 1",
      robot_name: id,
      user_name: "Jacky",
      mapName: selectedOption,
      map_height: 500,
      map_width: 500,
      rid: robot.rid,
      __v: 0
    }
    // Send web-socket
    scheduleSocket.emit('startPatrol', bodyToSubmit)

    // formSubmit(bodyToSubmit)
  }

  const handleSubmit = (event) => {
    // Formulate form
    const data = new FormData(document.getElementById("submit-form"))

    let patrol = []

    for (let index in missionItems) {
      if (missionItems[index].category === "point") {

        let pointInfo = missionItems[index]
        let startTime = data.get(`${missionItems[index].name}-${index}`)
        pointInfo.startTime = startTime
        patrol.push(pointInfo)

      } else if (missionItems[index].category === "path") {

        let pathInfo = missionItems[index]
        let startTime = data.get(`${missionItems[index].name}-${index}`)
        pathInfo.startTime = startTime
        patrol.push(pathInfo)

      } else if (missionItems[index].category === "action" && missionItems[index].name === "Pause") {

        let actionInfo = { name: missionItems[index].name }
        actionInfo.category = "action"
        let startTime = data.get(`${missionItems[index].name}-${index}`)
        actionInfo.startTime = startTime
        let hour = data.get(`${missionItems[index].name}-${index}-hour`).toString()
        let minute = data.get(`${missionItems[index].name}-${index}-minute`).toString()
        let pauseTime = `${hour ? hour : 0}:${minute ? minute : 0}`
        actionInfo.pauseTime = pauseTime
        patrol.push(actionInfo)

      } else if (missionItems[index].category === "action" && missionItems[index].name === "RotateTo2d") {

        let actionInfo = { name: missionItems[index].name }
        actionInfo.category = "action"
        let startTime = data.get(`${missionItems[index].name}-${index}`)
        actionInfo.startTime = startTime
        let degree = data.get(`${missionItems[index].name}-${index}-degree`)
        actionInfo.angle = parseInt(degree ? degree : 0)

        patrol.push(actionInfo)
      }
    }
    // Function to update mission to BE
    const formSubmit = async (body) => {
      const url = `${base_url}/db/update`
      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      const result = await res.json()
      if (result.data) {
        alert('Patrol Sent!')
      }
    }
    // Append patrol to request body
    let bodyToSubmit = {
      collection: 'robots',
      conditions: {
        rid: id,
      },
      "update": {
        schedules: [
          {
            patrol: patrol,
            schedule_name: "Schedule 1",
            robot_name: id,
            user_name: "Jacky",
            mapName: selectedOption,
            map_height: 500,
            map_width: 500,
            __v: 0
          }
        ]
      }
    }
    // Send request to update mission to BE
    formSubmit(bodyToSubmit)
  }

  const handleDelete = (event) => {
    const deleteIndex = event.target.getAttribute('index')
    let newMissionItems = missionItems.filter((item, index) => index != deleteIndex)
    setMissionItems(newMissionItems)
  }

  const handleDisplayPath = (event) => {
  }

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <div className="headder-btns">
            <Breadcrumb heading="patrol.edit-patrol" match={match} />

            <div className="submit-btns">
              <div>
                <Button className="load-btn" color="primary" onClick={toggleSchedule}>Load Schedule</Button>
              </div>
              <div>
                <Button className="submit-btn" color="primary" type="submit" onClick={handleSubmit}>Submit</Button>
              </div>
              <div>
                <Button className="perform-btn" color="primary" onClick={handlePerform}>Perform</Button>
              </div>
            </div>
          </div>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row className="main-container" style={{ height: window.innerHeight - 300 }}>
        <Colxx xxs="5" className="left-container">
          <Card className="mb-4">
            <Card className="list-option">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="list-options" />
                </CardTitle>
                <div className="list-btns">
                  <Dropdown isOpen={mapDropdownOpen} toggle={toggleMap}>
                    <DropdownToggle className="list-btn">
                      Map
                    </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-btn"
                      modifiers={{
                        setMaxHeight: {
                          enabled: true,
                          order: 890,
                          fn: (data) => {
                            return {
                              ...data,
                              styles: {
                                ...data.styles,
                                maxHeight: '200px',
                                maxWidth: '500px',
                                "overflowY": 'scroll',
                                "overflowX": 'auto',
                              },
                            };
                          },
                        },
                      }}
                    >
                      {mapList && mapList.map((item, index) => (
                        <DropdownItem key={index} value={item.value} onClick={selectMap}>{item.label}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown isOpen={pointDropdownOpen} toggle={togglePoint}>
                    <DropdownToggle className="list-btn">
                      Point
                      </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-btn"
                      modifiers={{
                        setMaxHeight: {
                          enabled: true,
                          order: 890,
                          fn: (data) => {
                            return {
                              ...data,
                              styles: {
                                ...data.styles,
                                maxHeight: '200px',
                                "overflowY": 'scroll',
                                "overflowX": 'auto',
                              },
                            };
                          },
                        },
                      }}
                    >
                      {pointList.map((item, index) => (
                        <DropdownItem key={index} value={item.name} onClick={addPoint}>{item.name}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown isOpen={pathDropdownOpen} toggle={togglePath}>
                    <DropdownToggle className="list-btn">
                      Path
                      </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-btn"
                      modifiers={{
                        setMaxHeight: {
                          enabled: true,
                          order: 890,
                          fn: (data) => {
                            return {
                              ...data,
                              styles: {
                                ...data.styles,
                                maxHeight: '200px',
                                "overflowY": 'scroll',
                                "overflowX": 'auto',
                              },
                            };
                          },
                        },
                      }}
                    >
                      {pathList.map((item, index) => (
                        <DropdownItem key={index} value={item.name} onClick={addPath}>{item.name}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown isOpen={actionDropdownOpen} toggle={toggleAction}>
                    <DropdownToggle className="list-btn">
                      Action
                      </DropdownToggle>
                    <DropdownMenu
                      className="dropdown-btn"
                      modifiers={{
                        setMaxHeight: {
                          enabled: true,
                          order: 890,
                          fn: (data) => {
                            return {
                              ...data,
                              styles: {
                                ...data.styles,
                                maxHeight: '200px',
                                "overflowY": 'scroll',
                                "overflowX": 'auto',
                              },
                            };
                          },
                        },
                      }}
                    >
                      {actionList.map((item, index) => (
                        <DropdownItem key={index} value={item.name} onClick={addAction}>{item.name}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </CardBody>
            </Card>
            <Card id="mission-card">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="missions" />
                </CardTitle>
                <Form onSubmit={handleSubmit}
                  encType="multipart/form-data" id="submit-form">
                  {missionItems.map((item, index) => {
                    if (item.category === "point" || item.category === "path") {
                      return <div className="task" key={index}>
                        <div className="split">
                          <div>
                            <Label>{item.name}</Label>
                          </div>
                          {item.category === "path" && <>
                            <div className="collapse-div">
                              {collapse[index] !== true && <div className="simple-icon-arrow-right glyph-icon display-path"
                                onClick={() => toggleCollapse(index)}>
                              </div>}
                              {collapse[index] === true && <div className="simple-icon-arrow-down glyph-icon display-path"
                                onClick={() => toggleCollapse(index)}>
                              </div>}

                              <Collapse isOpen={collapse[index]}>
                                <div className="display-points">
                                  {item.points.map((elem, index) => {
                                    return <div className="display-point" key={`${item.name}-${index}`}>
                                      <Label>Point {index + 1}:</Label>
                                      <br></br>
                                      <Label>{`x: ${elem.gridPosition.x.toFixed(2)}`}</Label>
                                      <br></br>
                                      <Label>{`y: ${elem.gridPosition.y.toFixed(2)}`}</Label>
                                      <br></br>
                                      <Label>{`angle: ${elem.angle}°`}</Label>
                                    </div>
                                  })}
                                </div>
                              </Collapse>
                            </div>
                          </>}
                          <div className="start-time-box">
                            <div>
                              <Label>Start time:</Label>
                            </div>
                            <div>
                              <Input
                                type="time"
                                name={item.name + "-" + index}
                                id={item.name + "-" + index}
                                defaultValue={item.startTime}>
                              </Input>
                            </div>
                          </div>
                        </div>
                        <div className="delete-btn glyph-icon simple-icon-close" index={index} onClick={handleDelete}></div>
                      </div>
                    }
                    else if (item.category === "action" && item.name === "Pause") {
                      return <div className="task" key={index}>
                        <div className="split">

                          <div>
                            <Label>{item.name}</Label>
                          </div>
                          <div className="duration">
                            {/* Setting pauseTime time (integer form) */}
                            <Label>Duration to Pause:</Label>
                            <div className="hour-and-minute-input">
                              <div className="hours">
                                <Input
                                  className="hour-input form-control"
                                  type="number"
                                  min="0"
                                  width="100px"
                                  name={item.name + "-" + index + "-hour"}
                                  id={item.name + "-" + index + "-hour"}
                                  placeholder="hours"
                                  defaultValue={item.pauseTime ? (item.pauseTime.split(':'))[0] : 0}
                                /> hours
                                  </div>
                              <div className="minutes">
                                <Input
                                  className="minute-input"
                                  type="number"
                                  min="0"
                                  name={item.name + "-" + index + "-minute"}
                                  id={item.name + "-" + index + "-minute"}
                                  placeholder="minutes"
                                  defaultValue={item.pauseTime ? (item.pauseTime.split(':'))[1] : 0}
                                />minutes
                                  </div>
                            </div>
                          </div>
                          <div>
                            <Label>Start Time to Pause:</Label>
                            <Input type="time"
                              name={item.name + "-" + index}
                              id={item.name + "-" + index}
                              defaultValue={item.startTime}>
                            </Input>
                          </div>
                        </div>
                        <div className="delete-btn glyph-icon simple-icon-close" index={index} onClick={handleDelete}></div>
                      </div>
                    } else if (item.category === "action" && item.name === "RotateTo2d") {
                      return <div className="task" key={index}>
                        <div className="split">

                          <div>
                            <Label>Rotate</Label>
                          </div>
                          <div className="rotate">
                            <Label>Rotate Angle (in degree):</Label>
                            <Input
                              type="number"
                              name={item.name + "-" + index + "-degree"}
                              id={item.name + "-" + index + "-degree"}
                              placeholder="0°"
                              defaultValue={item.angle}
                            />
                          </div>
                          <div>
                            <Label>Start Time to Rotate:</Label>
                            <Input type="time"
                              name={item.name + "-" + index}
                              id={item.name + "-" + index}
                              defaultValue={item.startTime}></Input>
                          </div>
                        </div>
                        <div className="delete-btn glyph-icon simple-icon-close" index={index} onClick={handleDelete}></div>
                      </div>
                    }
                  })}
                </Form>
              </CardBody>
            </Card>
          </Card>
          <Card>
            <CardBody>
              <CardTitle>
                <IntlMessages id="controller" />
              </CardTitle>
              <MovementController actionSocket={actionSocket} rid={id} />
            </CardBody>
          </Card>
        </Colxx>
        <Colxx xxs="7" id="right-container" className="mb-4">
          <Card id="map-card">
            <CardBody innerRef={mapContainer}>
              {selectedOption && <MapDashboard
                robotName={id}
                selectedmapName={selectedOption?.name}
                points={points}
                paths={paths}
                setPoints={setPoints}
                setPaths={setPaths}
                divWidth={mapContainerSize ? mapContainerSize.width : 300}
                divHeight={mapContainerSize ? mapContainerSize.height : 300}
              />}
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};
const mapStateToProps = ({ robots }) => {
  return {
    robots,
  };
};
export default connect(mapStateToProps)(EditPatrolPage);
