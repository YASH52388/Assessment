const STORAGE_KEY = 'school_posts';

// Get all posts
export function getPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Create a new post
export function createPost(post) {
  const posts = getPosts();
  const newPost = {
    id: Date.now(),
    ...post,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };
  posts.unshift(newPost);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return newPost;
}

// Like/unlike a post
export function likePost(postId, userId) {
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      const likes = post.likes || [];
      const isLiked = likes.includes(userId);
      
      return {
        ...post,
        likes: isLiked 
          ? likes.filter(id => id !== userId)
          : [...likes, userId]
      };
    }
    return post;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return updatedPosts;
}

// Add a comment to a post
export function addComment(postId, comment) {
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        comments: [...(post.comments || []), comment]
      };
    }
    return post;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return updatedPosts;
}

// Delete a post (admin/author only)
export function deletePost(postId, userId, userRole) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  
  // Check if user can delete (admin or post author)
  if (!post || (post.authorId !== userId && userRole !== 'admin')) {
    throw new Error('Unauthorized to delete this post');
  }
  
  const updatedPosts = posts.filter(p => p.id !== postId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return updatedPosts;
}

// Update a post (author only)
export function updatePost(postId, updates, userId) {
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId && post.authorId === userId) {
      return {
        ...post,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    return post;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return updatedPosts;
}

// Get posts by author
export function getPostsByAuthor(authorId) {
  const posts = getPosts();
  return posts.filter(post => post.authorId === authorId);
}

// Search posts
export function searchPosts(query) {
  const posts = getPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return posts.filter(post => 
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.authorName.toLowerCase().includes(lowercaseQuery)
  );
}

// Initialize with sample posts if none exist
export function initializeSamplePosts() {
  const existingPosts = getPosts();
  
  if (existingPosts.length === 0) {
    const samplePosts = [
      {
        id: 1,
        content: "Welcome to the new school year! We're excited to have everyone back. Please check your schedules and make sure you have all the necessary materials for your classes.",
        authorId: 1,
        authorName: "admin",
        authorRole: "admin",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        likes: [2, 3],
        comments: [
          {
            id: 1,
            content: "Thank you for the warm welcome!",
            authorId: 2,
            authorName: "teacher",
            authorRole: "teacher",
            createdAt: new Date(Date.now() - 82800000).toISOString()
          }
        ]
      },
      {
        id: 2,
        content: "Reminder: Parent-teacher conferences are scheduled for next week. Please sign up for your preferred time slots through the school portal.",
        authorId: 2,
        authorName: "teacher",
        authorRole: "teacher",
        createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        likes: [1],
        comments: []
      },
      {
        id: 3,
        content: "The science fair projects are due next Friday. Students, please make sure to submit your projects on time. Good luck to everyone!",
        authorId: 2,
        authorName: "teacher",
        authorRole: "teacher",
        createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        likes: [1, 3],
        comments: [
          {
            id: 2,
            content: "Looking forward to seeing all the creative projects!",
            authorId: 1,
            authorName: "admin",
            authorRole: "admin",
            createdAt: new Date(Date.now() - 18000000).toISOString()
          }
        ]
      }
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
  }
}

// Legacy functions for backward compatibility
export async function fetchPosts() {
  return getPosts();
}

export async function likeComment(postId, commentId) {
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      const updatedComments = post.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: (comment.likes || 0) + 1 };
        }
        return comment;
      });
      return { ...post, comments: updatedComments };
    }
    return post;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return updatedPosts;
}

