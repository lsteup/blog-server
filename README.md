# BlogSpace (Blogging Platform) API

This project is an API for a blogging platform, developed as part of The Odin Project Node.js curriculum. It serves as an educational exercise to build a backend server with MongoDB, capable of connecting to various frontend websites. The API enables users to register, sign in, and perform CRUD operations on blog posts. Visitors can view published posts and leave comments. Key technologies used include Node.js, Express, bcrypt for password hashing, JSON Web Token for route authentication, and Cloudinary for photo uploads. Swagger UI is integrated to display the available routes.

## Table of Contents

- [Features](#features)
- [Endpoints](#endpoints)
- [Credits](#credits)

## Features

- User registration and login
- Create, read, update, and delete (CRUD) operations on posts
- Edit user profile
- Upload photos to posts and profile
- Delete comments on posts (when logged in)
- View all published posts (public)
- Leave comments on posts (public)

## Endpoints

### `POST /api/v1/auth/register`

Register a new user.

- **Request**:
  - Body: JSON object containing `name`, `email`, `password`, `image`, and `bio (optional)`
- **Response**:
  - 201 Created
  - Body: JSON object of the created user

### `POST /api/v1/auth/login`

Login a user.

- **Request**:
  - Body: JSON object containing `email` and `password`
- **Response**:
  - 200 OK
  - Body: JSON object with JWT token

### `POST /api/v1/posts`

Create a new post (protected route).

- **Request**:
  - Header: `Authorization: Bearer your_jwt_token`
  - Body: JSON object containing `title`, `content`, and `image (optional)`
- **Response**:
  - 200 OK
  - Body: JSON object of the created post

### `GET /api/v1/posts`

Retrieve a list of all published posts.

- **Response**:
  - 200 OK
  - Body: JSON array of posts

### `GET /api/v1/posts/:id`

Retrieve a post by id.

- **Response**:
  - 200 OK
  - Body: JSON object of post

### `PATCH /api/v1/posts/:id`

Update a post by id.

- **Response**:
  - 200 OK
  - Body: JSON object of post

### `DELETE /api/v1/posts/:id`

Delete a post by id.

- **Response**:
  - 200 OK

### `POST /api/v1/posts/upload`

upload an image to the cloud.

- **Request**:
  - Header: `Authorization: Bearer your_jwt_token`
  - Body: JSON object containing `image`
- **Response**:
  - 200 OK

### `GET /api/v1/drafts`

Retrieve a list of all posts, published and unpublished.

- **Response**:
  - 200 OK
  - Body: JSON array of posts

### `GET /api/v1/drafts/:id`

Retrieve a single post, published or unpublished.

- **Response**:
  - 200 OK
  - Body: JSON object of post

### `POST /api/v1/posts/:id/comments`

Leave a comment on a post.

- **Request**:
  - Body: JSON object containing `content` and `name`
- **Response**:
  - 200 OK
  - Body: JSON object of the created comment

### `GET /api/v1/posts/:id/comments`

Retrieve all comments on a post.

- **Response**:
  - 200 OK
  - Body: JSON array of all comments

### `DELETE /api/v1/posts/:id/comments/:id`

Delete a comment by id.

- **Response**:
  - 200 OK

### `GET /api/v1/posts/activity`

Retrieve recent comments on any post by a specific user.

- **Response**:
  - 200 OK
  - Body: JSON array of all comments

### `GET /api/v1/users`

Retrieve a list of all users.

- **Response**:
  - 200 OK
  - Body: JSON array of all users

### `GET /api/v1/users/:id`

Retrieve a single user by id.

- **Response**:
  - 200 OK
  - Body: JSON object of user.

### `PATCH /api/v1/users/profile/edit`

Update profile information.

- **Request**:
  - Body: JSON object optionally containing `name`, `bio`, and `image`
- **Response**:
  - 200 OK
  - Body: JSON object of user.

### Live Demo

- [Live Link](https://blog-server-wto6.onrender.com/)
- [Front End #1](https://blog-user-site.vercel.app/)
- [Front End #2](https://blog-site-three-topaz.vercel.app/)

## Credits

This project is for educational purposes only. It was built as part of The Odin Project Node.js curriculum.
