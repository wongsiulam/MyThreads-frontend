import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit3, MessageCircle, UserPlus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, postAPI, followAPI } from '../services/api';
import PostCard from '../components/common/PostCard';

const UserProfile = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('threads');
  const isSelf = currentUser && String(currentUser.id) === String(userId);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userRes, postsRes, followersRes, followingRes] = await Promise.all([
          userAPI.getUserById(userId),
          postAPI.getUserPosts(userId),
          followAPI.getFollowers(userId),
          followAPI.getFollowing(userId),
        ]);
        setUser(userRes.data);
        setUserPosts(postsRes.data.data || []);
        setFollowers(followersRes.data || []);
        setFollowing(followingRes.data || []);
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleFollow = async () => {
    if (!currentUser) return;
    await followAPI.followUser(currentUser.id, userId);
    // 重新获取粉丝列表
    const followersRes = await followAPI.getFollowers(userId);
    setFollowers(followersRes.data || []);
  };

  const handleSendMessage = () => {
    navigate(`/chat/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">用户不存在</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 头部 */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <h1 className="text-xl font-bold">{isSelf ? '个人资料' : '用户资料'}</h1>
        </div>
      </header>
      {/* 主要内容 */}
      <main className="max-w-md mx-auto">
        {/* 用户信息卡片 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.nickname || '未设置昵称'}
              </h2>
              <p className="text-gray-600">@{user.phone}</p>
            </div>
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.nickname || '用户头像'}
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          {/* 用户简介 */}
          <p className="text-gray-700 mb-4">
            {user.bio || '这个人很懒，什么都没有留下...'}
          </p>
          {/* 关注数据 */}
          <div className="flex items-center space-x-6 mb-4">
            <div className="text-center">
              <p className="font-bold text-lg">{followers.length}</p>
              <p className="text-gray-600 text-sm">关注者</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{following.length}</p>
              <p className="text-gray-600 text-sm">正在关注</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{userPosts.length}</p>
              <p className="text-gray-600 text-sm">帖子</p>
            </div>
          </div>
          {/* 操作按钮 */}
          <div className="flex space-x-3">
            {isSelf ? (
              <>
                <Button variant="outline" className="flex-1" onClick={() => navigate('/edit-profile')}>
                  <Edit3 size={16} className="mr-2" />
                  编辑资料
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate('/login')}>退出登录</Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="flex-1" onClick={handleSendMessage}>
                  <MessageCircle size={16} className="mr-2" />
                  发消息
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleFollow}>
                  <UserPlus size={16} className="mr-2" />
                  关注
                </Button>
              </>
            )}
          </div>
        </div>
        {/* 标签页 */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'threads' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('threads')}
          >
            帖子
          </button>
        </div>
        {/* 内容区域 */}
        <div className="min-h-96">
          {activeTab === 'threads' && (
            <div>
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">还没有发布任何帖子</p>
                  <p className="text-gray-400 text-sm mt-2">分享你的第一个想法吧！</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

