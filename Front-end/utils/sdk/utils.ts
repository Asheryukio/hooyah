import Web3 from "web3";
import { printf } from './tools';
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import detectEthereumProvider from '@metamask/detect-provider';
import Provider, { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ProviderRpcError } from '@walletconnect/ethereum-provider/dist/types/types';
import { Chains, chainIdDict, tokenItem, tokens, UpdateAccountInfo, userInfo } from './config';
export var web3: Web3;

const projectId = '7e48604750ff839dfde67bffc47f08ec';
var provider: Provider;
/**
 * logout
 * @returns 
 */
export function logout() {
    //@ts-ignore
    web3 = null;
    userInfo.account = "";
    UpdateAccountInfo();
    if (provider?.connecting) {
        provider.disconnect();
    }
    return {
        account: userInfo.account,
        chainID: userInfo.chainID,
        chain: userInfo.chain,
        message: "logout",
    }
}
/**
 * connect wallet
 * @param type "metamask" | "walletconnect" | "coinbase"
 * @param callback 
 * @returns 
*/
export async function connect(type: "metamask" | "walletconnect" | "coinbase", callback: (data: { account: string; chainID: number; chain: string, message: string; }) => void) {
    console.log("connect-tttt", type);
    const isMobile = window.innerWidth<=640;
    try {
        if (type === "metamask") {
            const _ethereum: any = await detectEthereumProvider({ mustBeMetaMask: true });
            if (_ethereum && _ethereum.isMetaMask) {
                await _ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(_ethereum);
                eventsOn(_ethereum, callback);
                userInfo.message = "metamask";
            }else{
                userInfo.message = isMobile?"Please use a Web3 Dapp browser to access.":"Metamask not installed";
            }
        } else if (type === "walletconnect") {
            provider = await EthereumProvider.init({
                projectId: projectId,
                chains: [421614, 42161],
                showQrModal: true,
                optionalChains: [421614, 42161]
            })
            await provider.enable()
            //@ts-ignore
            web3 = new Web3(provider);
            eventsOn(provider, callback);
            userInfo.message = "walletconnect";
        } else if (type === "coinbase") {
            const coinbaseWallet = new CoinbaseWalletSDK({});
            const _ethereum: any = coinbaseWallet.makeWeb3Provider();
            await _ethereum.enable();
            web3 = new Web3(_ethereum);
            eventsOn(_ethereum, callback);
            userInfo.message = "coinbase";
        }
        if (web3) {
            userInfo.account = (await web3.eth.getAccounts())[0].toLowerCase();
            //@ts-ignore
            userInfo.chainID = await web3.eth.getChainId();
            userInfo.chain = chainIdDict[userInfo.chainID] ?? "";
            UpdateAccountInfo();
        }
    } catch (e: any) {
        userInfo.message = e.message;
    }
    return userInfo
}
/**
 * import token
 * @param token 
 * @returns 
 */
export async function importToken(token: tokenItem) {
    const _ethereum: any = await detectEthereumProvider();
    const params = {
        type: "ERC20",
        options: {
            address: token.id,
            symbol: token.symbol,
            decimals: token.decimals,
        }
    }
    return await _ethereum.request({
        method: "wallet_watchAsset",
        params: params,
    })
}
let walletDisconnectTimer: NodeJS.Timeout | null;
/**
 * account and chain event
 * @param _provider 
 * @param callback 
 */
function eventsOn(_provider: Provider, callback: (data: { account: string; chainID: number; chain: string, message: string; }) => void) {
    _provider.on("accountsChanged", (accounts: string[]) => {
        userInfo.account = accounts[0]?.toLowerCase();
        UpdateAccountInfo();
        callback({
            account: userInfo.account,
            chainID: userInfo.chainID,
            chain: chainIdDict[userInfo.chainID] ?? "",
            message: "accountsChanged",
        });
    });
    _provider.on("chainChanged", async (chainId: string) => {
        userInfo.chainID = Number(chainId) as typeof userInfo.chainID;
        callback({
            account: (await web3.eth.getAccounts())[0].toLowerCase(),
            chainID: userInfo.chainID,
            chain: chainIdDict[userInfo.chainID] ?? "",
            message: "chainChanged",
        });
    });
    _provider.on("disconnect", (args: ProviderRpcError) => {
        if (walletDisconnectTimer !== null) clearTimeout(walletDisconnectTimer)
        walletDisconnectTimer = setTimeout(() => {
            walletDisconnectTimer = null;
            if (args.code) {
                userInfo.account = "";
                UpdateAccountInfo();
                callback({
                    account: "",
                    chainID: 1,
                    chain: "",
                    message: "disconnect",
                })
            }
        }, 300);
    })
}
/**
 * change Metamask chain
 * @param chainid
 * @returns
 */
export async function changeMetamaskChain(chainid: 1 | 97 | 421614) {
    const _ethereum: any = await detectEthereumProvider();
    if (!_ethereum || !_ethereum.isMetaMask) {
        return;
    }
    try {
        await _ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x' + chainid.toString(16) }]
        })
    } catch (switchError: any) {
        if (switchError.code === 4902) {
            await _ethereum.request({ method: 'wallet_addEthereumChain', params: Chains[chainid] }).catch();
        }
    }
}
/**
 * is ETH address
 * @param token_address
 * @returns bool
 */
export async function isETHAddress(token_address: string) {
    try {
        var code = await web3.eth.getCode(token_address);
        if (code === "0x") {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}
/**
 * get token from token list
 * @param param 
 * @returns 
 */
export function getToken(param: string) {
    const defaultToken = { decimals: 18, id: "", symbol: "unknown", chainid: 1 };
    if (param.startsWith('0x')) {
        param = param.toLowerCase();
        return tokens.find(item => item.chainid === userInfo.chainID && item.id.toLowerCase() === param) ?? tokens.find(item => item.id.toLowerCase() === param) ?? defaultToken;
    } else {
        return tokens.find(item => item.chainid === userInfo.chainID && item.symbol === param) ?? tokens.find(item => item.symbol === param) ?? defaultToken;
    }
}
/**
 * execute contract
 * @param contract 
 * @param methodName 
 * @param value 
 * @param params 
 * @param callback
 */
export async function executeContract(contract: any, methodName: string, value: string, params: any, callback: (code: number, hash: string) => void, isCall = true) {
    let b = false;
    try {
        if (isCall) {
            let call_res = await contract.methods[methodName](...params).call({
                from: userInfo.account,
                value: value,
            });
            printf("call_res=", call_res)
        }
        b = true;
    }
    catch (err: any) {
        printf("--------params--------", params);
        printf("executeContract-", err);
        let str = JSON.stringify(err);
        if (str === "{}") {
            str = err.message
        }
        let id1 = str.indexOf("{");
        let id2 = str.lastIndexOf("}");
        let va = "";
        if (str.indexOf("Error:") >= 0) {
            va = str.slice(str.indexOf("Error"), id1);
            if (va.length < 8) {
                callback(4, str);
            } else {
                callback(4, va);
            }
            return;
        }
        str = str.slice(id1, id2 + 1);
        try {
            let aa = JSON.parse(str);
            if (aa.message) {
                va = aa.message;
            }
            else if (aa.originalError && aa.originalError.message) {
                va = aa.originalError.message;
            }
            else {
                va = str;
            }
        }
        catch (err2) {
            va = str;
        }

        if (va.length < 8) {
            va = JSON.stringify(err);
        }
        if (va === "execution reverted: No enough liquidity") {
            callback(4, va);
        } else {
            callback(-1, va);
        }
        b = false;
    }
    if (!b)
        return;
    // contract.methods[methodName](...params).estimateGas().catch((e: any) => console.error("-----methodName----", e));
    let sendParams: any = { from: userInfo.account, value: value }
    contract.methods[methodName](...params)
        .send(sendParams)
        .once("transactionHash", function (hash: string) {
            callback(0, hash);
        })
        .once("receipt", function (receipt: any) {
            if (receipt.status === true) {
                callback(1, receipt.transactionHash);
            }
        })
        .on("error", function (error: any, message: any) {
            if (message && message.transactionHash) {
                callback(3, message.transactionHash);
            } else {
                callback(2, error.message);
            }
        });
}