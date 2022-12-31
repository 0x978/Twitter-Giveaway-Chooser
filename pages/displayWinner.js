import TwitterApi from "twitter-api-v2"
import styles from "../styles/displayWinner.module.css"
import {useEffect, useState} from "react";
import { useRouter } from "next/router";

const Page = ({ response }) => {
    const [index,setIndex] = useState(0)
    const [winner,setWinner] = useState(response.data[0].winnerInfo[0].data)
    const [createdDate,setDate] = useState(new Date(winner.created_at))
    const [url,setUrl] = useState("https://www.twitter.com/"+winner.username)
    const router = useRouter()

    function returnHome(){
        router.push({
            pathname: "/",
        })
    }

    useEffect(() => { // iterate through winners when next button is pressed.
        if(index < response.data[0].winnerInfo.length){
            let data = response.data[0].winnerInfo[index].data
            setWinner(data)
            setDate(new Date(data.created_at))
            setUrl("https://www.twitter.com/"+data.username)
        }
        else{
            alert(`You have viewed all ${response.data[0].winnerInfo.length} winners!`)
        }
    },[index])

    function HandleIndex(increment){
        if(increment){
            if(index < response.data[0].winnerInfo.length-1) {
                setIndex(prevState => prevState + 1)
            }
            else{
                alert(`You have viewed all ${response.data[0].winnerInfo.length} winners!`)
            }
        }
        else{
            if(index > 0){
                setIndex(prevState => prevState-1)
            }
            else{
                alert(`This is the first winner`)
            }
        }
    }

    return (
        <main className={styles.winnerMain}>
            <div className={styles.winnerDiv}>
                <h1 > A winner has been selected!</h1>
                <h2>Twitter ID: {winner.id}</h2>
                <h2>Name: {winner.name}</h2>
                <h2>Twitter Tag: {winner.username}</h2>
                <h2>Account created date: {createdDate.toDateString()}</h2>
                <h2>Private account: {winner.protected ? "Yes" : "No"} </h2>
                <h2>Verified account: {winner.verified ? "Yes" : "No"} </h2>


                <h2>Followers: {winner.public_metrics.followers_count}</h2>
                <h2>Following: {winner.public_metrics.following_count}</h2>
                <h2>URL: <a href={url} target="_blank">{url}</a></h2>

                <button onClick={() => HandleIndex(true)} className={styles.nextWinner}>Next Winner</button>
                <button onClick={() => HandleIndex(false)} className={styles.prevWinner}>Previous Winner</button>
                <button onClick={returnHome} className={styles.homeButton}>Return Home</button>

            </div>
        </main>
    );
};

// I know It's probably not good to run this much code in the getServerSideProps but when I try streamlining the process by using api routes etc it fails
// I think It's something to do with the library only working on server side
export async function getServerSideProps(context) {

    if(outOfRangeValues(context)){ // catching invalid values inserted via URL.
        return {
            redirect: {
                destination: '/errorPages/tweet404',
                permanent: false,
            },
        };
    }



    const twitterClient = new TwitterApi(process.env.bearer_token); // gets bearer token from env
    let apiCall = null

    try {
        switch(context.query.requirement){
            case "liked":
                apiCall = await twitterClient.v2.tweetLikedBy(context.query.id,{ asPaginator: true }); // paginated response from twitter api
                break
            case "retweeted":
                apiCall = await twitterClient.v2.tweetRetweetedBy(context.query.id,{ asPaginator: true }); // paginated response from twitter api
                break
            default:
                apiCall = await twitterClient.v2.tweetLikedBy(context.query.id,{ asPaginator: true });
        }
    } // error handling for API limit. Any other error returns 404.
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
    if(apiCall.errors.length > 0 || apiCall.data.meta.result_count === 0){
        return {
            redirect: {
                destination: '/errorPages/tweet404',
                permanent: false,
            },
        };
    }
    // twitter API heavily limits calls to 75 per 15 min, will have to work with only doing a maximum of 20 calls to stay within limit this means at most only the most recent 2000 likes are considered
    let consideredPages = Math.floor(Math.random() * 20)
    for(let i = 0; i < consideredPages; i++){ // iterating over pagination up to 20 times.
        if(!apiCall.done && apiCall.rateLimit.remaining > 10){
            await apiCall.fetchNext(100)
        }
        else{
            break
        }
    }

    let winnerIDArr = []
    let participants = apiCall.data.data
    for(let i = 0; i < Number.parseInt(context.query.numOfWinners); i++){
        winnerIDArr.push(chooseWinner(participants).id)
    }

    let winnerInfoArr = []
    for(let i = 0; i < winnerIDArr.length;i++){
        let winnerDetails = await twitterClient.v2.user(winnerIDArr[i], { 'user.fields':
                ['created_at','description','entities','id','location','name','pinned_tweet_id',
                    'profile_image_url', 'protected','public_metrics','url','username','verified','withheld'] });
        winnerInfoArr.push(winnerDetails)
    }


    return {
        props: {
            response: {
                data:[{
                    winnerInfo:winnerInfoArr
                }]
            },
        },
    };
}


// Given a page, returns a user within that page at random
function chooseWinner(participants){
    let pageLength = participants.length
    let winnerIndex = Math.floor(Math.random() * pageLength)
    return participants[winnerIndex]
}
// Error checking for params that exceed limit, since this can be manually modified in the URL
function outOfRangeValues(context){
    let winnerNum = 0
    try{
        winnerNum = Number.parseInt(context.query.numOfWinners)
    }
    catch (e){
        return false
    }
    return winnerNum > 10 || winnerNum < 1 || !Number.isInteger(winnerNum);
}

export default Page;