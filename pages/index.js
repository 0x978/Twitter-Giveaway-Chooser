import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import styles from "../styles/index.module.css"

export default function Home() {
    const router = useRouter()
    const [URL,setURL] = useState("")

    function goto(parsedID){
        console.log(URL)
        router.push({
            pathname: "/testAPIPage",
            query:{
                id: parsedID
            }
        })
    }

    function parseURL(e){
        e.preventDefault();
        let parsedURL = URL.split("/status/")[1]
        goto(parsedURL)
    }

  return (
    <main className={styles.indexBody}>
        <form className={styles.inputForm}>
            <h3 className={styles.header}>Enter a tweet URL to get started!</h3>
            <input onChange={(e) => setURL(e.target.value)} type="text" id="IDinput"/>
            <button onClick={parseURL}>Submit</button>
        </form>
    </main>
  )
}
