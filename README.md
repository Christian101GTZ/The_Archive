# The Archive Project

### Web Development Final Project

Submitted by: **Christian Gomez Diaz**

## Live Demo

🌐 **Website:** https://thearchive101.netlify.app

---

## Overview

The Archive Project is a full-stack React app for saving and sharing media worth keeping — things like physical media, lost media, books, games, films, and music. Users can make an account, log in, and post an item with a picture and description. Anyone can browse, search, vote, and comment, and you can edit or delete your own posts. Logins and permissions are handled by Supabase.

Time spent: **50+** hours in total

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
├── components/         Reusable UI pieces
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
├── context/            Global login state
│   └── AuthContext.jsx
│
├── hooks/              Reusable logic
│   └── useComments.js
│
├── pages/              One file per page/route
│   ├── ArtifactDetails.jsx
│   ├── EditArtifact.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── SignUp.jsx
│   └── SubmitArtifact.jsx
│
├── services/           Talks to Supabase
│   ├── supabaseClient.js
│   └── votes.js
│
├── styles/             CSS files
│   ├── artifact-details.css
│   ├── artifact-form.css
│   ├── auth.css
│   ├── global.css
│   ├── home.css
│   └── navbar.css
│
├── App.css
├── App.jsx             Main layout and routes
└── main.jsx            App entry point
```

---

# Video Walkthrough

Here's a walkthrough of the implemented user stories.

### Desktop

<img src="src/assets/Final_Project.gif" title="Desktop walkthrough" width="100%" alt="Desktop walkthrough of The Archive Project" />

### Mobile

<img src="src/assets/Final_Project_Phone.gif" title="Mobile walkthrough" width="300" alt="Mobile walkthrough of The Archive Project" />

---

# Challenges Encountered

The hardest part was making sure users could only change their own posts and comments. Every post and comment is tied to the account that made it, and Supabase's Row Level Security (RLS) rules block anyone else from editing or deleting it.

The voting system also took a few tries. At first each post just stored a single number for its score. I replaced that with a separate Votes table that saves one vote per user per post, which made it possible to switch a vote, remove a vote, and stop people from voting twice.

As the app grew, some files got too big. Splitting them into smaller, reusable components (and one shared form) made the code easier to read and cut down on repeated code.

Image uploads were tricky too, since the picture has to be saved to storage first and then its link saved with the post.

Overall this project was great practice at building a full app with logins, file storage, a database, reusable components, and secure permissions.

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