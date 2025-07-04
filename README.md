# 🏃‍♀️ Jog Jam

**Jog Jam** is a React-based web app that generates personalized music playlists for runners, based on their pace and preferences. Built as a final project for the Code First Girls CFGdegree, it showcases full-stack development skills including React, Node.js, API integration, and environment management.

---

## 🚀 Features

- 🎵 Integrates with the Spotify API
- 🏃 Generates playlists tailored to a runner’s tempo
- 💡 Built with React and Node.js
- 🔐 Uses environment variables for secure API access

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- A Spotify Developer Account (for API credentials)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/jog-jam.git
```

---

### 2. Set up the Node server (Spotify API auth)

```bash
cd node-server
npm install
```

Create a `.env` file in the same directory with your Spotify credentials:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

Start the server:

```bash
node server.js
```

You should see:

```
Server is running on port 3001
```

---

### 3. Start the React app

Open a new terminal and return to the main project folder:

```bash
cd ../
npm install
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Technologies Used

- **Frontend:** React, CSS, HTML
- **Backend:** Node.js, Express, dotenv
- **APIs:** Spotify Web API
- **Other:** Git, npm

---

## 🤝 Team

Built by Group 4 as part of the Code First Girls CFGdegree.  

---

## 📝 License

This project is for educational purposes and not affiliated with Spotify.
