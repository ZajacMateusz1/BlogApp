# Social Media App

# Important

Backend is hosted on Render free, so the first request may take up to ~50 seconds due to cold start.

## [Live demo](blog-app-coral-one.vercel.app)

A full-stack social media application built with **React**, **TypeScript**, **Express** and **MongoDB**.

Features include authentication, user profiles, posts, image uploads, likes, comments, follow relationships, and personalized feeds.

## Project Evolution

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

## Validation

- Client-side validation using **React Hook Form** and **Zod**
- Server-side request validation using **Zod**

## Notifications

- Custom toast notification system

## File Uploads

- Image uploads using **Multer**
- Images stored in **Supabase Storage**

## Error Handling

- Centralized error handling middleware
- Custom `HttpError` class
- Consistent API error responses

## Database

- MongoDB with Mongoose
- Transactions for improved data consistency

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
- [**Vitest**](https://vitest.dev/)
- [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro)

## Backend

- [**Node.js**](https://nodejs.org/)
- [**Express**](https://expressjs.com/)
- [**TypeScript**](https://www.typescriptlang.org/)
- [**MongoDB**](https://www.mongodb.com/)
- [**Mongoose**](https://mongoosejs.com/)
- [**Zod**](https://zod.dev/)
- [**Multer**](https://github.com/expressjs/multer)
- [**Supabase Storage**](https://supabase.com/storage)
- [**bcrypt**](https://github.com/kelektiv/node.bcrypt.js)

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
│   │   │   ├── posts
│   │   │   └── users
│   │   ├── types
│   │   └── utils
│   └── tests
└── blog-app-frontend
    ├── src
    │   ├── assets
    │   ├── modules
    │   │   ├── auth
    │   │   ├── home
    │   │   ├── posts
    │   │   ├── shared
    │   │   └── users
    │   ├── router
    │   └── utils
    └── tests
```

Each module contains its own components, business logic, validation, types.

# HTTP Requests

API communication is handled with **React Query**, providing:

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
| POST   | `/api/posts/create`           | Create a new post with optional image upload.          |
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

# Authentication

The backend uses JWT authentication.

Protected endpoints require:

```http
Authorization: Bearer <token>
```

The frontend stores the access token and automatically logs the user out when it expires.

# Pagination

Cursor-based pagination is used for:

- Feed
- User posts
- Followers
- Following
- Comments

# Validation

Validation is implemented on both the client and server using **Zod**.

- Client-side validation before sending requests
- Server-side validation through dedicated middleware

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

# Environment Variables

## Frontend

```env
VITE_API_URL=
```

## Backend

```env
PORT=

DATABASE_URL=

JWT_SECRET=

SUPABASE_URL=

SUPABASE_SECRET_KEY=
```

# Installation

Clone the repository:

```bash
git clone https://github.com/ZajacMateusz1/SocialMediaApp
```

Install dependencies for both frontend and backend:

```bash
npm install
```

Configure environment variables.

Start the development servers for frontend and backend:

```bash
npm run dev
```

# Future Improvements

- Real-time notifications using WebSockets
- Real-time chat using WebSockets
- Additional unit tests
- Rate limiting
