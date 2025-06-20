import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, mentions, replies, verified

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'mentions', label: '提及' },
    { id: 'replies', label: '回复' },
    { id: 'verified', label: '已验证' },
  ];

  // 模拟数据
  const mockActivities = [
    {
      id: 1,
      type: 'like',
      user: { id: 1, nickname: '张三', avatar: '/default-avatar.png' },
      post: { id: 1, title: '我的第一个帖子', content: '这是一个测试帖子' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'comment',
      user: { id: 2, nickname: '李四', avatar: '/default-avatar.png' },
      post: { id: 1, title: '我的第一个帖子', content: '这是一个测试帖子' },
      comment: '很棒的分享！',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 3,
      type: 'follow',
      user: { id: 3, nickname: '王五', avatar: '/default-avatar.png' },
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ];

  useEffect(() => {
    // 模拟 API 调用
    const fetchActivities = async () => {
      setIsLoading(true);
      // 这里应该调用真实的 API
      setTimeout(() => {
        setActivities(mockActivities);
        setIsLoading(false);
      }, 1000);
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'follow':
        return <UserPlus size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'like':
        return '赞了你的帖子';
      case 'comment':
        return '评论了你的帖子';
      case 'follow':
        return '关注了你';
      default:
        return '';
    }
  };

  const formatTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
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
        <div className="px-4 py-3 max-w-md mx-auto">
          <h1 className="text-xl font-bold mb-3">活动</h1>
          
          {/* 标签页 */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-md mx-auto">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">暂无活动通知</p>
            <p className="text-gray-400 text-sm mt-2">当有人与你的内容互动时，会在这里显示</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  {/* 用户头像 */}
                  <Link to={`/user/${activity.user.id}`} className="flex-shrink-0">
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.nickname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>

                  {/* 活动内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getActivityIcon(activity.type)}
                      <span className="font-semibold text-sm">
                        {activity.user.nickname}
                      </span>
                      <span className="text-sm text-gray-600">
                        {getActivityText(activity)}
                      </span>
                    </div>

                    {/* 相关帖子或评论 */}
                    {activity.post && (
                      <Link 
                        to={`/post/${activity.post.id}`}
                        className="block mt-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {activity.post.title && (
                          <p className="font-medium text-sm mb-1">
                            {activity.post.title}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {activity.post.content}
                        </p>
                      </Link>
                    )}

                    {/* 评论内容 */}
                    {activity.comment && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">"{activity.comment}"</p>
                      </div>
                    )}

                    {/* 时间 */}
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Activity;

