import React, { useEffect, useState, useMemo } from 'react'
import { Circle, Line, Arrow, Group } from 'react-konva';

const getPointListDefaultResponse = [
    {
        "angle": -13.651858994749526,
        "gridX": 135.9783768017492,
        "gridY": 343.2470261536149,
        "mapName": "roborn811",
        "name": "Pt A",
        "type": 2
    },
    {
        "angle": 69.5,
        "gridX": 24,
        "gridY": 276,
        "mapName": "roborn811",
        "name": "Pt B",
        "type": 2
    }
]

const getPathListDefaultResponse = [
    {
        "lines": [{ "name": "0_1" }, { "name": "1_2" }, { "name": "2_3" }],
        "name": "path1",
        "points": [
            {
                "actions": [],
                "angle": 0,
                "defaultAngle": false,
                "gridPosition": {
                    "x": 50,
                    "y": 50
                },
                "name": "0"
            },
            {
                "actions": [],
                "angle": 0,
                "defaultAngle": false,
                "gridPosition": {
                    "x": 100,
                    "y": 50
                },
                "name": "1"
            },
            {
                "actions": [],
                "angle": 0,
                "defaultAngle": false,
                "gridPosition": {
                    "x": 100,
                    "y": 100
                },
                "name": "2"
            },
            {
                "actions": [],
                "angle": 0,
                "defaultAngle": false,
                "gridPosition": {
                    "x": 50,
                    "y": 100
                },
                "name": "3"
            }
        ]
    }
]

const defaultPointList = [];
const defaultPathList = [];
const defaultNewPath = []

const PointAndPath = ({
    pointList = defaultPointList,
    pathList = defaultPathList,
    positionIndicator = null,
    setPositionIndicator,
    pointState = null,
    newPath = defaultNewPath,
    isSelected }) => {
    const [pathLine, setPathLine] = useState([]);
    const drawList = useMemo(() => {
        if (!pathList) {
            return;
        }
        const newDrawList = [];
        const copyList = [...pathList];
        for (let eachPath of copyList) {
            if (eachPath.points) {
                let list = [];
                eachPath.points.forEach((elem, i) => {
                    const nthPoint = eachPath.points.find((point) => point.name === i.toString())
                    list.push(nthPoint.gridPosition.x);
                    list.push(nthPoint.gridPosition.y);
                })
                newDrawList.push(list);
            }
        }
        return newDrawList
    }, [pathList])

    useEffect(() => {
        if (!newPath || newPath.length <= 1) {
            return;
        }
        let newPathLine = newPath.reduce((acc, elem, i) => {
            acc.push(parseInt(elem.x))
            acc.push(parseInt(elem.y))
            return acc
        }, [])
        setPathLine(newPathLine)
    }, [JSON.stringify(newPath)])

    return (
        <>
            {pointList && pointList.length > 0 && pointList.map((point, i) => {
                return (
                    <Circle
                        key={'point-circle-' + i}
                        onclick
                        x={point.gridX}
                        y={point.gridY}
                        radius={5}
                        fill={'red'}
                    // onClick={()=>{handleEditClick(point)}}
                    />
                )
            })}
            {pathList && pathList.length > 0 && pathList.map((path, i) =>
                path.points.map((point, j) =>
                    <Circle
                        key={'path-circle' + i + '-' + j}
                        x={point.gridPosition.x}
                        y={point.gridPosition.y}
                        radius={5}
                        fill={'yellow'}
                    />
                )
            )}
            {isSelected && newPath?.length > 0 && newPath.map((point, i) =>
                <Circle
                    key={'new-path-circle' + i}
                    x={point.x}
                    y={point.y}
                    radius={5}
                    fill={'green'}
                />
            )}
            {isSelected && newPath?.length > 1 && pathLine.length > 0 &&
                <Line
                    points={pathLine}
                    stroke='red'
                />
            }
            {drawList?.length > 0 && drawList.map((eachLine, i) => <Line
                key={`pathLine-${i}}`}
                points={eachLine}
                stroke='red'
            />)
            }
            {isSelected && positionIndicator &&
                <Group draggable
                    x={positionIndicator.x}
                    y={positionIndicator.y}
                    offsetX={positionIndicator.x}
                    offsetY={positionIndicator.y}
                    onDragEnd={(e) => setPositionIndicator((positionIndicator) =>
                    ({
                        ...positionIndicator,
                        x: parseInt(e.target.attrs.x.toFixed(2)),
                        y: parseInt(e.target.attrs.y.toFixed(2))
                    }))}>
                    <Arrow
                        points={[
                            positionIndicator.x,
                            positionIndicator.y - 100,
                            positionIndicator.x,
                            positionIndicator.y]}
                        pointerLength={20}
                        pointerWidth={16}
                        fill='black'
                    />
                    <Arrow
                        points={[
                            positionIndicator.x,
                            positionIndicator.y,
                            positionIndicator.x + 20 * Math.cos(positionIndicator.angle / 180 * Math.PI),
                            positionIndicator.y - 20 * Math.sin(positionIndicator.angle / 180 * Math.PI)
                        ]}
                        pointerLength={10}
                        pointerWidth={6}
                        fill='#800080'
                        stroke='#800080'
                    />
                </Group>
            }
        </>
    )
}

export default PointAndPath;