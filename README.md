# Web Development Final Project - The Archive

Submitted by: **Christian Gomez Diaz**

This web app, **The Archive**, is a community-driven platform where users can document and preserve historical artifacts, media, and culturally significant items. Users can submit artifacts with images and descriptions, search and sort the archive, vote on artifacts, leave comments, and edit or delete their own submissions.

Time spent: **15** hours spent in total

---

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - [x] Form requires users to add a post title
  - [x] Users have the option to add:
    - [x] Additional textual content
    - [x] An uploaded image

- [x] **Web app includes a home feed displaying previously created posts**
  - [x] Displays all previously submitted artifacts
  - [x] Each artifact displays:
    - [x] Creation time
    - [x] Title
    - [x] Vote count
  - [x] Clicking **View Artifact** opens the artifact details page

- [x] **Users can view posts in different ways**
  - [x] Users can sort artifacts by:
    - [x] Creation time
    - [x] Vote count
  - [x] Users can search artifacts by title

- [x] **Users can interact with each post in different ways**
  - [x] Each artifact has its own details page
  - [x] Details page displays:
    - [x] Description
    - [x] Image
    - [x] Comments
  - [x] Users can leave comments
  - [x] Users can upvote artifacts
  - [x] Vote count updates immediately

- [x] **A post that a user previously created can be edited or deleted from its post page**
  - [x] Users can edit artifacts
  - [x] Users can delete artifacts

---

## Optional Features

The following **optional** features are implemented:

- [ ] Web app implements pseudo-authentication

- [ ] Users can repost previous posts

- [ ] Users can customize the interface

- [x] Users can add more characteristics to their posts
  - [x] Upload images directly from their local computer
  - [x] Images are stored using Supabase Storage

- [x] Web app displays a loading state while data is being fetched

---

## Additional Features

The following **additional** features are implemented:

- [x] Upvote and downvote functionality
- [x] Comment count displayed on each artifact card
- [x] Users can delete comments
- [x] Responsive design for desktop and mobile devices
- [x] Image preview while editing an artifact
- [x] Search and sort controls
- [x] Reusable React components
- [x] Shared ArtifactForm component used for both creating and editing artifacts
- [x] CSS organized into multiple modular stylesheet files
- [x] Empty-state messages when there are no artifacts or comments
- [x] Success and error messages for user actions

---

## Technologies Used

- React
- Vite
- JavaScript
- React Router
- Supabase
- Supabase Storage
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
├── pages/
│   ├── ArtifactDetails.jsx
│   ├── EditArtifact.jsx
│   ├── Home.jsx
│   └── SubmitArtifact.jsx
│
├── services/
│   └── supabaseClient.js
│
├── styles/
│   ├── artifact-details.css
│   ├── artifact-form.css
│   ├── global.css
│   ├── home.css
│   └── navbar.css
│
├── App.css
├── App.jsx
└── main.jsx
```

---

## Video Walkthrough

Here's a walkthrough of the implemented user stories:

<img src="YOUR_GIF_LINK_HERE" title="Video Walkthrough" width="100%" alt="Video Walkthrough" />

GIF created with **ScreenToGif**.

---

## Challenges Encountered

One of the biggest challenges during development was organizing the application as it became more complex. As additional features such as voting, comments, image uploads, and editing were added, several page components became very large and difficult to maintain.

To solve this, the project was refactored into reusable React components. Components such as `ArtifactForm`, `ArtifactCard`, `ArtifactFeed`, `ArchiveControls`, `CommentList`, and `CommentForm` helped reduce duplicated code and made the application easier to maintain.

Another challenge was sharing the same form between creating and editing artifacts. Instead of maintaining two nearly identical forms, a reusable `ArtifactForm` component was created that accepts props depending on whether the user is creating a new artifact or editing an existing one.

Working with Supabase Storage also required coordinating image uploads with database operations so that uploaded images were stored correctly and their public URLs were saved with each artifact.

Finally, the original stylesheet became very large, so it was reorganized into separate CSS files for global styles, navigation, the home page, artifact details, and forms to improve readability and maintainability.

---

## Future Improvements

Possible future improvements include:

- User authentication
- User profiles
- Private editing permissions
- Artifact categories
- Category filters
- Saved/bookmarked artifacts
- Theme customization
- Pagination
- Better loading animations
- Related artifact recommendations
- Rich text descriptions
- Image galleries with multiple images per artifact

---

## License

Copyright 2026 Christian Gomez Diaz

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.