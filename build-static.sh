#!/bin/bash
echo "Building static website..."

# 构建Vite项目
npx vite build

# 创建静态服务目录
mkdir -p dist-static
mkdir -p dist-static/manifests
mkdir -p dist-static/icons

# 复制构建后的静态文件
cp -r dist/public/* dist-static/
cp -r client/public/manifests/* dist-static/manifests/
cp -r client/public/icons/* dist-static/icons/
cp client/public/manifest.json dist-static/

echo "Static website build completed in dist-static directory"