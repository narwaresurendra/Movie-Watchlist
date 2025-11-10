# Movie-Watchlist
Build a Movie Watchlist App with these features:

1. USER AUTHENTICATION
- Sign up and login pages with email and password
- Simple profile page showing username, total movies watched, and total movies in watchlist

2. MOVIE SEARCH & WATCHLIST
- Homepage with a search bar at the top
- Search movies using TMDB API (or OMDb API)
- Display search results in a grid showing: movie poster, title, release year, genre, short synopsis, and "Add to Watchlist" button
- Create a "My Watchlist" page showing all saved movies with "Remove" and "Mark as Watched" buttons
- Store watchlist in database (use PostgreSQL or MongoDB)

3. RATING SYSTEM
- When user clicks "Mark as Watched", show a popup with 5-star rating system (with half-star increments from 0.5 to 5)
- Create a "Watched Movies" page showing all rated movies with their ratings and date rated
- Allow users to edit their ratings anytime
- Display user's average rating on profile page

4. AI-POWERED RECOMMENDATIONS
- Create a "Recommendations" section on homepage
- Use OpenAI API (or Claude API) to analyze user's rated movies (especially 4+ stars) and watchlist
- Display 5-10 recommended movies with: poster, title, year, genre, and an AI-generated explanation of why it's recommended (e.g., "You rated 3 sci-fi thrillers 5-stars, this has similar themes")
- Add "Add to Watchlist" and "Not Interested" buttons for each recommendation
- Include a "Get New Recommendations" button to refresh suggestions

5. TECHNICAL REQUIREMENTS
- Use React for frontend with responsive design (mobile and desktop)
- Use Tailwind CSS for styling
- Modern, clean UI with smooth interactions
- Store data in a database (Supabase or Firebase recommended)
- Integrate TMDB API for movie data
- Integrate OpenAI or Claude API for recommendations

Start by building the authentication and movie search first, then add watchlist, then ratings, then AI recommendations.
