import React, { useState, useEffect } from 'react';
import { postAPI,userAPI } from '../services/api';
import PostCard from '../components/common/PostCard';
import { RefreshCw, Sparkles } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const response = await postAPI.getAllPosts();
      setPosts(response.data.data || []);
      setError('');
    } catch (err) {
      setError('获取帖子失败，请稍后重试');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const userIds = [...new Set(posts.map(post => post.userId))];
    Promise.all(userIds.map(id => userAPI.getUserById(id)))
      .then(resArr => {
        const map = {};
        resArr.forEach(res => {
          if (res.data) map[res.data.id] = res.data;
        });
        setUserMap(map);
      });
  }, [posts]);

  const handleRefresh = () => {
    fetchPosts(true);
  };

  const handleLike = async (postId) => {
    try {
      const res = await postAPI.likePost(postId);
      const likesCount = res.data.data; // 最新点赞数
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, 
              liked: !post.liked,
              likesCount 
            }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 头部 */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 z-10 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">@</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Threads
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
          >
            <RefreshCw 
              size={20} 
              className={`${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} text-gray-600 transition-transform duration-300`} 
            />
          </button>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-md mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mx-4 mt-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">欢迎来到 Threads</h3>
            <p className="text-gray-500 mb-4">暂无帖子</p>
            <p className="text-gray-400 text-sm">成为第一个发布内容的人吧！</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {[...posts]
              .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  userMap={userMap}
                  onLike={handleLike}
                />
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

