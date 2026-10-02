# PhotoShare: a basic MERN photo feed

Upload a photo with a caption, save it, and see it in a vertical feed (newest first).

- **Frontend:** React + Vite + React Router (port 5173)
- **Backend:** Node.js + Express (port 5000)
- **Database:** MongoDB + Mongoose
- **Image storage:** ImageKit

```
photo-sharing-app/
├── backend/
│   ├── controllers/post.controller.js
│   ├── models/Post.js
│   ├── routes/post.routes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/ (Navbar.jsx, Feed.jsx, CreatePost.jsx)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 1. Requirements

- Node.js 18 or newer (`node -v`)
- A free ImageKit account: https://imagekit.io
- MongoDB: local install **or** a free MongoDB Atlas cluster

## 2. Get your ImageKit credentials

1. Sign up / log in at https://imagekit.io
2. Open **Developer options** (or **Developer** in the sidebar).
3. Copy the **URL endpoint** (looks like `https://ik.imagekit.io/your_id`).
4. Open **API keys** and copy the **Public key** and **Private key**.

## 3. Get your MongoDB connection string

- **Local MongoDB:** `mongodb://127.0.0.1:27017/photo-sharing`
- **MongoDB Atlas:** create a free cluster, add a database user, allow your IP under *Network Access*, then **Connect → Drivers** and copy the string. Put `/photo-sharing` before the `?` to name the database, and replace `<password>` with your real password.

## 4. Create the backend `.env`

In the `backend` folder, copy `.env.example` to a new file named `.env`:

```bash
cd backend
cp .env.example .env        # Windows (cmd): copy .env.example .env
```

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

The frontend needs no `.env` file. It gets the public key from the backend.

## 5. Run the backend (Terminal 1)

```bash
cd backend
npm install
node server.js
```

You should see `MongoDB connected` and `Server running on http://localhost:5000`.

## 6. Run the frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

## 7. Try it

1. Click **Create Post**.
2. Choose an image and type a caption.
3. Click **Submit**. You are redirected to the **Feed** with your post at the top.

## How it works

```
User selects image
→ React asks Express for a signature        GET  /api/imagekit-auth
→ React uploads the image to ImageKit
→ ImageKit returns the image URL
→ React sends { image: URL, caption }       POST /api/posts
→ Express saves the post in MongoDB
→ Feed page requests posts                  GET  /api/posts
→ Express returns them, newest first
→ React renders them with .map()
```

- **Frontend ↔ backend:** React calls `fetch("/api/posts")`. The Vite dev server proxy (`frontend/vite.config.js`) forwards `/api` requests to `http://localhost:5000`.
- **ImageKit:** the private key stays on the server and only signs a short-lived upload token. The browser uploads the file directly to ImageKit. Only the resulting URL is stored in MongoDB.
- **MongoDB:** each post is a document in the `posts` collection: `{ _id, image, caption, createdAt }`.

## API

| Method | URL | Purpose |
| ------ | --- | ------- |
| GET | `/api/posts` | All posts, newest first |
| POST | `/api/posts` | Create a post. Body: `{ "image": "<url>", "caption": "..." }` |
| GET | `/api/imagekit-auth` | Signature for the browser-side ImageKit upload |

## Troubleshooting

- **`MONGODB_URI is missing`:** you have not created `backend/.env`, or it is in the wrong folder.
- **`MongoDB connection error`:** check the connection string. On Atlas, check the password and that your IP is allowed.
- **"Could not load posts. Is the backend running?":** start the backend first and keep it running.
- **"ImageKit keys are missing in backend/.env":** fill in the keys, then restart `node server.js`. Changes to `.env` need a restart.
- **ImageKit upload fails:** make sure the public and private keys come from the same ImageKit account.
- **"Image must be hosted on your ImageKit account":** `IMAGEKIT_URL_ENDPOINT` does not match your account's endpoint.
- **Changed `PORT` in `.env`:** update the proxy port in `frontend/vite.config.js` too.
