import colors from './colors';
import bigWasterAudio from '../../assets/audio/bigwastersound'
import { playWithCallback } from './index';
import ParisAgreement from '../../assets/image/parisAgreement-new.mp3';
import fetchWithTimeoutAndHandling from '../../components/common/fetch';
const loadBaseUrl = async () => {
  try {
    const res = await fetch('/dynamicIP.json')
    const result = await res.json()
    return result
  } catch (err) {
    console.log(err)
    return {
      "host_url": "http://localhost:8080"
    }
  }
};
let base_url;
loadBaseUrl().then(result => base_url = result.host_url);

export default [
  // Relay control
  // {
  //   command: function cb(matchResult, history) {
  //     return fetchWithTimeoutAndHandling(`${base_url}/relay_ctrl/set_SW?id=0&status=1&timer=5`);
  //   },
  //   conditions: [/elevator up/,/up/,/上升/],
  // },
  // {
  //   command: function cb(matchResult, history) {
  //     return fetchWithTimeoutAndHandling(`${base_url}/relay_ctrl/set_SW?id=1&status=1&timer=5`);
  //   },
  //   conditions: [/elevator stop/,/stop/,/停/,/聽/,/stock/],
  // },
  // {
  //   command: function cb(matchResult, history) {
  //     return fetchWithTimeoutAndHandling(`${base_url}/relay_ctrl/set_SW?id=2&status=1&timer=5`);
  //   },
  //   conditions: [/elevator down/,/down/,/下降/],
  // },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/relay_ctrl/set_SW?id=3&status=1&timer=-1`);
    },
    conditions: [/humidifier on/, /humidifier/, /magnifier on/, /magnifier/, /打開噴霧/,/打开喷雾/,/打开喷.?/],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/relay_ctrl/set_SW?id=3&status=0&timer=0`);
    },
    conditions: [/humidifier off/, /humidifier/, /magnifier off/, /magnifier/,/關閉噴霧/,/关闭喷雾/,/关闭喷.?/],
  },
  // AGV control
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/stop`);
    },
    conditions: [/stop/, /stock/],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/rotate?direction=left`);
    },
    conditions: [/轉.?圈/, /turnaround/, /turn around/, /转.?圈/, /轉個.?/],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/rotate?direction=left`);
    },
    conditions: [/左轉/, /阻住/,/左转/],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/rotate?direction=right`);
    },
    conditions: [/右轉/, /又轉/,/右转/],
  },
  // camera control
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/camera_ctrl/ZoomIn`);
    },
    conditions: [/相機近.?啲/],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/camera_ctrl/ZoomOut`);
    },
    conditions: [/相幾遠啲/, /相機遠啲/],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/camera_ctrl/snapshot`);
    },
    conditions: [/幫我影相/],
  },

  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/movie_filming`, {
        method: 'get',
      });
    },
    conditions: [/拍片action/, /拍片 action/, /開始錄影/, /recording/, /calling/, /work order/,],
  },
  // video conferencing
  {
    command: function cb(matchResult, history) {
      window.location.href = 'http://meet.roborn.com/VC';
      return fetchWithTimeoutAndHandling('http://rpass.roborn.com:28082/call?request=call', {
        method: 'POST',
      });
    },
    conditions: [/打畀professor/, /打畀老師/],
  },
  // pc control
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(
        `${base_url}/OpenApp/Zoom?stat=on`
      );
    },
    conditions: [
      /開zoom/,
      /打開zoom/,
      /打開心/,
    ],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(
        `${base_url}/OpenApp/Zoom?stat=off`
      );
    },
    conditions: [
      /關閉Zoom/,
      /關Zoom/,
      /關閉數/,
    ],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(
        `${base_url}/casting_ctrl/casting?desktop=on`
      );
    },
    conditions: [
      /google search/,
      /project落電視/,
      /project絡電視/,
      /project去電視/,
      /project到電視/,
      /投影落電視/,
      /投影絡電視/,
      /投影去電視/,
      /投影到電視/,
      /投影幕電視/,
    ],
  }, {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(
        `${base_url}/casting_ctrl/casting?desktop=off`
      );
    },
    conditions: [/關閉投影/, /關帝投影/],
  },
  // pc control
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/Cast/PPT?status=on`);
    },
    conditions: [/開powerpoint/],
  },
  {
    command: function cb(matchResult, history) {
      return fetchWithTimeoutAndHandling(`${base_url}/Cast/PPT?status=off`);
    },
    conditions: [/關閉powerpoint/, /關帝powerpoint/],
  },
  // vaporizer
  // {
  //   command: function cb(matchResult, history) {
  //     return fetchWithTimeoutAndHandling(
  //       `${base_url}/relay_ctrl/set_SW?id=0&status=1&timer=0`
  //     );
  //   },
  //   conditions: [/打開噴煙/, / 打開緊煙/, /開啟賓醫/, /開啟噴煙/, /開啟婚宴/, /開始噴霧/, /打開噴霧/, /開始噴煙/, /Turn on automation/, /turn on automation/, /turn on the Miser/, /turn on the organizer/, /Turn on the go to my son/,
  //     /turn on.+automation/, /Turn on.+automation/, /turn on after my son/, /turn on atomizer/, /Turn on atomizer/, /Canon atomizer/, /China and atomizer/, /Turn on the app to Master/,
  //     /Turn on.+atomizer/, /Turn on .+my son/, /turn on .+my son/, /turn on.+measure/],
  // },
  // {
  //   command: function cb(matchResult, history) {
  //     return fetchWithTimeoutAndHandling(
  //       `${base_url}/relay_ctrl/set_SW?id=7&status=1&timer=0`
  //     );
  //   },
  //   conditions: [/打開香檳/, /打開香薰/],
  // },
  // {
  //   command: function cb(matchResult, history) {
  //     return fetchWithTimeoutAndHandling(
  //       `${base_url}/relay_ctrl/set_SW?id=7&status=0&timer=0`
  //     );
  //   },
  //   conditions: [/關閉香檳/, /關閉香薰/],
  // },
  // {
  //   command: function cb(matchResult, history) {
  //     return fetchWithTimeoutAndHandling(
  //       `${base_url}/relay_ctrl/set_SW?id=0&status=0&timer=0`
  //     );
  //   },
  //   conditions: [
  //     /停止噴煙/,
  //     /停止更衣/,
  //     /停止婚宴/,
  //     /關閉噴煙/,
  //     /關閉婚宴/,
  //     /關閉噴霧/,
  //     /Turn off automation/, /turn off automation/, /turn off the Miser/, /turn off the organizer/, /Turn off the go to my son/,
  //     /turn off.+automation/, /Turn off.+automation/, /turn off after my son/, /turn off atomizer/, /Turn off atomizer/, /Turn off the app to Master/,
  //     /Turn off.+atomizer/, /Turn off .+my son/, /turn off .+my son/, /turn off .+measure/
  //   ],
  // },
  // color changing
  {
    command: function cb(matchResult, history) {
      const color = matchResult[1];
      if (!colors[color]) {
        return { color: color, msg: 'color not found' };
      }
      const targetColor = colors[color].replace('#', '');
      const requestUrl = `${base_url}/LED_ctrl/setColor?color=${targetColor}&timer=0`;
      fetchWithTimeoutAndHandling(requestUrl);
      console.log(requestUrl);
    },
    conditions: [/[酸,傳,轉,專,磚,樽](.+色)/],
  },
  {
    command: function cb(matchResult, history) {
      history.push('app/detection');
      return fetchWithTimeoutAndHandling(
        `${base_url}/ai_activate?status=on`
      );
    },
    conditions: [
      /打開AI/,
      /打開ai/,
    ],
  },
  {
    command: function cb(matchResult, history) {
      window.location.href = 'http://localhost:3000/app'
      return fetchWithTimeoutAndHandling(
        `${base_url}/ai_activate?status=off`
      );
    },
    conditions: [
      /關閉AI/,
      /關閉ai/
    ],
  },
  {
    command: function cb(matchResult, history) {
      history.push('app/music');
      return fetchWithTimeoutAndHandling(
        `${base_url}/LED_ctrl/ColorFreq?status=on`
      );
    },
    conditions: [
      /打開鋼琴/,
    ],
  },
  {
    command: function cb(matchResult, history) {
      history.push('app/sensor');
    },
    conditions: [
      /打開sensor/, /light sensor/
    ],
  },
  {
    command: function cb(matchResult, history) {
      history.push('/');
      return fetchWithTimeoutAndHandling(
        `${base_url}/LED_ctrl/ColorFreq?status=off`
      );
    },
    conditions: [
      /關閉鋼琴/,
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      let user;
      const loadUsersData = localStorage.getItem('data')
      const loadToken = sessionStorage.getItem('token')
      const filterUser = JSON.parse(loadUsersData).filter((elem) => elem.token === loadToken)
      if (filterUser.length === 0) return;
      user = filterUser[0]
      const filterData = JSON.parse(loadUsersData).filter((elem) => elem.token !== user.token)
      const newData = [...filterData, { ...user, robotFace: 4 }]
      console.log(user)
      console.log('loadusersdata', loadUsersData)
      console.log(filterData, 'filter data')
      console.log(newData)
      localStorage.setItem('data', JSON.stringify(newData))
      history.push('/')
      audio.muted = true;
      audio.bigWasterGreet.play()
      setTimeout(() => {
        document.querySelector('body').style.backgroundColor = '#d8ebe0'
        document.querySelector('.NavBar').style.backgroundColor = '#b7cec2'
      }, 1000);
      // setTimeout(() => {  
      //   const backToStatic = [...filterData, { ...user, robotFace: 3 }]
      //   localStorage.setItem('data', JSON.stringify(backToStatic))
      //   history.push('/')
      // }, 5000);

    },
    conditions: [
      /搵大嘥鬼/, /big waster/, /big waiter/, /back waster/, /back waiter/, /back later/, /make way to/, /弘大嘥鬼/,/大.?鬼/,/big waste/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('air improvement')
      const sound = new Audio(bigWasterAudio.bigwasterQ1)
      playWithCallback(sound)
      history.push('/app/airImprovement')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /空氣質素.?改善/, /空氣質素.?改變/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('air further improvement')
      const sound = new Audio(bigWasterAudio.bigwasterQ2)
      playWithCallback(sound)
      history.push('/app/airQualityProblem')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /面對.+空氣質素.?問題/,
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('new blue print')
      const sound = new Audio(bigWasterAudio.bigwasterQ3)
      playWithCallback(sound)
      history.push('/app/newBlueprint')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /公佈.?新.?藍圖.?/, /風暴.?新.?藍圖.?/, /18號/, /風暴新南韓/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('tokyo paris')
      const sound = new Audio(bigWasterAudio.bigwasterQ4)
      playWithCallback(sound)
      history.push('/app/whyTokyoParis')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /東京.+巴黎/, /巴黎.+東京/, /包嚟.+東京/, /東京.+包嚟/, /東京巴黎/,/东京巴黎/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('Improve Air Quality')
      const sound = new Audio(bigWasterAudio.bigwasterQ5)
      playWithCallback(sound)
      history.push('/app/sixActions')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /藍圖(.+)提升(.+)?空氣.?質素/, /籃球.+提升(.+)?空氣.?質素/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('Green Transport')
      const sound = new Audio(bigWasterAudio.bigwasterQ5a)
      playWithCallback(sound)
      history.push('/app/greenTransport')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /綠色運輸/,/绿色运输/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('Liveable Environment')
      const sound = new Audio(bigWasterAudio.bigwasterQ5b)
      playWithCallback(sound)
      history.push('/app/liveableEnvironment')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /宜居環境/, /移居環境/, /而對環境/, /而居環境/, /而家環境/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('Comprehensive Emissions Reduction')
      const sound = new Audio(bigWasterAudio.bigwasterQ5c)
      playWithCallback(sound)
      history.push('/app/comprehensiveEmissionsReduction')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /全面減排/, /全面排減/,/全面减排/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('Clean Energy')
      const sound = new Audio(bigWasterAudio.bigwasterQ5d)
      playWithCallback(sound)
      history.push('/app/cleanEnergy')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /潔淨能源/, /節省能源/, /節約能源/, /設定能源/,/洁净能源/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('Scientifice Management')
      const sound = new Audio(bigWasterAudio.bigwasterQ5e)
      playWithCallback(sound)
      history.push('/app/scientificManagement')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /科學管理/, /科學館裡/, /科學館你/,/科学管理/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('Regional Collaboration')
      const sound = new Audio(bigWasterAudio.bigwasterQ5f)
      playWithCallback(sound)
      history.push('/app/regionalCollaboration')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /區域協同/, /區永結同/, /佢接同/, /區域不同/, /佢話貼圖/, /區域貼圖/, /區域結糖/, /區域閱讀/,/区域协同/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      console.log('more info')
      const sound = new Audio(bigWasterAudio.bigwasterQ5g)
      playWithCallback(sound)
      history.push('/app/wantToKnowMore')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /知多.+邊.?有/
    ],
  },
  {
    command: function cb(matchResult, history, myCarouselRef, audio) {
      audio.parisAgreement.play()
      history.push('/app/parisAgreement')
      myCarouselRef.current.setStoreState({ currentSlide: 1 })
    },
    conditions: [
      /巴黎協定/,/巴黎协定/
    ],
  },
  // {
  //   command: function cb(matchResult, history, myCarouselRef, audio) {
  //     playWithCallback(audio.demo1)
  //   },
  //   conditions: [/早晨/],
  // },
  // {
  //   command: function cb(matchResult, history, myCarouselRef, audio) {
  //     playWithCallback(audio.demo0)
  //   },
  //   conditions: [/morning/,/愛玲/,/安寧/,/魔力/],
  // },
  //
];
