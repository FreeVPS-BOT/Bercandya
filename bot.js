const { Telegraf } = require('telegraf');
const ytdl = require('ytdl-core');
const axios = require('axios');
const fs = require('fs');

const bot = new Telegraf('6963354340:AAHaB_-YjyxV3FUsii0uc2zwpODGQLQaOMo');

// Command to get weather information
bot.command('weather', async (ctx) => {
    try {
        const city = ctx.message.text.split(' ').slice(1).join(' ');
        if (!city) {
            ctx.reply('Masukkan nama kota untuk mendapatkan cuaca.');
            return;
        }
        const weatherData = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ed87c1fd28dd55e2200149e6305393dd&units=metric`);
        const { main, weather } = weatherData.data;
        const { temp, humidity } = main;
        const { description } = weather[0];
        ctx.reply(`Cuaca di ${city} saat ini: ${description}. Suhu: ${temp}°C. Kelembaban: ${humidity}%.`);
    } catch (error) {
        console.error('Error fetching weather:', error);
        ctx.reply('Maaf, tidak dapat mendapatkan informasi cuaca untuk kota tersebut.');
    }
});

// Command to search YouTube videos
bot.command('youtube', async (ctx) => {
    try {
        const query = ctx.message.text.split(' ').slice(1).join(' ');
        if (!query) {
            ctx.reply('Masukkan kata kunci untuk mencari video di YouTube.');
            return;
        }
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        ctx.reply(`Hasil pencarian YouTube untuk "${query}": ${searchUrl}`);
    } catch (error) {
        console.error('Error searching YouTube:', error);
        ctx.reply('Maaf, tidak dapat melakukan pencarian di YouTube saat ini.');
    }
});

// Command to download MP4 video from YouTube
bot.command('downloadmp4', async (ctx) => {
    try {
        const videoUrl = ctx.message.text.split(' ').slice(1).join(' ');
        if (!ytdl.validateURL(videoUrl)) {
            ctx.reply('Masukkan URL video YouTube yang valid.');
            return;
        }
        const info = await ytdl.getInfo(videoUrl);
        const videoStream = ytdl(videoUrl, { filter: 'audioandvideo' });
        ctx.reply('Memulai unduhan video MP4. Mohon tunggu...');
        ctx.telegram.sendDocument(ctx.message.chat.id, { source: videoStream, filename: `${info.videoDetails.title}.mp4` });
    } catch (error) {
        console.error('Error downloading MP4:', error);
        ctx.reply('Maaf, tidak dapat mengunduh video MP4 dari YouTube saat ini.');
    }
});

// Command to download MP3 audio from YouTube
bot.command('downloadmp3', async (ctx) => {
    try {
        const videoUrl = ctx.message.text.split(' ').slice(1).join(' ');
        if (!ytdl.validateURL(videoUrl)) {
            ctx.reply('Masukkan URL video YouTube yang valid.');
            return;
        }
        const info = await ytdl.getInfo(videoUrl);
        const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
        ctx.reply('Memulai unduhan lagu MP3. Mohon tunggu...');
        ctx.telegram.sendAudio(ctx.message.chat.id, { source: audioStream, filename: `${info.videoDetails.title}.mp3` });
    } catch (error) {
        console.error('Error downloading MP3:', error);
        ctx.reply('Maaf, tidak dapat mengunduh lagu MP3 dari YouTube saat ini.');
    }
});

bot.launch();
console.log('Bot sedang berjalan...');
