const { ethers } = require('ethers');
const { Keypair, sign } = require('@solana/web3.js');
const bs58 = require('bs58').default;
const nacl = require("tweetnacl")
const ethUtil = require('ethereumjs-util');
const expireTime = 100 * 60 * 1000
const jwt = require('jsonwebtoken');
// 生成 EVM 签名
async function generateEvmSignature(privateKey, message) {
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signMessage(message);
    return {
        address: wallet.address,
        signature
    };
}

// 生成 Solana 签名
function generateSolanaSignature(privateKey, message) {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    
    const messageUint8 = new TextEncoder().encode(message);
    const signatureUint8 = nacl.sign.detached(messageUint8, keypair.secretKey);
    const signature = bs58.encode(signatureUint8);
    return {
        address: keypair.publicKey.toBase58(),
        signature
    };
}

function parseEthSignature(timestamp, signature) {
    try {
        const message = timestamp.toString();
        const msgBuffer = Buffer.from(message);
        const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
        const signatureBuffer = ethUtil.toBuffer(signature);
        const signatureParams = ethUtil.fromRpcSig(signatureBuffer);

        const publicKey = ethUtil.ecrecover(
            msgHash,
            signatureParams.v,
            signatureParams.r,
            signatureParams.s
        );
        

        const addressBuffer = ethUtil.publicToAddress(publicKey);
        const address = ethUtil.bufferToHex(addressBuffer);

        if (parseInt(timestamp) + expireTime < new Date().getTime()) {
            return null;
        }

        return ethUtil.toChecksumAddress(address);
    } catch (error) {
        console.log(error)
        return null;
    }
}

function parseSolSignature(timestamp, signature, publicKey) {
    try {
        const message = timestamp.toString();
        const signatureBuffer = bs58.decode(signature);
        const publicKeyBuffer = bs58.decode(publicKey);

        if (!nacl.sign.detached.verify(Buffer.from(message), signatureBuffer, publicKeyBuffer)) {
            return null;
        }

        if (parseInt(timestamp) + expireTime < new Date().getTime()) {
            return null;
        }

        return publicKey;
    } catch (error) {
        console.log(error)
        return null;
    }
}

// 测试函数
async function testSignatures() {
    const timestamp = new Date().getTime();

    console.log(`Log in ${timestamp}`);

    // EVM 签名
    const evmPrivateKey = '0xc4481eead55a281469aabc440eef6bf10e9ade56143a37bb5fbbf714f3e40350';
    const evmResult = await generateEvmSignature(evmPrivateKey, timestamp.toString());
    console.log('EVM 签名结果:', evmResult);

    // Solana 签名
    const solanaPrivateKey = '5SGZkTNo375P9AHpgYq1Wq63xcbc8F46aWMaaCAW9eT2spnuoHh3uLduyTcs3dfmbP2RZSr2QBqc9whVzrK7e7tH';
    const solanaResult = generateSolanaSignature(solanaPrivateKey, timestamp.toString());
    console.log('Solana 签名结果:', solanaResult);

}

const genSuccessResponse = (data) => {
    return {
        code: 200,
        data
    };
};

const genFailResponse = (code, message) => {
    return {
        code,
        message
    };
};

function parseJwtToken(token) {
    try {
        // 验证并解码 JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            success: true,
            data: decoded
        };
    } catch (error) {
        // 如果 token 无效或已过期，返回错误信息
        if (error instanceof jwt.JsonWebTokenError) {
            return {
                success: false,
                error: "token invalid"
            };
        } else if (error instanceof jwt.TokenExpiredError) {
            return {
                success: false,
                error: "token expired"
            };
        } else {
            return {
                success: false,
                error: "token verify failed"
            };
        }
    }
}

function genJwtToken(address) {
    return jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

// 判断是否为有效的以太坊地址
function isEthAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isSolanaAddress(address) {
    try {
        // 检查地址是否为字符串
        if (typeof address !== 'string') {
            return false;
        }

        // 尝试解码 base58 地址
        const decoded = bs58.decode(address);

        // 检查解码后的长度是否为 32 字节
        return decoded.length === 32;
    } catch (error) {
        // 如果解码失败，则不是有效的 Solana 地址
        return false;
    }
}


function getChainType(address) {
    if(isEthAddress(address)) {
        return 1
    } 

    return 2
}

// 中间件：验证 JWT token


module.exports = { getChainType, isSolanaAddress, isEthAddress, parseEthSignature, parseSolSignature, parseJwtToken, genJwtToken, genSuccessResponse, genFailResponse, generateEvmSignature, generateSolanaSignature };
testSignatures()