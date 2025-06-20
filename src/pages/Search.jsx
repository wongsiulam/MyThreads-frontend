import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { searchAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); // posts, users, topics
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const tabs = [
    { id: 'posts', label: '帖子' },
    { id: 'users', label: '用户' },
    { id: 'topics', label: '话题' },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      let response;
      switch (activeTab) {
        case 'users':
          response = await searchAPI.searchUsers(query);
          break;
        case 'topics':
          response = await searchAPI.searchTopics(query);
          break;
        default:
          response = await searchAPI.searchPosts(query);
      }
      setResults(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!hasSearched) {
      return (
        <div className="text-center py-12">
          <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">搜索帖子、用户或话题</p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">没有找到相关结果</p>
          <p className="text-gray-400 text-sm mt-2">试试其他关键词</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {results.map((item, index) => (
          <Card key={index} className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              {activeTab === 'users' ? (
                <Link to={`/user/${item.id}`} className="flex items-center space-x-3">
                  <img
                    src={item.avatar || '/default-avatar.png'}
                    alt={item.nickname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{item.nickname}</p>
                    <p className="text-sm text-gray-500">@{item.phone}</p>
                  </div>
                </Link>
              ) : activeTab === 'topics' ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">#{item.name}</p>
                    <p className="text-sm text-gray-500">{item.postCount || 0} 个帖子</p>
                  </div>
                </div>
              ) : (
                <Link to={`/post/${item.id}`}>
                  <div className="flex items-start space-x-3">
                    <img
                      src={item.user?.avatar || '/default-avatar.png'}
                      alt={item.user?.nickname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">{item.user?.nickname}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {item.title && (
                        <p className="font-medium mb-1">{item.title}</p>
                      )}
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 头部 */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-1 relative">
              <SearchIcon 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <Input
                type="text"
                placeholder="搜索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-10"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={!query.trim()}>
              搜索
            </Button>
          </div>

          {/* 标签页 */}
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
      <main className="max-w-md mx-auto p-4">
        {renderResults()}
      </main>
    </div>
  );
};

export default Search;

