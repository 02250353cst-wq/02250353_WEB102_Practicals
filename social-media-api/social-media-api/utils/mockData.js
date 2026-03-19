// Mock Users Data
const users = [
  {
    id: "1",
    username: "traveler",
    email: "traveler@example.com",
    full_name: "Karma",
    profile_picture: "https://example.com/profiles/traveler.jpg",
    bio: "Travel photographer",
    created_at: "2023-01-15"
  },
  {
    id: "2",
    username: "foodie_adventures",
    email: "foodie@example.com",
    full_name: "Tashi Dorji",
    profile_picture: "https://example.com/profiles/foodie.jpg",
    bio: "Food explorer and recipe creator",
    created_at: "2023-02-20"
  },
  {
    id: "3",
    username: "nature_lens",
    email: "nature@example.com",
    full_name: "Pema Wangchuk",
    profile_picture: "https://example.com/profiles/nature.jpg",
    bio: "Wildlife and nature photographer",
    created_at: "2023-03-10"
  }
];

// Mock Posts Data
const posts = [
  {
    id: "1",
    caption: "Beautiful sunset in the mountains! #travel #nature",
    image: "https://example.com/posts/sunset.jpg",
    user_id: "1",
    likes_count: 245,
    comments_count: 18,
    created_at: "2023-06-15"
  },
  {
    id: "2",
    caption: "Tried this amazing local dish today! #food #culture",
    image: "https://example.com/posts/food.jpg",
    user_id: "2",
    likes_count: 189,
    comments_count: 24,
    created_at: "2023-06-18"
  },
  {
    id: "3",
    caption: "Spotted a rare bird species this morning #wildlife",
    image: "https://example.com/posts/bird.jpg",
    user_id: "3",
    likes_count: 312,
    comments_count: 31,
    created_at: "2023-06-20"
  },
  {
    id: "4",
    caption: "Morning hike views are always worth it! #hiking #mountains",
    image: "https://example.com/posts/hike.jpg",
    user_id: "1",
    likes_count: 178,
    comments_count: 12,
    created_at: "2023-06-22"
  }
];

// Mock Comments Data
const comments = [
  {
    id: "1",
    text: "Absolutely stunning view!",
    user_id: "2",
    post_id: "1",
    created_at: "2023-06-15"
  },
  {
    id: "2",
    text: "Where is this place? I need to visit!",
    user_id: "3",
    post_id: "1",
    created_at: "2023-06-16"
  },
  {
    id: "3",
    text: "This food looks delicious! What restaurant?",
    user_id: "1",
    post_id: "2",
    created_at: "2023-06-18"
  },
  {
    id: "4",
    text: "Amazing shot! What camera do you use?",
    user_id: "1",
    post_id: "3",
    created_at: "2023-06-20"
  }
];

// Mock Likes Data
const likes = [
  { id: "1", user_id: "2", post_id: "1", created_at: "2023-06-15" },
  { id: "2", user_id: "3", post_id: "1", created_at: "2023-06-15" },
  { id: "3", user_id: "1", post_id: "2", created_at: "2023-06-18" },
  { id: "4", user_id: "3", post_id: "2", created_at: "2023-06-19" },
  { id: "5", user_id: "1", post_id: "3", created_at: "2023-06-20" },
  { id: "6", user_id: "2", post_id: "3", created_at: "2023-06-21" }
];

// Mock Followers Data
const followers = [
  { id: "1", follower_id: "2", following_id: "1", created_at: "2023-04-10" },
  { id: "2", follower_id: "3", following_id: "1", created_at: "2023-04-15" },
  { id: "3", follower_id: "1", following_id: "2", created_at: "2023-04-20" },
  { id: "4", follower_id: "1", following_id: "3", created_at: "2023-05-01" }
];

module.exports = { users, posts, comments, likes, followers };
