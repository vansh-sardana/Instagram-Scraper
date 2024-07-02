const { MessageMedia, Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// const wwebVersion = '2.2407.3';
// const client = new Client({
//     authStrategy: new LocalAuth(), // your authstrategy here
//     puppeteer: {
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],
//         executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//     },
//     webVersionCache: {
//         type: 'remote',
//         remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
//     },
// });

const wwebVersion = '2.2407.3';

const client = new Client({
    authStrategy: new LocalAuth(), // your authstrategy here
    puppeteer: {
      headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
});
let count = 0;
let data = [["Vansh", 7011263403]];

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

async function sendMsgWithDelay() {
    for (let i = 0; i < data.length; i++) {
        if((i+1)%5==0){
            await new Promise((resolve) => setTimeout(resolve, 2000+(Math.random()*5)));
        }
        await new Promise((resolve) => setTimeout(resolve, 2000+(Math.random()*2)));
        const number = `91${data[i][1]}`;
        const name = `${data[i][0]}`;
        const msg = `Hi ${name.split(" ")[0]}, Step into elegance with our pure crepe long cord set! 💫 Add a touch of sophistication to your wardrobe with stylish tassels in wine and yellow hues. 
        #CrepeFashion #KurtiPantSet #StylishTassels #ElegantStyle #FashionForward #WineAndYellow`;

        const chatId = number + "@c.us";
        const media = await MessageMedia.fromUrl("https://instagram.fdel11-2.fna.fbcdn.net/o1/v/t16/f2/m69/An9sdIaRN1OWSc2mVSL0e3R_qUUcZvjOShGvjLLcY8PWcUTjN7t08RF7JZ23nQZEqUWYkd0YNorKk_yZp3e4RxiN.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLmNsaXBzLmMyLjEwODAuYmFzZWxpbmUifQ&_nc_ht=instagram.fdel11-2.fna.fbcdn.net&_nc_cat=103&vs=426753786870770_3807943870&_nc_vs=HBksFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HTGVXaHhKODI2WW1PQzRGQUROMmtLYTJRTzBYYnBSMUFBQUYVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dHUWFjeHFzWVFtTlphRUJBSTFsVlU2NVM3bHVicV9FQUFBRhUCAsgBACgAGAAbABUAACa0hJGn1aSzQBUCKAJDMywXQCfCj1wo9cMYFmRhc2hfYmFzZWxpbmVfMTA4MHBfdjERAHX%2BBwA%3D&_nc_rid=3bd50d9ded&ccb=9-4&oh=00_AYC8358eGczLsAyBcDY7gjQPrYffqRoLF0OriV0cJfs-Mw&oe=664D5818&_nc_sid=b41fef");

        await client.sendMessage(chatId, media, { caption: msg })
            .then(() => {
                console.log(`Message ${count} sent to ${name}!`);
                count++;
            })

            .catch(err => console.error(err));
    }
}

client.on('ready', () => {
    console.log('Client is ready!');
    sendMsgWithDelay();
    return;
});

client.initialize();