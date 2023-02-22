import React, { useRef, useEffect, useState } from 'react';
import { Group } from 'react-konva';
import { Circle, Transformer, Text, Image, Line } from 'react-konva';

const MapGp = ({
    showInitting, isSelected, onSelect,
    mapDrag, mapRotate, map, showPointsList,
    showEditPoint, showDeletePoint, showMoveToPoint,
    showEditPath, showDeletePath,
    points, showVirtualTracks, paths, position, setPointEditTarget,
    setPathEditTarget, pointDeleteList, setPointDeleteList,
    pathEditTarget_destination, pathDeleteList, setPathDeleteList
}) => {
    const gpRef = useRef()
    const trRef = useRef()
    const mapRef = useRef()

    const [pointsCleaned, setPointsCleaned] = useState(null)
    const [pathsCleaned, setPathsCleaned] = useState(null)
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    const handleDbClick = (pathCleaned) => {
        if (showDeletePath) {
            setPathDeleteList(pathCleaned)
            // console.log('Double clicked')
        }
    }

    const handleEditClick = (point) => {
        if (showEditPoint) {
            setPointEditTarget(point)
            setPointsCleaned(pointsCleaned.map((element) =>
                element.id === point.id ? { ...element, isChosen: true } : { ...element, isChosen: false }))
        }
        if (showMoveToPoint) {
            setPointEditTarget(point)
            setPointsCleaned(pointsCleaned.map((element) =>
                element.id === point.id ? { ...element, color: 'green' } : { ...element, color: '#800080' }))
        }
    }

    const handleClick = (pointCleaned, pathCleaned) => {
        if (showEditPath) {
            setPointEditTarget(pointCleaned)
            let pathsCleaned_new = Array.from(pathsCleaned)
            let lines_chosen = []
            pathsCleaned_new.forEach((path_new) => {
                if (path_new.id === pathCleaned.id) {
                    path_new.points.forEach((point_new) => {
                        if (pathEditTarget_destination.length > 0) {
                            pathEditTarget_destination.forEach(element => {
                                if (element.target.path_name === path_new.name && element.target.name === point_new.name) {
                                    point_new.gridX = element.x
                                    point_new.gridY = element.y
                                }
                            });
                        }
                        if (point_new.id === pointCleaned.id) {
                            point_new.isChosen = true
                        } else {
                            point_new.isChosen = false
                        }
                    })
                    path_new.lines.forEach((line_new) => {
                        if (pathEditTarget_destination.length > 0) {
                            pathEditTarget_destination.forEach(element => {
                                if (element.target.path_name === path_new.name && line_new.points_names.includes(element.target.name)) {
                                    let ind = line_new.points_names.indexOf(element.target.name)
                                    if (ind === 0) {
                                        line_new.points = [element.x, position.mapInfo.gridHeight - element.y, line_new.points[2], line_new.points[3]]
                                    } else {
                                        line_new.points = [line_new.points[0], line_new.points[1], element.x, position.mapInfo.gridHeight - element.y]
                                    }
                                }
                            });
                        }
                        if (line_new.points_names.includes(pointCleaned.name)) {
                            line_new.isChosen = true
                            lines_chosen.push(line_new)
                        } else {
                            line_new.isChosen = false
                        }
                    })
                } else {
                    path_new.points.forEach((point_new) => {
                        point_new.isChosen = false
                        if (pathEditTarget_destination.length > 0) {
                            pathEditTarget_destination.forEach(element => {
                                if (element.target.path_name === path_new.name && element.target.name === point_new.name) {
                                    point_new.gridX = element.x
                                    point_new.gridY = element.y
                                }
                            });
                        }
                    })
                    path_new.lines.forEach((line_new) => {
                        line_new.isChosen = false
                        if (pathEditTarget_destination.length > 0) {
                            pathEditTarget_destination.forEach(element => {
                                if (element.target.path_name === path_new.name && line_new.points_names.includes(element.target.name)) {
                                    let ind = line_new.points_names.indexOf(element.target.name)
                                    if (ind === 0) {
                                        line_new.points = [element.x, position.mapInfo.gridHeight - element.y, line_new.points[2], line_new.points[3]]
                                    } else {
                                        line_new.points = [line_new.points[0], line_new.points[1], element.x, position.mapInfo.gridHeight - element.y]
                                    }
                                }
                            });
                        }
                    })
                }
            })
            setPathEditTarget(lines_chosen)
            setPathsCleaned(pathsCleaned_new)
        }
    }

    useEffect(() => {
        if (points && (points.length > 0)) {
            let points_cleaned = []
            points.forEach((element, index) => {
                points_cleaned.push({
                    id: index,
                    gridX: element.gridX,
                    gridY: element.gridY,
                    name: element.name,
                    isChosen: false,
                    color: '#800080',
                    type: element.type,
                    angle: element.angle
                })
            });
            setPointsCleaned(points_cleaned)
        }
        if (!points || points.length === 0) {
            setPointsCleaned(null)
        }

    }, [points, showEditPoint, showDeletePoint]);

    useEffect(() => {
        if (points && (points.length > 0)) {
            let points_cleaned = []
            points.forEach((element, index) => {
                points_cleaned.push({
                    id: index,
                    gridX: element.gridX,
                    gridY: element.gridY,
                    name: element.name,
                    isChosen: false,
                    color: '#800080',
                    type: element.type,
                    angle: element.angle
                })
            });
            setPointsCleaned(points_cleaned)
        }

    }, [showMoveToPoint]);

    useEffect(() => {
        if (paths) {
            let paths_cleaned = []
            paths.paths.forEach((path, inda) => {
                paths_cleaned[inda] = {
                    id: inda,
                    points: [],
                    lines: [],
                    name: path.name,
                    isChosen: false
                }
                if (path.points && path.points.length > 0) {
                    path.points.forEach((point, indb) => {
                        paths_cleaned[inda].points.push({
                            id: indb,
                            isChosen: false,
                            gridX: point.gridPosition.x,
                            gridY: point.gridPosition.y,
                            name: point.name,
                            path_name: path.name
                        })
                    })
                }
            })
            // console.log('paths_lines', paths_cleaned)
            paths.paths_lines.forEach((path_line, i) => {
                path_line.path.forEach((line, j) => {
                    if (paths_cleaned[i]) {
                        paths_cleaned[i].lines.push({
                            id: j,
                            points: [line.begin.x, line.begin.y, line.end.x, line.end.y],
                            points_names: [line.begin_name, line.end_name],
                            isChosen: false
                        })
                    }
                })
            })
            // console.log(paths_cleaned)
            setPathsCleaned(paths_cleaned)
        }
        if (!paths || paths.length === 0) {
            setPathsCleaned(null)
        }
    }, [paths, showEditPath, showDeletePath]);

    useEffect(() => {
        if (pointsCleaned && pointsCleaned.length > 0) {
            let points_cleaned_new = Array.from(pointsCleaned)
            points_cleaned_new.forEach((ele, ind) => {
                ele.isChosen = false
            })
            if (pointDeleteList.length > 0) {
                pointDeleteList.forEach(pointDel => {
                    points_cleaned_new.forEach((e) => {
                        if (pointDel.id === e.id) {
                            e.isChosen = true
                        }
                    })
                })
                setPointsCleaned(points_cleaned_new)
            }
        }
    }, [pointDeleteList]);

    useEffect(() => {
        if (pathsCleaned && pathsCleaned.length > 0) {
            let paths_cleaned_new = Array.from(pathsCleaned)
            paths_cleaned_new.forEach((ele, ind) => {
                ele.isChosen = false
            })
            if (pathDeleteList.length > 0) {
                pathDeleteList.forEach(pathDel => {
                    paths_cleaned_new.forEach((e) => {
                        if (pathDel.id === e.id) {
                            e.isChosen = true
                        }
                    })
                })
                setPathsCleaned(paths_cleaned_new)
            }
        }
    }, [pathDeleteList]);

    // useEffect(() => {
    //     if (isSelected) {
    //         // we need to attach transformer manually
    //         trRef.current.nodes([gpRef.current]);
    //         trRef.current.getLayer().batchDraw();
    //     }
    // }, [isSelected]);

    useEffect(() => {
        setX(0)
        setY(0)
    }, [showInitting])

    return (
        <React.Fragment>
            <Group
                draggable={showInitting}
                x={x}
                y={y}
                ref={gpRef}
                onClick={onSelect}
                onTap={onSelect}
                // onMouseDown={(e) => {
                //     console.log(gpRef.current)
                //     const pos = e.target.getStage().getPointerPosition();
                //     console.log('x: ', pos.x, 'y: ', pos.y)
                // }}
                onDragEnd={(e) => {
                    // console.log(gpRef.current)
                    // console.log(mapRef.current)
                    const current = {
                        x: - mapRef.current.attrs.image.width / 2,
                        y: mapRef.current.attrs.image.height / 2
                    }

                    let current_angle = Math.atan(Math.abs(current.y) / Math.abs(current.x))
                    if (current.y < 0 && current.x > 0) {
                        current_angle = -current_angle
                    } else if (current.y < 0 && current.x < 0) {
                        current_angle = current_angle - Math.PI
                    } else if (current.y > 0 && current.x < 0) {
                        current_angle = Math.PI - current_angle
                    }
                    let new_angle = current_angle - gpRef.current.attrs.rotation / 180.0 * Math.PI
                    if (new_angle > Math.PI) {
                        new_angle = new_angle - 2 * Math.PI
                    } else if (new_angle < -Math.PI) {
                        new_angle = 2 * Math.PI - new_angle
                    }
                    const dis = Math.sqrt(current.x * current.x + current.y * current.y)
                    const x_diff = (Math.cos(new_angle) - Math.cos(current_angle)) * dis
                    const y_diff = (Math.sin(new_angle) - Math.sin(current_angle)) * dis

                    mapDrag({
                        x: (gpRef.current.attrs.x - x_diff),
                        y: (gpRef.current.attrs.y + y_diff)
                    })
                    console.log({
                        x: (gpRef.current.attrs.x - x_diff),
                        y: (gpRef.current.attrs.y + y_diff)
                    })
                }}
                onTransformEnd={(e) => {
                    mapRotate(gpRef.current.attrs.rotation)
                    console.log(gpRef.current.attrs.rotation)
                }}
            >
                {map ?
                    <Image
                        image={map}
                        // stroke='red'
                        ref={mapRef}
                    // onMouseDown={console.log(mapRef.current)}
                    />
                    : <Text text={'Loading map...'} />}
                {map && showPointsList && pointsCleaned && (pointsCleaned.length > 0) && position && 
                    pointsCleaned.map((point, i) => (
                        (point.type === 2) && !point.isChosen &&
                        <React.Fragment key={`fragment_${i}`}>
                            <Circle
                                key={`point_${i}`}
                                x={point.gridX}
                                y={(position.mapInfo.gridHeight - point.gridY)}
                                radius={3}
                                fill={point.color}
                                onClick={() => {
                                    handleEditClick(point)
                                }}
                                onTap={() => {
                                    handleEditClick(point)
                                }}
                                onDblClick={() => {
                                    if (showDeletePoint) {
                                        setPointDeleteList(point)
                                    }
                                }}
                                onDblTap={() => {
                                    if (showDeletePoint) {
                                        setPointDeleteList(point)
                                    }
                                }}
                            />
                            <Text
                                key={`text_${i}`}
                                x={point.gridX + 5}
                                y={position.mapInfo.gridHeight - point.gridY - 5}
                                text={point.name}
                            />
                        </React.Fragment>
                    ))
                }
                {map && showVirtualTracks && pathsCleaned && (pathsCleaned.length > 0) && position &&
                    pathsCleaned.map((pathCleaned, i) => (
                        pathCleaned.points.map((pointCleaned, j) => (
                            (!pointCleaned.isChosen) && (!pathCleaned.isChosen) &&
                            <React.Fragment key={`fragment_${i}_${j}`}>
                                <Circle
                                    key={`path_${i}_point_${j}`}
                                    x={pointCleaned.gridX}
                                    y={position.mapInfo.gridHeight - pointCleaned.gridY}
                                    radius={3}
                                    fill={"red"}
                                    onClick={() => {
                                        handleClick(pointCleaned, pathCleaned)
                                    }}
                                    onTap={() => {
                                        handleClick(pointCleaned, pathCleaned)
                                    }}
                                    onDblClick={() => {
                                        handleDbClick(pathCleaned)
                                    }}
                                    onDblTap={() => {
                                        handleDbClick(pathCleaned)
                                    }}
                                />
                                <Text
                                    key={`path_${i}_text_${j}`}
                                    x={pointCleaned.gridX + 10}
                                    y={position.mapInfo.gridHeight - pointCleaned.gridY - 10}
                                    text={(pathCleaned.name + '_' + pointCleaned.name)}
                                />
                            </ React.Fragment>
                        ))
                    ))
                }
                {map && showVirtualTracks && pathsCleaned && (pathsCleaned.length > 0) &&
                    pathsCleaned.map((pathCleaned, i) => (
                        pathCleaned.lines.map((lineCleaned, k) => (
                            (!pathCleaned.isChosen) && (!lineCleaned.isChosen) &&
                            <Line
                                key={`path_${i}_line_${k}`}
                                points={lineCleaned.points}
                                stroke={"#20B2AA"}
                                onDblClick={() => {
                                    handleDbClick(pathCleaned)
                                }}
                                onDblTap={() => {
                                    handleDbClick(pathCleaned)
                                }}
                            />
                        ))
                    ))
                }
            </Group>
            {
                // map && isSelected && (
                //     <Transformer
                //         ref={trRef}
                //         centeredScaling={true}
                //         rotationSnaps={[0, 90, 180, 270]}
                //         resizeEnabled={false}
                //     />
                // )
            }
        </ React.Fragment>
    )
}

export default MapGp
