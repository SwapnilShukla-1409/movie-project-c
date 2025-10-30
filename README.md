Favorite Movies & TV Shows Application

This is a full-stack web application built for a coding challenge. It allows users to register, log in, and manage a personal list of their favorite movies and TV shows.

The app features a secure backend API with user authentication and a modern, responsive React frontend with infinite scrolling, search, and filtering.

<!-- You should take a screenshot of your running application and add it here! -->

Features

User Authentication: Full auth flow (Register, Login, Logout) using JWTs stored in secure, http-only cookies.

Full CRUD: Users can Create, Read, Update, and Delete movie/TV show entries.

Infinite Scrolling: The main table automatically loads more entries as the user scrolls, powered by TanStack Query.

Search & Filter: Users can search by title (debounced) and filter by type (Movie/TV Show).

Image Support: Users can add poster URLs, which are displayed in the table.

Type-Safe API: End-to-end type safety from the database to the frontend using Prisma, Zod, and TypeScript.

Modern UI: Built with Tailwind CSS and Shadcn UI components for a clean, responsive, and accessible user experience.

Tech Stack

Frontend

Framework: React (Vite + TypeScript)

Styling: Tailwind CSS (v4)

Component Library: Shadcn UI

State Management: TanStack Query (React Query)

Forms: React Hook Form

Validation: Zod

Routing: React Router DOM

Backend

Framework: Node.js with Express

Database: MySQL

ORM: Prisma

Validation: Zod

Authentication: JSON Web Tokens (JWT) & cookie-parser

Local Setup & Installation

Follow these steps to run the project on your local machine.

Prerequisites

Node.js: v18 or newer (LTS recommended)

Git: To clone the repository

Code Editor: VS Code (recommended)

Database: A running MySQL server. Option A (Docker) is highly recommended.

Step 1: Clone the Repository

git clone [https://github.com/your-username/movie-project.git](https://github.com/your-username/movie-project.git)
cd movie-project


Step 2: Set Up the MySQL Database

You must have a MySQL server running. You have two main options:

Option A: Run with Docker (Recommended)

This is the cleanest and easiest way to get a database running.

Make sure Docker Desktop is installed and running.

Run the following command in your terminal to start a MySQL container:

docker run -d --name mysql-movie-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mysecretpassword -e MYSQL_DATABASE=fav_movies mysql:latest


This creates a database named fav_movies with a root password of mysecretpassword.

Your database is now running at localhost:3306.

Option B: Manual MySQL (XAMPP / Local Install)

Install and run a local MySQL server (e.g., via XAMPP).

Open your MySQL admin tool (like phpMyAdmin at http://localhost/phpmyadmin).

Create a new database named fav_movies.

Your connection details will likely be:

User: root

Password: (empty by default)

Host: localhost

Port: 3306

Step 3: Configure the Backend

Navigate to the backend folder:

cd backend


Copy the example environment file:

cp .env.example .env


Edit the .env file:
Open .env in your code editor and update the DATABASE_URL with your database password from Step 2.

If you used Docker:

DATABASE_URL="mysql://root:mysecretpassword@localhost:3306/fav_movies"


If you used XAMPP (no password):

DATABASE_URL="mysql://root:@localhost:3306/fav_movies"


Important: Also set a JWT_SECRET (can be any long, random string).

Install backend dependencies:

npm install


Generate the Prisma Client:

npx prisma generate


Run the database migration (this creates the tables):

npx prisma migrate dev


Step 4: Configure the Frontend

Open a new terminal.

Navigate to the frontend folder:

cd frontend


Install frontend dependencies:

npm install


Step 5: Run the Application

You need two terminals running at the same time.

In your first terminal (Backend):

cd backend
npm run dev


(The backend server will start on http://localhost:5000)

In your second terminal (Frontend):

cd frontend
npm run dev


(The frontend app will open in your browser at http://localhost:5173)

You can now register a new user and start using the application!