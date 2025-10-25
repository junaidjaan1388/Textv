// server.js
const express = require('express');
const ytdl = require('ytdl-core');
const cp = require('child_process');
const sanitize = require('sanitize-filename'); // optional
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static frontend if present
app.use(express.static('public'));

// Simple health
app.get('/', (req, res) => {
  res.send('Downloader backend running. Use /download?url=...&type=video|audio or open the frontend.');
});

/**
 * GET /download?url=...&type=video|audio
 * Streams the content to the client.
 *
 * WARNING: Do not use to download copyrighted videos without permission.
 */
app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;
  const type = req.query.type === 'audio' ? 'audio' : 'video';

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).send('Invalid or missing url parameter');
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = sanitize(info.videoDetails.title || 'video');

    if (type === 'video') {
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
      res.setHeader('Content-Type', 'video/mp4');

      ytdl(videoUrl, { filter: (f) => f.container === 'mp4' || f.container === 'webm' })
        .pipe(res)
        .on('error', err => {
          console.error('Stream error:', err);
          if (!res.headersSent) res.status(500).end('Streaming error');
        });

    } else {
      // audio: stream best audio and convert to mp3 using ffmpeg (if installed)
      res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
      res.setHeader('Content-Type', 'audio/mpeg');

      const ffmpeg = cp.spawn('ffmpeg', [
        '-i', 'pipe:0',
        '-f', 'mp3',
        '-vn',
        '-codec:a', 'libmp3lame',
        '-qscale:a', '2',
        'pipe:1'
      ], { stdio: ['pipe', 'pipe', 'inherit'] });

      const stream = ytdl(videoUrl, { quality: 'highestaudio' });
      stream.pipe(ffmpeg.stdin);
      ffmpeg.stdout.pipe(res);

      ffmpeg.on('error', e => {
        console.error('ffmpeg failed:', e);
        if (!res.headersSent) res.status(500).end('Server audio conversion error');
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + String(err.message || err));
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
