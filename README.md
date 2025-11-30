# Employee Attendance System

A full-stack Employee Attendance System with role-based access (Manager & Employee).  
Built with React + Redux Toolkit + Tailwind on the frontend, Node.js + Express + MongoDB on the backend. This repository contains both local and Docker workflows for development and demo.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Folder Structure](#folder-structure)  
- [Prerequisites](#prerequisites)  
- [Environment Variables](#environment-variables)  
- [Local Development (no Docker)](#local-development-no-docker)  
- [Docker Development / Demo](#docker-development--demo)  
- [Seeding the Database](#seeding-the-database)  
- [Usage / Test Flow](#usage--test-flow)  
- [API Endpoints](#api-endpoints)  
- [Troubleshooting](#troubleshooting)  
- [Production Notes & Hardening](#production-notes--hardening)  
- [Acknowledgements](#acknowledgements)

---

## Features

### Employee
- Register and Login  
- Mark Check-In and Check-Out  
- View today's attendance and history  
- Edit / View Profile

### Manager
- Manager login  
- Dashboard: quick stats (present / absent / total)  
- View all attendance records  
- Export attendance as CSV  
- Team calendar placeholder UI

---

## Tech Stack

**Frontend**
- React, Vite, Redux Toolkit, Tailwind CSS, Axios

**Backend**
- Node.js, Express, Mongoose, JWT Authentication

**Database**
- MongoDB (local or Docker)

**Dev / Ops**
- Docker, Docker Compose, nginx (serving static frontend in Docker setup)

---

## Folder Structure

