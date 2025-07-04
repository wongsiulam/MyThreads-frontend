import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userAPI, postAPI, commentAPI, followAPI, getRecentMessages, searchAPI } from '@/services/api';

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

  useEffect(() => {
    const fetchAllActivities = async () => {
      setIsLoading(true);
      try {
        // 1. 获取当前用户
        const userRes = await userAPI.getCurrentUser();
        const currentUser = userRes.data || userRes;
        const userId = currentUser.id;

        // 2. 获取关注我的人（粉丝）
        const followersRes = await followAPI.getFollowers(userId);
        const followers = followersRes.data || followersRes;
        const followerDetails = await Promise.all(
          followers.map(async (follower) => {
            if (follower.nickname && follower.avatar) {
              return { ...follower, id: follower.followerId };
            } else {
              const detailRes = await userAPI.getUserById(follower.followerId);
              return { ...detailRes.data || detailRes, id: follower.followerId };
            }
          })
        );
        const followActivities = followerDetails.map((follower, idx) => ({
          id: `follow-${follower.id}`,
          type: 'follow',
          user: follower,
          createdAt: followers[idx].createdAt || followers[idx].followedAt || new Date().toISOString(),
        }));

        // 3. 搜索当前用户的所有帖子
        const postsRes = await searchAPI.searchPosts('');
        const allPosts = postsRes.data || postsRes;
        const userPosts = allPosts.filter(post => post.userId === userId);
        const postIds = userPosts.map(post => post.id);

        // 4. 遍历每个postId，获取评论
        let commentActivities = [];
        for (const postId of postIds) {
          const commentsRes = await commentAPI.getPostComments(postId);
          const comments = Array.isArray(commentsRes.data) ? commentsRes.data : [];
          const commentDetails = await Promise.all(
            comments.map(async (comment) => {
              const detailRes = await userAPI.getUserById(comment.userId);
              return { ...comment, user: detailRes.data || detailRes };
            })
          );
          commentActivities = commentActivities.concat(
            commentDetails.map(comment => ({
              id: `comment-${comment.id}`,
              type: 'comment',
              user: comment.user,
              post: { id: postId, title: userPosts.find(p => p.id === postId)?.title || '', content: userPosts.find(p => p.id === postId)?.content || '' },
              comment: comment.content,
              createdAt: comment.createTime,
            }))
          );
        }

        // 5. 合并所有活动，按时间倒序排序
        const allActivities = [...followActivities, ...commentActivities];
        allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log('allActivities', allActivities);
        setActivities(allActivities);
      } catch (err) {
        console.error('fetchAllActivities error:', err);
        setActivities([]);
      }
      setIsLoading(false);
    };
    fetchAllActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'follow':
        return <UserPlus size={16} className="text-green-500" />;
      case 'comment':
        return <MessageCircle size={16} className="text-blue-500" />;
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
      case 'chat':
        return '发来了一条新消息';
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
                      src={activity.user.avatar || '/default-avatar.png'}
                      alt={activity.user.nickname || '用户头像'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>

                  {/* 活动内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getActivityIcon(activity.type)}
                      <Link to={`/user/${activity.user.id}`} className="font-semibold text-sm hover:underline">
                        {activity.user.nickname}
                      </Link>
                      <span className="text-sm text-gray-600">
                        {getActivityText(activity)}
                      </span>
                      {activity.type === 'comment' && activity.post && (
                        <Link to={`/post/${activity.post.id}`} className="ml-2 text-xs text-blue-500 hover:underline">
                          {activity.post.title}
                        </Link>
                      )}
                    </div>
                    {/* 时间 */}
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
                {activity.type === 'comment' && (
                  <div className="mt-2">
                    {/* 帖主的帖子内容 */}
                    <div className="p-3 bg-gray-50 rounded mb-2">
                      {activity.post.title && (
                        <div className="font-medium text-sm mb-1">{activity.post.title}</div>
                      )}
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {activity.post.content && activity.post.content.length > 60
                          ? activity.post.content.slice(0, 60) + '...'
                          : activity.post.content}
                      </div>
                    </div>
                    {/* 评论内容 */}
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        "{activity.comment && activity.comment.length > 40
                          ? activity.comment.slice(0, 40) + '...'
                          : activity.comment}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Activity;

