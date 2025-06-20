import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Edit3, Share, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { postAPI, followAPI, userAPI } from '../services/api';
import PostCard from '../components/common/PostCard';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('threads'); // threads, replies, reposts
  const [showEdit, setShowEdit] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const navigate = useNavigate();

  const tabs = [
    { id: 'threads', label: '帖子' },
    { id: 'replies', label: '回复' },
    { id: 'reposts', label: '转发' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // 获取用户帖子
        const postsResponse = await postAPI.getUserPosts(user.id);
        setUserPosts(postsResponse.data.data || []);

        // 获取关注者和关注的人
        const followersResponse = await followAPI.getFollowers(user.id);
        const followingResponse = await followAPI.getFollowing(user.id);
        
        setFollowers(followersResponse.data || []);
        setFollowing(followingResponse.data || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleLike = async (postId) => {
    try {
      await postAPI.likePost(postId);
      // 更新本地状态
      setUserPosts(userPosts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 头部 */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <h1 className="text-xl font-bold">个人资料</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Settings size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-md mx-auto">
        {/* 用户信息卡片 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.nickname || '未设置昵称'}
              </h2>
              <p className="text-gray-600">@{user?.phone}</p>
            </div>
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.nickname || '用户头像'}
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>

          {/* 用户简介 */}
          <p className="text-gray-700 mb-4">
            {user?.bio || '这个人很懒，什么都没有留下...'}
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
            <Button variant="outline" className="flex-1" onClick={() => navigate('/edit-profile')}>
              <Edit3 size={16} className="mr-2" />
              编辑资料
            </Button>
            <Button variant="outline" className="flex-1">
              <Share size={16} className="mr-2" />
              分享资料
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              退出登录
            </Button>
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'replies' && (
            <div className="text-center py-12">
              <p className="text-gray-500">回复功能即将推出</p>
            </div>
          )}

          {activeTab === 'reposts' && (
            <div className="text-center py-12">
              <p className="text-gray-500">转发功能即将推出</p>
            </div>
          )}
        </div>
      </main>

      {showEdit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">编辑资料</h2>
            <div className="mb-3">
              <label className="block mb-1">昵称</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1">头像URL</label>
              <input
                className="border rounded px-2 py-1 w-full"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowEdit(false)} className="px-3 py-1 rounded bg-gray-200">取消</button>
              <button
                onClick={async () => {
                  try {
                    await userAPI.updateUser({ nickname, avatar });
                    alert('资料更新成功！');
                    setShowEdit(false);
                    window.location.reload(); // 或者你可以用 setUser 更新本地 user
                  } catch (err) {
                    alert('更新失败');
                  }
                }}
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

