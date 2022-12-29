import styles from "../../styles/429.module.css"
import { useRouter } from "next/router";

export default function err429(props) {
    const router = useRouter()

    function handleClick(){
        router.push({
                pathname: "/",
            })
        }

    return(
        <main className={styles.main}>
        <div className={styles.messageDiv}>
            <h1 className={styles.text}>Error 429</h1>
            <h2 className={styles.text}>The twitter API is currently being rate limited, please try again later.</h2>
            <h3 className={styles.text}>The API can only handle ~75 requests per 15 minutes</h3>
            <button onClick={handleClick} className={styles.button}>Return to menu</button>
        </div>
        </main>
    )
}
