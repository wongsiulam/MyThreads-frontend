// API 基础配置
const API_BASE_URL = 'http://localhost:8081/api';

// 创建 axios 实例
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    if (error.response?.status === 401) {
      // Token 过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户相关 API
export const userAPI = {
  // 用户注册
  register: (data) => apiClient.post('/user/register', data),
  
  // 用户登录
  login: (data) => apiClient.post('/user/login', data),
  
  // 获取用户信息
  getUserById: (id) => apiClient.get(`/user/${id}`),
  
  // 更新用户信息
  updateUser: (data) => apiClient.put('/user/update', data),
  
  // 检查手机号是否存在
  checkPhone: (phone) => apiClient.get(`/user/check-phone?phone=${phone}`),
  
  // 获取当前用户信息
  getCurrentUser: () => apiClient.get('/user/me'),
};

// 帖子相关 API
export const postAPI = {
  // 发布帖子
  createPost: (data) => apiClient.post('/posts', data),
  
  // 获取所有帖子
  getAllPosts: () => apiClient.get('/posts'),
  
  // 获取单个帖子
  getPostById: (postId) => apiClient.get(`/posts/${postId}`),
  
  // 获取用户帖子列表
  getUserPosts: (userId) => apiClient.get(`/posts/user/${userId}`),
  
  // 更新帖子
  updatePost: (postId, data) => apiClient.put(`/posts/${postId}`, data),
  
  // 删除帖子
  deletePost: (postId) => apiClient.delete(`/posts/${postId}`),
  
  // 点赞帖子
  likePost: (postId) => apiClient.post(`/posts/${postId}/like`),
  
  // 取消点赞
  unlikePost: (postId) => apiClient.delete(`/posts/${postId}/like`),
};

// 评论相关 API
export const commentAPI = {
  // 发布评论
  createComment: (postId, data) => apiClient.post(`/posts/${postId}/comments`, data),
  
  // 获取帖子评论
  getPostComments: (postId) => apiClient.get(`/posts/${postId}/comments`),
  
  // 获取评论回复
  getCommentReplies: (postId, commentId) => apiClient.get(`/posts/${postId}/comments/${commentId}/replies`),
  
  // 删除评论
  deleteComment: (postId, commentId) => apiClient.delete(`/posts/${postId}/comments/${commentId}`),
};

// 关注相关 API
export const followAPI = {
  // 关注用户
  followUser: (followerId, followingId) => apiClient.post(`/follows/${followerId}/${followingId}`),
  
  // 取消关注
  unfollowUser: (followerId, followingId) => apiClient.delete(`/follows/${followerId}/${followingId}`),
  
  // 获取粉丝列表
  getFollowers: (userId) => apiClient.get(`/follows/followers/${userId}`),
  
  // 获取关注列表
  getFollowing: (userId) => apiClient.get(`/follows/following/${userId}`),
};

// 好友相关 API
export const friendAPI = {
  // 发送好友请求
  sendFriendRequest: (userId, friendId) => apiClient.post(`/friends/request/${userId}/${friendId}`),
  
  // 接受好友请求
  acceptFriendRequest: (requestId) => apiClient.put(`/friends/accept/${requestId}`),
  
  // 拒绝好友请求
  rejectFriendRequest: (requestId) => apiClient.put(`/friends/reject/${requestId}`),
  
  // 删除好友
  deleteFriend: (userId, friendId) => apiClient.delete(`/friends/${userId}/${friendId}`),
  
  // 获取好友请求列表
  getFriendRequests: (userId) => apiClient.get(`/friends/requests/${userId}`),
  
  // 获取好友列表
  getFriends: (userId) => apiClient.get(`/friends/${userId}`),
};

// 搜索相关 API
export const searchAPI = {
  // 搜索用户
  searchUsers: (keyword) => apiClient.get(`/search/users?keyword=${keyword}`),
  
  // 搜索帖子
  searchPosts: (keyword) => apiClient.get(`/search/posts?keyword=${keyword}`),
  
  // 搜索话题
  searchTopics: (keyword) => apiClient.get(`/search/topics?keyword=${keyword}`),
};

// 文件相关 API
export const fileAPI = {
  // 上传头像
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/files/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 删除头像
  deleteAvatar: (filename) => apiClient.delete(`/files/avatar?filename=${filename}`),
};

export default apiClient;

