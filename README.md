<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: auto;">

  <h1>📣 Reddit Clone</h1>
  <p>
    A full-featured Reddit-style platform built with <strong>Next.js</strong>, <strong>React</strong>, <strong>Tailwind CSS</strong>, <strong>Prisma</strong>, and <strong>MySQL</strong> — supporting community creation, real-time interaction, and secure user authentication.
  </p>

  <h2>🚀 Features</h2>
  <ul>
    <li><strong>🔐 Authentication:</strong> Secure login and registration using <strong>NextAuth.js</strong>.</li>
    <li><strong>🧵 Subreddit-Style Communities:</strong>
      <ul>
        <li>Create and join communities</li>
        <li>Post content and interact via comments</li>
        <li>Upvote/downvote posts and comments</li>
        <li>Customize personal profiles</li>
      </ul>
    </li>
    <li><strong>🛠 Community Management:</strong> Admins can define rules to ensure a safe environment.</li>
    <li><strong>📱 Responsive UI:</strong> Fully optimized for both desktop and mobile devices using Tailwind CSS.</li>
    <li><strong>⚡ Real-Time Updates:</strong> Live post and vote updates with Redis caching for performance.</li>
  </ul>

  <h2>🛠 Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> Next.js 14, React, Tailwind CSS</li>
    <li><strong>Backend:</strong> Next.js API Routes, Prisma ORM, MySQL</li>
    <li><strong>Authentication:</strong> NextAuth.js with Google Provider</li>
    <li><strong>Caching & Realtime:</strong> Redis</li>
    <li><strong>Deployment:</strong> Easily deployable on Vercel or your preferred platform</li>
  </ul>

  <h2>🧑‍💻 Getting Started</h2>
  <ol>
    <li><strong>Clone the repository</strong>
      <pre><code>git clone https://github.com/yourusername/reddit-clone.git
cd reddit-clone</code></pre>
    </li>
    <li><strong>Install dependencies</strong>
      <pre><code>npm install</code></pre>
    </li>
    <li><strong>Setup environment variables</strong>
      <p>Create a <code>.env</code> file with the following required credentials:</p>
      <ul>
        <li><strong>DATABASE_URL</strong> from <a href="https://railway.app" target="_blank">Railway</a> (MySQL)</li>
        <li><strong>UPLOADTHING_SECRET</strong> and <strong>UPLOADTHING_APP_ID</strong> from <a href="https://uploadthing.com" target="_blank">UploadThing</a></li>
        <li><strong>GOOGLE_CLIENT_ID</strong> and <strong>GOOGLE_CLIENT_SECRET</strong> from your Google OAuth app</li>
        <li><strong>NEXTAUTH_SECRET</strong> for securing NextAuth sessions</li>
        <li><strong>REDIS_URL</strong> for real-time caching</li>
      </ul>
    </li>
    <li><strong>Run the development server</strong>
      <pre><code>npm run dev</code></pre>
    </li>
    <li><strong>Open in browser</strong>
      <p>Visit <a href="http://localhost:3000">http://localhost:3000</a></p>
    </li>
  </ol>

  <h2>📸 Screenshots</h2>
  <p><em>(Add screenshots here to showcase the UI and features)</em></p>
  
  ## 📚 Documentation
  👉 [Frontend Features Ready for Implementation](docs/frontend-features.md)

  <h2>📄 License</h2>
  <p>MIT License. Feel free to use and customize.</p>

</body>
</html>
