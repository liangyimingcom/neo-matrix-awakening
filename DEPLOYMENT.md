# 🚀 AWS 部署指南

本文档详细介绍如何将黑客帝国 NEO 觉醒网站部署到 AWS，采用安全最佳实践架构。

## 📋 部署概览

### 架构组件
- **Amazon S3** - 私有存储桶存储静态文件
- **Amazon CloudFront** - 全球 CDN 分发
- **AWS Certificate Manager** - SSL 证书管理
- **Amazon Route53** - DNS 解析
- **Origin Access Control** - 安全访问控制

### 安全特性
- ✅ S3 桶完全私有
- ✅ 仅通过 CloudFront 访问
- ✅ 强制 HTTPS 加密
- ✅ 自动 SSL 证书管理

## 🛠️ 前置要求

### 1. AWS 账户设置
```bash
# 安装 AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 配置 AWS CLI
aws configure --profile your-profile
```

### 2. 域名要求
- 在 Route53 中托管的域名
- 或者可以修改 DNS 记录的域名

### 3. 权限要求
确保 AWS 用户具有以下权限：
- S3 完全访问权限
- CloudFront 完全访问权限
- ACM 证书管理权限
- Route53 DNS 管理权限

## 📦 步骤 1: 创建 S3 存储桶

### 1.1 创建存储桶
```bash
# 设置变量
export BUCKET_NAME="neo-matrix-awakening-$(date +%s)"
export AWS_PROFILE="your-profile"
export AWS_REGION="us-east-1"

# 创建存储桶
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION --profile $AWS_PROFILE
```

### 1.2 上传网站文件
```bash
# 上传所有文件
aws s3 sync . s3://$BUCKET_NAME \
  --exclude ".git/*" \
  --exclude ".kiro/*" \
  --exclude "node_modules/*" \
  --exclude "*.md" \
  --profile $AWS_PROFILE
```

### 1.3 配置私有访问
```bash
# 启用公共访问阻止
aws s3api put-public-access-block \
  --bucket $BUCKET_NAME \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --profile $AWS_PROFILE
```

## 🔐 步骤 2: 申请 SSL 证书

### 2.1 申请证书
```bash
# 设置域名变量
export DOMAIN_NAME="neo.yourdomain.com"

# 申请证书
CERT_ARN=$(aws acm request-certificate \
  --domain-name $DOMAIN_NAME \
  --validation-method DNS \
  --profile $AWS_PROFILE \
  --query 'CertificateArn' \
  --output text)

echo "Certificate ARN: $CERT_ARN"
```

### 2.2 获取 DNS 验证记录
```bash
# 获取验证信息
aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --profile $AWS_PROFILE \
  --query 'Certificate.DomainValidationOptions[0].ResourceRecord'
```

### 2.3 添加 DNS 验证记录
```bash
# 获取托管区域 ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones \
  --profile $AWS_PROFILE \
  --query "HostedZones[?Name=='yourdomain.com.'].Id" \
  --output text | cut -d'/' -f3)

# 创建验证记录 (替换实际的验证值)
cat > dns-validation.json << EOF
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "_validation_name_from_acm_output",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "_validation_value_from_acm_output"
          }
        ]
      }
    }
  ]
}
EOF

# 添加记录
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://dns-validation.json \
  --profile $AWS_PROFILE
```

### 2.4 等待证书验证
```bash
# 等待证书验证完成
aws acm wait certificate-validated \
  --certificate-arn $CERT_ARN \
  --profile $AWS_PROFILE

echo "Certificate validated successfully!"
```

## 🌐 步骤 3: 创建 CloudFront 分发

### 3.1 创建 Origin Access Control
```bash
# 创建 OAC 配置文件
cat > oac-config.json << EOF
{
  "Name": "neo-matrix-oac",
  "Description": "OAC for Neo Matrix website",
  "OriginAccessControlOriginType": "s3",
  "SigningBehavior": "always",
  "SigningProtocol": "sigv4"
}
EOF

# 创建 OAC
OAC_ID=$(aws cloudfront create-origin-access-control \
  --origin-access-control-config file://oac-config.json \
  --profile $AWS_PROFILE \
  --query 'OriginAccessControl.Id' \
  --output text)

echo "OAC ID: $OAC_ID"
```

### 3.2 创建 CloudFront 分发配置
```bash
# 创建分发配置文件
cat > cloudfront-config.json << EOF
{
  "CallerReference": "neo-matrix-$(date +%s)",
  "Aliases": {
    "Quantity": 1,
    "Items": ["$DOMAIN_NAME"]
  },
  "DefaultRootObject": "index.html",
  "Comment": "Neo Matrix Awakening Website",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "neo-matrix-s3-origin",
        "DomainName": "$BUCKET_NAME.s3.$AWS_REGION.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        },
        "OriginAccessControlId": "$OAC_ID"
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "neo-matrix-s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "$CERT_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "PriceClass": "PriceClass_100"
}
EOF
```

### 3.3 创建 CloudFront 分发
```bash
# 创建分发
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json \
  --profile $AWS_PROFILE \
  --query 'Distribution.Id' \
  --output text)

echo "Distribution ID: $DISTRIBUTION_ID"

# 获取 CloudFront 域名
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
  --id $DISTRIBUTION_ID \
  --profile $AWS_PROFILE \
  --query 'Distribution.DomainName' \
  --output text)

echo "CloudFront Domain: $CLOUDFRONT_DOMAIN"
```

### 3.4 等待分发部署
```bash
# 等待分发部署完成
echo "Waiting for CloudFront distribution to deploy..."
aws cloudfront wait distribution-deployed \
  --id $DISTRIBUTION_ID \
  --profile $AWS_PROFILE

echo "CloudFront distribution deployed successfully!"
```

## 🔒 步骤 4: 配置 S3 桶策略

### 4.1 创建桶策略
```bash
# 获取 AWS 账户 ID
ACCOUNT_ID=$(aws sts get-caller-identity --profile $AWS_PROFILE --query 'Account' --output text)

# 创建 S3 桶策略
cat > s3-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DISTRIBUTION_ID"
        }
      }
    }
  ]
}
EOF
```

### 4.2 应用桶策略
```bash
# 应用策略
aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy file://s3-policy.json \
  --profile $AWS_PROFILE

echo "S3 bucket policy applied successfully!"
```

## 🌍 步骤 5: 配置 DNS 记录

### 5.1 创建 CNAME 记录
```bash
# 创建 CNAME 记录配置
cat > cname-record.json << EOF
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "$DOMAIN_NAME",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "$CLOUDFRONT_DOMAIN"
          }
        ]
      }
    }
  ]
}
EOF
```

### 5.2 添加 DNS 记录
```bash
# 添加 CNAME 记录
CHANGE_ID=$(aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://cname-record.json \
  --profile $AWS_PROFILE \
  --query 'ChangeInfo.Id' \
  --output text)

echo "DNS change ID: $CHANGE_ID"
```

### 5.3 等待 DNS 传播
```bash
# 等待 DNS 记录生效
echo "Waiting for DNS propagation..."
aws route53 wait resource-record-sets-changed \
  --id $CHANGE_ID \
  --profile $AWS_PROFILE

echo "DNS records updated successfully!"
```

## ✅ 步骤 6: 验证部署

### 6.1 测试 HTTPS 访问
```bash
# 测试网站访问
echo "Testing website access..."
curl -I https://$DOMAIN_NAME

# 检查 SSL 证书
echo "Checking SSL certificate..."
openssl s_client -connect $DOMAIN_NAME:443 -servername $DOMAIN_NAME < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

### 6.2 验证安全配置
```bash
# 验证 S3 桶私有配置
echo "Verifying S3 bucket security..."
aws s3api get-public-access-block \
  --bucket $BUCKET_NAME \
  --profile $AWS_PROFILE

# 验证桶策略
aws s3api get-bucket-policy \
  --bucket $BUCKET_NAME \
  --profile $AWS_PROFILE
```

## 🔧 维护操作

### 更新网站内容
```bash
# 更新文件
aws s3 sync . s3://$BUCKET_NAME \
  --delete \
  --exclude ".git/*" \
  --profile $AWS_PROFILE

# 清除 CloudFront 缓存
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*" \
  --profile $AWS_PROFILE
```

### 监控和日志
```bash
# 启用 CloudFront 访问日志 (可选)
aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --distribution-config file://updated-config-with-logging.json \
  --if-match $(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'ETag' --output text) \
  --profile $AWS_PROFILE
```

## 🚨 故障排除

### 常见问题

#### 1. 证书验证失败
```bash
# 检查 DNS 记录是否正确
dig _validation_name_from_acm_output

# 重新验证证书
aws acm resend-validation-email \
  --certificate-arn $CERT_ARN \
  --domain $DOMAIN_NAME \
  --validation-domain $DOMAIN_NAME \
  --profile $AWS_PROFILE
```

#### 2. CloudFront 403 错误
```bash
# 检查 S3 桶策略
aws s3api get-bucket-policy --bucket $BUCKET_NAME --profile $AWS_PROFILE

# 检查 OAC 配置
aws cloudfront get-origin-access-control --id $OAC_ID --profile $AWS_PROFILE
```

#### 3. DNS 解析问题
```bash
# 检查 DNS 记录
dig $DOMAIN_NAME

# 检查 Route53 记录
aws route53 list-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --profile $AWS_PROFILE
```

## 💰 成本优化

### 1. 选择合适的价格等级
```bash
# 更新为更经济的价格等级
# PriceClass_100: 美国、加拿大、欧洲
# PriceClass_200: 美国、加拿大、欧洲、亚洲、中东、非洲
# PriceClass_All: 全球所有边缘位置
```

### 2. 配置缓存策略
```bash
# 为静态资源设置长期缓存
# CSS/JS 文件: 1年
# HTML 文件: 1小时
# 图片文件: 1个月
```

## 🔄 自动化脚本

### 完整部署脚本
```bash
#!/bin/bash
# deploy.sh - 一键部署脚本

set -e

# 配置变量
DOMAIN_NAME="neo.yourdomain.com"
AWS_PROFILE="your-profile"
AWS_REGION="us-east-1"
BUCKET_NAME="neo-matrix-awakening-$(date +%s)"

echo "🚀 Starting deployment..."

# 1. 创建 S3 桶
echo "📦 Creating S3 bucket..."
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION --profile $AWS_PROFILE

# 2. 上传文件
echo "📤 Uploading files..."
aws s3 sync . s3://$BUCKET_NAME --exclude ".git/*" --profile $AWS_PROFILE

# 3. 配置私有访问
echo "🔒 Configuring private access..."
aws s3api put-public-access-block \
  --bucket $BUCKET_NAME \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --profile $AWS_PROFILE

# 4. 申请证书
echo "🔐 Requesting SSL certificate..."
CERT_ARN=$(aws acm request-certificate \
  --domain-name $DOMAIN_NAME \
  --validation-method DNS \
  --profile $AWS_PROFILE \
  --query 'CertificateArn' \
  --output text)

echo "Certificate ARN: $CERT_ARN"
echo "Please add the DNS validation record and run the script again with --continue flag"

# 继续部署的其他步骤...
```

## 📞 支持

如果在部署过程中遇到问题，请：

1. 检查 AWS CLI 配置和权限
2. 验证域名和 DNS 设置
3. 查看 CloudFormation 事件日志
4. 参考 AWS 官方文档

---

**🎉 部署完成后，你的黑客帝国 NEO 觉醒网站将在你的自定义域名上安全运行！**