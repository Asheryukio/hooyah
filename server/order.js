require('dotenv').config();
const { readData, writeData, updateData } = require("./db");
const { v4: uuidv4 } = require('uuid');
const { getChainType, genSuccessResponse, genFailResponse } = require("./util");

const userTable = "users";
const orderTable = "orders";

// 从 .env 文件读取价格
const ETH_PRICE = parseFloat(process.env.ETH_PRICE);
const SOLANA_PRICE = parseFloat(process.env.SOLANA_PRICE);
const USDT_PRICE = parseFloat(process.env.USDT_PRICE);

async function addOrder(address, payCoin) {
    try {
        // 1. 根据地址获取用户邮箱
        const userData = await readData(userTable, `WHERE eth_address = '${address}' OR solana_address = '${address}'`);
        if (userData.length === 0) {
            return genFailResponse(400, "user not found or not binding");
        }
        const email = userData[0].email;

        // 2. 根据 paySymbol 获取对应的价格
        let price;
        switch (payCoin.toUpperCase()) {
            case 'ETH':
                price = ETH_PRICE;
                break;
            case 'SOL':
                price = SOLANA_PRICE;
                break;
            case 'USDT':
                price = USDT_PRICE;
                break;
            default:
                return genFailResponse(400, "not support coin");
        }

        // 3. 生成随机订单 ID
        const orderId = uuidv4();

        // 4. 创建订单数据
        const orderData = {
            order_id: orderId,
            email: email,
            pay_coin: payCoin.toUpperCase(),
            pay_chain: getChainType(address),
            price: price,
            status: 0,
            buy_item: 1,
            create_time: new Date().toISOString()
        };

        // 5. 写入数据库
        await writeData(orderTable, orderData);

        return genSuccessResponse({
            orderId: orderId,
            price
        });
    } catch (error) {
        console.error("add order failed:", error);
        return genFailResponse(500, "add order failed");
    }
}

async function payOrder(address, orderId, txHash) {
    try {
        // 1. 检查交易哈希是否已被使用
        const existingOrder = await readData(orderTable, `WHERE tx_hash = '${txHash}'`);
        if (existingOrder.length > 0) {
            return genFailResponse(400, "Transaction hash already used");
        }

        // 2. 根据地址获取用户邮箱
        const userData = await readData(userTable, `WHERE eth_address = '${address}' OR solana_address = '${address}'`);
        if (userData.length === 0) {
            return genFailResponse(400, "user not found");
        }
        const email = userData[0].email;

        // 3. 查询对应的订单
        const orderData = await readData(orderTable, `WHERE order_id = '${orderId}' AND email = '${email}'`);
        if (orderData.length === 0) {
            return genFailResponse(400, "order not found");
        }

        // 4. 检查订单状态
        if (orderData[0].status !== 0) {
            return genFailResponse(400, "order already paid");
        }

        // 5. 更新订单状态和交易哈希
        const updateResult = await updateData(orderTable, 
            { tx_hash: txHash, status: 1 },
            `order_id = '${orderId}'`
        );

        if (updateResult.affectedRows === 0) {
            return genFailResponse(500, "update order failed");
        }

        return genSuccessResponse("order paid successfully");
    } catch (error) {
        console.error("pay order failed:", error);
        return genFailResponse(500, "pay order failed");
    }
}

async function queryOrder(orderId) {
    try {
        // Query the order from the database
        const orderData = await readData('orders', `WHERE order_id = '${orderId}'`);

        // Check if the order exists
        if (orderData.length === 0) {
            return genFailResponse(400, "Order not found");
        }

        const order = orderData[0];

        // Define status meanings
        const statusMeanings = {
            0: "Pending",
            1: "Paid",
            2: "Confirmed"
            // Add more status codes and meanings as needed
        };

        // Prepare the response
        const response = {
            orderId: order.order_id,
            status: order.status,
            email: order.email,
            price: order.price,
            statusMeaning: statusMeanings[order.status] || "Unknown",
            payCoin: order.pay_coin,
            pay_chain: order.pay_chain,
            price: order.price,
            createTime: order.create_time,
            tx_hash: order.tx_hash
        };

        return genSuccessResponse(response);
    } catch (error) {
        console.error("Error querying order:", error);
        return genFailResponse(500, "Failed to query order");
    }
}

module.exports = {
    addOrder,
    payOrder,
    queryOrder
};