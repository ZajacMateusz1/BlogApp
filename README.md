# Social Media App

# Important

Backend is hosted on Render free, so the first request may take up to ~50 seconds due to cold start.

## [Live demo](https://blog-app-coral-one.vercel.app)

A full-stack social media application built with **React**, **TypeScript**, **Express** and **MongoDB**.

Features include authentication, user profiles, posts, image uploads, likes, comments, follow relationships, personalized feeds, real-time notifications, real-time messaging, and automated backend error analysis.

# Project Evolution

This project originally started as a simple blog application, which is why some parts of the repository and naming conventions still reference "BlogApp".

# Features

## Authentication

- User registration and login
- JWT authentication
- Automatic logout after token expiration
- Protected API routes

## Posts

- Create, edit, and delete posts
- Upload images
- Like and unlike posts
- Optimistic UI updates

## Comments

- Add comments
- Infinite scroll
- Cursor-based pagination

## Users

- User profiles
- Edit profile
- Avatar uploads
- Search users
- Follow & unfollow
- Followers and following lists
- Friend suggestions

## Feed

- Personalized feed from followed users
- Global feed fallback
- Infinite scroll
- Cursor-based pagination

## Messaging

- Real-time messaging using **WebSockets**
- Conversations between users
- Conversation list
- Search existing conversations
- Search for users without an existing conversation
- Create conversations through the REST API
- Persistent messages stored in **MongoDB**
- Tracking the last message in a conversation
- Per-user conversation read state
- Marking conversations as read
- Retrieving conversations with cursor-based pagination
- Retrieving messages with cursor-based pagination
- Server-side validation of message payloads using **Zod**
- Frontend UI for viewing and searching conversations
- Frontend UI for creating new conversations
- Frontend messaging UI for displaying and sending messages

## Validation

- Client-side validation using **React Hook Form** and **Zod**
- Server-side request validation using **Zod**
- WebSocket message payload validation using **Zod**

## Notifications

- Real-time notifications using **WebSockets**
- Automatic WebSocket reconnection after connection loss
- WebSocket connection health checks using a ping/pong mechanism
- Notification history
- Notifications stored in **MongoDB**
- Notifications page
- Mark notifications as read
- Cursor-based pagination
- Notifications for:
  - Likes
  - Comments
  - New followers

## File Uploads

- Image uploads using **Multer**
- Images stored in **Supabase Storage**

## Error Handling

- Centralized error handling middleware
- Custom `HttpError` class
- Consistent API error responses
- Integration with **BugAnalyzer** for automated backend error analysis
- Error reports can be sent to BugAnalyzer for analysis using **Google Gemini**
- BugAnalyzer stores analyzed errors and their results in **PostgreSQL**

## Database

- MongoDB with Mongoose
- Transactions for improved data consistency
- Conversation and message persistence

## Testing

The project includes tests for:

- Components
- Custom hooks
- Forms
- Validation
- API interactions

Built with:

- Vitest
- React Testing Library

# Tech Stack

## Frontend

- [**React**](https://react.dev/)
- [**TypeScript**](https://www.typescriptlang.org/)
- [**Vite**](https://vite.dev/)
- [**React Router**](https://reactrouter.com/)
- [**TanStack React Query**](https://tanstack.com/query/latest)
- [**React Hook Form**](https://react-hook-form.com/)
- [**Zod**](https://zod.dev/)
- [**Tailwind CSS**](https://tailwindcss.com/)
- [**Lucide React**](https://lucide.dev/)
- [**WebSocket API**](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [**Vitest**](https://vitest.dev/)
- [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro)

## Backend

- [**Node.js**](https://nodejs.org/)
- [**Express**](https://expressjs.com/)
- [**TypeScript**](https://www.typescriptlang.org/)
- [**MongoDB**](https://www.mongodb.com/)
- [**Mongoose**](https://mongoosejs.com/)
- [**WebSocket (ws)**](https://www.npmjs.com/package/ws)
- [**Zod**](https://zod.dev/)
- [**Multer**](https://github.com/expressjs/multer)
- [**Supabase Storage**](https://supabase.com/storage)
- [**bcrypt**](https://github.com/kelektiv/node.bcrypt.js)
- [**express-rate-limit**](https://www.npmjs.com/package/express-rate-limit)

## BugAnalyzer

The backend can integrate with a separate [**BugAnalyzer**](https://github.com/ZajacMateusz1/BugAnalyzer) service for automated error analysis.

BugAnalyzer receives backend error reports from the Social Media App, sends them to **Google Gemini** for analysis, validates the AI response using **Zod**, and stores the bug together with its analysis in **PostgreSQL**.

The integration is used to report backend errors without affecting the HTTP error response returned to the client.

# Project Structure

```text
BlogApp

├── backend
│   ├── src
│   │   ├── config
│   │   ├── errors
│   │   ├── middlewares
│   │   ├── models
│   │   ├── modules
│   │   │   ├── auth
│   │   │   ├── feed
│   │   │   ├── messages
│   │   │   ├── notifications
│   │   │   ├── posts
│   │   │   ├── users
│   │   │   └── ws
│   │   ├── types
│   │   └── utils
│   └── tests
└── blog-app-frontend
    ├── src
    │   ├── assets
    │   ├── modules
    │   │   ├── auth
    │   │   ├── home
    │   │   ├── messages
    │   │   ├── notifications
    │   │   ├── posts
    │   │   ├── shared
    │   │   ├── users
    │   │   └── ws
    │   ├── router
    │   └── utils
    └── tests
```

Each module contains its own components, business logic, validation and types.

# HTTP Requests

API communication is handled through a small `fetch` wrapper combined with **React Query**, providing:

- Query caching
- Infinite queries
- Optimistic updates
- Cache invalidation
- Background refetching
- Request state management

# API Endpoints

## Authentication

| Method | Endpoint             | Description                                                |
| ------ | -------------------- | ---------------------------------------------------------- |
| POST   | `/api/auth/register` | Register a new user account and return a JWT access token. |
| POST   | `/api/auth/login`    | Authenticate a user and return a JWT access token.         |

---

## Users

| Method | Endpoint                         | Description                                          |
| ------ | -------------------------------- | ---------------------------------------------------- |
| GET    | `/api/users/search`              | Search users by username.                            |
| GET    | `/api/users/suggestions`         | Get follow suggestions for the authenticated user.   |
| GET    | `/api/users/:userId`             | Get a user's public profile information.             |
| PATCH  | `/api/users/me`                  | Update the authenticated user's profile information. |
| GET    | `/api/users/:userId/posts`       | Get posts created by a specific user.                |
| POST   | `/api/users/:followingId/follow` | Follow a user.                                       |
| DELETE | `/api/users/:followingId/follow` | Unfollow a user.                                     |
| GET    | `/api/users/:userId/followers`   | Get a paginated list of a user's followers.          |
| GET    | `/api/users/:userId/following`   | Get a paginated list of users that the user follows. |

---

## Posts

| Method | Endpoint                      | Description                                            |
| ------ | ----------------------------- | ------------------------------------------------------ |
| GET    | `/api/posts/:postId`          | Get a single post by its ID.                           |
| POST   | `/api/posts/create`           | Create a new post with image upload.                   |
| PATCH  | `/api/posts/:postId`          | Update an existing post.                               |
| DELETE | `/api/posts/:postId`          | Delete a post.                                         |
| POST   | `/api/posts/:postId/like`     | Like a post.                                           |
| DELETE | `/api/posts/:postId/like`     | Remove a like from a post.                             |
| GET    | `/api/posts/:postId/comments` | Get comments for a post using cursor-based pagination. |
| POST   | `/api/posts/:postId/comments` | Add a new comment to a post.                           |

---

## Feed

| Method | Endpoint    | Description                                                                  |
| ------ | ----------- | ---------------------------------------------------------------------------- |
| GET    | `/api/feed` | Get the authenticated user's personalized feed with cursor-based pagination. |

---

## Notifications

| Method | Endpoint                  | Description                                                               |
| ------ | ------------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/notifications`      | Get the authenticated user's notifications using cursor-based pagination. |
| PATCH  | `/api/notifications/read` | Mark all unread notifications as read.                                    |

---

## Messages

| Method | Endpoint                                 | Description                                                                |
| ------ | ---------------------------------------- | -------------------------------------------------------------------------- |
| POST   | `/api/messages/conversation/:userId`     | Create a conversation between the authenticated user and another user.     |
| GET    | `/api/messages/conversations`            | Get the authenticated user's conversations using cursor-based pagination.  |
| GET    | `/api/messages/:conversationId/messages` | Get messages from a conversation using cursor-based pagination.            |
| PATCH  | `/api/messages/:conversationId/read`     | Mark a conversation as read for the authenticated user.                    |
| GET    | `/api/messages/search`                   | Search the authenticated user's existing conversations.                    |
| GET    | `/api/messages/search/users`             | Search for users without an existing conversation with authenticated user. |

Messages are sent through the WebSocket connection using a validated `chat_message` payload.

# Authentication

The backend uses JWT authentication.

Protected endpoints require:

```http
Authorization: Bearer <token>
```

The frontend stores the access token and automatically logs the user out when it expires.

# Real-time Communication

The frontend establishes a WebSocket connection after authentication.

The backend uses WebSockets to deliver real-time notifications when a user:

- receives a like on a post,
- receives a comment on a post,
- gains a new follower.

WebSockets are also used for real-time messaging between users. Incoming chat messages are validated using **Zod**, persisted in MongoDB, and associated with conversations.

A chat message uses the following payload structure:

```json
{
  "type": "chat_message",
  "payload": {
    "recipient": "userId",
    "content": "Message content"
  }
}
```

The message payload is validated on the server:

- `recipient` must be a non-empty string with a maximum length of 50 characters.
- `content` must be a non-empty string with a maximum length of 500 characters.

When a message is sent, the backend:

- finds the existing conversation between the sender and recipient,
- stores the message in MongoDB,
- updates the conversation's last message,
- marks the recipient's conversation as unread.

Conversations are created separately through the REST API.

The backend uses MongoDB transactions when creating a message and updating the related conversation.

The conversation stores read state separately for each participant. A participant can mark their conversation as read through the REST API.

If the WebSocket connection is closed unexpectedly, the frontend automatically attempts to reconnect after a 5-second delay. Reconnection attempts continue until the WebSocket provider is unmounted.

Notifications are also stored in MongoDB, allowing users to retrieve their notification history after reconnecting or refreshing the application.

The WebSocket server uses a ping/pong heartbeat mechanism to monitor connection health. Every 30 seconds, the server sends a ping to connected clients and terminates connections that do not respond with a pong.

# Pagination

Cursor-based pagination is used for:

- Feed
- User posts
- Followers
- Following
- Comments
- Notifications
- Conversations
- Messages

# Validation

Validation is implemented on both the client and server using **Zod**.

- Client-side validation before sending requests
- Server-side validation through dedicated middleware
- WebSocket message payload validation

# Error Handling

The backend provides centralized error handling.

Validation and application errors return consistent JSON responses.

Example:

```json
{
  "message": "Validation Error",
  "details": {
    "fieldErrors": {
      "username": ["Min username length is 3"]
    }
  }
}
```

Unexpected backend errors can additionally be reported to **BugAnalyzer** for automated analysis.

The error report contains the service name, request information and error details. BugAnalyzer analyzes the error using Google Gemini and stores the result in PostgreSQL.

If BugAnalyzer is unavailable, it should not prevent the Social Media App from returning its normal HTTP error response.

# Environment Variables

## Frontend

```env
VITE_API_URL=
```

Base URL of the REST API.

```env
VITE_WS_URL=
```

WebSocket server URL used for real-time elements.

## Backend

```env
PORT=
```

Port on which the backend server will run.

```env
DATABASE_URL=
```

MongoDB connection string.

```env
JWT_SECRET=
```

Secret used to sign and verify JWT access tokens.

```env
SUPABASE_URL=
```

Supabase project URL.

```env
SUPABASE_SECRET_KEY=
```

Supabase service role key used for file uploads.

```env
BUG_ANALYZER_API_URL=
```

Base URL of the BugAnalyzer API.

```env
BUG_ANALYZER_KEY=
```

Authentication key used when sending error reports to BugAnalyzer.

# Installation

Clone the repository:

```bash
git clone https://github.com/ZajacMateusz1/SocialMediaApp.git && cd SocialMediaApp
```

Install backend dependencies:

```bash
cd backend && npm install
```

In a new terminal install frontend dependencies:

```bash
cd blog-app-frontend && npm install
```

Configure the required environment variables for both the frontend and backend.

Start the backend development server:

```bash
cd backend && npm run dev
```

Start the frontend development server:

```bash
cd blog-app-frontend && npm run dev
```

Start BugAnalyzer separately and configure `BUG_ANALYZER_API_URL` and `BUG_ANALYZER_KEY` if automated error analysis is enabled.

# Future Improvements

- Additional unit tests
