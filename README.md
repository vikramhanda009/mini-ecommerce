🚀 Mini E-Commerce Application

🔗 Live Demo: https://mini-ecommerce-three-psi.vercel.app/

🔗 GitHub Repo: https://github.com/vikramhanda009/mini-ecommerce

📌 Overview

This is a ReactJS-based Mini E-Commerce Application built as part of a technical assignment.
The application demonstrates modern frontend development practices including state management, routing, performance optimization, and UI/UX design.

🛠️ Tech Stack
⚛️ ReactJS (Functional Components + Hooks)
🧠 Redux Toolkit (State Management)
🔁 React Router (Routing)
🎨 Styled Components + CSS
🌐 REST APIs (FakeStore API + DummyJSON)
🚀 Vercel (Deployment)
✨ Features
🏠 Product Listing Page (/)
Fetches and displays 100+ products
Product card includes:
Image
Title
Price
Short description
🔍 Search functionality (filter by title)
🎯 Filters:
Category
Size
⚡ Infinite scrolling (no pagination)
🧠 Memoized filtering for performance
📄 Product Details Page (/product/:id)
Displays:
Large product image
Title
Category
Full description
Price
⚡ Performance Optimizations
Memoization using createSelector
Lazy rendering (infinite scroll)
Avoid unnecessary re-renders
Efficient state updates with Redux
🎨 UI/UX Enhancements
Clean and responsive design
Skeleton loading state
Error handling with retry option
Reset filters button
Smooth scrolling experience
📦 Installation & Setup
# Clone the repository
git clone https://github.com/vikramhanda009/mini-ecommerce

# Navigate to project
cd mini-ecommerce

# Install dependencies
npm install

# Run the app
npm run dev
⚙️ Build
npm run build
npm run preview
🧠 Key Design Decisions
Used Redux Toolkit for scalable state management
Combined data from multiple APIs to simulate a large dataset
Used unique IDs (uid) for stable rendering
Implemented selector-based filtering for performance
Avoided pagination → used infinite scroll for better UX
📁 Folder Structure (Simplified)
src/
 ├── app/            # Store configuration
 ├── features/       # Redux slices
 ├── components/     # Reusable UI components
 ├── pages/          # Application pages
 ├── hooks/          # Custom hooks
 └── types/          # Type definitions
🚀 Future Improvements
Add cart functionality
Add authentication
Add product sorting
Improve accessibility (ARIA)
Add unit & integration tests
📬 Contact

Vikram Handa
📧 vikramhanda007@gmail.com