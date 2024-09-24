const express = require('express');
const app = express();
const port = 3001;
const {login, bindAddress} = require("./login")
const {addOrder, payOrder, queryOrder} = require("./order")
const {parseJwtToken} = require("./util")
const { genFailResponse} = require("./util");
require("./query")


// 中间件,用于解析JSON请求体
app.use(express.json());


function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json(genFailResponse(403, "token not found"));
    }

    const result = parseJwtToken(token.split(' ')[1]); // 假设 token 格式为 "Bearer <token>"

    if (!result.success) {
        return res.status(401).json(genFailResponse(401, result.error));
    }

    req.address = result.data.address; // 将解码后的用户信息添加到请求对象
    next();
}

// GET请求 - 获取所有用户
app.post('/login', async (req, res) => {
  const {address, timestamp, signature} = req.body;
  res.json(await login(address, timestamp, signature));
});

// POST请求 - 创建新用户
app.post('/bindAddress', verifyToken, async (req, res) => {
  const { email, name } = req.body;
  res.json(await bindAddress(req.address, email, name));
});

app.post('/addOrder', verifyToken, async (req, res) => {
    const { payCoin, amount } = req.body;
    res.json(await addOrder(req.address, payCoin, amount));
  });

app.post('/payOrder', verifyToken, async (req, res) => {
    const { orderId, txHash } = req.body;
    res.json(await payOrder(req.address, orderId, txHash));
  });

  app.get('/queryOrder', async (req, res) => {
    const { orderId } = req.query;  // 从查询参数中获取 orderId
    if (!orderId) {
        return res.status(400).json(genFailResponse(400, "orderId is required"));
    }
    res.json(await queryOrder(orderId));
});
// 启动服务器
app.listen(port, () => {
  console.log(`server start at http://localhost:${port}`);
});
