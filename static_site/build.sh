#!/bin/bash

# 确保必要的目录存在
mkdir -p public
mkdir -p public/manifests
mkdir -p public/icons

# 复制所有必要的静态资源
echo "复制静态资源..."
cp -r ../client/public/icons/* public/icons/
cp -r ../client/public/manifests/* public/manifests/
cp ../client/public/manifest.json public/

# 安装依赖
echo "安装依赖..."
npm install

# 执行构建
echo "开始构建静态站点..."
node build.js

echo "静态网站构建完成！"
echo "构建结果位于 ../dist 目录"
echo "您可以使用 'npx serve ../dist' 预览站点"