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
    const likedByID = await twitterClient.v2.tweetLikedBy(context.query.id,{ asPaginator: true }); // paginated response from twitter api

    let resArr = [iterateRes(likedByID.data)] // 2d arr of all user ID's per page


    // twitter API heavily limits calls to 75 per 15 min, will have to work with only doing 10 calls to stay within limit
    // this means only the most recent 1000 likes are considered
    // TODO since I am iterating 10 times and then choosing a random page from 0 to 10, unnecessary API calls are being used up. Could run for loop random amount of times and take last?
    for(let i = 0; i < 9; i++){ // iterating over likedbyID paginations 9 times (+1 from orig call = 10) TODO assess whether this is a good amount
        if(!likedByID.done && likedByID.rateLimit.remaining !== 0){
            let pageResult = await likedByID.next(100) // stores new req as own instance, not necessary and confuses things TODO <<<
            resArr.push(iterateRes(pageResult.data))
            console.log(pageResult.rateLimit) // TODO debug info remove later
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

function iterateRes(pageData){ // iterates over page and returns arr of ids
    let arr = []
    for(let i = 0; i < pageData.data.length; i++){
        arr.push(pageData.data[i])
    }
    return arr
}

function chooseWinner(participantArray){ // randomly choose a page, then a user within that page
    // randomly choosing a page from list of pages.
    let arrLength = participantArray.length
    let subarrIndex = Math.floor(Math.random() * arrLength)
    let winnerArray = participantArray[subarrIndex]

    // choosing a user from chosen page.
    let winnerArrayLength = winnerArray.length
    let winnerIndex = Math.floor(Math.random() * winnerArrayLength)
    return winnerArray[winnerIndex]
}

export default Page;