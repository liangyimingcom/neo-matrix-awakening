# 🎬 黑客帝国 NEO 觉醒网站

一个完整的黑客帝国风格的 NEO 觉醒体验网站，采用 AWS 安全最佳实践架构部署。

[![Live Demo](https://img.shields.io/badge/Live%20Demo-neo.liangym.people.aws.dev-green?style=for-the-badge&logo=amazonaws)](https://neo.liangym.people.aws.dev)
[![AWS](https://img.shields.io/badge/AWS-CloudFront%20%2B%20S3-orange?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/)
[![Security](https://img.shields.io/badge/Security-Private%20S3%20Bucket-red?style=for-the-badge&logo=amazons3)](https://aws.amazon.com/s3/)

## 🌟 项目特色

### 🎮 交互体验
- **持续数字雨背景** - 包含日文字符和数字的矩阵代码雨效果
- **7个完整场景** - 从觉醒到成为救世主的完整故事线
- **双重控制方式** - 鼠标点击和键盘快捷键
- **炫酷视觉特效** - 故障文字、脉冲动画、粒子效果
- **动态音效系统** - Web Audio API 生成的科幻音效
- **响应式设计** - 完美支持桌面端和移动端

### 🔒 安全架构
- **私有 S3 存储桶** - 符合 AWS 安全最佳实践
- **CloudFront CDN** - 全球加速 + Origin Access Control
- **SSL/TLS 加密** - ACM 管理的自动续期证书
- **Route53 DNS** - 企业级域名解析

## 🎯 在线体验

**🌐 访问地址**: [https://neo.liangym.people.aws.dev](https://neo.liangym.people.aws.dev)

### 🎮 操作指南

| 按键 | 功能 |
|------|------|
| `空格键` | 开始觉醒 |
| `R` | 选择红色药丸 |
| `B` | 选择蓝色药丸 |
| `C` | 继续觉醒 |
| `S` | 站起来 |
| `T` | 开始训练 |
| `D` | 下载技能 |
| `H` | 拯救人类 |
| `ESC` | 重置到开始 |

## 🏗️ 技术架构

### 前端技术栈
- **HTML5** - 语义化标记和现代Web标准
- **CSS3** - 高级动画、变换和响应式设计
- **JavaScript ES6+** - 模块化编程和现代语法
- **Web Audio API** - 动态音效生成
- **Canvas API** - 数字雨动画渲染

### AWS 架构图
```
Internet
    ↓
Route53 DNS (neo.liangym.people.aws.dev)
    ↓
CloudFront CDN (Global Edge Locations)
    ↓ (Origin Access Control)
Private S3 Bucket (Static Website Files)
```

### 🔧 AWS 服务
- **Amazon S3** - 私有存储桶，静态网站文件存储
- **Amazon CloudFront** - 全球内容分发网络
- **AWS Certificate Manager** - SSL/TLS证书自动管理
- **Amazon Route53** - DNS解析和域名管理

## 📦 项目结构

```
neo-matrix-awakening/
├── index.html              # 主页面文件
├── style.css              # 样式文件 (20KB+)
├── script.js              # JavaScript逻辑 (15KB+)
├── .kiro/
│   └── settings/
│       └── mcp.json       # MCP配置文件
├── cloudfront-config.json # CloudFront分发配置
├── current-config.json    # 当前分发配置
├── update-config.json     # 更新配置文件
└── README.md              # 项目文档
```

## 🚀 本地开发

### 环境要求
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)
- 本地HTTP服务器 (推荐使用 Python 或 Node.js)

### 快速开始
```bash
# 克隆项目
git clone https://github.com/your-username/neo-matrix-awakening.git
cd neo-matrix-awakening

# 启动本地服务器 (Python)
python3 -m http.server 8000

# 或使用 Node.js
npx serve .

# 访问 http://localhost:8000
```

## 🔒 安全特性

### S3 桶安全配置
- ✅ **完全私有** - 启用所有公共访问阻止设置
- ✅ **精确权限** - 仅允许特定 CloudFront 分发访问
- ✅ **条件访问** - 使用服务主体和源 ARN 限制

### CloudFront 安全配置
- ✅ **Origin Access Control (OAC)** - 替代传统 OAI 的现代方案
- ✅ **强制 HTTPS** - 自动重定向 HTTP 到 HTTPS
- ✅ **TLS 1.2+** - 最低安全协议版本
- ✅ **SNI 支持** - 现代 SSL 支持方式

## 🎬 故事场景

| 场景 | 描述 | 特效 |
|------|------|------|
| 1️⃣ **觉醒** | NEO从梦境中醒来 | 故障文字、脉冲动画 |
| 2️⃣ **选择** | 红蓝药丸的命运抉择 | 3D悬浮药丸、发光效果 |
| 3️⃣ **真相** | 发现矩阵的真实面目 | 矩阵代码转换 |
| 4️⃣ **现实** | 从培养舱中真正觉醒 | 培养舱动画、电缆效果 |
| 5️⃣ **飞船** | 遇见Morpheus和Trinity | 科幻内饰、控制台 |
| 6️⃣ **训练** | 下载各种技能 | 进度条动画、技能特效 |
| 7️⃣ **救世主** | 成为The One，拯救人类 | 光环特效、粒子系统 |

## 🧪 自动化测试

项目使用 Playwright 进行自动化测试，确保所有交互功能正常：

```javascript
// 测试流程示例
✅ 页面加载测试
✅ 觉醒按钮交互
✅ 药丸选择功能
✅ 场景切换验证
✅ 完整故事线测试
✅ 响应式设计测试
```

## 📊 性能优化

### 前端优化
- **CSS3 硬件加速** - 使用 `transform3d` 和 `will-change`
- **事件优化** - 防抖处理和事件委托
- **资源预加载** - 关键资源优先加载
- **代码压缩** - 生产环境代码优化

### CDN 优化
- **全球边缘节点** - CloudFront 全球加速
- **智能缓存** - 静态资源长期缓存
- **Gzip 压缩** - 自动内容压缩
- **HTTP/2 支持** - 现代协议优化

## 💰 成本分析

### 预估月度成本 (低流量)
| 服务 | 用量 | 成本 |
|------|------|------|
| S3 存储 | < 1GB | $0.023 |
| S3 请求 | < 1000 | $0.01 |
| CloudFront 传输 | < 1GB | $0.085 |
| CloudFront 请求 | < 10000 | $0.01 |
| Route53 托管区域 | 1个 | $0.50 |
| ACM 证书 | 1个 | 免费 |
| **总计** | | **~$0.67/月** |

## 🔧 部署指南

### 前置要求
- AWS CLI 配置
- 有效的 AWS 账户
- Route53 托管域名

### 一键部署脚本
```bash
#!/bin/bash
# 设置变量
BUCKET_NAME="neo-matrix-awakening-$(date +%s)"
DOMAIN_NAME="neo.yourdomain.com"
PROFILE="your-aws-profile"

# 创建 S3 桶
aws s3 mb s3://$BUCKET_NAME --profile $PROFILE

# 上传文件
aws s3 sync . s3://$BUCKET_NAME --exclude ".git/*" --profile $PROFILE

# 配置私有访问
aws s3api put-public-access-block \
  --bucket $BUCKET_NAME \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --profile $PROFILE

# 申请 SSL 证书
aws acm request-certificate \
  --domain-name $DOMAIN_NAME \
  --validation-method DNS \
  --profile $PROFILE

# 创建 CloudFront 分发
# (详细步骤请参考完整部署文档)
```

## 🛠️ 维护指南

### 内容更新
```bash
# 更新网站内容
aws s3 sync . s3://your-bucket-name --delete --profile your-profile

# 清除 CloudFront 缓存
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*" \
  --profile your-profile
```

### 监控建议
- **CloudWatch 指标** - 监控 CloudFront 性能
- **访问日志** - 分析用户行为模式
- **证书监控** - 确保 SSL 证书有效性
- **成本监控** - 设置账单警报

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 ES6+ 语法
- 遵循语义化命名
- 添加必要的注释
- 确保响应式兼容性

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- **《黑客帝国》电影** - 灵感来源
- **AWS 文档** - 架构参考
- **开源社区** - 技术支持

## 📞 联系方式

- **项目地址**: [GitHub Repository](https://github.com/your-username/neo-matrix-awakening)
- **在线演示**: [https://neo.liangym.people.aws.dev](https://neo.liangym.people.aws.dev)
- **问题反馈**: [GitHub Issues](https://github.com/your-username/neo-matrix-awakening/issues)

---

<div align="center">

**🎬 欢迎来到矩阵世界 🎬**

*选择你的药丸，开始觉醒之旅*

[![Red Pill](https://img.shields.io/badge/🔴-Red%20Pill-red?style=for-the-badge)](https://neo.liangym.people.aws.dev)
[![Blue Pill](https://img.shields.io/badge/🔵-Blue%20Pill-blue?style=for-the-badge)](https://neo.liangym.people.aws.dev)

</div>