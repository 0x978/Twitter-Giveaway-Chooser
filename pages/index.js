import { useRouter } from "next/router";
import {useEffect, useState} from "react";

export default function Home() {
    const router = useRouter()
    const [id,setID] = useState("")

    function goto(e){
        console.log(id)
        e.preventDefault();
        router.push({
            pathname: "/testAPIPage",
            query:{
                id: id
            }
        })
    }
  return (
    <main>
        <h1>Enter a tweet ID</h1>
        <form>
            <input onChange={(e) => setID(e.target.value)} type="text" id="IDinput"/>
            <button onClick={goto}>Submit</button>
        </form>
    </main>
  )
}
