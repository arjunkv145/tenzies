import { useReducer, useEffect } from "react"

const initialState = {
    currentTime: { minutes: 0, seconds: 0 },
    bestTime: JSON.parse(localStorage.getItem("bestTime"))
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET INITIAL TIME':
            return { ...state, currentTime: { minutes: 0, seconds: 0 } }

        case 'UPDATE CURRENT TIME':
            return {
                ...state,
                currentTime: state.currentTime.seconds === 59 ? 
                    {
                        minutes: state.currentTime.minutes + 1,
                        seconds: 0 
                    } : 
                    {
                        ...state.currentTime, 
                        seconds: state.currentTime.seconds + 1 
                    }
            }

        case 'SET NEW BEST TIME':
            const  { currentTime, bestTime } = state
            if (
                ( bestTime === null ) || 
                ( currentTime.minutes < bestTime.minutes ) || 
                ( currentTime.minutes === bestTime.minutes && currentTime.seconds < bestTime.seconds )
            ) {
                localStorage.setItem("bestTime", JSON.stringify(currentTime))
                return { ...state, bestTime: state.currentTime }
            }
            return state

        case 'RESET BEST TIME':
            localStorage.setItem("bestTime", JSON.stringify(null))
            return { ...state, bestTime: null }

        default:
            return state
    }
}

export default function Duration({tenzies}) {
    
    const [time, dispatch] = useReducer(reducer, initialState)
    const { currentTime, bestTime } = time

    useEffect(() => {
        let interval
        if(tenzies) {
            clearInterval(interval)
            dispatch({ type: 'SET NEW BEST TIME' })
        }
        else {
            dispatch({ type: 'SET INITIAL TIME' })
            interval = setInterval(() => {
                dispatch({ type: 'UPDATE CURRENT TIME' })
            }, 1000)
        }
        
        return () => clearInterval(interval)
    }, [tenzies])
    
    return <>
        <p className="current-time">
            <span className="bold">
                Time&nbsp;
            </span>
            - {currentTime.minutes} : {currentTime.seconds}
        </p>
        <p className="best-time">
            <span className="bold">
                Best time&nbsp;
            </span>
            - {bestTime === null ? "none" : `${bestTime.minutes} : ${bestTime.seconds}`}
        </p>
        {
            tenzies
            &&
            <button 
            className="reset-best-time-btn"
            onClick={() => dispatch({ type: 'RESET BEST TIME' })}
            >
                Reset best time
            </button>
        }
    </>
}

//export default function Duration({tenzies}) {
//    
//    const initialTime = () => ({minutes: 0,seconds: 0})
//    const setLocalStorage = () => localStorage.setItem("bestTime", JSON.stringify(time))
//    const getLocalStorage = () => JSON.parse(localStorage.getItem("bestTime"))
//    
//    const updateBestTime = () => {
//        setLocalStorage()
//        setBestTime(time)
//    }
//    
//    const [time, setTime] = useState(() => initialTime())
//    const [bestTime, setBestTime] = useState(() => getLocalStorage())
//    
//    useEffect(() => {
//        let interval
//        if(tenzies) {
//            clearInterval(interval)
//            function compareBestTime() {
//                if(bestTime === null) updateBestTime()
//                else if(time.minutes < bestTime.minutes) updateBestTime()
//                else if(time.minutes === bestTime.minutes && time.seconds < bestTime.seconds) {
//                    updateBestTime()
//                }
//            }
//            compareBestTime()
//        }
//        else {
//            setTime(() => initialTime())
//            interval = setInterval(() => {
//                setTime(t => {
//                    return t.seconds === 59 ? 
//                        {minutes: t.minutes + 1,seconds: 0} : 
//                        {...t, seconds: t.seconds + 1}
//                })
//            }, 1000)
//        }
//        
//        return () => clearInterval(interval)
//    }, [tenzies])
//    
//    return <>
//        <p className="best-time">Best time - {bestTime === null ? "none" : `${bestTime.minutes} : ${bestTime.seconds}`} </p>
//        <p className="time"> Time - {time.minutes}:{time.seconds}</p>
//    </>
//}