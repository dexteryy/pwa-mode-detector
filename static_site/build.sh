#!/bin/bash

# 设置颜色变量
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

echo -e "${BLUE}===== PWA显示模式检测器 - 静态版本构建 =====${NC}"

# 确保必要的目录存在
mkdir -p public
mkdir -p public/manifests
mkdir -p public/icons

# 复制所有必要的静态资源
echo -e "${BLUE}[1/4]${NC} 复制静态资源..."
if [ -d "../client/public/icons" ]; then
  cp -r ../client/public/icons/* public/icons/ 2>/dev/null || :
else
  echo "警告: 图标目录不存在，跳过复制"
fi

if [ -d "../client/public/manifests" ]; then
  cp -r ../client/public/manifests/* public/manifests/ 2>/dev/null || :
else
  echo "警告: manifests目录不存在，跳过复制"
fi

if [ -f "../client/public/manifest.json" ]; then
  cp ../client/public/manifest.json public/ 2>/dev/null || :
else
  echo "警告: manifest.json文件不存在，跳过复制"
fi

# 安装依赖
echo -e "${BLUE}[2/4]${NC} 安装依赖..."
npm install --silent

# 执行构建
echo -e "${BLUE}[3/4]${NC} 开始构建静态站点..."
node build.js

# 创建简单的服务器配置
echo -e "${BLUE}[4/4]${NC} 创建服务器配置..."
cat > ../dist/serve.json <<EOL
{
  "public": ".",
  "rewrites": [
    { "source": "/**", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/**",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" }
      ]
    }
  ]
}
EOL

echo -e "${GREEN}静态网站构建完成！${NC}"
echo -e "构建结果位于 ${BLUE}../dist${NC} 目录"
echo -e "您可以使用 ${BLUE}'npx serve ../dist'${NC} 预览站点"
echo ""
echo -e "${GREEN}本项目现已是纯静态PWA应用，不再需要服务器！${NC}"