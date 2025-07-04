import React, { useState, useEffect } from 'react';
import { getSession } from '../api/users';
import { getPosts, createPost, likePost, addComment } from '../api/posts';
import { 
  FiPlus, 
  FiHeart, 
  FiMessageCircle, 
  FiShare2, 
  FiImage, 
  FiFile,
  FiSend,
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiClock,
  FiUser
} from 'react-icons/fi';

const Timeline = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image: null, file: null });
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sessionUser = getSession();
    setUser(sessionUser);
    loadPosts();
  }, []);

  const loadPosts = () => {
    const allPosts = getPosts();
    setPosts(allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const canPost = () => {
    return user && (user.role === 'teacher' || user.role === 'admin');
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const post = {
      id: Date.now(),
      content: newPost.content,
      authorId: user.id,
      authorName: user.username,
      authorRole: user.role,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
      image: newPost.image,
      file: newPost.file
    };

    createPost(post);
    setNewPost({ content: '', image: null, file: null });
    setShowCreatePost(false);
    setIsLoading(false);
    loadPosts();
  };

  const handleLike = (postId) => {
    likePost(postId, user.id);
    loadPosts();
  };

  const handleComment = (postId) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;

    addComment(postId, {
      id: Date.now(),
      content: comment,
      authorId: user.id,
      authorName: user.username,
      authorRole: user.role,
      createdAt: new Date().toISOString()
    });

    setCommentInputs({ ...commentInputs, [postId]: '' });
    loadPosts();
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'role-admin',
      teacher: 'role-teacher',
      student: 'role-student',
      parent: 'role-parent'
    };
    return colors[role] || 'role-default';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPost({ ...newPost, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, file: { name: file.name, size: file.size } });
    }
  };

  if (!user) return null;

  return (
    <div className="timeline-container">
      <div className="timeline-wrapper">
        {/* Header */}
        <div className="timeline-header animate-fadeIn">
          <h1 className="form-title">Timeline</h1>
          <p className="form-subtitle">
            Stay updated with the latest announcements and activities
          </p>
        </div>

        {/* Create Post Section */}
        {canPost() && (
          <div className="card hover-lift animate-slideInLeft">
            {!showCreatePost ? (
              <button
                onClick={() => setShowCreatePost(true)}
                className="create-post-trigger"
              >
                <span className="create-post-text">What's on your mind, {user.username}?</span>
                <FiPlus className="create-post-icon" />
              </button>
            ) : (
              <div className="create-post-form">
                <div className="post-author-info">
                  <div className="author-avatar">
                    <span className="author-initial">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="author-details">
                    <p className="author-name">{user.username}</p>
                    <span className={`role-badge ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share an announcement or update..."
                  className="post-textarea"
                  rows="4"
                />

                {newPost.image && (
                  <div className="post-image-preview">
                    <img
                      src={newPost.image}
                      alt="Upload preview"
                      className="preview-image"
                    />
                    <button
                      onClick={() => setNewPost({ ...newPost, image: null })}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                )}

                {newPost.file && (
                  <div className="post-file-preview">
                    <FiFile className="file-icon" />
                    <span className="file-name">{newPost.file.name}</span>
                    <button
                      onClick={() => setNewPost({ ...newPost, file: null })}
                      className="remove-file-btn"
                    >
                      <FiTrash2 className="trash-icon" />
                    </button>
                  </div>
                )}

                <div className="post-actions">
                  <div className="media-buttons">
                    <label className="media-button">
                      <FiImage className="media-icon" />
                      <span className="media-label">Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden-input"
                      />
                    </label>
                    <label className="media-button">
                      <FiFile className="media-icon" />
                      <span className="media-label">File</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden-input"
                      />
                    </label>
                  </div>
                  <div className="form-buttons">
                    <button
                      onClick={() => {
                        setShowCreatePost(false);
                        setNewPost({ content: '', image: null, file: null });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.content.trim() || isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? (
                        <div className="spinner"></div>
                      ) : (
                        <>
                          <FiSend className="btn-icon" />
                          <span>Post</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posts Feed */}
        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="card empty-state animate-fadeIn">
              <FiMessageCircle className="empty-icon" />
              <h3 className="empty-title">No posts yet</h3>
              <p className="empty-description">
                {canPost() 
                  ? "Be the first to share an announcement!"
                  : "Check back later for updates from teachers and administrators."
                }
              </p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="card hover-lift animate-slideInLeft post-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Post Header */}
                <div className="post-header">
                  <div className="post-author-info">
                    <div className="author-avatar">
                      <span className="author-initial">
                        {post.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="author-details">
                      <div className="author-name-row">
                        <p className="author-name">{post.authorName}</p>
                        <span className={`role-badge ${getRoleColor(post.authorRole)}`}>
                          {post.authorRole}
                        </span>
                      </div>
                      <div className="post-time">
                        <FiClock className="time-icon" />
                        <span>{formatTimeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="more-options-btn">
                    <FiMoreHorizontal className="more-icon" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="post-content">
                  <p className="post-text">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="post-media">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="post-image"
                    />
                  </div>
                )}

                {/* Post File */}
                {post.file && (
                  <div className="post-file">
                    <FiFile className="file-icon" />
                    <span className="file-name">{post.file.name}</span>
                    <button className="download-btn">
                      Download
                    </button>
                  </div>
                )}

                {/* Post Actions */}
                <div className="post-interactions">
                  <div className="interaction-buttons">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`interaction-btn ${
                        post.likes.includes(user.id) ? 'liked' : ''
                      }`}
                    >
                      <FiHeart className={`interaction-icon ${post.likes.includes(user.id) ? 'filled' : ''}`} />
                      <span className="interaction-count">{post.likes.length}</span>
                    </button>
                    <button className="interaction-btn">
                      <FiMessageCircle className="interaction-icon" />
                      <span className="interaction-count">{post.comments.length}</span>
                    </button>
                    <button className="interaction-btn">
                      <FiShare2 className="interaction-icon" />
                      <span className="interaction-label">Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {post.comments.length > 0 && (
                  <div className="comments-section">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="comment-avatar">
                          <span className="comment-initial">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="comment-content">
                          <div className="comment-bubble">
                            <div className="comment-header">
                              <p className="comment-author">{comment.authorName}</p>
                              <span className={`role-badge small ${getRoleColor(comment.authorRole)}`}>
                                {comment.authorRole}
                              </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                          <p className="comment-time">
                            {formatTimeAgo(comment.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="add-comment-section">
                  <div className="comment-input-wrapper">
                    <div className="comment-avatar">
                      <span className="comment-initial">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="comment-input-container">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        className="comment-input"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="comment-send-btn"
                      >
                        <FiSend className="send-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;