import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react';
import { Button as ReactButton } from 'reactstrap'

const Button = ({ primary, text, onClick, outline }) => {
  return (
    <ReactButton
      type="button"
      onClick={onClick}
      color={`${primary ? 'primary' : 'secondary'}`}
      outline={outline}
    >
      {text}
    </ReactButton>
  )
}

const Buttons = ({
  showMap, onShowMap, robotType,
  showLasers, onShowLasers,
  showPointsList, onShowPointsList,
  showVirtualTracks, onShowVirtualTracks, onCancelAction,
  showInitting, onShowInitting, onCancelInitting,
  showAddPoint, showEditPoint, showDeletePoint,
  showAddPath, showEditPath, showDeletePath,
  onAddPoint, onEditPoint, onDeletPoint, onAddPath,
  onEditPath, onDeletPath, onDoneAddPoint, onDoneAddLine,
  onDoneEditPoint, setPointRotate, lineAddPoint, removeAddPoint, verifyLine,
  pointDeleteList, undoPointDeleteList, onDoneDeletePoint, onDoneEditPath,
  pathDeleteList, undoPathDeleteList, onDoneDeletePath, onAddCurrentPoint,
  showMoveToPoint, onMoveToPoint, onDoneMoveToPoint
}) => {
  const [ptName, setPtName] = useState('')
  const [pathName, setPathName] = useState('')
  const [pathPtNum, setPathPtNum] = useState(0)
  const [ptAngle, setPtAngle] = useState(0)

  useEffect(() => {
    if (showAddPoint || showEditPoint || showDeletePoint || showAddPath || showEditPath || showDeletePath || showPointsList || showVirtualTracks) {
      setPathPtNum(0)
    }
  }, [showAddPoint, showEditPoint, showDeletePoint, showAddPath, showEditPath, showDeletePath, showPointsList, showVirtualTracks])

  useEffect(() => {
    if (!showAddPoint) {
      setPtName('')
      setPtAngle(0)
      setPointRotate(0)
    }
    if (!showAddPath) {
      setPathName('')
      setPtAngle(0)
      setPointRotate(0)
    }

  }, [showAddPoint, showEditPoint, showDeletePoint, showAddPath, showEditPath, showDeletePath])

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button
          text={showMap ? 'Close' : 'Map'}
          onClick={onShowMap}
          primary={true}
          outline={showMap ? true : false}
        />
        {showMap && <Button
          text={showInitting ? 'Finish' : 'Init Pose'}
          onClick={onShowInitting}
          primary={true}
          outline={showInitting ? true : false}
        />}
        {showInitting && showMap && <Button
          text={'Cancel'}
          onClick={onCancelInitting}
        />}
        {showMap && <Button
          text={showLasers ? 'Lasers' : 'Lasers'}
          onClick={onShowLasers}
          primary={true}
          outline={showLasers ? true : false}
        />}
        {robotType === 'aobo' && showMap && <Button
          text={showPointsList ? 'Points' : 'Points'}
          onClick={onShowPointsList}
          primary={true}
          outline={showPointsList ? true : false}
        />}
        {robotType === 'aobo' && showMap && <Button
          text={showVirtualTracks ? 'Paths' : 'Paths'}
          onClick={onShowVirtualTracks}
          primary={true}
          outline={showVirtualTracks ? true : false}
        />}
        {robotType === 'aobo' && showMap && <Button
          color={'black'}
          text={'Stop AGV'}
          onClick={onCancelAction}
          primary={true}
          outline={false}

        />}
      </div>
      <div>
        {!showInitting && showMap && showPointsList && <Button
          text={'Add Point'}
          style={showAddPoint ? 'groove' : 'none'}
          onClick={onAddPoint}
          outline={showAddPoint ? true : false}
        />}
        {showAddPoint && <Button
          text={'Add Current'}
          onClick={() => {
            if (ptName === '') {
              alert('Please enter the name of the point!')
              return
            }
            onAddCurrentPoint(ptName)
          }}
        />}
        {showAddPoint && <Button
          primary={true}
          text={'Done'}
          onClick={() => {
            if (ptName === '') {
              alert('Please enter the name of the point!')
              return
            }
            onDoneAddPoint(ptName, ptAngle > 180 ? (ptAngle - 360) : ptAngle)
          }}
        />}
        {!showInitting && showMap && showPointsList && <Button
          text={'Edit Point'}
          style={showEditPoint ? 'groove' : 'none'}
          onClick={onEditPoint}
          outline={showEditPoint ? true : false}
        />}
        {showEditPoint && <Button
          primary={true}
          text={'Done'}
          onClick={() => {
            onDoneEditPoint(ptName, ptAngle > 180 ? (ptAngle - 360) : ptAngle)
          }}
        />}
        {!showInitting && showMap && showPointsList && <Button
          text={'Delete Point'}
          style={showDeletePoint ? 'groove' : 'none'}
          onClick={onDeletPoint}
          outline={showDeletePoint ? true : false}
        />}
        {(pointDeleteList.length > 0) && showDeletePoint && <Button
          text={'Undo'}
          onClick={undoPointDeleteList}
          primary={true}
        />}
        {showDeletePoint && <Button
          text={'Done'}
          onClick={onDoneDeletePoint}
          primary={true}
        />}
        {!showInitting && showMap && showPointsList && <Button
          text={'Move to Point'}
          style={showMoveToPoint ? 'groove' : 'none'}
          onClick={onMoveToPoint}
        />}
        {showMoveToPoint && <Button
          text={'Go'}
          onClick={onDoneMoveToPoint}
        />}
        {!showInitting && showMap && showVirtualTracks && <Button
          text={'Add Path'}
          style={showAddPath ? 'groove' : 'none'}
          onClick={onAddPath}
          outline={showAddPath ? true : false}
        />}
        {showAddPath && <Button
          primary={true}
          text={'Done'}
          onClick={() => {
            if (pathName === '') {
              alert('Please enter the name of the path!')
              return
            }
            onDoneAddLine(pathName)
          }}
        />}
        {!showInitting && showMap && showVirtualTracks && <Button
          text={'Edit Path'}
          style={showEditPath ? 'groove' : 'none'}
          onClick={onEditPath}
          outline={showEditPath ? true : false}
        />}
        {showEditPath && <Button
          primary={true}
          text={'Done'}
          onClick={() => {
            onDoneEditPath()
          }}
        />}
        {!showInitting && showMap && showVirtualTracks && <Button
          text={'Delete Path'}
          style={showDeletePath ? 'groove' : 'none'}
          onClick={onDeletPath}
          outline={showDeletePath ? true : false}
        />}
        {(pathDeleteList.length > 0) && showDeletePath && <Button
          primary={true}
          text={'Undo'}
          onClick={undoPathDeleteList}
        />}
        {showDeletePath && <Button
          primary={true}
          text={'Done'}
          onClick={onDoneDeletePath}
        />}
        {showAddPoint &&
          <div>
            <div>
              Name of the point
            </div>
            <input
              value={ptName}
              style={{ width: "120px", marginBottom: "5px" }}
              onChange={(e) => {
                setPtName(e.target.value)
              }}
            />
            Set Angle
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              defaultValue="0"
              onChange={(e) => {
                let angle = parseFloat(e.target.value)
                setPtAngle(angle);
                if (angle > 180) {
                  setPointRotate(angle - 360);
                } else {
                  setPointRotate(angle);
                }
              }}
            />
            {ptAngle}
          </div>
        }
        {showEditPoint &&
          <div>
            <input
              value={ptName}
              placeholder="New name of the point"
              onChange={(e) => {
                setPtName(e.target.value)
              }}
            />
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              defaultValue="0"
              onChange={(e) => {
                let angle = parseFloat(e.target.value)
                setPtAngle(angle);
                if (angle > 180) {
                  setPointRotate(angle - 360);
                } else {
                  setPointRotate(angle);
                }
              }}
            />
            {`New angle: ${ptAngle}`}
          </div>
        }
        {showAddPath &&
          <div>
            <div>
              Name of the path
            </div>
            <input
              value={pathName}
              style={{ marginBottom: "5px" }}
              onChange={(e) => {
                setPathName(e.target.value)
              }}
            />
            Set Angle
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              defaultValue="0"
              onChange={(e) => {
                let angle = parseFloat(e.target.value)
                setPtAngle(angle);
                if (angle > 180) {
                  setPointRotate(angle - 360);
                } else {
                  setPointRotate(angle);
                }
              }}
            />
            {ptAngle}
            <ReactButton
              onClick={async () => {
                const verifyResult = await verifyLine()
                if (verifyResult) {
                  console.log(ptAngle)
                  lineAddPoint(pathPtNum,ptAngle)
                  setPathPtNum(pathPtNum + 1)
                } else {
                  alert('Path is not safe!')
                }
              }}
            >
              Next point
            </ReactButton>
            {showAddPath && (pathPtNum > 0) &&
              <ReactButton
                primary={true}
                onClick={() => {
                  removeAddPoint(pathPtNum - 1)
                  setPathPtNum(pathPtNum - 1)
                }}
              >
                Undo
            </ReactButton>
            }
          </div>
        }
      </div>
    </ React.Fragment>
  )
}

Button.defaultProps = {
  color: 'steelblue',
}

Button.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
}

export default Buttons
