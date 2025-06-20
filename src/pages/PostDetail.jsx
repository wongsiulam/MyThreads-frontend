import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';

const PostDetail = () => {
  const { postId,id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取帖子详情
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postAPI.getPostById(postId);
        setPost(res.data.data);
      } catch (err) {
        setError('获取帖子详情失败');
      }
    };
    fetchPost();
  }, [id]);

  // 获取评论
  const fetchComments = async () => {
    try {
      const res = await commentAPI.getPostComments(postId);
      setComments(res.data.data || []);
    } catch (err) {
      setError('获取评论失败');
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [id]);

  // 发布评论
  const handleComment = async (parentId = null) => {
    if (!commentContent.trim()) return;
    setCommentLoading(true);
    try {
      await commentAPI.createComment(postId, { content: commentContent, parentId });
      setCommentContent('');
      fetchComments();
    } catch (err) {
      setError('评论失败');
    } finally {
      setCommentLoading(false);
    }
  };

  // 删除评论
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    try {
      await commentAPI.deleteComment(id, commentId);
      fetchComments();
    } catch (err) {
      setError('删除评论失败');
    }
  };

  // 获取评论的回复
  const fetchReplies = async (commentId) => {
    try {
      const res = await commentAPI.getCommentReplies(id, commentId);
      return res.data.data || [];
    } catch (err) {
      setError('获取回复失败');
      return [];
    }
  };

  // 渲染评论及其回复
  const renderComments = (commentsList, parent = false) => {
    return commentsList.map((comment) => (
      <div key={comment.id} className={`border-b border-gray-100 py-2 ${parent ? 'ml-6 bg-gray-50' : ''}`}>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-800">{comment.user?.nickname || '匿名用户'}：</div>
          <button className="text-xs text-red-400 hover:underline" onClick={() => handleDeleteComment(comment.id)}>删除</button>
        </div>
        <div className="text-gray-700 text-sm mb-1 whitespace-pre-wrap">{comment.content}</div>
        {/* 回复列表 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-1">{renderComments(comment.replies, true)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {!post ? (
          <div>加载中...</div>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-2">{post.title}</h1>
            <div className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</div>
            <div className="border-t pt-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">评论区</h2>
              <div className="mb-2">
                <Textarea
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  placeholder="写下你的评论..."
                  rows={3}
                  className="w-full mb-2"
                />
                <Button onClick={() => handleComment()} disabled={commentLoading || !commentContent.trim()}>
                  {commentLoading ? '发布中...' : '发布评论'}
                </Button>
              </div>
              <div>
                {comments.length === 0 ? (
                  <div className="text-gray-400 text-sm">暂无评论</div>
                ) : (
                  renderComments(comments)
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;

