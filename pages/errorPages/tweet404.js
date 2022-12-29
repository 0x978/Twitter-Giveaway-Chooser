import styles from "../../styles/404.module.css"
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
                <h1 className={styles.text}>Error 404</h1>
                <h2 className={styles.text}>The tweet you entered was not found.</h2>
                <h3 className={styles.text}>Please ensure the tweet URL you entered was valid</h3>
                <button onClick={handleClick} className={styles.button}>Return to menu</button>
            </div>
        </main>
    )
}
