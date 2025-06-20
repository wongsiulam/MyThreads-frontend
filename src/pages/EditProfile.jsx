import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, fileAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';

const EditProfile = () => {
  const { user } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadStatus('uploading');
    try {
      const res = await fileAPI.uploadAvatar(file);
      setAvatar(res.data.url);
      setUploadStatus('success');
    } catch (err) {
      alert('上传失败');
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateUser({ nickname, avatar });
      alert('资料更新成功！');
      navigate('/profile');
      window.location.reload();
    } catch (err) {
      alert('更新失败');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <h1 className="text-xl font-bold">编辑资料</h1>
        </div>
      </header>
      <main className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            {avatar && (
              <img src={avatar || '/default-avatar.png'} alt="头像预览" className="w-20 h-20 rounded-full mt-2 object-cover mx-auto" />
            )}
          <div>
            <label className="block mb-1 font-medium">昵称</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              required
            />
          </div>
          <div>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
              onClick={handleUploadClick}
            >
              <Image size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {uploadStatus === 'uploading'
                  ? '上传中...'
                  : uploadStatus === 'success'
                  ? '上传成功'
                  : '点击上传头像'}
              </p>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              取消
            </Button>
            <Button type="submit" variant="default">
              保存
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProfile;
