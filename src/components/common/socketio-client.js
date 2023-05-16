import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { playWithCallback } from '../../helpers/RobornSpeechRecognition/index';
import { useHistory } from 'react-router-dom'
// content
import bigWasterAudio from '../../assets/audio/bigwastersound'


const socket = io('ws://172.18.0.81:8080/server'); // Replace with your server URL

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

const Call_page_and_audio = ({ myCarouselRef }) => {
  const history = useHistory();
  console.log('Connecting to')
  socket.on('message', (message) => {
    const sound = new Audio(bigWasterAudio.bigwasterQ1)
    sound.play()
    // playWithCallback(sound)
    history.push('/app/'+ message)
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