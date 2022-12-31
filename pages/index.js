import { useRouter } from "next/router";
import {useState} from "react";
import styles from "../styles/index.module.css"

export default function Index() {
    const router = useRouter()
    const [URL,setURL] = useState("")
    const [winnerNum,setWinnerNum] = useState(0)
    const [loading,setLoading] = useState(false)

    function goto(parsedID,requirement){
        setLoading(true)
        router.push({
            pathname: "/displayWinner",
            query:{
                id: parsedID,
                requirement:requirement,
                numOfWinners:winnerNum
            }
        })
    }

    function parseURL(requirement){
        let parsedURL = URL.split("/status/")[1]
        goto(parsedURL,requirement)
    }

    function verification(e,requirement){
        e.preventDefault();
        if(URL.length=== 0){
            alert("Please Enter a URL")
        }
        else if(!URL.match(`(/twitter.com/)`)){
            alert("This is not a valid URL")
        }
        else if(winnerNum === 0){
            alert("Please enter a number of winners.")
        }
        else if(winnerNum > 10 || winnerNum < 0 || !Number.isInteger(winnerNum)){
            alert("Not a valid number of winners.")
        }
        else{
            parseURL(requirement)
        }
    }

  return (
      !loading ?
          <main className={styles.indexBody}>
              <form className={styles.inputForm}>
                  <h3 className={styles.header}>Enter a tweet URL to get started</h3>
                  <label className={styles.text}>Tweet URL: </label>
                  <input type="text" className={styles.URLInput} onChange={(e) => setURL(e.target.value)}/>

                  <h3>Enter the number of winners (maximum 10):</h3>
                  <input type="text" className={styles.winnerInput} onChange={(e) => setWinnerNum(Number.parseInt(e.target.value))}/>

                  <h3>select a winner from:</h3>
                  <button className={styles.likedButton} onClick={(e) => verification(e,"liked")}>Liked users</button>
                  <button className={styles.rtButton} onClick={(e) => verification(e,"retweeted")}>Retweeting users</button>
              </form>
          </main>
          :
          <main className={styles.indexBody}>
              <div className={styles.loadingDiv}>
                  <h1>
                      Selecting a winner, please wait...
                  </h1>
              </div>
          </main>
  )
}
