import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post, userMap = {}, onLike, onComment, onShare }) => {
  const formatTime = (dateString) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffInMinutes < 1) return '刚刚';
      if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
      return `${Math.floor(diffInMinutes / 1440)}天前`;
    } catch (error) {
      return '刚刚';
    }
  };

  return (
    <article className="p-4 hover:bg-gray-50/50 transition-all duration-200 border-b border-gray-100 last:border-b-0">
      <div className="flex space-x-3">
        {/* 用户头像 */}
        <Link to={`/user/${post.userId}`} className="flex-shrink-0 group">
          <div className="relative">
            <img
              src={userMap[post.userId]?.avatar || '/default-avatar.png'}
              alt={userMap[post.userId]?.nickname || '用户'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-gray-200 transition-all duration-200"
            />
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition-all duration-200"></div>
          </div>
        </Link>

        {/* 帖子内容 */}
        <div className="flex-1 min-w-0">
          {/* 用户信息和时间 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Link 
                to={`/user/${post.userId}`}
                className="font-semibold text-gray-900 hover:underline transition-all duration-200"
              >
                {userMap[post.userId]?.nickname || '匿名用户'}
              </Link>
              <span className="text-gray-500 text-sm">
                {formatTime(post.createTime)}
              </span>
            </div>
            <button className="p-1.5 rounded-full hover:bg-gray-200 transition-all duration-200 opacity-0 group-hover:opacity-100">
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
          </div>

          {/* 帖子标题 */}
          {post.title && (
            <h3 className="font-medium text-gray-900 mb-2 leading-snug">
              <Link 
                to={`/post/${post.id}`}
                className="hover:underline transition-all duration-200"
              >
                {post.title}
              </Link>
            </h3>
          )}

          {/* 帖子内容 */}
          <div className="text-gray-800 mb-3 whitespace-pre-wrap leading-relaxed">
            <Link to={`/post/${post.id}`} className="hover:text-gray-900 transition-colors duration-200">
              {post.content}
            </Link>
          </div>

          {/* 标签 */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="text-blue-600 text-sm hover:underline cursor-pointer hover:text-blue-700 transition-colors duration-200"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* 互动按钮 */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-6">
              {/* 点赞 */}
              <button
                onClick={() => onLike(post.id)}
                className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-all duration-200 group p-1.5 rounded-full hover:bg-red-50"
              >
                <Heart
                  size={18}
                  className={`transition-all duration-200 ${
                    post.liked 
                      ? 'fill-red-500 text-red-500 scale-110' 
                      : 'group-hover:fill-red-500 group-hover:scale-110'
                  }`}
                />
                {post.likesCount > 0 && (
                  <span className="text-sm font-medium">{post.likesCount}</span>
                )}
              </button>

              {/* 评论 */}
              <Link
                to={`/post/${post.id}`}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-200 group p-1.5 rounded-full hover:bg-blue-50"
              >
                <MessageCircle size={18} className="group-hover:scale-110 transition-transform duration-200" />
                {post.commentCount > 0 && (
                  <span className="text-sm font-medium">{post.commentCount}</span>
                )}
              </Link>

              {/* 转发 */}
              <button 
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-all duration-200 group p-1.5 rounded-full hover:bg-green-50"
                onClick={() => alert('功能待完善')}
              >
                <Repeat2 size={18} className="group-hover:scale-110 transition-transform duration-200" />
                {post.repostCount > 0 && (
                  <span className="text-sm font-medium">{post.repostCount}</span>
                )}
              </button>
            </div>

            {/* 分享 */}
            <button 
              onClick={() => alert('功能待完善')}
              className="text-gray-500 hover:text-gray-700 transition-all duration-200 p-1.5 rounded-full hover:bg-gray-100"
            >
              <Share size={18} className="hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
