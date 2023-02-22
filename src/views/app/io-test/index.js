import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Container, Row, Col } from 'reactstrap';
import { io } from 'socket.io-client'

const IoTest = () => {

  const [actionSocket, setActionSocket] = useState();
  const [dataSocket, setDataSocket] = useState();
  const [robot, setRobot] = useState();

  const dataSocketUrl = "http://rpass.roborn.com:28080"
  const actionSocketUrl = "http://rpass.roborn.com:28081"

  const connectSocket = (e) => {
    e.preventDefault()
    if (e.target.name === 'action') {
      const uid = document.querySelector('#actionUid').value
      const password = document.querySelector('#actionPassword').value
      const actionSocketConnect = io(actionSocketUrl, {
        auth: {
          uid: uid,
          password: password
        }
      })
      setActionSocket(actionSocketConnect)
    }
    if (e.target.name === 'data') {

      const uid = document.querySelector('#dataUid').value
      const password = document.querySelector('#dataPassword').value
      const dataSocketConnect = io(dataSocketUrl, {
        auth: {
          uid: uid,
          password: password
        }
      })
      setDataSocket(dataSocketConnect)
    }
  }

  const emitAction = (e) => {
    e.preventDefault()
    let newMessage = JSON.parse(document.querySelector('#action-emit-message').value)
    actionSocket.emit('message', newMessage)
  }

  const emitData = (e) => {
    e.preventDefault()
    let newMessage = JSON.parse(document.querySelector('#action-emit-message').value)
    actionSocket.emit('message', newMessage)
  }

  useEffect(() => {
    if (actionSocket !== undefined) {
      actionSocket.on('message', (data) => {
        document.querySelector('#actionReceiveBox').innerHTML += JSON.stringify(data).substring(1, 200) + '...' + "<br />"
      })
    }
    if (dataSocket !== undefined) {
      dataSocket.on('message', (data) => {
        document.querySelector('#dataReceiveBox').innerHTML += JSON.stringify(data).substring(1, 200) + '...' + "<br />"
      })
    }
  }, [actionSocket, dataSocket]);

  useEffect(() => {
    document.querySelector('body').style.overflow = "hidden"
  },[])

  useEffect(() => {
    const getRobot = async() => {
      const result = await fetch('http://rpass.roborn.com:8080/getRobot')
      const lol = await result.json()
      // const lol = {gs1003: {datasocket: "blahblah", actionsocket: "blahblah"}}
      setRobot(lol.robot)
    }
    getRobot()
    const timer = setInterval(()=>{
      getRobot()
    },10000)
    return () => clearInterval(timer)
  },[])

  useEffect(() => {
   console.log(robot)
  },[robot])

  return (
    <>
      <Container style={{ margin: '5px', paddingLeft: '5px', paddingRight: '5px', maxWidth: 'inherit' }}>
        <h3>Robots Online: </h3>
        {robot && robot.map((elem,index)=>(
          <h3 key={index}>{elem}, {new Date().toLocaleTimeString()}</h3>))}
         <Row style={{ border: "2px dashed #c7c7c7" }}>
          <Col xs="2" style={{ border: "2px dashed #c7c7c7", padding: "10px", marginRight: "10px" }}>
            <Form>
              <h3>Uid:</h3>
              <Input id="actionUid" type='text' defaultValue={localStorage.getItem("actionUid")} onChange={() => {
                setTimeout(() => { localStorage.setItem('actionUid', document.querySelector('#actionUid').value) }, 1000)
              }} />
              <h3>Password:</h3>
              <Input id="actionPassword" type='text' defaultValue={localStorage.getItem("actionPassword")} onChange={() => {
                setTimeout(() => { localStorage.setItem('actionPassword', document.querySelector('#actionPassword').value) }, 1000)
              }} />
              {/* <h3>Rid:</h3>
              <Input id="actionRid" type='text' defaultValue={localStorage.getItem('actionRid')} onChange={() => {
                setTimeout(() => { localStorage.setItem('actionRid', document.querySelector('#actionRid').value) }, 1000)
              }} /> */}
              <Input type='submit' name="action" value="connect action" onClick={connectSocket} />
            </Form>
          </Col>
          {actionSocket &&
            <>
              <Col xs="3" style={{ border: "2px dashed #c7c7c7", padding: "10px", marginRight: "10px" }}>
                <h3>Action Socket Connected</h3>
                <Form>
                  <h3>Emit Message:</h3>
                  <Input id="action-emit-message" type='textarea' defaultValue={localStorage.getItem("action-emit-message")} onChange={() => {
                    setTimeout(() => { localStorage.setItem('action-emit-message', document.querySelector('#action-emit-message').value) }, 1000)
                  }}></Input>
                  <Input type='submit' name="emit" value="emit" onClick={emitAction} />
                </Form>
              </Col>
              <Col style={{ border: "2px dashed #c7c7c7", padding: "10px" }}>
                <h3>Received Action Message</h3>
                <div id="actionReceiveBox" style={{ maxHeight: window.innerHeight / 2 - 75 + "px", overflowX: 'scroll' }}></div>
              </Col>
            </>}
        </Row>
        <Row style={{ border: "2px dashed #c7c7c7" }}>
          <Col xs="2" id="data1" style={{ border: "2px dashed #c7c7c7", padding: "10px", marginRight: "10px" }}>
            <Form>
              <h3>Uid:</h3>
              <Input id="dataUid" type='text' defaultValue={localStorage.getItem("dataUid")} onChange={() => {
                setTimeout(() => { localStorage.setItem('dataUid', document.querySelector('#dataUid').value) }, 1000)
              }} />
              <h3>Password:</h3>
              <Input id="dataPassword" type='text' defaultValue={localStorage.getItem("dataPassword")} onChange={() => {
                setTimeout(() => { localStorage.setItem('dataPassword', document.querySelector('#dataPassword').value) }, 1000)
              }} />
              {/* <h3>Rid:</h3>
              <Input id="dataRid" type='text' defaultValue={localStorage.getItem('dataRid')} onChange={() => {
                setTimeout(() => { localStorage.setItem('dataRid', document.querySelector('#dataRid').value) }, 1000)
              }} /> */}
              <Input type='submit' name="data" value="connect data" onClick={connectSocket} />
            </Form>
          </Col>
          {dataSocket &&
            <>
              <Col xs="3" id="data2" style={{ border: "2px dashed #c7c7c7", padding: "10px", marginRight: "10px" }}>
                <h3>Data Socket Connected</h3>
                <Form>
                  <h3>Emit Message:</h3>
                  <Input id="data-emit-message" type='textarea' defaultValue={localStorage.getItem("data-emit-message")} onChange={() => {
                    setTimeout(() => { localStorage.setItem('data-emit-message', document.querySelector('#data-emit-message').value) }, 1000)
                  }}></Input>
                  <Input type='submit' name="emit" value="emit" onClick={emitData} />
                </Form>
              </Col>
              <Col style={{ border: "2px dashed #c7c7c7", padding: "10px" }}>
                <h3>Received Data Message</h3>
                <div id="dataReceiveBox" style={{ maxHeight: window.innerHeight / 2 - 75 + "px", overflowX: 'scroll' }}></div>
              </Col>
            </>}
        </Row>
      </Container>
    </>
  );
};
const mapStateToProps = ({ robots }) => {
  return {
    robots,
  };
};
export default connect(mapStateToProps)(IoTest);
