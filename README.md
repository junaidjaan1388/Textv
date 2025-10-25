# Legal YouTube Downloader (Example)

**IMPORTANT — read before using**

This example project demonstrates a small frontend and a Node.js backend that can stream YouTube video/audio to the client using `ytdl-core`.  
**DO NOT** use it to download copyrighted content unless you own the content or have explicit permission from the copyright owner. Downloading other people's videos may violate YouTube's Terms of Service and local law.

## What's included
- `index.html` — simple frontend that opens `/download?url=...&type=video|audio`.
- `server.js` — Express server that streams video or converts audio to MP3 using `ffmpeg`.
- `package.json` — dependencies.

## Quick start (local, for lawful use only)
1. Install Node.js (16+ recommended).
2. Clone/unzip this project and run:
   ```bash
   npm install
   # If you want audio->mp3 conversion, install ffmpeg on your system:
   # macOS: brew install ffmpeg
   # Ubuntu/Debian: sudo apt-get install ffmpeg
   npm start
   ```
3. Open the frontend file `index.html` in a browser or visit `http://localhost:3000` if you move `index.html` into a `public/` folder.

## Security & deployment notes
- If deploying publicly, add authentication, rate-limiting, CORS rules, and logging.
- Keep dependencies updated.
- This code is educational; use responsibly.

## License
This is provided as-is for educational purposes.
