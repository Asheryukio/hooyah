import { web3 } from "./utils";
import { ERC20, userInfo } from "./config";
import { convertBigNumberToNormal } from "./tools";

export { useAccountInfo } from "./config";
export { transfer, transferETH, signEvm } from "./execute";
export { logout, getToken, connect } from "./utils"
export { connectWallet, getTokenBalance, signSolana, transferToken, transferSol, logoutPhantom } from "./phantom";

const tokens = [{ id: "0xB757c8A137aaa639fe96f3fB7e45119B146b034a", symbol: "USDT", decimal: 18 },
{ id: "0x0000000000000000000000000000000000000000", symbol: "ETH", decimal: 18 }]

export async function getTokensBalance() {
    let balances = [];
    try {
        for (let index = 0; index < tokens.length; index++) {
            const element = tokens[index];
            if (element.id === "0x0000000000000000000000000000000000000000") {
                console.log("userInfo9999",userInfo.account,web3.eth);
                let balance = await web3.eth.getBalance(userInfo.account);
                balances.push({
                    balance: convertBigNumberToNormal(balance),
                    ...element
                });
            } else {
                let contract = new web3.eth.Contract(ERC20, element.id);
                let balance = await contract.methods.balanceOf(userInfo.account).call();
                balances.push({
                    balance: convertBigNumberToNormal(balance, element.decimal),
                    ...element
                });
            }
        }
    } catch (e) {
        console.log(e);
    }
    return balances;
}