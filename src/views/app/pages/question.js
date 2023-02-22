import React, { useEffect, useState } from "react"
import { Button } from "reactstrap"
import fetchWithTimeoutAndHandling from "../../../components/common/fetch"
import questionAudio from "../../../assets/audio/questionsound"
import tick from '../../../assets/image/tick.png';
import cross from '../../../assets/image/cross.png';

const ProgressBar = ({ progress }) => {
    return <>
        <div style={{ position: 'relative', height: '15px', marginTop: '80px', left: '5%' }}>
            <div style={{ height: '100%', width: '90%', backgroundColor: '#DEDBD3', position: "absolute" }}></div>
            <div style={{ height: '100%', width: `${progress * 0.9}%`, backgroundColor: '#73DE4D', position: 'absolute' }}></div>
        </div>
    </>
}
const Question = () => {
    const [question, setQuestion] = useState({})
    const [questionList, setQuestionList] = useState({})
    const [questionIndex, setQuestionIndex] = useState(0)
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("")
    const [answer, setAnswer] = useState({ answerOption: undefined, isCorrect: undefined, hasAnswered: false })
    const [showFinish, setShowFinish] = useState(false);
    const [hasAnsweredCounter, setHasAnsweredCounter] = useState(1);
    const [showTick, setShowTick] = useState(false);
    const [showCross, setShowCross] = useState(false);
    const [questionRemain, setQuestionRemain] = useState([]);
    
    if (questionRemain.length==0 && hasAnsweredCounter==1){
        for (let i=1; i<questionList?.length;i++){
        questionRemain.push(i);
    }}
    
    useEffect(() => {
        if (question.choices) {
            console.log(question.choices)
        }
    }, [question])

    const loadCategory = async () => {
        const result = await fetchWithTimeoutAndHandling('http://api.roborn.com:9090/api/questions/getCategory')
        if (result.status) {
            setCategories(result.msg)
        }
    }
    useEffect(() => {
        console.log(answer)
    }, [answer])

    useEffect(() => {
        const getQuestionByCategory = async (category) => {
            console.log(category)
            const result = await fetchWithTimeoutAndHandling(`http://api.roborn.com:9090/api/questions/getQuestionByCategory/${category}`)
            console.log(result)
            console.log(result.status)
            if (result && result.status) {
                return result.questionList
            } else {
                console.error("Error geting question")
                return []
            }
        }
        if (selectedCategory) {
            console.log(selectedCategory)
            getQuestionByCategory(selectedCategory).then(result => setQuestionList(result))
        }
    }, [selectedCategory])

    const answerQuestion = async (selectedAnswer) => {
        // Summit answer to server
        if (answer.hasAnswered) {
            return;
        }
        const response = await fetchWithTimeoutAndHandling('http://api.roborn.com:9090/api/questions/answerQuestion', 8000, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: questionList[questionIndex].question,
                answer: selectedAnswer,
                userId: '30624700'
            })
        })
        if (response?.status && response.msg === "correct") {
            console.log('correct')
            new Audio(questionAudio.ansCorrect).play()
            setAnswer({ isCorrect: true, answerOption: selectedAnswer, hasAnswered: true })
            setShowTick(true)
        } else if (response?.status && response.msg === "wrong") {
            console.log('wrong')
            new Audio(questionAudio.ansWrong).play()
            setAnswer({ isCorrect: false, answerOption: selectedAnswer, hasAnswered: true })
            setShowCross(true)
        }
    }

    const nextQuestion = () => {
        setAnswer({ answerOption: undefined, isCorrect: undefined, hasAnswered: false })
        setShowTick(false)
        setShowCross(false)
        setHasAnsweredCounter(pre => (pre + 1))        
        // Prevent error before finish page is done
        /*if (questionIndex + 1 !== questionList?.length){
            setQuestionIndex(pre => pre + 1);
        }*/
        
        // Check if show "Finish"
        if (hasAnsweredCounter%questionList?.length == 0) {
            console.log("answered all questions");
            setShowFinish(true);            
        }
        else {
            setShowFinish(false);        
            // Pick random question            
            var qIndex = Math.floor(Math.random()*questionRemain.length)           
            setQuestionIndex(questionRemain[qIndex])            
            questionRemain.splice(qIndex,1)
        }
    }    

    return (<>
        <div style={{ position: 'absolute', width: '100%', height: "calc(100vh - 100px)", backgroundColor: '#FFFCF2' }}>
            {Array.isArray(categories) && categories.length === 0 && <Button onClick={() => loadCategory()} style={{ position: 'absolute', top: '50%', left: '50%', width: '500px', transform: 'translate(-50%,-50%)', fontSize: '80px' }}>Challenge Future!</Button>}
            {Array.isArray(categories) && categories.length >= 1 && !selectedCategory && <> <div style={{ fontSize: '50px', textAlign: 'center' }}>Choose a category</div>
                {categories.map((category, index) => { return <Button key={'category-' + index} style={{ backgroundColor: "#F9F8F6", color: 'black', fontSize: '40px', width: '300px', height: '150px' }} onClick={() => setSelectedCategory(category)}>{category}</Button> })}
            </>}
            {showFinish ? (
                <div style= {{fontSize: '130px', position: 'absolute', left: '33%', top: '200px', textAlign: 'center', color: 'MediumSeaGreen'}}>Finish !</div>
            ):(selectedCategory && questionList.length > 0 && 
                <>
                    {/* <ProgressBar progress={questionIndex / questionList.length * 100} /> */}
                    <div style={{ fontSize: '30px', position: 'absolute', left: '50%', top: '10px', transform: 'translate(-50%)', width: '80%', textAlign: 'center' }}>{questionList[questionIndex].question}</div>
                    {questionList[questionIndex].answers && <>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: 'calc(100vh - 300px)', fontSize: '30px' }}>
                            <div style={{ display: "flex", justifyContent: 'space-evenly', height: '15%' }}>
                                <Button style={{ borderRadius: '10px', color: 'black', fontSize: '25px', minHeight: '130px', width: '30%', backgroundColor: answer.answerOption === "A" ? (answer.isCorrect ? 'green' : 'red') : '#FABF68' }} onClick={() => answerQuestion("A")}>{questionList[questionIndex].answers[0]}</Button>
                                <Button style={{ borderRadius: '10px', color: 'black', fontSize: '25px', minHeight: '130px', width: '30%', backgroundColor: answer.answerOption === "B" ? (answer.isCorrect ? 'green' : 'red') : '#FABF68' }} onClick={() => answerQuestion("B")}>{questionList[questionIndex].answers[1]}</Button>
                            </div>
                            {
                                questionList[questionIndex].answers[2] &&(
                                    <div style={{ display: "flex", justifyContent: 'space-evenly', height: '15%' }}>
                                    <Button style={{ borderRadius: '10px', color: 'black', fontSize: '25px', minHeight: '130px', width: '30%', backgroundColor: answer.answerOption === "C" ? (answer.isCorrect ? 'green' : 'red') : '#FABF68' }} onClick={() => answerQuestion("C")}>{questionList[questionIndex].answers[2]}</Button>
                                    <Button style={{ borderRadius: '10px', color: 'black', fontSize: '25px', minHeight: '130px', width: '30%', backgroundColor: answer.answerOption === "D" ? (answer.isCorrect ? 'green' : 'red') : '#FABF68' }} onClick={() => answerQuestion("D")}>{questionList[questionIndex].answers[3]}</Button>
                                </div>
                                )
                            }
                       
                        </div></>}
                </>
            )}
            {showTick?(<img style={{position: 'absolute', top:'300px', left:'55%', width:'320px',textAlign: 'center'}} src={tick} />):(<div></div>)}
            {showCross?(<img style={{position: 'absolute', top:'300px', left:'50%', width:'320px',textAlign: 'center'}} src={cross} />):(<div></div>)}           
            {answer.hasAnswered && <Button onClick={() => nextQuestion()} style={{ backgroundColor: '#DEBEAE', position: 'absolute', left: '50%', top:'80%', fontSize: '24px', transform: 'translate(-50%,-50%)', width: '300px', borderRadius: '10px', color: 'black' }}>Next Question</Button>}
        </div>
    </>
    )
}

export default Question