import { ActionG,actionsType } from "."

export const setGWidth = (value:number):ActionG => {
    return {
        type: actionsType.GWIDTH,
        data: value
    };
}
export const setGHeight = (value:number):ActionG => {
    return {
        type: actionsType.GHEIGHT,
        data: value
    };
}
export const setMobile = (value:boolean):ActionG => {
    return {
        type: actionsType.MOBILE,
        data: value
    };
}
export const setUser = (value:never):ActionG => {
    return {
        type: actionsType.USERINFO,
        data: value
    };
}

//set isLogin
export const setLogin = (value:boolean):ActionG => {
    return {
        type: actionsType.LOGIN,
        data: value
    };
}
//set network
export const setNetwork = (value:string):ActionG => {
    return {
        type: actionsType.NETWORK,
        data: value
    };
}

//set chainId.
export const setChainId = (value:number):ActionG => {
    return {
        type: actionsType.CHAINID,
        data: value
    };
}

//set account
export const setAccount = (value:string):ActionG => {
    return {
        type: actionsType.ACCOUNT,
        data: value
    };
}

//set Evm
export const setEvm = (value:boolean):ActionG => {
    return {
        type: actionsType.EVM,
        data: value
    };
}
//set info
export const setInfo = (value:never):ActionG => {
    return {
        type: actionsType.INFO,
        data: value
    };
}

//set walletId
export const setWalletId = (value:number):ActionG => {
    return {
        type: actionsType.walletId,
        data: value
    };
}