import TwitterApi from "twitter-api-v2"

const Page = ({ response }) => {

    return (
        <main>
            <h1>{response.data[0].id}</h1>
            <h1>{response.data[0].name}</h1>
            <h1>{response.data[0].username}</h1>
        </main>
    );
};

export async function getServerSideProps(context) { // runs on page load

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
                        destination: '/429',
                        permanent: false,
                    },
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
                destination: '/tweet404',
                permanent: false,
            },
        };
    }

    let resArr = [iterateRes(likedByID.data)] // 2d arr of all user ID's per page

    // twitter API heavily limits calls to 75 per 15 min, will have to work with only doing 10 calls to stay within limit
    // this means only the most recent 1000 likes are considered
    // TODO since I am iterating 10 times and then choosing a random page from 0 to 9, unnecessary API calls are being used up. Could run for loop random amount of times and take last?
    for(let i = 0; i < 9; i++){ // iterating over likedbyID paginations 9 times (+1 from orig call = 10) TODO assess whether this is a good amount
        if(!likedByID.done && likedByID.rateLimit.remaining > 10){
            let pageResult = await likedByID.next(100) // stores new req as own instance, not necessary and confuses things TODO <<<
            resArr.push(iterateRes(pageResult.data))
            console.log(pageResult.rateLimit) // TODO debug info remove later
        }
        else{
            break
        }
    }

    let winner = chooseWinner(resArr)
    console.log(winner) // TODO debug info remove later

    return {
        props: {
            response: {
                data:[{
                    id:winner.id,
                    name:winner.name,
                    username:winner.username
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

// randomly chooses a page, then a user within that page and returns their info
function chooseWinner(participantArray){
    // randomly choosing a page from list of pages.
    let arrLength = participantArray.length
    let pageIndex = Math.floor(Math.random() * arrLength)
    let winnerArray = participantArray[pageIndex] // TODO in future should return this aswell so the winner can be rerolled easily

    // choosing a user from chosen page.
    let winnerArrayLength = winnerArray.length
    let winnerIndex = Math.floor(Math.random() * winnerArrayLength)
    return winnerArray[winnerIndex]
}

export default Page;