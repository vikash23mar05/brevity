# Brevity - Enterprise URL Shortener 🚀

Brevity is a high-performance, full-stack URL shortener built with modern web technologies. Designed as a "placement-ready" project, it emphasizes backend engineering fundamentals, professional UI/UX, and scalable system design.

## ✨ Features

- **Blazing Fast Redirects:** Implements the **Cache-Aside** pattern using Upstash Redis. Cache hits result in sub-millisecond redirect latency.
- **Graceful Degradation:** If the Redis cache goes down, the system safely falls back to MongoDB without interrupting user traffic.
- **Stateless Authentication:** Secure user sessions using `jose` JSON Web Tokens (JWT) stored in HTTP-only, secure cookies to prevent XSS attacks.
- **Edge Security:** Next.js Middleware acts as a bouncer, validating JWTs at the network edge before protecting routes render.
- **Custom Aliases:** Users can define their own human-readable short links (e.g., `brevity.com/my-link`).
- **Asynchronous Analytics:** Every click transparently parses the `User-Agent` to track browser and device types. The database write happens *asynchronously* so it never blocks the 302 redirect.
- **Master-Detail Dashboard:** A premium, SaaS-style analytics dashboard featuring responsive CSS Grid layouts and live SVG charts via Recharts.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas/database) (via Mongoose)
- **Cache:** [Upstash Redis](https://upstash.com/) (via `ioredis`)
- **Authentication:** `bcryptjs` (Hashing) & `jose` (JWT)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Utilities:** `nanoid`, `ua-parser-js`

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vikash23mar05/brevity.git
   cd brevity
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_string
   REDIS_URL=your_upstash_redis_connection_string (Optional)
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ System Architecture

### The Cache-Aside Pattern
When a user clicks a shortened link (e.g., `/gPaKoV`), the Edge function intercepts the request:
1. **Cache Check:** It checks Redis for the key `link:gPaKoV`.
2. **Cache Hit:** If found, it instantly returns an HTTP 302 redirect to the original URL.
3. **Cache Miss:** If not found, it queries MongoDB. It then asynchronously writes the result back into Redis with a 1-hour expiration (`EX 3600`) before returning the 302 redirect. 
   *(Subsequent clicks within the hour bypass the database entirely).*

### Analytics Pipeline
Click data is not written synchronously. To maximize redirect speed, the route handler parses the request headers and triggers a `Click.create()` Promise to MongoDB, but intentionally does **not** `await` it. The redirect is sent to the client immediately while the database write finishes in the background.

## 📝 License
This project is open-source and available under the MIT License.
