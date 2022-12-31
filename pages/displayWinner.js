import TwitterApi from "twitter-api-v2"
import styles from "../styles/displayWinner.module.css"
import {useState} from "react";
import { useRouter } from "next/router";

const Page = ({ response }) => {
    const [winner,setWinner] = useState(response.data[0])
    const [createdDate,setDate] = useState(new Date(winner.accountAge))
    const [url,setUrl] = useState("https://www.twitter.com/"+winner.username)
    const router = useRouter()

    function returnHome(){
        router.push({
            pathname: "/",
        })
    }


    console.log(winner.winnerPage)

    return (
        <main className={styles.winnerMain}>
            <div className={styles.winnerDiv}>
                <h1 > A winner has been selected!</h1>
                <h2>Twitter ID: {winner.id}</h2>
                <h2>Name: {winner.name}</h2>
                <h2>Twitter Tag: {winner.username}</h2>
                <h2>Account created date: {createdDate.toDateString()}</h2>
                <h2>Private account: {winner.isPrivate ? "Yes" : "No"} </h2>
                <h2>Verified account: {winner.isVerified ? "Yes" : "No"} </h2>


                <h2>Followers: {winner.public_metrics.followers_count}</h2>
                <h2>Following: {winner.public_metrics.following_count}</h2>
                <h2>URL: <a href={url} target="_blank">{url}</a></h2>

                <button className={styles.reRoll}>Re-roll Winner</button>
                <button onClick={returnHome} className={styles.homeButton}>Return Home</button>

            </div>
        </main>
    );
};

// I know its probably not good to run this much code in the getServerSideProps but when I try streamlining the process by using api routes etc it fails
// I think its something to do with the library only working on server side
export async function getServerSideProps(context) {

    const twitterClient = new TwitterApi(process.env.bearer_token); // gets bearer token from env
    let likedByID = null

    // error handling for API limit. Any other error returns 404.
    try {
        likedByID = await twitterClient.v2.tweetLikedBy(context.query.id,{ asPaginator: true }); // paginated response from twitter api TODO can be adapted later to get likes, retweets or replies depending on chosen
    }
    catch (ApiResponseError){
        switch (ApiResponseError.code){
            case 429: // Error for reaching API limit
                return {
                    redirect: {
                        destination: '/errorPages/429',
                        permanent: false,
                    }
                };
            default:
                return {
                    notFound: true,
                }
        }
    }
    // API does not return 404 if the tweet does not exist, so must handle it here.
    if(likedByID.errors.length > 0){
        return {
            redirect: {
                destination: '/errorPages/tweet404',
                permanent: false,
            },
        };
    }

    let resArr = [iterateRes(likedByID.data)] // 2d arr of all user ID's per page

    // twitter API heavily limits calls to 75 per 15 min, will have to work with only doing a maximum of 20 calls to stay within limit this means at most only the most recent 2000 likes are considered
    let consideredPages = Math.floor(Math.random() * 20)
    for(let i = 0; i < consideredPages; i++){ // iterating over likedbyID paginations up to 20 times.
        if(!likedByID.done && likedByID.rateLimit.remaining > 10){
            let pageResult = await likedByID.next(100)
            resArr.push(iterateRes(pageResult.data))
            console.log(pageResult.rateLimit) // TODO debug info remove later
        }
        else{
            break
        }
    }

    let winner = chooseWinner(resArr)

    console.log(winner.username) // TODO debug info remove later

    const winnerDetails = await twitterClient.v2.user(winner.id, { 'user.fields':
            ['created_at','description','entities','id','location','name','pinned_tweet_id',
                'profile_image_url', 'protected','public_metrics','url','username','verified','withheld'] });

    return {
        props: {
            response: {
                data:[{
                    id:winner.id,
                    name:winner.name,
                    username:winner.username,
                    public_metrics:winnerDetails.data.public_metrics,
                    isVerified:winnerDetails.data.verified,
                    isPrivate:winnerDetails.data.protected,
                    accountAge: winnerDetails.data.created_at,
                }]
            },
        },
    };
}

// iterates over a given page and returns arr of ids, name and tag of every user in that page
function iterateRes(pageData){
    let arr = []
    for(let i = 0; i < pageData.data.length; i++){
        arr.push(pageData.data[i])
    }
    return arr
}

// randomly chooses a page, then a user within that page and returns the winner user as well as the page of the winner
function chooseWinner(participantArray){
    // randomly choosing a page from list of pages.
    let arrLength = participantArray.length
    let pageIndex = Math.floor(Math.random() * arrLength)
    let winnerPage = participantArray[pageIndex]

    let pageLength = winnerPage.length
    let winnerIndex = Math.floor(Math.random() * pageLength)
    winnerPage.splice(winnerIndex,1)
    return winnerPage[winnerIndex]
}

export default Page;