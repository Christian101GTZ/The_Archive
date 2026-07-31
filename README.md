# The Archive Project

### Web Development Final Project

Submitted by: **Christian Gomez Diaz**

## Live Demo

🌐 **Website:** https://thearchive101.netlify.app

---

## Overview

The Archive Project is a full-stack React web application dedicated to preserving historical artifacts, physical media, lost media, books, games, films, music, and other culturally significant items. Registered users can securely create an account, log in, submit artifacts with images and descriptions, browse and search the archive, vote on posts, leave comments, and manage their own contributions through Supabase Authentication and Row Level Security (RLS).

Time spent: **50+** hours spent in total

---

# Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - [x] Form requires users to add a post title
  - [x] Users have the option to add:
    - [x] Additional textual content
    - [x] Uploaded image

- [x] **Web app includes a home feed displaying previously created posts**
  - [x] Displays all submitted artifacts
  - [x] Each artifact displays:
    - [x] Creation time
    - [x] Title
    - [x] Current vote score
  - [x] Clicking **View Post** opens the artifact details page

- [x] **Users can view posts in different ways**
  - [x] Users can sort artifacts by:
    - [x] Newest
    - [x] Oldest
    - [x] Most Upvoted
    - [x] Alphabetically (A–Z)
  - [x] Users can search artifacts by title

- [x] **Users can interact with each post in different ways**
  - [x] Every artifact has its own details page
  - [x] Details page displays:
    - [x] Description
    - [x] Uploaded image
    - [x] Comments
  - [x] Users can leave comments
  - [x] Users can upvote and downvote artifacts
  - [x] Vote score updates immediately

- [x] **A post that a user previously created can be edited or deleted**
  - [x] Users can edit their own artifacts
  - [x] Users can delete their own artifacts

---

# Optional Features

The following **optional** functionality is completed:

- [x] Users can upload images directly from their local computer
- [x] Images stored using Supabase Storage
- [x] Loading state displayed while data is being fetched

---

# Additional Features

The following **additional** features are implemented:

- [x] Secure user authentication using Supabase Authentication
- [x] User registration and login system
- [x] Protected routes
- [x] Row Level Security (RLS)
- [x] Ownership verification for editing and deleting artifacts
- [x] Ownership verification for deleting comments
- [x] Upvote and downvote voting system
- [x] One vote per user per artifact
- [x] Vote switching
- [x] Vote removal
- [x] Comment count displayed on artifact cards
- [x] Responsive design
- [x] Image preview while editing
- [x] Search functionality
- [x] Multiple sorting options
- [x] Reusable React components
- [x] Shared ArtifactForm component
- [x] Modular CSS architecture
- [x] Empty-state messages
- [x] Success and error notifications

---

# Technologies Used

- React
- Vite
- JavaScript (ES6+)
- React Router
- Supabase
  - Database
  - Authentication
  - Storage
- SQL
- HTML5
- CSS3
- Git
- GitHub

---

# Installation

Clone the repository

```bash
git clone https://github.com/Christian101GTZ/The_Archive.git
```

Navigate into the project

```bash
cd The_Archive
```

Install dependencies

```bash
npm install
```

Create a `.env` file and add:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Run the development server

```bash
npm run dev
```

---

# Project Structure

```text
src/
├── components/
│   ├── ArchiveControls.jsx
│   ├── ArtifactCard.jsx
│   ├── ArtifactDetailsActions.jsx
│   ├── ArtifactDetailsHeader.jsx
│   ├── ArtifactFeed.jsx
│   ├── ArtifactForm.jsx
│   ├── CommentCard.jsx
│   ├── CommentForm.jsx
│   ├── CommentList.jsx
│   └── Navbar.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── pages/
│   ├── ArtifactDetails.jsx
│   ├── EditArtifact.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── SignUp.jsx
│   └── SubmitArtifact.jsx
│
├── services/
│   ├── auth.js
│   └── supabaseClient.js
│
├── styles/
│   ├── artifact-details.css
│   ├── artifact-form.css
│   ├── auth.css
│   ├── global.css
│   ├── home.css
│   └── navbar.css
│
├── App.css
├── App.jsx
└── main.jsx
```

---

# Video Walkthrough

Here's a walkthrough of the implemented user stories.

> Add your ScreenToGif recording here before submission.

```html
<img src="YOUR_GIF_LINK_HERE" title="Video Walkthrough" width="100%" alt="Video Walkthrough" />
```

---

# Challenges Encountered

One of the biggest challenges during development was implementing secure user authentication while ensuring users could only modify their own content. After integrating Supabase Authentication, every artifact and comment needed to be associated with the authenticated user's account.

Implementing Row Level Security (RLS) required creating database policies that restricted database operations based on the authenticated user's ID. This ensured only authorized users could create, edit, or delete their own content.

Another significant challenge was redesigning the voting system. The original implementation stored a vote count directly on each artifact. It was replaced with a dedicated Votes table that stores one vote per user per artifact, allowing users to switch votes, remove votes, and preventing duplicate voting.

As the project expanded, many components became increasingly large. Refactoring the application into reusable React components and modular CSS significantly improved maintainability and reduced duplicated code.

Working with Supabase Storage also required coordinating image uploads with database operations so uploaded images were stored correctly and their public URLs were saved alongside each artifact.

Overall, this project provided valuable experience building a full-stack React application using authentication, cloud storage, relational databases, reusable components, CRUD operations, and secure user permissions.

---

# Future Improvements

- User profile pages
- User avatars
- Bookmark favorite artifacts
- Artifact categories
- Category filtering
- Rich text descriptions
- Multiple images per artifact
- Notification system
- Repost/thread functionality
- Theme customization
- Infinite scrolling
- Better loading animations
- Related artifact recommendations
- Admin moderation tools

---

# License

Copyright 2026 Christian Gomez Diaz

Licensed under the Apache License, Version 2.0.