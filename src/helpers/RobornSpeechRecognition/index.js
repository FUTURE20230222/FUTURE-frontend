import { useEffect, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import glossary from './glossary';
import { useHistory } from 'react-router-dom'
import newGlossary from './translate'
import askFutureGlossary from './askFuture'
import bigWasterGreet from '../../assets/image/bigwasterGreeting-new.mp3';
import ParisAgreement from '../../assets/image/parisAgreement-new.mp3';
import defaultSound from '../../assets/audio/default'
import bigWasterAudio from '../../assets/audio/bigwastersound'
import demoAudio from '../../assets/audio/demo'

const playWithCallback = (audioToPlay) => {
  const playPromise = audioToPlay.play();
  if (playPromise !== undefined) {
    playPromise
      .then(_ => {
        // Automatic playback started!
        // Show playing UI.
        console.log("audio played auto");
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
        console.log("Playback Error:", error);
        console.log("playback prevented");
      });
  }
}

export { playWithCallback }

export const useRobornSpeechRecognition = ({
  myCarouselRef,
  keyPhases = ['hello',"哈喽","你好"],
  language
}) => {
  const { transcript, resetTranscript } = useSpeechRecognition({});
  const [isFire, setFire] = useState(false);
  const [returnCarouselTimer, setReturnCaroueslTimer] = useState();
  const audio = {
    start: new Audio(defaultSound.bbsound),
    end: new Audio(defaultSound.bbsound_end_1),
    bigWasterError1: new Audio(bigWasterAudio.bigwasterError1),
    bigWasterError2: new Audio(bigWasterAudio.bigwasterError2),
    bigWasterError3: new Audio(bigWasterAudio.bigwasterError3),
    bigWasterGreet: new Audio(bigWasterGreet),
    parisAgreement: new Audio(ParisAgreement),
    demo0: new Audio(demoAudio.demo0),
    demo1: new Audio(demoAudio.demo1),
  }
  const history = useHistory();

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      return null;
    }
    SpeechRecognition.startListening({
      continuous: true,
      language: 'zh-HK',
    });
  }, []);

  useEffect(() => {
    SpeechRecognition.startListening({
      continuous: true,
      language: language,
    });
  }, [language])

  useEffect(() => {
    console.log(transcript);
    if (transcript == '') {
      return;
    }
    // CHANGES
    const containsKeyPhase = keyPhases.map((phrase) => {
      return transcript.toLowerCase().includes(phrase)
    })
    // const hasKeyPhase = transcript.toLowerCase().includes(keyPhases)
    const hasKeyPhase =  containsKeyPhase.some((b) => b === true);
    // CHANGED
    if (hasKeyPhase) {
      history.push('/app')
      console.log('listening');
      resetTranscript();
      setFire(true);
      myCarouselRef.current.setStoreState({ currentSlide: 0 });
      const loadUsersData = localStorage.getItem('data')
      const loadToken = sessionStorage.getItem('token')
      const filterUser = JSON.parse(loadUsersData).filter((elem) => elem.token === loadToken)
      if (filterUser.length > 0 && filterUser[0]?.robotFace === 3 || filterUser[0]?.robotFace === 4) {
        audio.bigWasterGreet.play()
      } else {
        const playPromise = audio.start.play();

        if (playPromise !== undefined) {
          playPromise
            .then(_ => {
              // Automatic playback started!
              // Show playing UI.
              console.log("audio played auto");
            })
            .catch(error => {
              // Auto-play was prevented
              // Show paused UI.
              console.log(error, 'error')
              console.log("playback prevented");
            });
        }

      }
      const timeoutKP = setTimeout(() => {
        console.log('timeout');
        if (!isFire) {
          audio.end.play()
        }
        setFire(false);
      }, 4000);
      return () => clearTimeout(timeoutKP);
    }
    if (isFire) {
      const timeoutIsFire = setTimeout(() => {
        console.log('emit/execute', transcript);
        executeCommand(transcript);
        setFire(false);
        if (returnCarouselTimer) {
          clearTimeout(returnCarouselTimer)
        }
        const timer = setTimeout(() => {
          // expo demo use
          myCarouselRef.current.setStoreState({ currentSlide: 0 })
        }, 60000)
        setReturnCaroueslTimer(timer)
        resetTranscript();
      }, 2000);
      return () => clearTimeout(timeoutIsFire);
    }
  }, [transcript]);

  const executeCommand = (transcript) => {
    let isMatch = false;
    console.log(glossary)
    for (const g of glossary) {
      for (const condition of g.conditions) {
        const matchResult = transcript.toLowerCase().match(condition)
        if (matchResult) {
          isMatch = true;
          console.log('match', matchResult);
          g.command(matchResult, history, myCarouselRef, audio);
        }
      }
    }
    newGlossary.then(result => {
      result.forEach(g => {
        for (const condition of g.conditions) {
          const matchResult = transcript.toLowerCase().match(condition)
          if (matchResult) {
            isMatch = true;
            console.log('match', matchResult);
            console.log(g.command)
            g.command(matchResult, history, myCarouselRef, audio);
          }
        }
      })
    })
    askFutureGlossary.then(result => {
      result.forEach(g => {
        switch (sessionStorage.getItem('lang')) {
          case 'zh-HK':
            for (const condition of g.conditions1) {
              const matchResult = transcript.toLowerCase().match(condition)
              if (matchResult) {
                isMatch = true;
                console.log('match', matchResult);
                g.command(matchResult, history, myCarouselRef, audio);
              }
            }
            break
          case 'cmn-Hans-CN':
            for (const condition of g.conditions2) {
              const matchResult = transcript.toLowerCase().match(condition)
              if (matchResult) {
                isMatch = true;
                console.log('match', matchResult);
                g.command(matchResult, history, myCarouselRef, audio);
              }
            }
            break
          case 'en-US':
            for (const condition of g.conditions3) {
              const matchResult = transcript.toLowerCase().match(condition)
              if (matchResult) {
                isMatch = true;
                console.log('match', matchResult);
                g.command(matchResult, history, myCarouselRef, audio);
              }
            }
            break
          default:
            break
        }

      })
    })

    const loadUsersData = localStorage.getItem('data')
    const loadToken = sessionStorage.getItem('token')
    const filterUser = JSON.parse(loadUsersData).filter((elem) => elem.token === loadToken)
    if (filterUser.length > 0 && filterUser[0]?.robotFace === 3 || filterUser[0]?.robotFace === 4) {
    } else {
      // audio.end.play()
    }
    if (!isMatch) {
      if (filterUser.length > 0 && filterUser[0]?.robotFace === 3 || filterUser[0]?.robotFace === 4) {
        const random = Math.random() * 3
        if (random < 1) playWithCallback(audio.bigWasterError1)
        else if (random >= 1 && random < 2) playWithCallback(audio.bigWasterError2)
        else if (random >= 2 && random <= 3) playWithCallback(audio.bigWasterError3)
      }
    }
  };

  return { transcript };
};