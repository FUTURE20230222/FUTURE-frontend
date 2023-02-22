import React from 'react';
import { Arrow, Circle } from 'react-konva';

const Points = ({ showLasers, showMap, lasers, position, remainingPath, showInitting }) => {
    // Get arrow
    const getArrow = (position, len, showInitting) => {
        if (position) {
            if (!showInitting) {
                return [
                    position.gridPosition.x - len * Math.cos(position.angle / 180 * Math.PI),
                    position.mapInfo.gridHeight - (position.gridPosition.y - len * Math.sin(position.angle / 180 * Math.PI)),
                    position.gridPosition.x + len * Math.cos(position.angle / 180 * Math.PI),
                    position.mapInfo.gridHeight - (position.gridPosition.y + len * Math.sin(position.angle / 180 * Math.PI))
                ]
            } else {
                return [
                    position.mapInfo.gridWidth / 2 - len * Math.cos(position.angle / 180 * Math.PI),
                    len * Math.sin(position.angle / 180 * Math.PI) + position.mapInfo.gridHeight / 2,
                    len * Math.cos(position.angle / 180 * Math.PI) + position.mapInfo.gridWidth / 2,
                    -len * Math.sin(position.angle / 180 * Math.PI) + position.mapInfo.gridHeight / 2
                ]
            }

        }
        return
    }

    return (
        <React.Fragment>
            {showMap && remainingPath && (remainingPath.length > 0) && position &&
                remainingPath.map((remaining, i) => (
                    <Circle
                        key={'remaining_' + i}
                        x={remaining.x}
                        y={(position.mapInfo.gridHeight - remaining.y)}
                        radius={1.5}
                        fill="#32CD32"
                    />
                ))
            }
            {showMap && showLasers && lasers && (lasers.gridPhits.length > 0) && position &&
                lasers.gridPhits.map((laser, i) => (
                    <Circle
                        key={'laser_' + i}
                        x={!showInitting ? laser.x : (laser.x + position.mapInfo.gridWidth / 2 - position.gridPosition.x)}
                        y={!showInitting ? (position.mapInfo.gridHeight - laser.y) : (-laser.y + position.mapInfo.gridHeight / 2 + position.gridPosition.y)}
                        radius={1}
                        fill="red"

                    />
                ))
            }
            {showMap && position &&
                <Arrow
                    points={getArrow(position, 10, showInitting)}
                    pointerLength={12}
                    pointerWidth={8}
                    fill='#DC143C'
                />
            }
        </ React.Fragment>
    )
}

export default Points
