import React, { useRef, useState, useEffect } from 'react';
import { Group, Arrow, Circle, Line, Text } from 'react-konva';
import Points from './Points'
import MapGp from './MapGp';

const Gp = ({
    showMap, showLasers, showPointsList,
    showVirtualTracks, showInitting, map,
    isSelected, onSelect, lasers, position,
    points, paths, remainingPath, addLineTargets,
    mapDrag, mainGpDrag, set_done_target,
    mapRotate, pointRotate, refreshMap, mainGpMove,
    mapInfo, showAddPoint, showEditPoint, showDeletePoint, showMoveToPoint,
    showAddPath, showEditPath, showDeletePath, pointEditTarget, pathEditTarget,
    setPointEditTarget, setPathEditTarget, setPointEditTarget_destination,
    setPathEditTarget_destination, pathEditTarget_destination,
    pointDeleteList, setPointDeleteList, pathDeleteList, setPathDeleteList
}) => {
    const [drag, setDrag] = useState({ x: mainGpMove.x + mapInfo.width / 2, y: mainGpMove.y + mapInfo.height / 2 });
    const [editDrag, setEditDrag] = useState({ x: 0, y: 0 });
    const [editDrag_next, setEditDrag_next] = useState({ x: 0, y: 0 });
    const [editPathDragDisplay, setEditPathDragDisplay] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        // console.log(showAddPoint)
        setDrag({ x: (mapInfo.width / 2), y: (mapInfo.height / 2) })
        !showInitting && mainGpDrag({ x: editDrag.x, y: editDrag.y })
    }, [showAddPath, showAddPoint])

    useEffect(() => {
        setEditDrag_next(editDrag)
        setEditPathDragDisplay({ x: 0, y: 0 })
    }, [pointEditTarget])

    // Get arrow
    const getArrow = (angle) => {
        const result = [
            mainGpMove.x + mapInfo.width / 2,
            mainGpMove.y + mapInfo.height / 2,
            mainGpMove.x + mapInfo.width / 2 + 20 * Math.cos(angle / 180 * Math.PI),
            mainGpMove.y + mapInfo.height / 2 - 20 * Math.sin(angle / 180 * Math.PI)
        ]
        return result
    }

    // Get arrow in Edit mode
    const getArrowEdit = (position, angle) => {
        const result = [
            position.x,
            position.y,
            position.x + 20 * Math.cos(angle / 180 * Math.PI),
            position.y - 20 * Math.sin(angle / 180 * Math.PI)
        ]
        return result
    }

    // Get Line points
    const getLinePoints = (addLineTargets) => {
        let line_result = []
        for (const element of addLineTargets) {
            line_result.push(element.point.x)
            line_result.push((mapInfo.height - element.point.y))
        }
        return line_result
    }

    // Get Line last point
    const getLastPoint = (addLineTargets) => {
        let point_result = []
        if (isNaN(drag.x)) {
            return
        } else {
            point_result.push((addLineTargets[addLineTargets.length - 1].point.x))
            point_result.push((mapInfo.height - addLineTargets[addLineTargets.length - 1].point.y))
            point_result.push((drag.x))
            point_result.push((drag.y))
            return point_result
        }
    }

    return (
        <React.Fragment>
            <Group
                draggable={!showInitting && map}
                // onMouseDown={(e) => {
                //     const pos = e.target.getStage().getPointerPosition();
                //     // console.log('x: ', pos.x, 'y: ', pos.y)
                // }}
                onDragMove={(e) => {
                    setDrag({ x: (mainGpMove.x + mapInfo.width / 2 - e.target.x()), y: (mapInfo.height / 2 + mainGpMove.y - e.target.y()) })
                    setEditPathDragDisplay({ x: e.target.x() - editDrag_next.x, y: e.target.y() - editDrag_next.y })
                }}
                onDragEnd={(e) => {
                    !showInitting && !showAddPoint && !showAddPath && mainGpDrag({ x: e.target.x(), y: e.target.y() })
                    !showInitting && setEditDrag({ x: e.target.x(), y: e.target.y() })
                    // console.log('editDrag_next', editDrag_next)
                    // console.log('drag', e.target.x(), e.target.y())
                    if (pointEditTarget) {
                        setPointEditTarget_destination({ x: (pointEditTarget.gridX - (e.target.x() - editDrag_next.x)), y: (pointEditTarget.gridY - (-e.target.y() + editDrag_next.y)) })
                        setPathEditTarget_destination({ target: pointEditTarget, x: (pointEditTarget.gridX - (e.target.x() - editDrag_next.x)), y: (pointEditTarget.gridY - (-e.target.y() + editDrag_next.y)) })
                        // console.log({ x: +editDrag_next.x + pointEditTarget.gridX - e.target.x(), y: -editDrag_next.y + pointEditTarget.gridY + e.target.y() })
                    }
                    // console.log((mainGpMove.x + mapInfo.width / 2 - e.target.x(), mapInfo.height / 2 - mainGpMove.y + e.target.y()))
                    set_done_target({ x: mainGpMove.x + mapInfo.width / 2 - e.target.x(), y: mapInfo.height / 2 - mainGpMove.y + e.target.y() })
                    // console.log({ x: mainGpMove.x + mapInfo.width / 2 - e.target.x(), y: mapInfo.height / 2 - mainGpMove.y + e.target.y() })
                }}
            >
                {showMap && refreshMap &&
                    <MapGp
                        showInitting={showInitting}
                        isSelected={isSelected}
                        onSelect={onSelect}
                        mapDrag={mapDrag}
                        mapRotate={mapRotate}
                        map={map}
                        showPointsList={showPointsList}
                        showVirtualTracks={showVirtualTracks}
                        points={points}
                        paths={paths}
                        position={position}
                        pointEditTarget={pointEditTarget}
                        setPointEditTarget={setPointEditTarget}
                        setPathEditTarget={setPathEditTarget}
                        pathEditTarget_destination={pathEditTarget_destination}
                        pointDeleteList={pointDeleteList}
                        setPointDeleteList={setPointDeleteList}
                        pathDeleteList={pathDeleteList}
                        setPathDeleteList={setPathDeleteList}
                        showEditPoint={showEditPoint}
                        showDeletePoint={showDeletePoint}
                        showMoveToPoint={showMoveToPoint}
                        showEditPath={showEditPath}
                        showDeletePath={showDeletePath}
                    />}
                <Points
                    lasers={lasers}
                    position={position}
                    remainingPath={remainingPath}
                    showMap={showMap}
                    showLasers={showLasers}
                    showInitting={showInitting}
                />
                {showAddPath && (addLineTargets.length > 0) && mapInfo &&
                    addLineTargets.map((target, i) => (
                        <Circle
                            key={`addLine_point_${i}`}
                            x={(target.point.x)}
                            y={(mapInfo.height - target.point.y)}
                            radius={3}
                            fill={"red"}
                        />
                    ))
                }
                {showAddPath && (addLineTargets.length > 0) &&
                    <React.Fragment>
                        <Line
                            points={getLinePoints(addLineTargets)}
                            stroke={"#20B2AA"}
                        />
                        {
                            getLastPoint(addLineTargets) &&
                            <Line
                                points={getLastPoint(addLineTargets)}
                                stroke={"#20B2AA"}
                            />
                        }
                    </React.Fragment>
                }
            </Group>
            { showAddPoint && mapInfo &&
                <React.Fragment>
                    <Arrow
                        points={[mainGpMove.x + mapInfo.width / 2, mainGpMove.y + mapInfo.height / 2 - 10, mainGpMove.x + mapInfo.width / 2, mainGpMove.y + mapInfo.height / 2]}
                        pointerLength={20}
                        pointerWidth={16}
                        fill='black'
                    />
                    <Arrow
                        points={getArrow(pointRotate)}
                        pointerLength={10}
                        pointerWidth={6}
                        fill='#800080'
                        stroke='#800080'
                    />
                </ React.Fragment>
            }
            { showAddPath && mapInfo &&
                <React.Fragment>
                    <Arrow
                        points={[mainGpMove.x + mapInfo.width / 2, mainGpMove.y + mapInfo.height / 2 - 10, mainGpMove.x + mapInfo.width / 2, mainGpMove.y + mapInfo.height / 2]}
                        pointerLength={20}
                        pointerWidth={16}
                        fill='black'
                    />
                    <Arrow
                        points={getArrow(pointRotate)}
                        pointerLength={10}
                        pointerWidth={6}
                        fill='#800080'
                        stroke='#800080'
                    />
                </ React.Fragment>
            }
            { showEditPoint && pointEditTarget && position &&
                <React.Fragment>
                    <Circle
                        x={pointEditTarget.gridX + editDrag_next.x}
                        y={(position.mapInfo.gridHeight - pointEditTarget.gridY + editDrag_next.y)}
                        radius={3}
                        fill={"green"}
                    />
                    <Arrow
                        points={getArrowEdit({ x: pointEditTarget.gridX + editDrag_next.x, y: (position.mapInfo.gridHeight - pointEditTarget.gridY + editDrag_next.y) }, pointRotate)}
                        pointerLength={10}
                        pointerWidth={6}
                        fill='red'
                        stroke='red'
                    />
                    <Text
                        x={pointEditTarget.gridX + 5 + editDrag_next.x}
                        y={position.mapInfo.gridHeight - pointEditTarget.gridY - 5 + editDrag_next.y}
                        text={pointEditTarget.name}
                    />
                </React.Fragment>
            }
            { showEditPath && pathEditTarget && pointEditTarget && position &&
                <React.Fragment>
                    <Circle
                        x={pointEditTarget.gridX + editDrag_next.x}
                        y={(position.mapInfo.gridHeight - pointEditTarget.gridY + editDrag_next.y)}
                        radius={3}
                        fill={"green"}
                    />
                    <Text
                        x={pointEditTarget.gridX + 10 + editDrag_next.x}
                        y={position.mapInfo.gridHeight - pointEditTarget.gridY - 10 + editDrag_next.y}
                        text={pointEditTarget.path_name + '_' + pointEditTarget.name}
                    />
                </React.Fragment>
            }
            { showEditPath && (pathEditTarget.length === 1) && (pathEditTarget[0].points_names[0] === pointEditTarget.name) && pointEditTarget && position &&
                <Line
                    points={[pathEditTarget[0].points[0] + editDrag_next.x, pathEditTarget[0].points[1] + editDrag_next.y, pathEditTarget[0].points[2] + editPathDragDisplay.x + editDrag_next.x, pathEditTarget[0].points[3] + editPathDragDisplay.y + editDrag_next.y]}
                    stroke={"#20B2AA"}
                />
            }
            { showEditPath && (pathEditTarget.length === 1) && (pathEditTarget[0].points_names[1] === pointEditTarget.name) && pointEditTarget && position &&
                <Line
                    points={[pathEditTarget[0].points[0] + editPathDragDisplay.x + editDrag_next.x, pathEditTarget[0].points[1] + editPathDragDisplay.y + editDrag_next.y, pathEditTarget[0].points[2] + editDrag_next.x, pathEditTarget[0].points[3] + editDrag_next.y]}
                    stroke={"#20B2AA"}
                />
            }
            { showEditPath && (pathEditTarget.length === 2) && pointEditTarget && position &&
                <React.Fragment>
                    <Line
                        points={[pathEditTarget[1].points[0] + editDrag_next.x, pathEditTarget[1].points[1] + editDrag_next.y, pathEditTarget[1].points[2] + editPathDragDisplay.x + editDrag_next.x, pathEditTarget[1].points[3] + editPathDragDisplay.y + editDrag_next.y]}
                        stroke={"#20B2AA"}
                    />
                    <Line
                        points={[pathEditTarget[0].points[0] + editPathDragDisplay.x + editDrag_next.x, pathEditTarget[0].points[1] + editPathDragDisplay.y + editDrag_next.y, pathEditTarget[0].points[2] + editDrag_next.x, pathEditTarget[0].points[3] + editDrag_next.y]}
                        stroke={"#20B2AA"}
                    />
                </React.Fragment>
            }
        </React.Fragment>

    )
}

// Button.defaultProps = {
//   color: 'steelblue',
// }

// Button.propTypes = {
//   text: PropTypes.string,
//   color: PropTypes.string,
//   onClick: PropTypes.func,
// }

export default Gp
