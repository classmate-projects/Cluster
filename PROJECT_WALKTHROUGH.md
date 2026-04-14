# 🚀 Project Showcase Walkthrough

Welcome to the **ClassMates Project Showcase**! This platform is designed to present your innovative projects with a premium, high-performance aesthetic.

## 🏗️ Architecture Overview

The application is built using **Next.js (App Router)** and **Tailwind CSS v4**, ensuring a modern and scalable foundation.

- **Frontend**: React Server Components (where applicable) and Client Components for interactivity.
- **Styling**: Tailwind v4 with custom design tokens for glassmorphism, gradients, and dark mode.
- **Metadata**: Stored in `src/data/projects.json` and managed via a local API route (`/api/projects`).
- **Icons/Images**: High-quality placeholders from Unsplash to ensure a "stunning" first impression.

---

## 🎭 Role-Based Experiences

### 👨‍💻 Public User View
- **Grid Layout**: Projects are displayed in a clean, responsive grid.
- **Interactivity**: Hovering over a card reveals a "Learn more" invitation.
- **Navigation**: Clicking a card takes you to a **Launch Details** placeholder page, simulating a purchase/info flow.

### 🛡️ Admin View
- **Activation**: Toggle via the **Admin View** button in the bottom right corner.
- **Card Actions**:
  - **Configure**: Opens a modal to edit project metadata (Title, Version, Desc, Thumbnail, Tags, URL).
  - **Access**: Direct link to the project's website.
- **Management**: An "Add Project" tile appears at the end of the grid to create new entries.

---

## 🛠️ Key Components

### 1. Project Grid (`page.js`)
The main hub that orchestrates searching (future), rendering, and state management between Admin and Public views.

### 2. Project Card (`src/components/ProjectCard.js`)
A premium card component with glassmorphism effects, scale transitions, and dynamic action buttons based on permissions.

### 3. Configuration Modal (`src/components/ConfigureModal.js`)
A sophisticated form that allows admins to update project details in real-time. Changes are saved back to the `projects.json` file.

---

## 🚀 Getting Started

1. **Launch**: The site is currently running on `http://localhost:3000`.
2. **Explore**: Scroll through the hero section and view the project grid.
3. **Admin Mode**: Toggle the Admin view and try clicking **Configure** on one of the projects!

---

## 🔭 Future Roadmap
- [ ] **NextAuth Integration**: Replace the dev toggle with secure admin authentication.
- [ ] **Database Migration**: Move from JSON to PostgreSQL or MongoDB for better scalability.
- [ ] **Purchase Flow**: Implement Stripe or LemonSqueezy for project licenses.
- [ ] **Analytics**: Integrate a dashboard for project click-through rates.

---
*Created with ❤️ by Antigravity.*
