import React, { useState, useRef, useEffect, createRef, useContext } from 'react';
import { Stage, Layer, Tag, Group, Text, Label as KonvaLabel, Image } from 'react-konva';
import { Input, Button, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import MapImage from '../patrol-components/MapImage'
import PositionAndLaser from '../patrol-components/PositionAndLaser'
import './NewMapComponent.css'
import PointAndPath from '../patrol-components/PointAndPath'
import PopUpController from '../PopUpController/PopUpController'
import { DataSocketContext, ActionSocketContext } from '../../../App'
import zoomInIcon from './buttonImage/zoom-In.png'
import zoomOutIcon from './buttonImage/zoom-out.png'
import clockwise from './buttonImage/clockwise.png'
import anticlockwise from './buttonImage/anticlock.png'

//  custom comp

const showSlider = ["Add New Point", "Add Path"]

const MapMultiRobot = ({ mapsSrc, robotsData, setMapsSrc, singleMap }) => {

    const layerButtons = [
        { name: "Rotate clockwise", text: "\e091", src: clockwise },
        { name: "Rotate anticlockwise", src: anticlockwise },
        { name: "Zoom in", src: zoomInIcon },
        { name: "Zoom out", src: zoomOutIcon }]
    const [divHeight, setHeight] = useState(700);
    const [divWidth, setWidth] = useState(100);
    const [selectedId, selectLayer] = useState(null);
    const [groupRefs, setGroupRefs] = useState([]);
    const [modal, setModal] = useState(false);
    const [pointPathState, setPointPathState] = useState(null)
    const [positionIndicator, setPositionIndicator] = useState(null)
    const [newPath, setNewPath] = useState(null)
    const [robotsRealTimeData, setRobotsRealTimeData] = useState([])
    const [pointList, setPointList] = useState([])
    const [pathList, setPathList] = useState([])
    const buttonList = [
        { Point: ["Add Current Position", "Add New Point", "Edit Point", "Delete Point", "Navigate to Point"] },
        { Path: ["Add Path", "Edit Path", "Delete Path", "Navigate Path"] },
    ]
    const dataSocket = useContext(DataSocketContext);
    const actionSocket = useContext(ActionSocketContext);
    const stageRef = useRef(null);
    const textRef = useRef(null);
    const toggle = () => setModal(!modal)
    const [buttonArray, setButtonArray] = useState();


    const simple_line_icons = new FontFace('simple-line-icons',
        // pass the url to the file in CSS url() notation
        'url(https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.0/fonts/Simple-Line-Icons.woff2)');

    document.fonts.add(simple_line_icons); // add it to the document's FontFaceSet

    simple_line_icons.load().then(() => {
        // we're good to use it
        console.log('text loaded', textRef.current)
        textRef.current.text("\e013")
        console.log('text', textRef.current.text())
        // ctx.fillStyle = 'green';
        textRef.current.fontFamily('simple-line-icons');
        textRef.current.draw()
    }).catch(console.error);

    useEffect(() => {
        const newButtonArray = [];
        for (let i in layerButtons) {
            const button_img = new window.Image(30, 30);
            button_img.src = layerButtons[i].src
            newButtonArray[i] = button_img
        }
        setButtonArray(newButtonArray)
    }, [])
    useEffect(() => {
        actionSocket.emit('message', {
            "rid": "bw1001",
            "request": "getMapList",
            "params": {},
            "body": {}
        })
        actionSocket.on('message', (data) => {
            if (data.request === 'getMapList') {
                console.log(data)
            }
        })
    }, [])

    // Fetch location, but location should be passed automatically from server 
    // This should be removed after the implementation
    useEffect(() => {
        actionSocket.emit('message', {
            "rid": "bw1001",
            "request": "init",
            "params": {
                "mapName": "roborn811"
            },
            "body": {}
        })
    }, [])

    const fetchPath = () => {
        actionSocket.emit('message', {
            "rid": "bw1001",
            "request": "getPathList",
            "params": {
                "mapName": "roborn811"
            },
            "body": {}
        })
    }

    const fetchPoint = () => {
        actionSocket.emit('message', {
            "rid": "bw1001",
            "request": "getPointList",
            "params": {
                "mapName": "roborn811"
            },
            "body": {}
        })
    }

    // Fetch pathList, info can be packed and emit by one socket call
    // Should be updated after the implementation
    useEffect(() => {
        fetchPath()
        dataSocket.on('message', (data) => {
            if (data.request === 'getPathList') {
                let newArray = pathList.filter((elem) => elem.rid !== data.rid)
                newArray.push({ data: data.data, rid: data.rid })
                setPathList(newArray)
            }
        })
    }, [])

    useEffect(() => {
        dataSocket.on('message', (data) => {
            if (data.request === 'getPosition') {
                const update = [...robotsRealTimeData]
                if (update.find((elem) => elem.rid !== data.rid) !== undefined) {
                    update.filter((elem) => elem.rid !== data.rid)
                }
                update.push(data);
                setRobotsRealTimeData(update);
            }
        })
    }, [])

    useEffect(() => {
        // add or remove refs
        setGroupRefs(groupRefs => (Array(mapsSrc.length).fill().map((_, i) => groupRefs[i] || createRef())))
        // Auto select for only one map
        if (mapsSrc.length === 1) {
            selectLayer(mapsSrc[0].rid);
        }
    }, [mapsSrc.length])

    useEffect(() => {
        if (stageRef.current) {
            setWidth(document.querySelector('.konvajs').offsetWidth);
            setHeight(document.querySelector('.konvajs').offsetHeight);
        }
    }, [document.querySelector('.konvajs')?.offsetWidth, document.querySelector('.konvajs')?.offsetHeight, window.innerHeight, window.innerWidth]);

    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty && mapsSrc.length !== 1) {
            selectLayer(null);
        }
    };

    const handleLayerChange = (e) => {
        console.log(e.target.id())
        if (!selectedId) {
            return
        }
        let newSrc = [...mapsSrc];
        const i = newSrc.findIndex(elem => elem.rid === selectedId)
        if (e.target.id() === "Rotate clockwise" || e.target.id() === "Rotate anticlockwise") {
            newSrc[i].angle = e.target.id() === "Rotate clockwise" ? mapsSrc[i].angle + 10 : mapsSrc[i].angle - 10
        }
        if (e.target.id() === "Zoom in" || e.target.id() === "Zoom out") {
            newSrc[i].scale = e.target.id() === "Zoom out" ? mapsSrc[i].scale * 0.95 : mapsSrc[i].scale / 0.95
        }
        setMapsSrc(newSrc);
    }

    const changeScale = (e, i) => {
        let newSrc = [...mapsSrc];
        newSrc[i].scale = e.evt.deltaY > 0 ? mapsSrc[i].scale * 0.95 : mapsSrc[i].scale / 0.95
        setMapsSrc(newSrc);
    }

    const onload = () => {
        groupRefs.forEach((elem, i) => {
            if (elem.current !== null) {
                let newSrc = [...mapsSrc];
                newSrc[i].offsetX = elem.current?.children[0].getWidth() / 2
                newSrc[i].offsetY = elem.current?.children[0].getHeight() / 2
                setMapsSrc(newSrc);
            }
        })
    }

    const handlePointPathAction = (e) => {
        if (!selectedId) {
            alert('Please select a map')
            return;
        }
        setPointPathState(e.target.id)
        switch (e.target.id) {
            case "Add Current Position":
                console.log('handle add current')
                setModal(true)
                break;
            case "Add New Point":
                console.log('handle add new point')
                setPositionIndicator({
                    x: groupRefs[0].current.children[0].getWidth() / 2,
                    y: groupRefs[0].current.children[0].getHeight() / 2,
                    angle: 0
                })
                break;
            case "Edit Point":
                break;
            case "Delete Point":
                break;
            case "Add Path":
                console.log('handle add path')
                setPositionIndicator({
                    x: groupRefs[0].current.children[0].getWidth() / 2,
                    y: groupRefs[0].current.children[0].getHeight() / 2,
                    angle: 0
                });
                setNewPath([]);
                break;
            case "Edit Path":
                break;
            case "Delete Path":
                setModal(true);
                break;
            case "Navigate Path":
                setModal(true);
                break;
            default:
                console.log('no match', e.target.id);
        }
    }

    const onNextPoint = () => {
        console.log(positionIndicator);
        let tempPath = [...newPath];
        tempPath.push(positionIndicator);
        setNewPath(tempPath);
    }

    const onDonePoint = () => {
        switch (pointPathState) {
            case "Add Current Position":
                console.log('Finish adding current point');
                break;
            case "Add New Point":
                toggle()
                console.log('Finish setting point');
                break;
            case "Edit Point":
                //
                break;
            case "Add Path":
                toggle()
                break;
            default:
                console.log('no match', pointPathState);
        }
    }

    useEffect(() => {
        stageRef.current.draw();
    }, [mapsSrc])

    const confirmPointName = () => {
        const pointName = document.querySelector('#pointName').value

        // Input check
        if (pointName !== '') {
            setModal(false)
            sendRequest(pointName)
        } else {
            alert('Please insert a valid name.')
        }
        console.log(pointPathState);

        if (pointPathState === "Add Current Position") {
            // Get current position
            let currentPoint = (robotsRealTimeData.filter(elem => elem.rid === selectedId))
            actionSocket.emit('message', {
                request: "add point",
                rid: selectedId,
                params: {
                    angle: currentPoint.angle,
                    gridX: currentPoint.gridPosition.x,
                    gridY: currentPoint.gridPosition.y,
                    name: pointName,
                }
            })
            console.log(currentPoint);
            console.log(selectedId);
        }
    }

    const confirmPathName = () => {
        const pathName = document.querySelector('#pathName').value
        if (pathName !== '') {
            setModal(false);
            console.log(newPath);
            sendRequest(pathName);
        } else {
            alert('Please insert a valid name.');
        }
    }

    const sendRequest = (targetName) => {
        // Create body
        let points, lines, paths, body;
        points = newPath.map((elem, i) => {
            return {
                actions: [],
                angle: elem.angle,
                gridPosition: {
                    x: elem.x,
                    y: elem.y
                },
                defaultAngle: false,
                name: i.toString()
            }
        });

        lines = newPath.reduce((acc, elem, i) => {
            if (i > 0) {
                acc.push({
                    begin: (i - 1).toString(),
                    end: i.toString(),
                    name: `${i - 1}_${i}`,
                    radius: 0
                })
            };
            return acc;
        }, [])

        paths = [{
            name: targetName,
            lines: lines.map(elem => elem.name)
        }]

        body = { points: points, lines: lines, paths: paths, name: targetName, mapName: "roborn811" }

        console.log(body)

        actionSocket.emit('message', {
            "rid": selectedId,
            "request": "addPathList",
            "params": {},
            "body": body,
        })

        dataSocket.on('message', data => {
            if (data.request === "addPathList" && data.status === "successed") {
                fetchPath();
                setNewPath([]);
                setPointPathState(null);
            }
        })

    }

    const deletePoint = (e) => {
        setModal(false)
        actionSocket.emit('message', {
            rid: selectedId,
            request: "deletePointList",
            params: {
                mapName: "roborn811",
                pointName: e.target.textContent
            },
            body: {}
        })
        dataSocket.on('message', data => {
            if (data.request === "deletePoint" && data.status === "successed") {
                fetchPoint();
                setPointPathState(null);
            }
        })
    }

    const deletePath = (e) => {
        setModal(false)
        actionSocket.emit('message', {
            rid: selectedId,
            request: "deletePathList",
            params: {
                mapName: "roborn811",
                group_name: e.target.textContent,
                pathName: e.target.textContent
            },
            body: {}
        })
        dataSocket.on('message', data => {
            if (data.request === "deletePathList" && data.status === "successed") {
                fetchPath();
                setPointPathState(null);
            }
        })
    }

    const moveToPath = (e) => {
        setModal(false);
        actionSocket.emit('message', {
            rid: selectedId,
            request: "navigatePath",
            params: {
                mapName: "roborn811",
                pathName: e.target.textContent,
            },
            body: {}
        })
        dataSocket.on('message', data => {
            if (data.request === "navigatePath" && data.status === "successed") {
                console.log('Move to successed')
                setPointPathState(null);
            }
        })
    }

    return (
        <>
            <div>
                {/* <div className={'icon'}>e005</div> */}
                <div className='re-render' style={{ marginTop: '10px' }}>
                    <Stage
                        ref={stageRef}
                        className="konvajs"
                        width={divWidth}
                        height={divHeight}
                        style={{ background: 'white' }}
                        onMouseDown={checkDeselect}
                        onTouchStart={checkDeselect}
                    >
                        {mapsSrc.map((obj, i) => {
                            return <Layer
                                key={`map-` + i}
                                onClick={() => selectLayer(obj.rid)}
                                onTap={() => selectLayer(obj.rid)}
                            >
                                <Group
                                    id={obj.rid}
                                    ref={groupRefs[i]}
                                    draggable
                                    onWheel={(e) => changeScale(e, i)}
                                    x={obj.offsetX}
                                    y={obj.offsetY}
                                    scaleX={obj.scale}
                                    scaleY={obj.scale}
                                    offsetX={obj.offsetX}
                                    offsetY={obj.offsetY}
                                    rotation={obj.angle}
                                    onDragEnd={(e) => {
                                        let src = [...mapsSrc]
                                        src[i].x = e.target.attrs.x
                                        src[i].y = e.target.attrs.y
                                        setMapsSrc(src)
                                    }}
                                >
                                    <MapImage
                                        imageSrc={obj.src}
                                        onload={onload}
                                        isSelected={singleMap ? true : obj.rid === selectedId}
                                        singleMap={singleMap}
                                    />
                                    <PositionAndLaser position={(robotsRealTimeData.filter(elem => elem.rid === obj.rid))[0]?.data} />
                                    <PointAndPath
                                        positionIndicator={positionIndicator}
                                        setPositionIndicator={setPositionIndicator}
                                        newPath={newPath}
                                        pathList={pathList ? pathList.find(elem => elem.rid === obj.rid)?.data : []}
                                        isSelected={singleMap ? true : obj.rid === selectedId} />
                                    {/* Below is offset indicator */}
                                    {/* <Rect
                                        fill={'red'}
                                        width={10}
                                        height={10}
                                        x={obj.offsetX}
                                        y={obj.offsetY}
                                    /> */}
                                </Group>
                            </Layer>
                        })}

                        <Layer>
                            {buttonArray?.length > 0 && layerButtons.map((elem, i) => {
                                return <React.Fragment key={`layerButtons-${i}`}>
                                    <KonvaLabel x={divWidth - 50} y={20 + i * 60} opacity={0.75}>
                                        {/* <Tag fill={"yellow"} lineJoin={'round'} shadowColor={"Red"} shadowBlur={10} shadowOpacity={0.5} /> */}
                                        <Image onMouseDown={handleLayerChange} onTouchStart={handleLayerChange} id={elem.name} image={buttonArray[i]} />
                                        {/* <Text onMouseDown={handleLayerChange} onTouchStart={handleLayerChange} width={"auto"} height={"auto"} className='simple-line-icons' id={elem.name} text={elem.text} fontFamily={"'simple-line-icons'"} fontSize={18} padding={5} fill={"black"} /> */}
                                    </KonvaLabel>
                                </React.Fragment>
                            })}
                            {/* <React.Fragment>
                                <KonvaLabel x={divWidth - 150} y={20 + 6 * 60} opacity={0.75}>
                                    <Tag fill={"yellow"} lineJoin={'round'} shadowColor={"Red"} shadowBlur={10} shadowOpacity={0.5} />
                                    <Text name={'simple-icon-user'} className={'simple-icon-user'} ref={textRef} onMouseDown={handleLayerChange} onTouchStart={handleLayerChange} width={"auto"} height={"auto"} id={'hello'} fontFamily={"'simple-line-icons'"} fontSize={18} padding={5} fill={"black"} />
                                </KonvaLabel>
                            </React.Fragment> */}
                        </Layer>
                    </Stage>
                    <div style={{ position: 'absolute', display: 'flex', justifyContent: 'space-between', top: '0px', left: '100px' }}>
                        {buttonList.map((elem, i) =>
                            <UncontrolledDropdown style={{ marginLeft: '10px' }} key={'dropDown' + i}>
                                <DropdownToggle caret>
                                    {(Object.keys(elem))[0]}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {elem[(Object.keys(elem))[0]].map((buttonSelection, j) =>
                                        <DropdownItem id={buttonSelection} onClick={handlePointPathAction} key={'dropDownItem' + i + '-' + j}>{buttonSelection}</DropdownItem>)}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        )}
                        {positionIndicator && showSlider.find(elem => elem === pointPathState) && <Input id='angleRotation' style={{ marginLeft: '10px', width: 'auto' }} type='range' min={0} max={360} defaultValue={positionIndicator?.angle ?? 0}
                            onChange={(e) => setPositionIndicator(positionIndicator => ({ ...positionIndicator, angle: parseInt(e.target.value) }))} />}
                        {pointPathState === "Add Path" && <Button style={{ marginLeft: '10px' }} type='primary' onClick={onNextPoint}>Next Point</Button>}
                        {pointPathState && pointPathState !== "Add Current Position" && pointPathState !== "Delete Path" && <Button style={{ marginLeft: '10px' }} type='primary' onClick={onDonePoint}>Done</Button>}
                    </div>
                </div>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>{pointPathState}</ModalHeader>
                    {(pointPathState === "Add Current Position" || pointPathState === "Add New Point") && <>
                        <ModalBody>
                            <Label>Point Name:</Label>
                            <Input type="text" id="pointName" placeholder="Please name the point" />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={confirmPointName}>Confirm</Button>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>}
                    {(pointPathState === "Delete Point") && <>
                        <ModalBody>
                            <Label>Choose a point to DELETE:</Label>
                            {pointList.length > 0 && (pointList.find(elem => elem.rid === selectedId).data).map(elem => {
                                return <Button key={`deletePoint-${elem.name}`} color="primary" style={{ width: '100%' }} outline onClick={deletePoint}>{elem.name}</Button>
                            })}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>
                    }
                    {(pointPathState === "Add Path") && <>
                        <ModalBody>
                            <Label>Path Name:</Label>
                            <Input type="text" id="pathName" placeholder="Please name the path" />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={confirmPathName}>Confirm</Button>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>}
                    {(pointPathState === "Delete Path") && <>
                        <ModalBody>
                            <Label>Choose a path to DELETE:</Label>
                            {pathList.length > 0 && (pathList.find(elem => elem.rid === selectedId).data).map(elem => {
                                return <Button key={`delete-${elem.name}`} color="primary" style={{ width: '100%' }} outline onClick={deletePath}>{elem.name}</Button>
                            })}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>
                    }
                    {(pointPathState === "Navigate Path") && <>
                        <ModalBody>
                            <Label>Choose a path to move to:</Label>
                            {pathList.length > 0 && (pathList.find(elem => elem.rid === selectedId).data).map(elem => {
                                return <Button key={`move-to-${elem.name}`} color="primary" style={{ width: '100%' }} outline onClick={moveToPath}>{elem.name}</Button>
                            })}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </>
                    }
                </Modal>
            </div>
            {/* <MovementController actionSocket={actionSocket} rid={selectedId} isButtonType={false} /> */}
            <PopUpController rid={selectedId} actionSocket={actionSocket} isButtonType={false} />

        </>
    );
};
export default MapMultiRobot;
