# Threads App

一个仿 Threads 的社交平台前端项目，支持发帖、点赞、评论、个人资料编辑、图片上传等功能。

## 功能特性 （已实现部分）
- 用户注册、登录、登出
- 浏览帖子（按时间倒序）
- 发帖（支持图片上传）
- 点赞、评论、转发（占位）
- 个人资料页、编辑资料（支持头像上传）
- 搜索、关注、粉丝等（部分功能占位）

## 技术栈
- React 18
- React Router
- Axios
- Tailwind CSS（或自定义 CSS）
- Vite
- 图标库：lucide-react

## 目录结构
```
src/
  pages/         # 页面组件（Home, Profile, EditProfile, CreatePost 等）
  components/    # 通用UI组件和业务组件
  services/      # API 请求封装
  contexts/      # 全局上下文（如 AuthContext）
  hooks/         # 自定义 hooks
  assets/        # 静态资源
public/           # 公共资源
```

## 启动方式
1. 安装依赖：
   ```bash
   pnpm install
   # 或 npm install
   ```
2. 启动开发服务器：
   ```bash
   pnpm dev
   # 或 npm run dev
   ```
3. 访问 [http://localhost:5173](http://localhost:5173)

> 需要配合后端 API 服务一同使用。
> 本项目的后端地址：https://github.com/wongsiulam/MyThreads-backend.git

## 常见问题
- **图片上传失败？** 请确保后端已实现图片上传接口，并允许跨域。
- **接口404或401？** 检查 `src/services/api.js` 里的 API 地址和本地后端服务是否一致。
- **样式不生效？** 请确认已正确安装 Tailwind CSS 或相关依赖。


## 网页效果
![alt text](image.png)![alt text](image-1.png)![alt text](image-2.png)
![alt text](image-3.png)![alt text](image-4.png)


本项目仅供学习交流使用。
