import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap';
import pon from "/assets/frame0.png"
import kick from "/assets/frame1.png"

export default function MiniGame() {

    const [pic, setPic] = useState(pon)
    const [score, setScore] = useState(0)
    const [start, setStart] = useState(false)
    const [seconds, setSeconds] = useState(0);

    function changePic(){
        let value = pic

        if (value === kick) {
            setPic(pon)
        } else {
            setPic(kick)
            handleScore()
        }
    }

    function handleScore(){
        setScore(prevScore => prevScore + 1)
    }

    function handleStart(){
        //init
        setScore(0)
        setStart(true)
    }

    if (seconds === 10){
        alert("You scored " + score + "!");
        //reset
        setStart(false)
        setSeconds(0)
    }

    useEffect(() => {
        let interval = null
        if(start){
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1)
            }, 1000)
        }else if (!start && seconds !== 0){
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [start, seconds])


    return (
        <>
            {
                (start === false)? (
                    <>
                        <Container className="d-flex justify-content-center" style={{paddingTop: "100px", paddingBottom: "10px"}}>
                            <Button variant="danger" onClick={handleStart}>Start Now!</Button>
                        </Container>
                        <Container className="d-flex flex-column" style={{paddingBottom: "100px"}}>
                            <div className="text-info" style={{ textAlign: "center"}}>You get score by kicking the freerider</div>
                            <div className="text-info" style={{ textAlign: "center"}}>Keep clicking (10s)</div>
                        </Container>
                    </>
                ) : (
                    <>
                        <Container className="d-flex justify-content-space-between">
                            <h1>Your Score: {score}</h1>
                        </Container>
                        <Container className="d-flex justify-content-center">
                            <img 
                                src={pic} 
                                onClick={() => {
                                    changePic()
                                    }
                                }
                            />
                        </Container>
                    </>
                )
            }
        </>
    )
}
