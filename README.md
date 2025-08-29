# 🎬 Netflex

A full-stack movie streaming platform inspired by Netflix, built with **Next.js, Supabase, and TailwindCSS**.  
It supports user authentication, movie upload, watchlist, likes/dislikes, and a polished UI similar to Netflix.

---

## 🚀 Features

- 🔑 **Authentication** with Supabase (sign up, login, logout)  
- 🎥 **Movie upload** (title, description, genre + video storage in Supabase)  
- ❤️ **Like/Dislike reactions** per user per movie (YouTube style)  
- ⭐ **Watchlist support** (add/remove movies to your personal list)  
- 📺 **Responsive Netflix-style UI** (grid, banners, hover effects)  
- 🔍 **Browse movies** with genres & descriptions  
- 🗄️ **Supabase backend** for DB + file storage  

---

## 📸 Screenshots

<div align="center">
  <img src="public/readmepicture/i1.jpg" width="80%" alt="Homepage" />
  <br/><br/>
  <img src="public/readmepicture/i2.jpg" width="80%" alt="Movie Details" />
  <br/><br/>
  <img src="public/readmepicture/i3.jpg" width="80%" alt="Dashboard / Upload" />
</div>

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React 18, App Router), TailwindCSS  
- **Backend & Auth:** Supabase (Postgres + Auth + Storage)  
- **UI Components:** Shadcn/UI, Lucide Icons, Framer Motion  

---

## 📂 Project Structure

netflex/
 ┣ components/        # Reusable UI components
 ┣ lib/               # Supabase client
 ┣ pages/             # Next.js pages
 ┣ public/            # Static assets (including readme screenshots)
 ┣ styles/            # TailwindCSS styles
 ┗ utils/             # Helpers


#### its important made lib folder in root then made supabase.js in it then configure here supabase client.
## Made by Himanshu