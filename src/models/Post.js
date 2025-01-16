const postSchema = {
  creator: {
    id: String,
    name: String,
    profile: Object
  },
  image: {
    url: String,
    prompt: String
  },
  caption: String,
  timestamp: Date,
  engagement: {
    likes: Number,
    comments: Number
  }
}; 