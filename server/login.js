const { readData, writeData } = require("./db");
require('dotenv').config();

const bs58 = require('bs58');
const { isEthAddress, isSolanaAddress, getChainType, genJwtToken, genSuccessResponse, genFailResponse, parseEthSignature, parseSolSignature } = require("./util");

const userTable = "users";


async function login(address, timestamp, signature) {
    let recoverAddress;
    let addressField;
    if (isEthAddress(address)) {
        recoverAddress = parseEthSignature(timestamp, signature);
        addressField = 'eth_address';
    } else if (isSolanaAddress(address)) {
        recoverAddress = parseSolSignature(timestamp, signature, address);
        addressField = 'solana_address';
    } else {
        return genFailResponse(400, "login type failed");
    }

    if (!recoverAddress || recoverAddress.toLowerCase() !== address.toLowerCase()) {
        return genFailResponse(400, "signature recover failed or expire");
    }

    
    let userData = await readData(userTable, `WHERE ${addressField} = '${recoverAddress}'`);
    let bind = userData.length > 0;
    const token = genJwtToken(recoverAddress);
    let userInfo = {};
    if (bind) {
        userInfo = {
            email: userData[0].email,
            name: userData[0].name,
            eth_address: userData[0].eth_address,
            solana_address: userData[0].solana_address
        };
    }

    return genSuccessResponse({ 
        token,
        bind,
        userInfo,
        ETH_PRICE: process.env.ETH_PRICE, 
        USDT_PRICE: process.env.USDT_PRICE, 
        SOLANA_PRICE: process.env.SOLANA_PRICE, 
        EVM_USDT_CONTRACT: process.env.EVM_USDT_CONTRACT,
        SOLANA_USDT_CONTRACT: process.env.SOLANA_USDT_CONTRACT,
        ETH_RECEIVER_ADDRESS: process.env.ETH_RECEIVER_ADDRESS, 
        SOLANA_RECEIVER_ADDRESS: process.env.SOLANA_RECEIVER_ADDRESS
    });
}

async function generateUniqueRandomName() {
    let isUnique = false;
    let name;
    while (!isUnique) {
        const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        name = `player-${randomNumber}`;
        
        // 检查数据库中是否已存在该名称
        const existingUser = await readData(userTable, `WHERE name = '${name}'`);
        if (existingUser.length === 0) {
            isUnique = true;
        }
    }
    return name;
}

async function bindAddress(address, email, name) {
    try {
        let data = await readData(userTable, `WHERE email = '${email}' or solana_address = '${address}' or eth_address = '${address}'`);
        if (data.length > 0) {
            return genFailResponse(400, "already bind");
        }

        // 如果 name 为空，生成一个唯一的随机名称
        if (!name || name.trim() === '') {
            name = await generateUniqueRandomName();
        } else {
            // 检查提供的名称是否已存在
            const existingUser = await readData(userTable, `WHERE name = '${name}'`);
            if (existingUser.length > 0) {
                return genFailResponse(400, "name already exists");
            }
        }

        let bindData = {
            email: email,
            name: name,
            bind: getChainType(address)
        };

        if (isEthAddress(address)) {
            bindData.eth_address = address;
        } else if (isSolanaAddress(address)) {
            bindData.solana_address = address;
        } else {
            return genFailResponse(400, "Invalid address");
        }

        await writeData(userTable, bindData);

        const userInfo = await readData(userTable, `WHERE email = '${email}'`);
        if (userInfo.length > 0) {
            const user = userInfo[0];
            return genSuccessResponse({
                name: user.name,
                email: user.email,
                eth_address: user.eth_address || null,
                solana_address: user.solana_address || null,
                bind: user.bind
            });
        }

        return genFailResponse(500, "bind failed");
    } catch (error) {
        console.error("bind address failed:", error);
        return genFailResponse(500, "bind address failed");
    }
}

module.exports = {
    bindAddress,
    login
};