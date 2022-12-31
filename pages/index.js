import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import styles from "../styles/index.module.css"

export default function Index() {
    const router = useRouter()
    const [URL,setURL] = useState("")
    const [loading,setLoading] = useState(false)

    function goto(parsedID){
        setLoading(true)
        router.push({
            pathname: "/displayWinner",
            query:{
                id: parsedID
            }
        })
    }

    function parseURL(){
        let parsedURL = URL.split("/status/")[1]
        goto(parsedURL)
    }

    function verification(e){
        e.preventDefault();
        if(URL.length=== 0){
            alert("Please Enter a URL")
        }
        else if(!URL.match(`(/twitter.com/)`)){
            alert("This is not a valid URL")
        }
        else{
            parseURL()
        }
    }

  return (
      !loading ?
          <main className={styles.indexBody}>
              <form className={styles.inputForm}>
                  <h3 className={styles.header}>Enter a tweet URL to get started!</h3>
                  <label className={styles.text}>Tweet URL: </label>
                  <input type="text" className={styles.URLInput} onChange={(e) => setURL(e.target.value)}/>

                  <h3>select a winner from:</h3>
                  <button className={styles.likedButton} onClick={verification}>Liked users</button>
                  <button className={styles.rtButton} onClick={verification}>Retweeting users</button>
                  <button className={styles.repliedButton} onClick={verification}>Replied users</button>
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
