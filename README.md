# AI-Powered Chatbot
This is a Next.js-powered chatbot interface that replicates the ChatGPT UI while integrating with OpenAI's API. It provides real-time streaming responses, markdown support, and optimized UI interactions for an intuitive chatbot experience.

![ai-chatbot-demo](https://github.com/hazel-shih/ai-chatbot/blob/main/public/ai-chatbot-demo.gif)

Project link: https://ai-chatbot-nu-coral.vercel.app/chat
⚠️ A valid user-key is required to access this chatbot. Please contact the author for authorization.

## 🚀 Features

- **ChatGPT-like UI** - Sleek chat interface with message bubbles and input box.
- **Real-time AI Responses** - Utilizes `ReadableStream` to stream OpenAI responses smoothly.
- **Markdown Rendering** - Supports headers, lists, tables, and syntax highlighting.
- **State Management for Chat History** - Maintains conversation flow using React state.
- **Intelligent Input Handling** - Prevents accidental message submission for IME-based languages.
- **Optimized Token Usage** - Automatically trims old messages to fit within OpenAI's token limit.
- **Secure Backend API** - Routes API requests through a backend to protect API keys and control model settings.

## 🏗 Tech Stack

- **Frontend**: React, TypeScript, Next.js, TailwindCSS
- **Backend API**: Node.js, hosted on Render
- **Deployment**: 
  - Frontend - Vercel
  - Backend - Render (Node.js)

## ⚡ Getting Started

First, install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/) in your browser to access the chatbot.

---

Let me know if you have any feedback or feature requests! 🚀

