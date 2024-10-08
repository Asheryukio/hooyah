const { readData, updateData } = require("./db");
const {Web3} = require('web3');
const axios = require('axios');
const abi = require('ethereumjs-abi');
const fs = require('fs');
const path = require('path');
const { Connection, PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
require('dotenv').config();
const BigNumber = require('bignumber.js');
const tokens = require('./tokens.json');

// 初始化 Web3 实例（用于以太坊）
const web3 = new Web3(process.env.ETH_RPC_URL);

// 初始化 Solana 连接
const solanaConnection = new Connection(process.env.SOLANA_RPC_URL);
const SOLANA_USDT_MINT = new PublicKey(process.env.SOLANA_USDT_CONTRACT);
const SOLANA_NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112');
const LAMPORTS_PER_SOL = 1e9;

// USDT 合约地址和 ABI（仅包含 transfer 函数的 ABI）
const USDT_CONTRACT_ADDRESS = process.env.EVM_USDT_CONTRACT;
// 收款地址
const ETH_RECEIVER_ADDRESS = process.env.ETH_RECEIVER_ADDRESS;
const SOLANA_RECEIVER_ADDRESS = new PublicKey(process.env.SOLANA_RECEIVER_ADDRESS);

// 获取价格并写入 tokens.json
async function updateTokenPrices() {
    try {
        const response = await axios.get('http://127.0.0.1:8787/price');
        const prices = response.data;

        // 读取现有的 tokens.json 文件
        const tokensPath = path.join(__dirname, 'tokens.json');
        const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

        // 更新价格
        for (const token in prices) {
            if (tokens[token]) {
                tokens[token].price = (tokens["USDT_SOLANA"].price / prices[token]).toString();
            }
        }

        global.tokens = tokens;
        // 写入更新后的 tokens.json 文件
        fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 4));
    } catch (error) {
        console.error('Failed to update token prices:', error);
    }
}

async function checkPaidOrders() {
    try {
        // 查询所有已支付但未确认的订单
        const paidOrders = await readData('orders', 'WHERE status = 1');

        for (const order of paidOrders) {
            let isConfirmed = false;
            
            if(order.pay_chain === 1) {
                if (order.pay_coin === 'ETH') {
                    isConfirmed = await checkEthTransaction(order);
                } else {
                    isConfirmed = await checkUsdtTransaction(order);
                }
            } else if(order.pay_chain === 2) {
                isConfirmed = await checkSolanaTransaction(order);
            } else {
                console.warn(`unsupport chain: ${order.pay_chain}`);
                continue;
            }

            if (isConfirmed) {
                // 更新订单状态为已确认

                const user = await getUserInfo(order.email);
                if (user) {
                    // 调用发送邮件的 API
                    await sendConfirmationEmail(order, user);
                } else {
                    console.error(`User not found for order ${order.order_id}`);
                }

                await updateData('orders', { status: 2 }, `order_id = '${order.order_id}'`);
                console.log(`order ${order.order_id} already paid`);
            }
        }

        // console.log("check complete");
    } catch (error) {
        console.error("check failed", error);
    }
}

async function getUserInfo(email) {
    const users = await readData('users', `WHERE email = '${email}'`);
    return users.length > 0 ? users[0] : null;
}

async function sendConfirmationEmail(order, user) {
    try {
        const chainName = order.pay_chain === 1 ? 'eth' : 'solana';
        const tokenInfo = tokens[order.pay_coin];
        
        if (!tokenInfo) {
            throw new Error(`Token information not found for ${order.pay_coin}`);
        }

        // 将 total_price 转换为 BigNumber
        const totalPrice = new BigNumber(order.total_price);

        // 计算人类可读的金额
        const readableAmount = totalPrice.dividedBy(new BigNumber(10).pow(tokenInfo.decimals)).toString();

        const response = await axios.post('http://127.0.0.1:8787/send', {
            sender: user.eth_address || user.solana_address,
            name: user.name,
            to: user.email,
            order: order.order_id,
            hash: order.tx_hash,
            chain: chainName,
            amount: `${readableAmount} ${order.pay_coin}`
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(`Confirmation email sent for order ${order.order_id}`, response.data);
    } catch (error) {
        console.error(`Failed to send confirmation email for order ${order.order_id}:`, error);
    }
}

async function checkEthTransaction(order) {
    try {
        const tx = await web3.eth.getTransaction(order.tx_hash);
        if (!tx) return false;

        const receipt = await web3.eth.getTransactionReceipt(order.tx_hash);
        if (!receipt || !receipt.status) return false;

        // 验证接收地址和金额
        if (tx.to.toLowerCase() !== ETH_RECEIVER_ADDRESS.toLowerCase()) return false;
        if (tx.value.toString() !== order.total_price.toString()) {
            console.log(`Amount mismatch. Expected: ${order.total_price}, Actual: ${tx.value}`);
            return false
        }

        return true;
    } catch (error) {
        console.error("check eth tx failed:", error);
        return false;
    }
}

async function checkUsdtTransaction(order) {
    try {
        const tx = await web3.eth.getTransaction(order.tx_hash);
        if (!tx) {
            console.log(`Transaction not found for hash: ${order.tx_hash}`);
            return false;
        }

        const receipt = await web3.eth.getTransactionReceipt(order.tx_hash);
        if (!receipt || !receipt.status) {
            console.log(`Transaction failed or pending for hash: ${order.tx_hash}`);
            return false;
        }

        console.log(`Transaction input data: ${tx.input}`);

        // Check if the transaction is to the USDT contract
        if (tx.to.toLowerCase() !== USDT_CONTRACT_ADDRESS.toLowerCase()) {
            console.log(`Transaction is not to USDT contract. To: ${tx.to}`);
            return false;
        }

        // Decode transaction input data
        const methodId = tx.input.slice(0, 10);
        const params = `0x${tx.input.slice(10)}`;

        if (methodId !== '0xa9059cbb') {
            console.log(`Not a standard ERC20 transfer. Method ID: ${methodId}`);
            return false;
        }

        const [recipient, amount] = abi.rawDecode(['address', 'uint256'], Buffer.from(params.slice(2), 'hex'));

        // Convert recipient to checksum address
        const checksumRecipient = web3.utils.toChecksumAddress(`0x${recipient.toString('hex')}`);
        const checksumReceiver = web3.utils.toChecksumAddress(ETH_RECEIVER_ADDRESS);

        console.log(`Decoded data: To: ${checksumRecipient}, Amount: ${amount.toString()}`);

        // Verify recipient address and amount
        if (checksumRecipient !== checksumReceiver) {
            console.log(`Recipient mismatch. Expected: ${checksumReceiver}, Actual: ${checksumRecipient}`);
            return false;
        }

        if (amount.toString() !== order.total_price.toString()) {
            console.log(`Amount mismatch. Expected: ${order.total_price}, Actual: ${amount}`);
            return false;
        }

        console.log(`USDT transaction verified successfully for order ${order.order_id}`);
        return true;
    } catch (error) {
        console.error(`Error checking USDT transaction for order ${order.order_id}:`, error);
        return false;
    }
}


async function checkSolanaTransaction(order) {
    try {
        const signature = order.tx_hash;
        const tx = await solanaConnection.getTransaction(signature, { commitment: 'confirmed' });
        if (!tx || tx.meta.err) return false;

        const { message } = tx.transaction;
        const accountKeys = message.accountKeys;

        let isConfirmed = false;
        if (order.pay_coin === 'SOL') {
            isConfirmed = await checkSolNativeTransfer(tx, order, accountKeys, SOLANA_NATIVE_MINT);
        } else if (order.pay_coin === 'USDT_SOLANA') {
            isConfirmed = await checkSplTokenTransfer(tx, order, accountKeys, SOLANA_USDT_MINT);
        }

        return isConfirmed;
    } catch (error) {
        console.error("Error checking Solana transaction:", error);
        return false;
    }
}

async function checkSolNativeTransfer(tx, order) {
    const { meta } = tx;
    const postBalances = meta.postBalances;
    const preBalances = meta.preBalances;

    const receiverIndex = tx.transaction.message.accountKeys.findIndex(key => key.toBase58() === SOLANA_RECEIVER_ADDRESS.toBase58());

    if (receiverIndex === -1) {
        console.log(`Receiver address not found in transaction`);
        return false;
    }

    // Calculate the change in balance for the receiver
    const balanceChangeLamports = postBalances[receiverIndex] - preBalances[receiverIndex];
    const orderPriceLamports = order.total_price;

    // Check if the balance change matches the order price in lamports
    if (balanceChangeLamports.toString() !== orderPriceLamports.toString()) {
        console.log(`Amount mismatch. Expected: ${orderPriceLamports.toString()} lamports, Actual: ${balanceChangeLamports} lamports`);
        return false;
    }

    console.log(`SOL transfer verified successfully for order ${order.order_id}`);
    return true;
}

async function checkSplTokenTransfer(tx, order) {
    const { meta } = tx;

    // 检查交易是否成功
    if (meta.err !== null) {
        console.log('Transaction failed');
        return false;
    }

    // 查找接收者的 token 账户
    const receiverPostBalance = meta.postTokenBalances.find(
        balance => balance.owner === SOLANA_RECEIVER_ADDRESS.toBase58()
    );

    if (!receiverPostBalance) {
        console.log('Receiver token account not found in postTokenBalances');
        return false;
    }

    // 查找接收者的预交易余额
    const receiverPreBalance = meta.preTokenBalances.find(
        balance => balance.owner === SOLANA_RECEIVER_ADDRESS.toBase58()
    );

    // 计算实际转账金额
    let transferAmount;
    if (receiverPreBalance) {
        transferAmount = new BigNumber(receiverPostBalance.uiTokenAmount.amount)
            .minus(receiverPreBalance.uiTokenAmount.amount);
    } else {
        // 如果之前没有余额，那么 postBalance 就是转账金额
        transferAmount = new BigNumber(receiverPostBalance.uiTokenAmount.amount);
    }

    // 检查转账金额是否匹配订单金额
    if (!transferAmount.isEqualTo(order.total_price)) {
        console.log(`Amount mismatch. Expected: ${order.total_price}, Actual: ${transferAmount.toString()}`);
        return false;
    }

    // 验证 token mint 地址
    if (receiverPostBalance.mint !== SOLANA_USDT_MINT.toBase58()) {
        console.log(`Token mint mismatch. Expected: ${SOLANA_USDT_MINT.toBase58()}, Actual: ${receiverPostBalance.mint}`);
        return false;
    }

    console.log(`SPL token transfer verified successfully for order ${order.order_id}`);
    return true;
}

async function runCheckPaidOrders() {
    // console.log('Starting to check paid orders:', new Date().toISOString());
    try {
        await updateTokenPrices();
        await checkPaidOrders();
        // console.log('Order check completed:', new Date().toISOString());
    } catch (error) {
        console.error('Error occurred during order check:', error);
    }

    // Set a short delay to prevent potential infinite loops
    setTimeout(runCheckPaidOrders, 5000);
}
runCheckPaidOrders()