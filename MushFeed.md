# MushFeed Demo Concept
Created: 2024-01-15
Last Updated: 2024-01-15

Core Demo Features:
- Feed view with posts
- Hashtag exploration view
- Profile view
- Like and follow functionality
- Auto-generated and user-added hashtags
- Subtle shoppable links in comments (placeholder links)

Demo User accounts:
- anna@mush.style / mush
- tim@mush.style / mush
- joel@moderntalent.io / mush

Sample Content:
- 10 AI influencer profiles (5 men, 5 women):
  1. Sofia Chen (F) - Asian - Minimalist white outfits
  2. Marcus Johnson (M) - Black - Urban streetwear in red
  3. Priya Patel (F) - Indian - Luxury fashion in gold/black
  4. Diego Ramirez (M) - Mexican - Vintage style in blue
  5. Emma Wilson (F) - White - Sustainable fashion in green
  6. Raj Kumar (M) - Indian - Tech-wear in silver/black
  7. Yuki Tanaka (M) - Asian - Avant-garde in purple
  8. Isabella Martinez (F) - Mexican - Boho chic in pink
  9. James Anderson (M) - White - Classic menswear in navy
  10. Zara Williams (F) - Black - Contemporary in yellow
- Each profile has 10 curated posts
- Consistent color palette per influencer
- Distinct personality and style narrative
- Sample engagement (likes/comments) pre-populated

Data Structure:
- Users
  - id, email, password, name, profile_pic
  - following[] and followers[] arrays
- Posts
  - id, user_id, image_url, caption
  - hashtags[], likes[]
  - timestamp, shopping_links[]

UI/UX Focus:
- Instagram-like feed layout
- Profile grid layout
- Hashtag exploration grid
- Smooth animations and transitions
- Double-tap to like
- Skeleton loading states
- Pull-to-refresh animation

Technical Notes:
- Simple JWT authentication for demo users
- Paginated feed (20 posts per page)
- Using stock photos initially
- Basic REST API endpoints
- No complex caching/scaling needed for demo
- Shopping integration deferred to later phase
- Focus on core social interactions first

What We're Demonstrating:
1. Lower barrier to entry for content creation
   - Professional-looking content with minimal effort
   - AI enhancement of regular photos (future feature)

2. Scalable synthetic content
   - AI-generated influencer profiles
   - Engaging feed content from day one

3. Basic discovery features
   - Hashtag-based content discovery
   - Profile exploration
   - Subtle shopping integration

Future Considerations (Not In Demo):
- Full AI influencer system (1000+ profiles)
- Direct messaging
- Comments system
- Content moderation
- Real product shopping integration
- AI image generation and enhancement


