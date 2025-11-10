# Movie Watchlist App

A full-featured movie watchlist application with AI-powered recommendations, built with React, Supabase, and TMDB API.

## Features

### User Authentication
- Secure sign up and login with email and password
- Protected routes for authenticated users
- User profile with personalized statistics

### Movie Search & Discovery
- Real-time movie search powered by TMDB API
- Beautiful grid layout displaying movie posters, titles, release years, and synopses
- Add movies to your personal watchlist with one click

### Watchlist Management
- View all saved movies in your watchlist
- Remove movies from watchlist
- Mark movies as watched with a rating

### Rating System
- 5-star rating system with half-star increments (0.5 to 5.0)
- Modal popup for rating movies when marking as watched
- Edit ratings anytime from the Watched Movies page
- View all watched movies with ratings and dates

### User Profile
- Display username
- Total movies in watchlist counter
- Total movies watched counter
- Average rating calculation and visualization

### AI-Powered Recommendations
- Smart movie recommendations based on your 4+ star ratings
- AI-generated explanations for each recommendation
- Supports both OpenAI and Claude APIs
- "Add to Watchlist" and "Not Interested" options
- Refresh recommendations anytime
- Fallback to popular movies if AI API not configured

## Tech Stack

- **Frontend**: React 19, React Router
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Movie Data**: TMDB API
- **AI Recommendations**: OpenAI or Claude API (optional)

## Prerequisites

1. Node.js (v16 or higher)
2. A Supabase account and project
3. A TMDB API key
4. (Optional) OpenAI or Claude API key for AI recommendations

## Setup Instructions

### 1. Get Your API Keys

#### TMDB API Key
1. Create a free account at [TMDB](https://www.themoviedb.org/)
2. Go to Settings > API
3. Request an API key
4. Copy your API key

#### OpenAI API Key (Optional)
1. Create an account at [OpenAI](https://platform.openai.com/)
2. Go to API Keys section
3. Create a new API key
4. Copy your API key

#### Claude API Key (Optional)
1. Create an account at [Anthropic](https://www.anthropic.com/)
2. Access the API console
3. Generate an API key
4. Copy your API key

### 2. Configure Environment Variables

The `.env` file is already set up with Supabase credentials. You just need to add your TMDB API key:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

Optional: Add AI API key for recommendations (choose one):

```bash
# For OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key_here

# OR for Claude
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

The database schema is already set up in Supabase. Simply start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── MovieCard.jsx
│   ├── StarRating.jsx
│   ├── RatingModal.jsx
│   ├── ProtectedRoute.jsx
│   └── Recommendations.jsx
├── pages/              # Page components
│   ├── SignUp.jsx
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── Watchlist.jsx
│   ├── WatchedMovies.jsx
│   └── Profile.jsx
├── context/            # React context providers
│   └── AuthContext.jsx
├── services/           # API services
│   ├── supabase.js
│   └── tmdb.js
├── hooks/              # Custom React hooks
│   └── useDebounce.js
├── utils/              # Utility functions
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Database Schema

The app uses four main tables in Supabase:

1. **profiles**: Extended user profile information
2. **watchlist**: Movies saved to user's watchlist
3. **watched_movies**: Movies the user has watched and rated
4. **user_preferences**: User preferences including "not interested" movies

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.

## Usage

1. **Sign Up**: Create a new account with email, password, and username
2. **Search Movies**: Use the search bar to find movies
3. **Add to Watchlist**: Click "Add to Watchlist" on any movie
4. **Mark as Watched**: Go to your watchlist and click "Mark as Watched" to rate a movie
5. **Rate Movies**: Use the star rating system to rate movies (0.5 to 5.0)
6. **View Stats**: Check your profile for statistics
7. **Get Recommendations**: AI will suggest movies based on your 4+ star ratings

## Features in Detail

### Responsive Design
The app is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

### Security
- Row Level Security on all database tables
- Protected routes requiring authentication
- Secure password hashing with Supabase Auth
- API keys stored as environment variables

### User Experience
- Loading states for all async operations
- Success/error messages for user actions
- Smooth animations and transitions
- Intuitive navigation
- Mobile-friendly hamburger menu

## Notes

- The AI recommendations feature requires either an OpenAI or Claude API key
- Without an AI API key, the app will show popular movie recommendations
- TMDB API has a rate limit of 40 requests per 10 seconds
- All movie data and images are provided by TMDB

## License

ISC
