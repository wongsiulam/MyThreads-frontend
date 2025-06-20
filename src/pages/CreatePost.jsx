import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Image, X } from 'lucide-react';
import { postAPI } from '../services/api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    imageUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // 清除错误信息
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError('请输入帖子内容');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await postAPI.createPost(formData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || '发布失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await postAPI.uploadImage(file); // 你可以用 fileAPI.uploadAvatar 或新建 postAPI.uploadImage
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      alert('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 头部 */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold">新帖子</h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.content.trim()}
            size="sm"
          >
            {isLoading ? '发布中...' : '发布'}
          </Button>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-md mx-auto p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 mb-4 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 标题输入 */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              标题（可选）
            </label>
            <Input
              id="title"
              name="title"
              placeholder="给你的帖子起个标题..."
              value={formData.title}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* 内容输入 */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-gray-700">
              内容 *
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="分享你的想法..."
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full resize-none"
              required
            />
            <div className="text-right text-xs text-gray-500">
              {formData.content.length}/500
            </div>
          </div>

          {/* 标签输入 */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium text-gray-700">
              标签（可选）
            </label>
            <Input
              id="tags"
              name="tags"
              placeholder="用逗号分隔多个标签，如：生活,摄影,旅行"
              value={formData.tags}
              onChange={handleChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              添加标签可以让更多人发现你的帖子
            </p>
          </div>

          {/* 媒体上传区域（暂时占位） */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
            onClick={handleImageUploadClick}
          >
            <Image size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {uploading ? '上传中...' : formData.imageUrl ? '上传成功' : '点击上传图片'}
            </p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="内容图片预览"
              className="w-40 rounded-lg mt-2 object-cover mx-auto"
            />
          )}
        </form>
      </main>
    </div>
  );
};

export default CreatePost;

