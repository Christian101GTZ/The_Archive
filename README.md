# The Archive Project

### Web Development Final Project

Submitted by: **Christian Gomez Diaz**

The Archive Project is a community-driven platform dedicated to preserving historical artifacts, physical media, lost media, books, games, films, music, and other culturally significant items. Registered users can securely create an account, log in, submit artifacts with images and descriptions, browse and search the archive, vote on posts, leave comments, and manage their own contributions through Supabase Authentication and Row Level Security (RLS).

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

- [x] Users can add additional characteristics to their posts
  - [x] Upload images directly from their local computer
  - [x] Images stored using Supabase Storage

- [x] Loading state displayed while data is being fetched

---

# Additional Features

The following **additional** features are implemented:

- [x] Secure user authentication using Supabase Authentication
- [x] User registration and login system
- [x] Protected routes for authenticated users
- [x] Row Level Security (RLS) for secure database access
- [x] Ownership verification for editing and deleting artifacts
- [x] Ownership verification for deleting comments
- [x] Upvote and downvote voting system
- [x] One vote per user per artifact
- [x] Vote switching (change from upvote to downvote and vice versa)
- [x] Vote removal by clicking the same vote again
- [x] Comment count displayed on artifact cards
- [x] Users can delete their own comments
- [x] Responsive layout for desktop and mobile devices
- [x] Image preview while editing artifacts
- [x] Search functionality
- [x] Multiple sorting options
- [x] Reusable React components
- [x] Shared ArtifactForm component for creating and editing artifacts
- [x] Modular CSS organization
- [x] Empty-state messages
- [x] Success and error notifications
- [x] Hero landing page

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

## Project Structure

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

> **Add your ScreenToGif recording here before submission.**

```html
<img src="YOUR_GIF_LINK_HERE" title="Video Walkthrough" width="100%" alt="Video Walkthrough" />
```

GIF created with **ScreenToGif**.

---

# Challenges Encountered

One of the biggest challenges during development was implementing secure user authentication while ensuring users could only modify their own content. After integrating Supabase Authentication, every artifact and comment needed to be associated with the authenticated user's account.

Implementing Row Level Security (RLS) was another significant challenge. Database policies were created to ensure only authenticated users could create content and that only the owner of an artifact or comment could edit or delete it. This added an important layer of security while keeping the application user-friendly.

Another major challenge involved redesigning the voting system. The original implementation simply stored a vote count on each artifact. This was replaced with a dedicated **Votes** table that stores one vote per user per artifact. This design allows users to upvote, downvote, switch votes, or remove their vote while preventing duplicate votes and keeping vote totals accurate.

As the project continued to grow, many components became increasingly large and difficult to maintain. To improve organization, the application was refactored into reusable React components and shared functionality. Components such as **ArtifactForm**, **Navbar**, and the authentication context helped simplify the codebase and reduce duplication.

Working with Supabase Storage also required coordinating image uploads with database operations so uploaded images were stored correctly and their public URLs were saved alongside each artifact.

Overall, this project provided valuable experience building a full-stack React application using authentication, cloud storage, relational databases, reusable components, CRUD operations, and secure user permissions.

---

# Future Improvements

Possible future improvements include:

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

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an **"AS IS" BASIS**, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.