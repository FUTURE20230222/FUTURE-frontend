import React, { useState, useEffect, useContext } from 'react';
import { injectIntl } from 'react-intl';
import { Label, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
//  custom comp
import { Stage, Layer, Image, Text } from 'react-konva';
import MovementController from '../../../components/common/MovementController/MovementController'
import { DataSocketContext, ActionSocketContext } from '../../../App'
const CreateMap = () => {
    const dataSocket = useContext(DataSocketContext);
    const actionSocket = useContext(ActionSocketContext);
    const [modal, setModal] = useState(true);
    const [load, setLoad] = useState(false);
    const [confirmName, setConfirmName] = useState(false);
    const [rid, setRid] = useState();
    const [map, setMap] = useState();
    const [robotList, setRobotList] = useState([]);
    const [failLoad, setFailLoad] = useState(false);
    let imageSrc;

    const cloud_url = 'http://rpass.roborn.com:18080'
    const test_url = 'http://192.168.8.104:8080';


    useEffect(() => {
        const getRobotList = async () => {
            const fetchWithTimeout = async (resource, options) => {
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
            try {
                const list = await fetchWithTimeout(`${test_url}/getRobot`, { timeout: 2000 })
                const listRes = await list.json()
                // console.log(listRes.robot)
                setRobotList(listRes.robot)
                setLoad(true)
            } catch (err) {
                // Demo code for testing
                // setRobotList(['aobo1001', 'gs1003', 'bw1001'])
                // setLoad(true)

                // Logic for fail loading
                setFailLoad(true)
            }
        }
        // Get robot list 
        getRobotList()
    }, [])

    // Fetch map
    useEffect(() => {
        if (!rid) {
            return;
        }
        actionSocket.emit('message', 'getRealTimeMap')
        dataSocket.on('message', (data) => {
            if (data.request === 'getRealTimeMap') {
                imageSrc = data.src
            }
        })
        const map_img = new window.Image();
        map_img.src = imageSrc
        map_img.onload = () => {
            setMap(map_img)
        }
    }, [rid])

    const saveMap = (mapName) => {
        if (!mapName) {
            alert('Please input valid name!')
            return;
        }
        actionSocket.emit('message', {
            request: 'saveMap',
            rid: rid,
            params: {
                mapName: mapName
            },
            body: {}
        })
        setConfirmName(false)
    }

    const selectRobot = (rid) => {
        setRid(rid);
        setModal(false);
        actionSocket.emit('message', {
            "rid": "bw1001",
            "request": "createMap",
            "params": {},
            "body": {}
        })
    }

    return (<>
        <Modal isOpen={modal}>
            {!load && <>
                <ModalHeader>Loading robots</ModalHeader>
                <ModalBody>
                    {!failLoad && <Label>Please wait...</Label>}
                    {failLoad && <Label>Sorry, failed to load robots.</Label>}
                </ModalBody>
                {failLoad &&
                    <Button color="primary" style={{ margin: '10px 15px' }} onClick={() => { setModal(false); setLoad(true); }}>Cancel</Button>
                }
            </>}
            {load && <>
                <ModalHeader>Select Robot</ModalHeader>
                <ModalBody>
                    {robotList.map(elem => {
                        return <Button key={`robot-${elem}`}
                            color="primary"
                            style={{ width: '100%' }}
                            outline
                            onClick={() => selectRobot(elem)}>{elem}
                        </Button>
                    })}
                </ModalBody>
            </>
            }
        </Modal>
        <Modal isOpen={confirmName}>
            <ModalHeader>Create Map</ModalHeader>
            <ModalBody>
                <Label>Please name the map</Label>
                <Input type="text" id="mapName" />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={() => saveMap(document.querySelector('#mapName')?.value)}>Confirm</Button>
                <Button color="secondary" onClick={() => setConfirmName(false)}>Cancel</Button>
            </ModalFooter>
        </Modal>
        {load && !failLoad && <>
            <h4>This is create map page. You are mapping for robot {rid}.</h4>
            <Stage width={100} height={100}>
                <Layer>
                    {map ? <Image image={map} /> : <Text text="Loading map..." />}
                </Layer>
            </Stage>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <MovementController actionSocket={actionSocket} rid={rid} />
                <Button color="primary" style={{ height: '40px', marginRight: '200px' }} onClick={() => setConfirmName(true)}>Save Map</Button>
            </div>
        </>}
        {load && failLoad && <>
            <h4>Please check robot connection.</h4>
        </>}
    </>
    );
};
export default injectIntl(CreateMap);
