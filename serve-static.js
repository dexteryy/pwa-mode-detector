import express from 'express';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// 为静态资源提供服务
app.use(express.static(resolve(__dirname, 'dist-static')));

// 对所有路由返回index.html（SPA路由支持）
app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, 'dist-static', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});