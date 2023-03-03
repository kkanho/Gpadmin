import React, { useEffect, useState } from 'react'
import { Button, Container, Dropdown } from 'react-bootstrap';
import pon from "/assets/frame0.png"
import kick from "/assets/frame1.png"

export default function MiniGame() {

    let audio = new Audio("/assets/KickSound.mp3")

    const [pic, setPic] = useState(pon)
    const [score, setScore] = useState(0)
    const [start, setStart] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [period, setPeriod] = useState(10)

    function kickFreerider() {

        let picture = pic

        if (picture === kick) {
            setPic(pon)
        } else {
            setPic(kick)
            audio.play()
            handleScore()
        }
    }

    function handleScore() {
        setScore(prevScore => prevScore + 1)
    }

    function handleStart() {
        //init
        setScore(0)
        setStart(true)
    }

    if (seconds === period) {
        alert("You have kicked the freerider for " + score + " times in " + period + " seconds!");
        //reset
        setStart(false)
        setSeconds(0)
    }

    //just for timer count down
    useEffect(() => {
        let interval = null
        if (start) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1)
            }, 1000)
        } else if (!start && seconds !== 0) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [start, seconds])

    //for space keydown
    // useEffect(() => {
    //     document.addEventListener('keydown', detectKeyDown, true)
    // }, [])

    // function detectKeyDown(e) {
    //     if(start && e.key === ' ') {
    //         kickFreerider()
    //     }
    // }

    return (
        <>
            {
                (start === false) ? (
                    <>
                        <Container className="d-flex justify-content-center" style={{ paddingTop: "130px", paddingBottom: "10px" }}>
                            <Button variant="danger" onClick={handleStart}>Start Now!</Button>
                        </Container>
                        <Container className="d-flex flex-column" style={{ paddingBottom: "70px" }}>
                            <div className="text-info" style={{ textAlign: "center" }}>You get score by kicking the freerider</div>
                            <Container className="d-flex justify-content-center align-items-center pt-1">
                                <div className="text-info mt-1">Keep clicking</div>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light">
                                        {period}s
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setPeriod(10)}>10s</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(15)}>15s</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(30)}>30s</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(45)}>45s</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setPeriod(60)}>60s</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Container>
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
                                onClick={kickFreerider}
                            />
                        </Container>
                    </>
                )
            }
        </>
    )
}
