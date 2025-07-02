import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatMessages, sendMessage, deleteMessage, updateMessageStatus, userAPI } from '../services/api';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // 对方信息
  const [messages, setMessages] = useState([]); // 聊天记录
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 获取对方信息
  useEffect(() => {
    if (userId) {
      userAPI.getUserById(userId).then(res => setUserInfo(res.data));
    }
  }, [userId]);

  // 获取聊天记录
  useEffect(() => {
    if (userId) {
      setLoading(true);
      getChatMessages(userId)
        .then(res => setMessages(Array.isArray(res) ? res : []))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  // 聊天内容自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || !userId) return;
    await sendMessage({ receiverId: userId, content: input });
    setInput('');
    getChatMessages(userId).then(res => setMessages(Array.isArray(res) ? res : []));
  };

  // 删除消息
  const handleDelete = async (id) => {
    await deleteMessage(id);
    setMessages(messages.filter(msg => msg.id !== id));
  };

  // 标记为已读
  const handleRead = async (id) => {
    // 只允许对方发给你的消息被标记为已读
    const msg = messages.find(m => m.id === id);
    if (!msg || msg.isSelf) return; // 自己发的消息不能标记为已读
    await updateMessageStatus(id, 1);
    setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 1 } : msg));
  };

  if (!userInfo) {
    return <div className="flex items-center justify-center h-full text-gray-400">用户信息加载失败</div>;
  }

  if (!userId) {
    return <div className="flex items-center justify-center h-full text-gray-500">请选择聊天对象</div>;
  }

  return (
    <div className="flex flex-col h-[90vh] max-w-lg mx-auto bg-gray-100 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 顶部栏 */}
      <div className="flex items-center px-4 py-3 bg-white border-b border-gray-100 relative">
        <button className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center mx-auto">
          <Avatar>
            <AvatarImage src={userInfo?.avatar} alt={userInfo?.nickname} />
            <AvatarFallback>{userInfo?.nickname?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="ml-3 font-bold text-lg">{userInfo?.nickname || '用户'}</div>
        </div>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100">
          <MoreHorizontal size={22} />
        </button>
      </div>
      {/* 聊天内容 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
        {loading ? (
          <div className="text-center text-gray-400 mt-8">加载中...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">暂无聊天记录</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex mb-6 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
              <Avatar>
                <AvatarImage src={msg.senderAvatar} alt={msg.senderName} />
                <AvatarFallback>{msg.senderName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className={`max-w-[70%] ${msg.isSelf ? 'mr-3 items-end' : 'ml-3 items-start'} flex flex-col`}>
                <div className="text-xs text-gray-500 mb-1">{msg.senderName} <span className="ml-2">{msg.time}</span></div>
                <div className={`rounded-2xl px-4 py-2 text-base shadow-sm ${msg.isSelf ? 'bg-green-100 text-right' : 'bg-white border text-left'}`}>{msg.content}</div>
                <div className="flex items-center text-[11px] text-gray-400 mt-1">
                  {msg.isSelf && (
                    <Button size="sm" variant="ghost" className="ml-2 px-1" onClick={() => handleDelete(msg.id)}>
                      删除
                    </Button>
                  )}
                  {/* {!msg.isSelf && msg.status === 0 && (
                    <Button size="sm" variant="outline" className="ml-2 px-1" onClick={() => handleRead(msg.id)}>
                      标为已读
                    </Button>
                  )} */}
                  {!msg.isSelf && msg.status === 1 && (
                    <span className="ml-2 text-green-500">已读</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* 输入框 */}
      <div className="flex items-center px-4 py-4 bg-white border-t border-gray-100">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="请输入消息..."
          className="flex-1 mr-2 rounded-full bg-gray-50"
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          maxLength={500}
        />
        <Button onClick={handleSend} disabled={!input.trim()} className="rounded-full px-6">发送</Button>
      </div>
    </div>
  );
};

export default Chat; 