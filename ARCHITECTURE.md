# 🏗️ 技术架构文档

本文档详细描述了黑客帝国 NEO 觉醒网站的技术架构、设计决策和实现细节。

## 📊 架构概览

### 系统架构图
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   用户浏览器     │────│   Route53 DNS    │────│  Internet       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│  CloudFront CDN │────│  ACM Certificate │
│  (全球边缘节点)  │    │  (SSL/TLS)      │
└─────────────────┘    └──────────────────┘
         │
         │ (Origin Access Control)
         ▼
┌─────────────────┐    ┌──────────────────┐
│   Private S3    │────│   S3 Bucket      │
│   Bucket        │    │   Policy         │
└─────────────────┘    └──────────────────┘
```

### 技术栈总览
| 层级 | 技术 | 用途 |
|------|------|------|
| **前端** | HTML5, CSS3, JavaScript ES6+ | 用户界面和交互 |
| **动画** | Canvas API, CSS3 Animations | 视觉特效和动画 |
| **音频** | Web Audio API | 动态音效生成 |
| **存储** | Amazon S3 | 静态文件存储 |
| **CDN** | Amazon CloudFront | 全球内容分发 |
| **DNS** | Amazon Route53 | 域名解析 |
| **SSL** | AWS Certificate Manager | 证书管理 |
| **安全** | Origin Access Control | 访问控制 |

## 🎨 前端架构

### 核心组件设计

#### 1. MatrixRain 类 - 数字雨效果
```javascript
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.drops = [];
        this.columns = Math.floor(this.canvas.width / 20);
    }
    
    animate() {
        // 使用 requestAnimationFrame 优化性能
        // 实现平滑的 60fps 动画
    }
}
```

**设计特点：**
- 使用 Canvas API 进行高性能渲染
- 响应式列数计算适配不同屏幕
- 字符集包含数字和日文片假名
- 优化的动画循环避免内存泄漏

#### 2. SceneManager 类 - 场景管理
```javascript
class SceneManager {
    constructor() {
        this.currentScene = 'awakening-scene';
        this.scenes = {
            'awakening-scene': document.getElementById('awakening-scene'),
            'pill-choice-scene': document.getElementById('pill-choice-scene'),
            // ... 其他场景
        };
    }
    
    switchScene(sceneId) {
        // 平滑的场景切换动画
        // 状态管理和事件处理
    }
}
```

**设计特点：**
- 单例模式管理全局场景状态
- 事件驱动的场景切换机制
- 支持键盘和鼠标双重交互
- 内置音效系统集成

#### 3. 音效系统 - Web Audio API
```javascript
playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // 根据类型生成不同频率的音效
    switch(type) {
        case 'wake': /* 觉醒音效 */ break;
        case 'choice': /* 选择音效 */ break;
        // ...
    }
}
```

**设计特点：**
- 纯 JavaScript 生成音效，无需外部文件
- 不同场景对应不同音频特征
- 错误处理确保音频失败不影响功能
- 支持现代浏览器的音频策略

### CSS 架构设计

#### 1. 模块化样式组织
```css
/* 基础样式 */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* 组件样式 */
.scene { /* 场景容器 */ }
.matrix-btn { /* 矩阵风格按钮 */ }
.pill { /* 药丸组件 */ }

/* 动画效果 */
@keyframes glitch { /* 故障效果 */ }
@keyframes pulse { /* 脉冲效果 */ }
@keyframes particleFloat { /* 粒子浮动 */ }
```

#### 2. 响应式设计策略
```css
/* 移动端适配 */
@media (max-width: 768px) {
    .glitch-text h1 { font-size: 2.5rem; }
    .pills-container { flex-direction: column; }
}

/* 高对比度支持 */
@media (prefers-contrast: high) {
    .matrix-btn { border-width: 3px; }
}

/* 减少动画支持 */
@media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; }
}
```

#### 3. 性能优化技术
```css
/* 硬件加速 */
.scene { transform: translateZ(0); }
.pill { will-change: transform; }

/* GPU 加速动画 */
@keyframes optimizedMove {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(100px, 0, 0); }
}
```

## ☁️ AWS 架构设计

### 1. 安全架构原则

#### 纵深防御策略
```
Layer 1: CloudFront (边缘安全)
├── DDoS 保护
├── WAF 集成能力
└── 地理位置限制

Layer 2: Origin Access Control
├── 服务主体验证
├── 源 ARN 条件检查
└── 签名验证 (SigV4)

Layer 3: S3 Bucket Security
├── 公共访问完全阻止
├── 精确的桶策略
└── 加密存储
```

#### 最小权限原则
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bucket-name/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::account:distribution/id"
        }
      }
    }
  ]
}
```

### 2. 性能架构设计

#### CloudFront 配置优化
```yaml
缓存策略:
  静态资源 (CSS/JS): 
    - TTL: 31536000 (1年)
    - 压缩: 启用
  HTML 文件:
    - TTL: 86400 (1天)
    - 压缩: 启用
  
边缘位置:
  - 价格等级: PriceClass_100
  - 覆盖区域: 美国、加拿大、欧洲
  
协议支持:
  - HTTP/2: 启用
  - IPv6: 启用
  - 压缩: 自动 Gzip
```

#### 性能监控指标
```yaml
关键指标:
  - 缓存命中率: >90%
  - 边缘响应时间: <100ms
  - 源站响应时间: <200ms
  - 错误率: <0.1%

监控工具:
  - CloudWatch 指标
  - Real User Monitoring
  - 访问日志分析
```

### 3. 高可用性设计

#### 多层冗余
```
DNS 层: Route53
├── 健康检查
├── 故障转移路由
└── 多区域支持

CDN 层: CloudFront
├── 全球边缘节点
├── 自动故障转移
└── 源站健康检查

存储层: S3
├── 11个9的持久性
├── 跨AZ复制
└── 版本控制支持
```

## 🔧 开发工具链

### 1. 自动化测试

#### Playwright 测试框架
```javascript
// 功能测试示例
test('NEO awakening journey', async ({ page }) => {
  await page.goto('https://neo.liangym.people.aws.dev');
  
  // 测试觉醒按钮
  await page.click('#wake-up-btn');
  await page.waitForSelector('#red-pill');
  
  // 测试药丸选择
  await page.click('#red-pill');
  await page.waitForSelector('#continue-btn');
  
  // 验证场景切换
  const isVisible = await page.isVisible('#matrix-scene');
  expect(isVisible).toBe(true);
});
```

#### 测试覆盖范围
- ✅ 功能测试 - 所有交互元素
- ✅ 性能测试 - 页面加载时间
- ✅ 兼容性测试 - 多浏览器支持
- ✅ 响应式测试 - 不同屏幕尺寸
- ✅ 安全测试 - HTTPS 和证书验证

### 2. 部署自动化

#### AWS CLI 脚本
```bash
#!/bin/bash
# 自动化部署流程

deploy_website() {
    echo "🚀 Starting deployment..."
    
    # 1. 同步文件到 S3
    aws s3 sync . s3://$BUCKET_NAME --delete
    
    # 2. 清除 CloudFront 缓存
    aws cloudfront create-invalidation \
        --distribution-id $DISTRIBUTION_ID \
        --paths "/*"
    
    # 3. 验证部署
    curl -I https://$DOMAIN_NAME
    
    echo "✅ Deployment completed!"
}
```

#### CI/CD 集成建议
```yaml
# GitHub Actions 示例
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v1
      - name: Deploy to S3
        run: aws s3 sync . s3://$BUCKET_NAME
      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

## 📊 性能优化策略

### 1. 前端性能优化

#### 资源优化
```javascript
// 代码分割和懒加载
const loadScene = async (sceneName) => {
    const module = await import(`./scenes/${sceneName}.js`);
    return module.default;
};

// 图片优化
const optimizeImages = () => {
    // WebP 格式支持检测
    // 响应式图片加载
    // 懒加载实现
};
```

#### 渲染优化
```css
/* 关键渲染路径优化 */
.critical-above-fold {
    /* 首屏内容优先加载 */
}

/* 非关键资源延迟加载 */
.non-critical {
    /* 使用 loading="lazy" */
}
```

### 2. 网络性能优化

#### 资源压缩
- **Gzip 压缩**: CloudFront 自动启用
- **Brotli 压缩**: 现代浏览器支持
- **资源合并**: 减少 HTTP 请求数量

#### 缓存策略
```yaml
缓存层级:
  浏览器缓存:
    - HTML: no-cache
    - CSS/JS: max-age=31536000
    - 图片: max-age=2592000
  
  CDN 缓存:
    - 静态资源: 长期缓存
    - 动态内容: 短期缓存
    - API 响应: 按需缓存
```

## 🔒 安全最佳实践

### 1. 内容安全策略 (CSP)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;">
```

### 2. HTTPS 强制和安全头
```yaml
安全配置:
  HTTPS: 强制重定向
  HSTS: 启用 (max-age=31536000)
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### 3. 访问控制
```json
{
  "访问控制策略": {
    "S3桶": "完全私有",
    "CloudFront": "仅允许 HTTPS",
    "证书": "自动续期",
    "DNS": "DNSSEC 支持"
  }
}
```

## 📈 监控和可观测性

### 1. 关键指标监控
```yaml
性能指标:
  - 页面加载时间: <2秒
  - 首次内容绘制: <1秒
  - 最大内容绘制: <2.5秒
  - 累积布局偏移: <0.1

可用性指标:
  - 正常运行时间: >99.9%
  - 错误率: <0.1%
  - 响应时间: <100ms
```

### 2. 日志和追踪
```javascript
// 前端错误监控
window.addEventListener('error', (event) => {
    // 发送错误信息到监控系统
    console.error('Frontend Error:', event.error);
});

// 性能监控
const observer = new PerformanceObserver((list) => {
    // 收集性能指标
    list.getEntries().forEach(entry => {
        console.log('Performance:', entry);
    });
});
```

## 🔄 扩展性设计

### 1. 水平扩展能力
- **CDN 扩展**: 支持全球边缘节点
- **存储扩展**: S3 无限存储容量
- **计算扩展**: 可集成 Lambda@Edge

### 2. 功能扩展接口
```javascript
// 插件化架构
class PluginManager {
    constructor() {
        this.plugins = new Map();
    }
    
    register(name, plugin) {
        this.plugins.set(name, plugin);
    }
    
    execute(name, ...args) {
        const plugin = this.plugins.get(name);
        return plugin ? plugin.execute(...args) : null;
    }
}
```

## 📋 技术债务管理

### 1. 代码质量
- **ESLint**: JavaScript 代码规范
- **Prettier**: 代码格式化
- **TypeScript**: 类型安全 (未来升级)

### 2. 依赖管理
- **无外部依赖**: 纯原生 JavaScript 实现
- **浏览器兼容性**: 支持现代浏览器
- **渐进式增强**: 基础功能向下兼容

---

**🏗️ 这个架构设计确保了网站的高性能、高安全性和高可维护性，为用户提供了流畅的黑客帝国觉醒体验。**