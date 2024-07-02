const { IgApiClient, IgCheckpointError } = require('instagram-private-api');
const { unlinkSync, writeFileSync, readFileSync } = require('fs');

function getUsername(){
    const usernames= ["sunainas9261", "suffixstore121", "suffix_store12"];
    return usernames[Math.floor(Math.random()*3)];
}

async function downloadRecentPostsForFamilyMembers(familyMembers) {
    const ig = new IgApiClient();
    try {
        const serializedState = readFileSync('session.json', 'utf8');
        ig.state.deserialize(serializedState);
        console.log('Session loaded successfully.');
    } catch (error) {
        console.error('Error loading session:', error);
    }
    ig.state.generateDevice("realme 8s 5g");
    await ig.simulate.preLoginFlow();
    await delay(2000);

    try {
        await ig.account.currentUser();
        console.log('Session is valid.');
    } catch (error) {
        console.log('Session is invalid. Logging in...');
        try {
            await ig.account.login(getUsername(), "Suffixstore@2024");
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
            const recentPosts = await userPosts.items({ count: 10 });
            console.log(recentPosts.length);
            let afterPosts = 0;
            for (const post of recentPosts) {
                console.log(`Processing post ${post.id}`);
                if (post.taken_at > targetTimestamp) {
                    if (post.media_type === 2) {
                        console.log("Video: ", post.video_duration);
                        const videoUrl = post.video_versions[1].url;
                        if(post.video_duration>=80){
                            throw new Error("Video duration limit reached");
                        }
                        console.log(videoUrl)
                        await sendMsgWithDelay(videoUrl)
                    }
                    else{
                        console.log(post);
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
    targetDate.setDate(targetDate.getDate() - 8);
    const timeString = readFileSync('time.txt', 'utf8');
    const [hours, minutes] = timeString.split(':').map(Number);
    console.log(hours,":",minutes);
    targetDate.setHours(hours);
    targetDate.setMinutes(minutes);
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

const { MessageMedia, Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const wwebVersion = '2.2407.3';
const client = new Client({
    webVersion: "2.2412.54v2",
    authStrategy: new LocalAuth(), // your authstrategy here
    puppeteer: {
        headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    webVersionCache: {
        type: 'remote',
        // remotePath: 'https://raw.githubusercontent.com/guigo613/alternative-wa-version/main/html/2.2412.54v2.html',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
});

data = [7011263403]
async function sendMsgWithDelay(url) {
    for (let i = 0; i < data.length; i++) {
        if ((i + 1) % 5 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 5000 + (Math.random() * 5000)));
        }
        await new Promise((resolve) => setTimeout(resolve, 2000 + (Math.random() * 2000)));
        const number = `91${data[i]}`;
        const chatId = number + "@c.us";
        const media = await MessageMedia.fromUrl(url);
        await new Promise((resolve) => setTimeout(resolve, 2000 + (Math.random() * 2000)));
        await client.sendMessage(chatId, media)
            .then(() => {
                console.log(`Message sent to ${chatId}`);
            })
            .catch(err => console.error(err));
    }
}

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});
client.on('ready', async () => {
    console.log('Client is ready!');
    // await delete_file();
    // let familyMembers = ["officenitaambani", "madhuridixitnene", "sonamkapoor", "farahkhankunder", "sushmitasen47", "malaikaaroraofficial", "deepikapadukone", "aishwaryaraibachchan_arb", "anushkasharma"]
    // await downloadRecentPostsForFamilyMembers(familyMembers);
    await delay(3000);
    await delete_file();
    familyMembers = ["kareenakapoorkhan"]
    await downloadRecentPostsForFamilyMembers(familyMembers);
    writeFileSync('time.txt', `${new Date().getHours()}:${new Date().getMinutes()}`, 'utf8');
    console.error("We are done")
    return;
});
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
client.initialize();