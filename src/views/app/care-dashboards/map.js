import React, { useState, useEffect, useRef, useContext } from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
//  custom comp
import { Stage, Layer, Rect, Transformer, Image, Text, Circle, Line } from 'react-konva';
import './style.css'
import Buttons from './robots-components/Buttons'
import Gp from './robots-components/Gp'
import mapImg from './upload/aobo1001/roborn811.bmp'
import { DataSocketContext, ActionSocketContext } from '../../../App'
import { elementType } from 'prop-types';

const MapDashboard = ({ intl, match, points, paths, setPoints, setPaths, divWidth, divHeight, selectedMapName, robotName }) => {
  const width = divWidth ? divWidth : window.innerWidth * 3 / 5;
  const height = divHeight ? divHeight : window.innerHeight * 3 / 5;
  const start_x = window.innerWidth * 0 / 10;
  const start_y = window.innerHeight * 0 / 10;

  const [showMap, setShowMap] = useState(false)
  const [showInitting, setShowInitting] = useState(false)
  const [showVirtualTracks, setShowVirtualTracks] = useState(false)
  const [showPointsList, setShowPointsList] = useState(false)
  const [showLasers, setShowLasers] = useState(false)
  const [selectShape, setSelectShape] = useState(false)
  const [showAddPoint, setShowAddPoint] = useState(false)
  const [showEditPoint, setShowEditPoint] = useState(false)
  const [showDeletePoint, setShowDeletePoint] = useState(false);
  const [showMoveToPoint, setShowMoveToPoint] = useState(false)
  const [showAddPath, setShowAddPath] = useState(false)
  const [showEditPath, setShowEditPath] = useState(false)
  const [showDeletePath, setShowDeletePath] = useState(false)
  const [refreshMap, setRefreshMap] = useState(true)
  const dataSocket = useContext(DataSocketContext);
  const actionSocket = useContext(ActionSocketContext);

  const [map, setMap] = useState(null);
  const [robotType, setRobotType] = useState('aobo');
  const [robot, setRobot] = useState('aobo1001');
  const [mapName, setMapName] = useState('roborn811');
  const [position, setPosition] = useState(null);
  const [lasers, setLasers] = useState(null);
  const [mapInfo, setMapInfo] = useState({});
  const [mapMove, setMapMove] = useState({ x: 0, y: 0 });
  const [mapRotateMove, setMapRotateMove] = useState({ x: 0, y: 0 });
  const [mainGpMove, setMainGpMove] = useState({ x: 0, y: 0 });
  const [doneTarget, setDoneTarget] = useState({ x: 0, y: 0 , angle:0});
  const [mapRotateAngle, setMapRotateAngle] = useState(0);
  const [pointRotate, setPointRotate] = useState(0);
  const [addLineTargets, setAddLineTargets] = useState([]);
  const [pointEditTarget, setPointEditTarget] = useState(null);
  const [pathEditTarget, setPathEditTarget] = useState([]);
  const [pointEditTarget_destination, setPointEditTarget_destination] = useState(null);
  const [pathEditTarget_destination, setPathEditTarget_destination] = useState([]);
  const [pointDeleteList, setPointDeleteList] = useState([]);
  const [pathDeleteList, setPathDeleteList] = useState([]);
  const [remainingPath, setRemainingPath] = useState(null);
  const [stageScale, setStageScale] = useState({
    stageScale: 1,
    stageX: start_x,
    stageY: start_y
  });
  const [dbData, setDbData] = useState()
  const [isPointPathLoaded, setIsPointPathLoaded] = useState(false)
  const [loadPointTimeout, setLoadPointTimeout] = useState()
  const [lastCenter, setLastCenter] = useState(null);
  const [lastDist, setLastDist] = useState(0);
  const stageRef = useRef();

  const aoboDBDomain = 'http://localhost:80'
  // const aoboDBDomain = 'http://rpass.roborn.com'

  const urls = {
    'aobo': {
      headers: { 'rid': `${robot}`, 'uid': '1001' },
      map: `${aoboDBDomain}/aobo-robot/getMap?name=${mapName}`,
      init: `${aoboDBDomain}/aobo-robot/recoverLocalization`,
      position: `${aoboDBDomain}/aobo-robot/getPosition`,
      lasers: `${aoboDBDomain}/aobo-robot/getLaserScan`,
      moveTo: `${aoboDBDomain}/aobo-robot/moveTo?`,
      remainingPath: `${aoboDBDomain}/aobo-robot/getRemainingPath`,
      cancelAction: `${aoboDBDomain}/aobo-robot/cancelAction`,
      // aobo verify path
      db_get: `${aoboDBDomain}/db/get`,
      db_update: `${aoboDBDomain}/db/update`,
      // points: `http://192.168.31.106:5000/points?mapName=${mapName}&robotName=${robot}`,
      // paths: `http://192.168.31.106:5000/virtualTracks?mapName=${mapName}&robotName=${robot}`,
      // addPoint: `http://192.168.31.106:5000/add_position?mapName=${mapName}&robotName=${robot}`,
      // deletePoint: `http://192.168.31.106:5000/delete_position?mapName=${mapName}&robotName=${robot}&position_name=`,
      // addLine: `http://192.168.31.106:5000/generate_graph_path?mapName=${mapName}&robotName=${robot}`,
      // updateLine: `http://192.168.31.106:5000/update_graph_path?mapName=${mapName}&robotName=${robot}`,
      // deleteLine: `http://192.168.31.106:5000/delete_graph_path?mapName=${mapName}&robotName=${robot}&graph_path_name=`,
    },
    'sauwu': {
      headers: { 'rid': `${robot}`, 'uid': '1001' },
      map: `http://10.7.5.88:8080/gs-robot/data/map_png?mapName=${mapName}`,
      init: `http://10.7.5.88:8080/gs-robot/cmd/initialize_customized_directly`,
      position: `http://10.7.5.88:8080/gs-robot/real_time_data/position`,
      lasers: `http://10.7.5.88:8080/gs-robot/real_time_data/laser_phit`,
      points: `http://10.7.5.88:8080/gs-robot/data/positions?mapName=${mapName}`,
      addPoint: `http://10.7.5.88:8080/gs-robot/cmd/position/add_position`,
      deletePoint: `http://10.7.5.88:8080/gs-robot/cmd/delete_position?mapName=${mapName}&position_name=`,
      paths: `http://10.7.5.88:8080/gs-robot/data/graph_paths?mapName=${mapName}`,
      addLine: `http://10.7.5.88:8080/gs-robot/cmd/generate_graph_path`,
      verifyLine: `http://10.7.5.88:8080/gs-robot/cmd/verify_graph_line`,
      updateLine: `http://10.7.5.88:8080/gs-robot/cmd/update_graph_path`,
      deleteLine: `http://10.7.5.88:8080/gs-robot/cmd/delete_graph_path?mapName=${mapName}&graph_path_name=`
    }
  }

  // Set the map name input
  useEffect(() => {
    if (selectedMapName !== undefined)
      setMapName(selectedMapName)
  }, [selectedMapName])

  // Change if points/paths input are changed
  // useEffect(() => {
  // setPoints(points)
  // setPaths(paths)
  // }, [points, paths])

  useEffect(() => {
    dataSocket.on('message', (data) => {
      // set position
      console.log(data,data.getPositions,data.getLaserScan)
      setPosition(data.getPositions)
      // set laser
      setLasers(data.getLaserScan)
    })
  }, [])

  useEffect(() => {
    getDb()
  }, [])

  useEffect(() => {
    console.log(position)
    if (position && dbData?.data?.length > 0 && !isPointPathLoaded){
      console.log(isPointPathLoaded)
      getPoints()
    }
    return;
  },[dbData,position])

  // Fetch points
  const fetchPositions = async () => {
    try {
      const position_res = await fetch(urls[robotType].position,
        {
          method: "POST",
          headers: urls[robotType].headers
        })
      const position_data = await position_res.json()
      // setPosition(position_data.data)

      // const laser_res = await fetch(urls[robotType].lasers, {
      //   method: "POST",
      //   headers: urls[robotType].headers
      // })
      // const laser_data = await laser_res.json()
      // setLasers(laser_data.data)

      if (robotType === 'aobo') {
        const remaining_paths_res = await fetch(urls[robotType].remainingPath, {
          method: "POST",
          headers: urls[robotType].headers
        })
        const remaining_paths_data = await remaining_paths_res.json()
        setRemainingPath(remaining_paths_data.remainingPath)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getDb = async () => {
    const body = { "collection": "robots", "conditions": { "rid": robot } }
      const db_get_res = await fetch(urls[robotType].db_get, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const db_get_data = await db_get_res.json()
      if (!db_get_data.data.length > 0 || !db_get_data.data[0].maps || !db_get_data.data[0].maps.length > 0){
        setTimeout(getDb,2000)
        return;
      }
      setDbData(db_get_data)
  }

  // Get points
  const getPoints = async () => {
    console.log('getPoints')
    try {
      const position_data = { data: position }
      if (dbData?.data?.length > 0 && dbData.data[0].maps && dbData.data[0].maps.length > 0) {
        let map_obj = dbData.data[0].maps.filter((target) => target.name == mapName)
        if (map_obj[0].points && map_obj[0].points.length > 0) {
          setPoints(map_obj[0].points)
        }
        else {
          setPoints([])
        }
        let paths_lines = []
        let path_data = map_obj[0].paths
        if (path_data && path_data.length > 0) {
          path_data.forEach((path) => {
            let paths_line = []
            path.lines.forEach((line) => {
              let line_xy = {}
              for (const element of path.points) {
                if (line.begin === element.name) {
                  line_xy.begin = { x: element.gridPosition.x, y: position_data.data.mapInfo.gridHeight - element.gridPosition.y }
                  line_xy.begin_name = line.begin
                }
                if (line.end === element.name) {
                  line_xy.end = { x: element.gridPosition.x, y: position_data.data.mapInfo.gridHeight - element.gridPosition.y }
                  line_xy.end_name = line.end
                }
              }
              paths_line.push(line_xy)
            })
            // console.log(i, paths_line)
            paths_lines.push({ path: paths_line, name: path.name })
          })
          // console.log(paths_lines)
          setPaths({ paths: path_data, paths_lines: paths_lines })
        }
        else {
          setPaths({ paths: [], paths_lines: [] })
        }
        setIsPointPathLoaded(true)
        clearTimeout(loadPointTimeout)
      } else {
        const retry = setTimeout(getPoints, 2000)
        setLoadPointTimeout(retry)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Get real time positions
  const getPositions = () => {
    fetchPositions()
  }

  // Sleep
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get map drag target point
  const mapDrag = (target) => {
    console.log('setMapMove', { x: target.x, y: target.y })
    setMapMove({ x: target.x, y: target.y })
    // setGpDrag({ x: target.x, y: target.y })
  }

  // Get main group drag target point
  const mainGpDrag = (target) => {
    setMainGpMove(target)
  }

  // Set Done target point
  const set_done_target = (target) => {
    setDoneTarget(target)
  }

  // Set point rotate angle
  const SetPointRotate = (target) => {
    setPointRotate(target)
  }

  // Verify line safety
  const verifyLine = async () => {
    if (addLineTargets.length < 1) {
      return true
    }
    if (robotType !== 'sauwu') {
      return true
    }
    const url = urls[robotType].verifyLine
    let result = {
      "begin":
      {
        "x": addLineTargets[addLineTargets.length - 1].point.x,
        "y": addLineTargets[addLineTargets.length - 1].point.y
      },
      "end":
      {
        "x": doneTarget.x,
        "y": doneTarget.y
      },
      "mapName": mapName,
      "radius": 0
    }
    // console.log(result)
    try {
      const res = await fetch(url, {
        method: 'POST',
        // headers: { 'rid': 'gs1001', 'uid': 'benson' },
        body: JSON.stringify(result)
      })
      const res_json = await res.json()
      console.log(res_json)
      if (res_json.successed) {
        return true
      }
      return false
    } catch (error) {
      console.error(error)
      return false
    }
  }

  // Done edit line pressed
  const onDoneEditPath = async () => {
    if (pathEditTarget_destination.length === 0 || !position) {
      setShowEditPath(false)
      return
    }
    let paths_new = JSON.parse(JSON.stringify(paths.paths))
    let paths_lines_new = JSON.parse(JSON.stringify(paths.paths_lines))
    let height = position.mapInfo.gridHeight;

    pathEditTarget_destination.forEach(dest => {
      paths_new.forEach(path => {
        if (dest.target.path_name === path.name) {
          path.points.forEach(point => {
            if (dest.target.name === point.name) {
              point.gridPosition = { x: dest.x, y: dest.y }
            }
          });
          path.paths[0].points.forEach(path_point => {
            if (dest.target.name === path_point.name) {
              path_point.gridPosition = { x: dest.x, y: dest.y }
            }
          });
        }
      });
      paths_lines_new.forEach(path_line => {
        if (dest.target.path_name === path_line.name) {
          path_line.path.forEach(line => {
            if (dest.target.name === line.begin_name) {
              line.begin = { x: dest.x, y: height - dest.y }
            }
            if (dest.target.name === line.end_name) {
              line.end = { x: dest.x, y: height - dest.y }
            }
          })
        }
      })
    });

    const verify_new = async () => {
      var succeed = []
      paths_new.forEach(async (path) => {
        let succ = {}
        succ[path.name] = true
        path.points.forEach(async (element, ind) => {
          if (ind !== path.points.length - 1) {
            let result = {
              "begin":
              {
                "x": element.gridPosition.x,
                "y": element.gridPosition.y
              },
              "end":
              {
                "x": path.points[ind + 1].gridPosition.x,
                "y": path.points[ind + 1].gridPosition.y,
              },
              "radius": 0,
              "mapName": mapName
            }
            const url = urls[robotType].verifyLine
            try {
              const res = await fetch(url, {
                method: 'POST',
                // headers: { 'rid': 'gs1001', 'uid': 'benson' },
                body: JSON.stringify(result)
              })
              const res_json = await res.json()
              if (!res_json.successed) {
                succ[path.name] = false
              }
              // return false
            } catch (error) {
              console.error(error)
              // return false
            }
          }
        });
        succeed.push(succ)
      });
      return succeed
    }

    if (robotType === 'sauwu') {
      const succeed_res = await verify_new()

      // console.log(succeed_res)

      sleep(500).then(() => {
        succeed_res.forEach(async (s, i) => {
          // console.log(s)
          // console.log(Object.values(s))
          if (s[paths_new[i].name]) {
            const url = urls[robotType].updateLine
            try {
              const res = await fetch(url, {
                method: 'POST',
                // headers: { 'rid': 'gs1001', 'uid': 'benson' },
                body: JSON.stringify(paths_new[i])
              })
              const res_json = await res.json()
              // todo
              console.log(res_json)
            } catch (error) {
              console.error(error)
            }
          } else {
            alert(`Path ${paths_new[i].name} is not safe.`)
          }
        });
        setShowEditPath(false)
        return
      })
    } else {
      // TODO Aobo verify line
      const aoboEditLine = async () => {
        paths_new.forEach(async (path_new) => {
          const url = urls[robotType].db_update
          let update_body = {
            "collection": "robots",
            "conditions": {
              "rid": robot,
              "maps.name": mapName
            },
            "update": {
              "$pull": {
                "maps.$.paths": {
                  "name": path_new.name
                }
              }
            }
          }
          try {
            const db_update_res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update_body)
            })
            const res_json = await db_update_res.json()
            console.log(res_json)
            if (res_json) {
              const url = urls[robotType].db_update
              let update_body = {
                "collection": "robots",
                "conditions": {
                  "rid": robot,
                  "maps.name": mapName
                },
                "update": {
                  "$push": {
                    "maps.$.paths": path_new
                  }
                }
              }
              try {
                const db_update_res = await fetch(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(update_body)
                })
                const res_json = await db_update_res.json()
                console.log(res_json)
              } catch (error) {
                console.error(error)
              }
            }
          } catch (error) {
            console.error(error)
          }
        });
        return true;
      }
      const res = await aoboEditLine();
      if (res) {
        setPaths({ paths: paths_new, paths_lines: paths_lines_new })
        setShowEditPath(false)
        return
      }
    }
  }

  // Done add line pressed
  const onDoneAddLine = (name) => {
    const generateobjects = (target) => {
      let points = []
      let lines = []
      let paths = []
      let path_lines = []
      let path_points = []
      target.forEach(function (element, index) {
        console.log(element.point.angle)
        points.push(
          {
            "actions": [],
            "angle": element.point.angle,
            "defaultAngle": false,
            "gridPosition":
            {
              "x": element.point.x,
              "y": element.point.y
            },
            "name": `${element.id}`
          }
        )
        path_points.push(
          points[points.length - 1]
        )
        if (index < target.length - 1) {
          lines.push(
            {
              "begin": `${element.id}`,
              "end": `${target[index + 1].id}`,
              "name": `${element.id}_${target[index + 1].id}`,
              "radius": 0
            }
          )
          path_lines.push(
            {
              "name": `${element.id}_${target[index + 1].id}`
            }
          )
        }
      })

      paths.push({
        "lines": path_lines,
        "name": "path1",
        "points": path_points
      })

      let objects = {
        lines: lines,
        points: points,
        paths: paths
      }
      return objects
    }

    if (addLineTargets.length < 2) {
      alert('Please add at least 2 points!')
      return
    }
    // console.log(addLineTargets)

    const obj_results = generateobjects(addLineTargets)

    let addLineResult = {
      'points': obj_results.points,
      "lines": obj_results.lines,
      "mapName": mapName,
      "name": name,
      "pathGroups": [],
      "paths": obj_results.paths,
    }

    const addLine = async () => {
      const url = urls[robotType].db_update
      let update_body = {
        "collection": "robots",
        "conditions": {
          "rid": robot,
          "maps.name": mapName
        },
        "update": {
          "$push": {
            "maps.$.paths": addLineResult
          }
        }
      }
      try {
        const db_update_res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update_body)
        })
        const res_json = await db_update_res.json()
        console.log(res_json)
        if (res_json !== null) {
          let new_path_line = []
          addLineResult.lines.forEach((result, i) => {
            new_path_line.push({
              begin: { x: addLineResult.points[i].gridPosition.x, y: position.mapInfo.gridHeight - addLineResult.points[i].gridPosition.y },
              begin_name: `${i}`,
              end_name: `${i + 1}`,
              end: { x: addLineResult.points[i + 1].gridPosition.x, y: position.mapInfo.gridHeight - addLineResult.points[i + 1].gridPosition.y }
            })
          })
          if (paths) {
            setPaths({ paths: [...paths.paths, addLineResult], paths_lines: [...paths.paths_lines, { path: new_path_line, name: addLineResult.name }] })
          }
          else {
            setPaths({ paths: [addLineResult], paths_lines: [{ path: new_path_line, name: addLineResult.name }] })
          }
        }
      } catch (error) {
        console.error(error)
      }
      setShowAddPath(false)
    }
    if (position) {
      addLine()
    }
    else {
      setShowAddPath(false)
    }
  }

  // Done delete path pressed
  const onDoneDeletePath = async () => {
    if (pathDeleteList.length === 0) {
      setShowDeletePath(false)
      return
    }

    const deletePaths = async () => {
      pathDeleteList.forEach(async (path_ele) => {
        const url = urls[robotType].db_update
        let update_body = {
          "collection": "robots",
          "conditions": {
            "rid": robot,
            "maps.name": mapName
          },
          "update": {
            "$pull": {
              "maps.$.paths": {
                "name": path_ele.name
              }
            }
          }
        }
        try {
          const db_update_res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update_body)
          })
          const res_json = await db_update_res.json()
          console.log(res_json)
        } catch (err) {
          console.error(err)
        }
      })
      return true
    }
    const result = await deletePaths()
    if (result) {
      setPaths({
        paths: paths.paths.filter(path => !pathDeleteList.map(delList => delList.name).includes(path.name)),
        paths_lines: paths.paths_lines.filter(path_line => !pathDeleteList.map(delList => delList.name).includes(path_line.name))
      })
      setShowDeletePath(false)
    }
  }

  // Done delete point pressed
  const onDoneDeletePoint = async () => {
    if (pointDeleteList.length === 0) {
      setShowDeletePoint(false)
      return
    }
    // console.log(pointDeleteList)

    const deletePoints = async () => {
      pointDeleteList.forEach(async (ele) => {
        const url = urls[robotType].db_update
        let update_body = {
          "collection": "robots",
          "conditions": {
            "rid": robot,
            "maps.name": mapName
          },
          "update": {
            "$pull": {
              "maps.$.points": {
                "name": ele.name
              }
            }
          }
        }
        try {
          const db_update_res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update_body)
          })
          const res_json = await db_update_res.json()
          console.log(res_json)
        } catch (error) {
          console.error(error)
        }
      })
      return true
    }
    const result = await deletePoints()
    if (result) {
      setShowDeletePoint(false)
      setPoints(points.filter(point => !pointDeleteList.map(delList => delList.name).includes(point.name)))
    }
  }

  // Done move to point pressed
  const onDoneMoveToPoint = async () => {
    if (!pointEditTarget) {
      alert('Please select a point!')
      return
    }
    if (robotType === 'aobo') {
      try {
        // const url_moveTo = urls[robotType].moveTo + `x=${pointEditTarget.gridX}&y=${pointEditTarget.gridY}&angle=${pointEditTarget.angle}`
        actionSocket.send({
          request: 'navigateTo',
          params: {
            x: pointEditTarget.gridX,
            y: pointEditTarget.gridY,
            angle: pointEditTarget.angle
          },
          rid: robot
        })
        setShowMoveToPoint(false)
        return
      } catch (err) {
        console.error(err)
      }
    }
    setShowMoveToPoint(false)
  }

  // Done edit point pressed
  const onDoneEditPoint = async (newName, angle) => {
    if (!pointEditTarget) {
      setShowEditPoint(false)
      return
    }
    const url = urls[robotType].db_update
    let update_body = {
      "collection": "robots",
      "conditions": {
        "rid": robot,
        "maps.name": mapName
      },
      "update": {
        "$pull": {
          "maps.$.points": {
            "name": pointEditTarget.name
          }
        }
      }
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update_body)
    }).then((res) => {
      var edit_result
      edit_result = {
        'angle': angle,
        'mapName': mapName,
        'name': newName === '' ? pointEditTarget.name : newName,
        'type': 2
      }
      if (!pointEditTarget_destination) {
        edit_result['gridX'] = pointEditTarget.gridX
        edit_result['gridY'] = pointEditTarget.gridY
      }
      else {
        edit_result['gridX'] = pointEditTarget_destination.x
        edit_result['gridY'] = pointEditTarget_destination.y
      }
      const addPoint = async () => {
        const url = urls[robotType].db_update
        let update_body = {
          "collection": "robots",
          "conditions": {
            "rid": robot,
            "maps.name": mapName
          },
          "update": {
            "$push": {
              "maps.$.points": edit_result
            }
          }
        }
        try {
          const db_update_res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update_body)
          })
          const res_json = await db_update_res.json()
          console.log(res_json)
          if (res_json !== null) {
            setPoints(
              points.map((point) =>
                point.name === pointEditTarget.name ? {
                  ...point,
                  'angle': angle,
                  'name': newName === '' ? pointEditTarget.name : newName,
                  'gridX': !pointEditTarget_destination ? pointEditTarget.gridX : pointEditTarget_destination.x,
                  'gridY': !pointEditTarget_destination ? pointEditTarget.gridY : pointEditTarget_destination.y
                } : point
              )
            )
          }
        } catch (error) {
          console.error(error)
        }
      }
      addPoint()
    },
      (err) => {
        console.err(err)
      })
    setShowEditPoint(false)
  }

  // Done add point pressed
  const onDoneAddPoint = (name, angle) => {
    // console.log(doneTarget)
    let result = {
      'angle': angle,
      'gridX': doneTarget.x,
      'gridY': doneTarget.y,
      'mapName': mapName,
      'name': name,
      'type': 2
    }
    // console.log(result)

    const addPoint = async () => {
      const url = urls[robotType].db_update
      let update_body = {
        "collection": "robots",
        "conditions": {
          "rid": robot,
          "maps.name": mapName
        },
        "update": {
          "$push": {
            "maps.$.points": result
          }
        }
      }
      try {
        const db_update_res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update_body)
        })
        const res_json = await db_update_res.json()
        console.log(res_json)
        if (res_json !== null) {
          if (points && points.length > 0) {
            setPoints([...points, result])
          }
          else {
            setPoints([result])
          }
        }
      } catch (error) {
        console.error(error)
      }
      setShowAddPoint(false)
    }

    addPoint()
  }

  // Add current point pressed
  const onAddCurrentPoint = (name) => {
    if (position) {
      let result = {
        'angle': position.angle,
        'gridX': position.gridPosition.x,
        'gridY': position.gridPosition.y,
        'mapName': mapName,
        'name': name,
        'type': 2
      }

      const addPoint = async () => {
        const url = urls[robotType].db_update
        let update_body = {
          "collection": "robots",
          "conditions": {
            "rid": robot,
            "maps.name": mapName
          },
          "update": {
            "$push": {
              "maps.$.points": result
            }
          }
        }
        try {
          const db_update_res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update_body)
          })
          const res_json = await db_update_res.json()
          console.log(res_json)
          setPoints([...points, result])
        } catch (error) {
          console.error(error)
        }
        setShowAddPoint(false)
      }

      addPoint()
    } else {
      setShowAddPoint(false)
    }
  }

  // Cancel action pressed
  const onCancelAction = async () => {
    const url = urls[robotType].cancelAction
    if (robotType === 'aobo') {
      try {
        actionSocket.send({
          request: 'stop',
          rid: robot
        })
        // const res = await fetch(url, {
        //   method: 'GET',
        //   headers: { 'rid': robot, 'uid': 'eric' },
        // })
        // const res_json = await res.json()
        // console.log(res_json)
      } catch (error) {
        console.error(error)
      }
    }
  }

  // Next point in add line pressed
  const lineAddPoint = (id, angle) => {
    setAddLineTargets([...addLineTargets, { id: id, point: { x: doneTarget.x, y: doneTarget.y, angle: angle } }])
  }

  // Remove next point in Undo button pressed
  const removeAddPoint = (id) => {
    setAddLineTargets(addLineTargets.filter((target) => target.id !== id))
  }

  // Get map rotate target angle
  const mapRotate = (target) => {
    const current_pos = {
      x: position.gridPosition.x - position.mapInfo.gridWidth / 2 - mapMove.x,
      y: position.gridPosition.y - position.mapInfo.gridHeight / 2 + mapMove.y
    }

    // let current_angle = Math.atan(Math.abs(current.y) / Math.abs(current.x))
    // if (current.y < 0 && current.x > 0) {
    //   current_angle = -current_angle
    // } else if (current.y < 0 && current.x < 0) {
    //   current_angle = current_angle - Math.PI
    // } else if (current.y > 0 && current.x < 0) {
    //   current_angle = Math.PI - current_angle
    // }

    // let new_angle = current_angle + target / 180.0 * Math.PI
    // if (new_angle > Math.PI) {
    //   new_angle = new_angle - 2 * Math.PI
    // } else if (new_angle < -Math.PI) {
    //   new_angle = 2 * Math.PI - new_angle
    // }

    // const dis = Math.sqrt(current.x * current.x + current.y * current.y)

    // const x_diff = (Math.cos(current_angle) - Math.cos(new_angle)) * dis
    // const y_diff = (Math.sin(new_angle) - Math.sin(current_angle)) * dis

    // const current_pos = {
    //   x: position.gridPosition.x,
    //   y: position.gridPosition.y
    // }

    const new_pos = {
      x: current_pos.x * Math.cos(target / 180.0 * Math.PI) - current_pos.y * Math.sin(target / 180.0 * Math.PI),
      y: current_pos.x * Math.sin(target / 180.0 * Math.PI) + current_pos.y * Math.cos(target / 180.0 * Math.PI)
    }

    console.log('setMapRotateMove', { x: current_pos.x - new_pos.x, y: new_pos.y - current_pos.y })
    setMapRotateMove({ x: current_pos.x - new_pos.x, y: new_pos.y - current_pos.y })
    setMapRotateAngle(position.angle + target)
  }

  // Check if map is selected
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectShape(false);
    }
  };

  // Init point
  const initPose = async () => {
    // var url = urls[robotType].init
    actionSocket.send({
      request: 'initialize',
      params: position ? {
        mapName: mapName,
        point: {
          angle: mapRotateAngle,
          gridPosition: {
            "x": position.mapInfo.gridWidth / 2 - (mapMove.x + mapRotateMove.x),
            "y": position.mapInfo.gridHeight / 2 + (mapMove.y + mapRotateMove.y)
          }
        }
      } : {},
      rid: robot
    })
    // if (robotType === 'sauwu') {
    //   if (position !== null) {
    //     const data = {
    //       "mapName": mapName,
    //       "point": {
    //         "angle": mapRotateAngle,
    //         "gridPosition": {
    //           "x": position.mapInfo.gridWidth / 2 - (mapMove.x + mapRotateMove.x),
    //           "y": position.mapInfo.gridHeight / 2 + (mapMove.y + mapRotateMove.y)
    //         }
    //       }
    //     }
    //     console.log(data)
    //     try {
    //       const res = await fetch(url, {
    //         method: 'POST',
    //         headers: { 'rid': 'gs1001', 'uid': 'benson' },
    //         body: JSON.stringify(data)
    //       })
    //       const res_json = await res.json()
    //       console.log(res_json)
    //       sleep(700).then(() => {
    //         getPositions().then(() => {
    //           setRefreshMap(false)
    //           setRefreshMap(true)
    //           setMapMove({ x: 0, y: 0 })
    //           setMapRotateMove({ x: 0, y: 0 })
    //           setMapRotateAngle(position.angle)
    //         })
    //       })
    //     } catch (error) {
    //       console.error(error)
    //     }
    //   } else {
    //     console.error('Can\'t get current position.')
    //   }
    // } else {
    //   // TODO Aobo init position
    //   try {
    //     const res = await fetch(url, {
    //       method: 'GET',
    //       headers: { 'rid': robot, 'uid': 'benson' },
    //     })
    //     const res_json = await res.json()
    //     console.log(res_json)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
  }

  useEffect(async () => {
    console.log(mapName)
    if (mapName === undefined) {
      return
    }
    getPoints()
    const map_img = new window.Image();
    map_img.src = mapImg;
    map_img.onload = () => {
      setMap(map_img);
      setMapInfo({ width: map_img.width, height: map_img.height })
      setDoneTarget({ x: map_img.width / 2, y: map_img.height / 2 })
    };
    stageRef.current.getContainer().style.backgroundColor = '#FFF8DC';
  }, [mapName])

  useEffect(() => {
    if (showAddPoint || showEditPoint || showDeletePoint || showAddPath || showEditPath || showDeletePath || showPointsList || showVirtualTracks) {
      setDoneTarget({ x: mapInfo.width / 2, y: mapInfo.height / 2 })
      setAddLineTargets([])
    }
  }, [showAddPoint, showEditPoint, showDeletePoint, showAddPath, showEditPath, showDeletePath])

  // useEffect(() => {
  //   if (mapName === undefined) {
  //     return
  //   }

  //   const id = setInterval(() => {
  //     refreshMap && getPositions();
  //   }, 2000);

  //   refreshMap && getPositions();
  //   return () => clearInterval(id);
  // }, [mapName])

  useEffect(() => {
    if (!showInitting) {
      setRefreshMap(true)
    }
  }, [showInitting])

  useEffect(() => {
    setPointEditTarget(null)
    setPathEditTarget([])
    setPointEditTarget_destination(null)
    setPathEditTarget_destination([])
    setPointDeleteList([])
    setPathDeleteList([])
  }, [showEditPoint, showDeletePoint, showMoveToPoint, showEditPath, showDeletePath])

  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  const getCenter = (p1, p2) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  return (
    <React.Fragment>
      <Row>
        <Colxx xxs="5" md="2" id="map-btn-group">
          <Buttons
            showMap={showMap}
            robotType={robotType}
            onShowMap={() => {
              if (selectedMapName === undefined) {
                alert("Please choose a map first")
                return
              }
              setShowMap(!showMap)
              setShowInitting(false)
              setSelectShape(false)
              setMapMove({ x: 0, y: 0 })
              setMapRotateMove({ x: 0, y: 0 })
              setShowAddPoint(false)
              setShowEditPoint(false)
              setShowDeletePoint(false)
              setShowMoveToPoint(false)
              setShowAddPath(false)
              setShowEditPath(false)
              setShowDeletePath(false)
              if (position) {
                setMapRotateAngle(position.angle)
              }
            }}
            showLasers={showLasers}
            onShowLasers={() => { setShowLasers(!showLasers) }}
            showPointsList={showPointsList}
            onShowPointsList={() => {
              // showPointsList && setMainGpMove(mainGpMove_next)
              setShowPointsList(!showPointsList)
              setShowAddPoint(false)
              setShowEditPoint(false)
              setShowDeletePoint(false)
              setShowMoveToPoint(false)
            }}
            showVirtualTracks={showVirtualTracks}
            onShowVirtualTracks={() => {
              // showVirtualTracks && setMainGpMove(mainGpMove_next)
              setShowVirtualTracks(!showVirtualTracks)
              setShowAddPath(false)
              setShowEditPath(false)
              setShowDeletePath(false)
            }}
            showInitting={showInitting}
            onShowInitting={() => {
              if (robot === 'sauwu') {
                showInitting && initPose()
                showInitting && setSelectShape(false)
                setShowInitting(!showInitting)
                setShowAddPoint(false)
                setShowEditPoint(false)
                setShowDeletePoint(false)
                setShowMoveToPoint(false)
                setShowAddPath(false)
                setShowEditPath(false)
                setShowDeletePath(false)
              }
              else {
                initPose()
              }
            }}
            onCancelInitting={() => {
              setRefreshMap(false)
              setShowInitting(false)
              setSelectShape(false)
              setMapMove({ x: 0, y: 0 })
              setMapRotateMove({ x: 0, y: 0 })
              if (position) {
                setMapRotateAngle(position.angle)
              }
            }}
            showAddPoint={showAddPoint}
            showEditPoint={showEditPoint}
            showDeletePoint={showDeletePoint}
            showMoveToPoint={showMoveToPoint}
            onMoveToPoint={() => { !showAddPoint && !showEditPoint && !showDeletePoint && !showAddPath && !showEditPath && !showDeletePath && setShowMoveToPoint(!showMoveToPoint) }}
            showAddPath={showAddPath}
            showEditPath={showEditPath}
            showDeletePath={showDeletePath}
            onAddPoint={() => {
              // showAddPoint && setMainGpMove(mainGpMove_next)
              !showMoveToPoint && !showEditPoint && !showDeletePoint && !showAddPath && !showEditPath && !showDeletePath && setShowAddPoint(!showAddPoint)
            }}
            onAddCurrentPoint={onAddCurrentPoint}
            onEditPoint={() => { !showMoveToPoint && !showAddPoint && !showDeletePoint && !showAddPath && !showEditPath && !showDeletePath && setShowEditPoint(!showEditPoint) }}
            onDeletPoint={() => { !showMoveToPoint && !showEditPoint && !showAddPoint && !showAddPath && !showEditPath && !showDeletePath && setShowDeletePoint(!showDeletePoint) }}
            onAddPath={() => {
              // showAddPath && setMainGpMove(mainGpMove_next)
              !showMoveToPoint && !showEditPoint && !showDeletePoint && !showAddPoint && !showEditPath && !showDeletePath && setShowAddPath(!showAddPath)
            }}
            onEditPath={() => { !showMoveToPoint && !showEditPoint && !showDeletePoint && !showAddPath && !showAddPoint && !showDeletePath && setShowEditPath(!showEditPath) }}
            onDeletPath={() => { !showMoveToPoint && !showEditPoint && !showDeletePoint && !showAddPath && !showEditPath && !showAddPoint && setShowDeletePath(!showDeletePath) }}
            onDoneAddPoint={onDoneAddPoint}
            onDoneEditPoint={onDoneEditPoint}
            onDoneMoveToPoint={onDoneMoveToPoint}
            onDoneAddLine={onDoneAddLine}
            onCancelAction={onCancelAction}
            setPointRotate={SetPointRotate}
            lineAddPoint={lineAddPoint}
            removeAddPoint={removeAddPoint}
            verifyLine={verifyLine}
            pointDeleteList={pointDeleteList}
            undoPointDeleteList={() => {
              // console.log(pointDeleteList)
              setPointDeleteList(pointDeleteList.filter((element) => (element.id !== pointDeleteList[pointDeleteList.length - 1].id)))
            }}
            onDoneDeletePoint={onDoneDeletePoint}
            onDoneEditPath={() => {
              // console.log(pathEditTarget_destination)
              onDoneEditPath()
            }}
            pathDeleteList={pathDeleteList}
            undoPathDeleteList={() => {
              setPathDeleteList(pathDeleteList.filter((element) => (element.id !== pathDeleteList[pathDeleteList.length - 1].id)))
            }}
            onDoneDeletePath={() => {
              onDoneDeletePath()
              // console.log(pathDeleteList)
            }}
          />
        </Colxx>
        <Colxx xxs="5" md="10">
          <Stage
            className="konvajs"
            width={width}
            height={height}
            x={stageScale.stageX}
            y={stageScale.stageY}
            ref={stageRef}
            scaleX={stageScale.stageScale}
            scaleY={stageScale.stageScale}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            // onTouchMove={(e) => {
            //   Konva.hitOnDragEnabled = true;
            //   e.evt.preventDefault();
            //   const stage = stageRef.current
            //   var touch1 = e.evt.touches[0];
            //   var touch2 = e.evt.touches[1];

            //   if (touch1 && touch2) {
            //     setScaling(true);
            //     if (stage.isDragging()) {
            //       stage.stopDrag();
            //     }
            //     var p1 = {
            //       x: touch1.clientX,
            //       y: touch1.clientY,
            //     };
            //     var p2 = {
            //       x: touch2.clientX,
            //       y: touch2.clientY,
            //     };
            //     if (!lastCenter) {
            //       setLastCenter(getCenter(p1, p2));
            //       return;
            //     }
            //     var newCenter = getCenter(p1, p2);
            //     var dist = getDistance(p1, p2);
            //     if (!lastDist) {
            //       setLastDist(dist);
            //     }
            //     var pointTo = {
            //       x: (newCenter.x - stage.x()) / stage.scaleX(),
            //       y: (newCenter.y - stage.y()) / stage.scaleX(),
            //     };

            //     var scale = stage.scaleX() * (dist / lastDist);

            //     stageRef.current.scale({
            //       x: scale,
            //       y: scale
            //     });
            //     var dx = newCenter.x - lastCenter.x;
            //     var dy = newCenter.y - lastCenter.y;

            //     var newPos = {
            //       x: newCenter.x - pointTo.x * scale + dx,
            //       y: newCenter.y - pointTo.y * scale + dy,
            //     };
            //     setStageScale({
            //       ...stageScale,
            //       stageScale: scale,
            //       stageX: newPos.x,
            //       stageY: newPos.y
            //     });
            //     setLastDist(dist);
            //     setLastCenter(newCenter);
            //   }
            // }}
            // onTouchEnd={() => {
            //   setLastDist(0);
            //   setLastCenter(null);
            // }}
            onWheel={(e) => {
              e.evt.preventDefault();
              const stage = stageRef.current.attrs;
              var oldScale = stage.scaleX;

              var newScale =
                e.evt.deltaY > 0 ? oldScale * 0.95 : oldScale / 0.95;

              stageRef.current.scale({
                x: newScale,
                y: newScale
              });

              setStageScale({
                ...stageScale,
                stageScale: newScale
              });
            }}
          >
            <Layer>
              <Gp
                mapDrag={mapDrag}
                mapRotate={mapRotate}
                showMap={showMap}
                start_x={start_x}
                start_y={start_y}
                showLasers={showLasers}
                showPointsList={showPointsList}
                showVirtualTracks={showVirtualTracks}
                showInitting={showInitting}
                map={map}
                isSelected={selectShape}
                onSelect={() => {
                  showInitting && setSelectShape(true);
                }}
                lasers={lasers}
                position={position}
                points={points}
                paths={paths}
                remainingPath={remainingPath}
                addLineTargets={addLineTargets}
                refreshMap={refreshMap}
                mainGpDrag={mainGpDrag}
                mainGpMove={mainGpMove}
                mapInfo={mapInfo}
                showAddPoint={showAddPoint}
                showEditPoint={showEditPoint}
                showDeletePoint={showDeletePoint}
                showMoveToPoint={showMoveToPoint}
                showAddPath={showAddPath}
                showEditPath={showEditPath}
                showDeletePath={showDeletePath}
                set_done_target={set_done_target}
                pointRotate={pointRotate}
                pointEditTarget={pointEditTarget}
                setPointEditTarget={(point) => {
                  setPointEditTarget(point)
                }}
                pathEditTarget={pathEditTarget}
                pathEditTarget_destination={pathEditTarget_destination}
                setPathEditTarget={(path) => {
                  // console.log(path)
                  setPathEditTarget(path)
                }}
                setPointEditTarget_destination={(point) => {
                  setPointEditTarget_destination(point)
                }}
                setPathEditTarget_destination={(point) => {
                  if (pathEditTarget_destination.length === 0) {
                    setPathEditTarget_destination([...pathEditTarget_destination, point])
                    return
                  }
                  var pathEditTarget_destination_new = pathEditTarget_destination
                  var changed = false
                  pathEditTarget_destination_new.forEach((edit_target) => {
                    if (edit_target.target.name === point.target.name && edit_target.target.path_name === point.target.path_name) {
                      edit_target.x = point.x
                      edit_target.y = point.y
                      changed = true
                    }
                  })
                  if (!changed) {
                    pathEditTarget_destination_new.push(point)
                  }
                  setPathEditTarget_destination(pathEditTarget_destination_new)
                }}
                pointDeleteList={pointDeleteList}
                setPointDeleteList={(point) => {
                  setPointDeleteList([...pointDeleteList, point])
                }}
                pathDeleteList={pathDeleteList}
                setPathDeleteList={(path) => {
                  setPathDeleteList([...pathDeleteList, path])
                }}
              />
            </Layer>
          </Stage>
        </Colxx>
      </Row>
    </ React.Fragment>
  );
};
export default injectIntl(MapDashboard);
