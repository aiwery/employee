## 🚀 在线预览

部署在 Vercel: [查看演示](https://employee-eight-kohl.vercel.app/)

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **样式框架**: Tailwind CSS
- **构建工具**: Vite
- **表单管理**: 自定义 Form 组件
- **状态管理**: React Hooks
- **数据模拟**: Mock API

## 📦 安装和运行

### 环境要求

- Node.js >= 18.18.0
- npm >= 8.0.0

### 快速开始

```bash
# 克隆项目
git clone https://github.com/aiwery/employee.git
cd employee

# 进入项目目录
cd employee-page

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

项目将在 `http://localhost:5173` 启动

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
employee-page/
├── src/
│   ├── components/
│   │   └── frame/           # 基础UI组件
│   │       ├── Button.tsx   # 按钮组件
│   │       ├── Card.tsx     # 卡片组件
│   │       ├── Form.tsx     # 表单组件
│   │       └── Input.tsx    # 输入框组件
│   ├── pages/
│   │   └── EmployeePage.tsx # 员工档案页面
│   ├── services/
│   │   └── employee.ts      # 员工数据API
│   ├── types/
│   │   └── employee.d.ts    # TypeScript类型定义
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🚀 部署到 Vercel

1. 推送代码到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 连接 GitHub 仓库
4. 选择 `employee-page` 目录作为根目录
5. 自动检测 Vite 配置并部署

## 📄 许可证

MIT License
