import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { playWithCallback } from '../../helpers/RobornSpeechRecognition/index';
import { loadFile } from '../../helpers/Utils'
import { useHistory } from 'react-router-dom'
import readXlsxFile from 'read-excel-file'
// content
import bigWasterAudio from '../../assets/audio/bigwastersound'


const socket = io('ws://localhost:8080/server'); // Replace with your server URL
// const server_message = socket.socket("/server")
socket.on('connect', () => {
  console.log('Connected to SocketIO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from SocketIO server');
});

function sendMessage(message) {
  socket.emit('messages', message);
}

const readExcel = async (blob, options) => {
  const file = await readXlsxFile(blob, options).then(({ rows, errors }) => {
      if (errors.length !== 0) {
          console.error('Failed to load file', errors)
      }
      return rows;
  })
  return file;
}
const glossaryMap = {
  "Key Words_zh-HK": "conditions1",
  "Key Words_zh-CN": "conditions2",
  "Key Words_en-US": "conditions3",
  "Image Name": "imageName",
  "Voice Name": "voiceName",
  "Video Name": "videoName",
}
// const response =  fetch('/assets/glossary.xlsx');
// const blob =  response.blob();
// console.log(__dirname);
// const excelData =  readExcel('/assets/glossary.xlsx', { map: glossaryMap })
// console.log(excelData) 

const Call_page_and_audio = ({ myCarouselRef }) => {
  const history = useHistory();
  console.log('Connecting to')
  socket.on('message', (message) => {
    // const elements = loadFile('assets/glossary.xlsx')
    // var elem = elements[0]
    // console.log(elem)
    // console.log(elements)

    // history.push(`/app/emptyPage/${elem.imageName}/${elem.voiceName}/${elem.videoName}`)
    history.push(`/app/emptyPage/Future 6.jpg/Section6 Have.mp3/undefined`)
    // const sound = new Audio(bigWasterAudio.bigwasterQ1)
    // sound.play()
    // playWithCallback(sound)
    // history.push('/app/'+ message)
    myCarouselRef.current.setStoreState({ currentSlide: 1 })
    });
    
}
// ReactDOM.render(
//   <React.StrictMode>
//     {/* Your app content here */}
//   </React.StrictMode>,
//   document.getElementById('root')
// );

export { socket, sendMessage, Call_page_and_audio };