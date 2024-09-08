import { convertNormalToBigNumber } from "./tools";
import { web3, executeContract, getToken } from "./utils";
import { userInfo, ContractAddress, tokenItem, ERC20 } from "./config";
import { ethers } from "ethers";
/**
 * approve token
 * @param token_address
 * @param callback
 */
export async function approveToken(token_address: string, callback: (code: number, hash: string) => void) {
  let destina_address = ContractAddress[userInfo.chainID].L1;
  let contract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber("1000000000", getToken(token_address).decimals);
  executeContract(contract, "approve", "0", [destina_address, bigAmount], callback);
}
/**
 * mint
 * @param token 
 * @param callback 
 */
export async function mint(token: tokenItem, callback: (code: number, hash: string | number) => void) {
  let contract = new web3.eth.Contract(ERC20, token.id);
  let bigAmount = convertNormalToBigNumber('1000000000', token.decimals);
  executeContract(contract, "mint", "0", [userInfo.account, bigAmount], callback);
}
/**
 * transfer
 * @param token_address 
 * @param to_address 
 * @param amount 
 * @param callback 
 */
export async function transfer(token_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void) {
  console.log('transfer', token_address, to_address, amount);
  let contract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber(amount, getToken(token_address).decimals);
  executeContract(contract, "transfer", "0", [to_address, bigAmount], callback);
}

/**
 * transfer ETH
 * @param to_address 
 * @param amount 
 * @param callback 
 */
export async function transferETH(to_address: string, amount: string, callback: (code: number, hash: string) => void) {
  const transaction = {
    from: userInfo.account,
    to: to_address,
    value: convertNormalToBigNumber(amount),
  };
  try {
    const txHash = await web3.eth.sendTransaction(transaction);
    callback(1, txHash.transactionHash);
  } catch (e: any) {
    callback(-1, e.message);
  }
}
/**
 * from *** transfer to ***
 * @param token_address 
 * @param from_address 
 * @param to_address 
 * @param amount 
 * @param callback 
 */
export async function transferFrom(token_address: string, from_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let contract = new web3.eth.Contract(ERC20, token_address);
  let bigAmount = convertNormalToBigNumber(amount, getToken(token_address).decimals);
  executeContract(contract, "transferFrom", "0", [from_address, to_address, bigAmount], callback);
}
/**
 * sign
 * @param msg 
 * @param callback 
 */
export async function signEvm(msg?: string) {
  //@ts-ignore
  let _ethereum: any = window['ethereum'];
  if (!msg) {
    msg = `To avoid digital dognappers, sign below to authenticate with CryptoCorgis`;
  }
  let res = { code: 1, sign: "" };
  try {
    console.log('userInfo', msg);
    // const from = userInfo.account;
    const provider = new ethers.providers.Web3Provider(_ethereum);
    const signer = provider.getSigner();
    const sign = await signer.signMessage(msg);
    // await _ethereum.request({
    //   method: 'personal_sign',
    //   params: [msg, from],
    // });
    res = { code: 1, sign };
  } catch (e: any) {
    res = { code: 2, sign: e.message };
  }
  return res;
}