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
    console.log(context.query.id)
    const twitterClient = new TwitterApi(process.env.bearer_token); // gets bearer token from env
    const likedByID = await twitterClient.v2.tweetLikedBy(context.query.id); // gets users who liked tweets by id


    return {
        props: {
            response: likedByID,
        },
    };
}

export default Page;