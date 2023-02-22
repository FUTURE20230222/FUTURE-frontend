import React, { useState, useEffect, useRef, useContext } from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
//  custom comp
import { Stage, Layer, Rect, Transformer, Image, Text, Circle, Line } from 'react-konva';
import './style.css'
import NewMapComponent from '../../../components/common/NewMapComponent/NewMapComponent'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from 'reactstrap';
import { DataSocketContext, ActionSocketContext } from '../../../App'

const MapDashboard = () => {

    const cloud_url = 'http://rpass.roborn.com:8080';
    const localhost_url = 'http://localhost:8080';
    const test_url = 'http://192.168.8.104:8080';
    const base_url = test_url;

    const dataSocket = useContext(DataSocketContext);
    const actionSocket = useContext(ActionSocketContext);

    const robot = ['aobo1001', 'bw1001', 'gs1003']

    const fetchImage = async (rid, mapName) => {
        const res = await fetch(`${base_url}/api/getMap?rid=${rid}&mapName=${mapName}`, {
            method: "POST",
            headers: { uid: "admin" }
        });
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob)
        return objectUrl
    }

    const initialMapExample = [
        {
            rid: "bw1001",
            mapName: "roborn811",
            src: '',
            scale: 1,
            mapWidth: 0,
            mapHeight: 0,
            x: 0,
            y: 0,
            angle: 0,
            offsetX: 0,
            offsetY: 0
        },
        // {
        //     rid: "aobo1001",
        //     mapName: "roborn811",
        //     src: '',
        //     scale: 1,
        //     mapWidth: 0,
        //     mapHeight: 0,
        //     x: 0,
        //     y: 0,
        //     angle: 0,
        //     offsetX: 0,
        //     offsetY: 0
        // }
    ]

    const [mapsSrc, setMapsSrc] = useState(initialMapExample);
    const [singleMap, setSingleMap] = useState(false);
    let robots = [];

    // Get Db
    useEffect(() => {
        mapsSrc.map(async (elem) => {
            const body = {
                "collection": "robots",
                "conditions": {
                    "rid": elem.rid
                }
            };
            const result = await fetch(`${base_url}/db/get`, {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(body)
            });
            const data = await result.json();
            robots.push(data.data);
        });
    }, [])

    const changeMap = async (e) => {
        // Update Robot List - add map of not in list, set map to false map if in list
        if (mapsSrc.some((elem => elem.rid === e.target.id))) {
            setMapsSrc(mapsSrc.filter(robot => robot.rid !== e.target.id))
        } else {
            // Now is resetting the map, but in long run should store and retrieve status from local storage
            let newArray = [...mapsSrc]
            newArray.push({
                rid: e.target.id,
                mapName: "roborn811",
                scale: 1,
                x: 0,
                y: 0,
                angle: 0,
                src: fetchImage(e.target.id, "roborn811")
            })
            setMapsSrc(newArray)

            actionSocket.emit('message', {

            })

        };
    }

    const loadMap = async () => {
        // load all the maps and put into array
        let obj = [...mapsSrc];
        for (let i in mapsSrc) {
            const map = await fetchImage(mapsSrc[i].rid, "roborn811");
            obj[i] = { ...obj[i], src: map };
        };
        setMapsSrc(obj);
    }

    // Initial load map
    useEffect(() => {
        loadMap();
        // Change to Single map setting when displaying more than one map
        if (mapsSrc.length === 1) {
            setSingleMap(true)
        } else {
            setSingleMap(false)
        }
    }, [mapsSrc.length])

    return (<>
        <UncontrolledDropdown>
            <DropdownToggle caret>
                Map
            </DropdownToggle>
            <DropdownMenu>
                {robot.map(rid => <DropdownItem key={`robot-${rid}`} id={rid} onClick={changeMap}>{rid}</DropdownItem>)}
            </DropdownMenu>
        </UncontrolledDropdown>
        <NewMapComponent singleMap={singleMap} mapsSrc={mapsSrc} setMapsSrc={setMapsSrc} robotsData={robots} height={500} width={500}></NewMapComponent>
    </>
    );
};
export default injectIntl(MapDashboard);
