import { TwitterApi } from 'twitter-api-v2';


const Page = ({ tweets }) => {
    console.log(tweets)
    return (
        <main>
            <h1>
                {tweets}
            </h1>
        </main>
    );
};

export async function getServerSideProps(context) {
    const twitterClient = new TwitterApi(process.env.bearerToken);
    const users = await twitterClient.v2.tweetLikedBy('20');
    console.log(users.data[0].id);

    return {
        props: {
            users,
        },
    };
}

export default Page;