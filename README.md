# Twitter Giveaway Chooser written in NextJS

Given a Tweet URL, this site returns a given number of random users who has liked / retweeted the Tweet.

You can use this tool at this URL: https://twitter-giveaway-chooser.vercel.app

## Technologies used:
- NextJS / React
- HTML / CSS
- Twitter API

## Limitations
Due to the limitations of Twitter's API, a maximum of 75 calls can be made every 15 minutes, of which, a maximum of 100 users can be returned from a single API call, meaning I can only extract information about the most recent 7500 people who liked or retweeted.

In practice this is still inefficent, as this would mean only one person could use the application per 15 minutes. Therefore, this has been furthered limited to ***up to*** the most recent 2000 likes / retweets a tweet receives.

If Twitter extends or removes this limitation in the future then I will update the application
