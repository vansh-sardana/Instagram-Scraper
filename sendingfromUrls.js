const { IgApiClient, IgCheckpointError } = require('instagram-private-api');
const { unlinkSync, writeFileSync, readFileSync } = require('fs');

async function downloadRecentPostsForFamilyMembers(familyMembers) {
    const ig = new IgApiClient();
    const mediaLinksList = [];
    try {
        const serializedState = readFileSync('session.json', 'utf8');
        ig.state.deserialize(serializedState);
        console.log('Session loaded successfully.');
    } catch (error) {
        console.error('Error loading session:', error);
    }

    ig.state.generateDevice("suffix_store12");
    await ig.simulate.preLoginFlow();
    await delay(2000);

    try {
        await ig.account.currentUser();
        console.log('Session is valid.');
    } catch (error) {
        console.log('Session is invalid. Logging in...');
        try {
            await ig.account.login("suffixstore121", "Suffixstore@2024");
            await delay(2000);
            const serializedState = await ig.state.serialize();
            const serializedStateString = JSON.stringify(serializedState);
            writeFileSync('session.json', serializedStateString);
            console.log('Session saved successfully.');
        } catch (loginError) {
            if (loginError instanceof IgCheckpointError) {
                console.log('Checkpoint challenge detected. Please solve it manually.');
            } else {
                console.error('Error logging in:', loginError);
            }
            return;
        }
    }

    // Iterate over family members
    for (const username of familyMembers) {
        try {
            console.log(`Fetching recent posts for ${username}`);
            const userInfo = await ig.user.searchExact(username);
            const targetUserId = userInfo.pk;
            await delay(2000);
            const targetTimestamp = getTimestamp();
            const userPosts= await ig.feed.user(targetUserId);
            const recentPosts = await userPosts.items({ limit: 13 });
            console.log(recentPosts.length);
            let afterPosts = 0;
            for (const post of recentPosts) {
                console.log(`Processing post ${post.id}`);
                if (post.taken_at > targetTimestamp) {
                    if (post.media_type === 1 || post.media_type === 8) {
                        if (post.carousel_media) {
                            // Handle album
                            for (const mediaItem of post.carousel_media) {
                                const mediaLink = getMediaLink(mediaItem);
                                if (mediaLink) {
                                    console.log("Carousel");
                                    await sendMsgWithDelay(mediaLink)
                                }
                            }
                        } else {
                            const mediaLink = getMediaLink(post);
                            if (mediaLink) {
                                console.log("Image");
                                await sendMsgWithDelay(mediaLink)
                            }
                        }
                    } else if (post.media_type === 2) {
                        const videoUrl = post.video_versions[1].url;
                            console.log("Video");
                            console.log(post.video_versions);
                            console.log(videoUrl)
                            // await sendMsgWithDelay(videoUrl)
                    }
                    console.log("\n");
                } else {
                    console.log('Post is before timestamp. Skipping...');
                    afterPosts++;
                    if (afterPosts >= 5) {
                        break;
                    }
                }
                await delay(500); // Delay before processing next post
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTimestamp() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 1);
    targetDate.setHours(13);
    targetDate.setMinutes(1);
    return Math.floor(targetDate.getTime() / 1000);
}

function getMediaLink(mediaItem) {
    let mediaUrl;
    if (mediaItem.media_type === 1) {
        mediaUrl = mediaItem.image_versions2.candidates[0].url;
    } else if (mediaItem.media_type === 2) {
        mediaUrl = mediaItem.video_versions[0].url;
    }
    return mediaUrl;
}
async function delete_file(){
    const filePath = 'session.json';
    try{
        unlinkSync(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
            console.log('File deleted successfully');
        })
    }
    catch(e){
        console.log(e);
    }
}

downloadRecentPostsForFamilyMembers(["madhuridixitnene"]);