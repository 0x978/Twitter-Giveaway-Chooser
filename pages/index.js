import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import styles from "../styles/index.module.css"

export default function Index() {
    const router = useRouter()
    const [URL,setURL] = useState("")

    function goto(parsedID){
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
    <main className={styles.indexBody}>
        <form className={styles.inputForm}>
            <h3 className={styles.header}>Enter a tweet URL to get started!</h3>
            <label>Tweet URL: </label>
            <input type="text" id="URLinput" onChange={(e) => setURL(e.target.value)}/>
            <button onClick={verification}>Submit</button>
        </form>
    </main>
  )
}
