import {legacy_createStore,applyMiddleware, Action} from 'redux';
import {thunk} from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import { trace } from '../utils/tools';

const initState = {
    isMobile: false,
    isLogin: false,
    isEvm:true,
    account: "",
    network: "",
    chainId: 0,
    token:'',
    userInfo: {},
    info: {},
    gWidth:1,
    gHeight:1,
    walletId:0,
}

export enum actionsType {
    MOBILE='MOBILE',
    LOGIN='LOGIN',
    TOKEN='TOKEN',
    USERINFO='USERINFO',
    GWIDTH='GWIDTH',
    GHEIGHT='GHEIGHT',
    NETWORK='NETWORK',
    CHAINID='CHAINID',
    ACCOUNT='ACCOUNT',
    EVM='EVM',
    INFO='INFO',
    walletId='walletId',
}

export type ActionG = Action & {
    type: actionsType,
    data: number | boolean | string | never
}


function reducer(state=initState, action:ActionG) {
    // trace("reducer",state,action)
    switch (action.type) {
        case actionsType.MOBILE:
            return { ...state, isMobile: action.data };
        case actionsType.LOGIN:
            return { ...state, isLogin: action.data };
        case actionsType.TOKEN:
            return { ...state, token: action.data };
        case actionsType.USERINFO:
            return { ...state, userInfo: action.data };
        case actionsType.GWIDTH:
            return { ...state, gWidth: action.data };
        case actionsType.GHEIGHT:
            return { ...state, gHeight: action.data };
        case actionsType.NETWORK:
            return { ...state, network: action.data };
        case actionsType.CHAINID:
            return { ...state, chainId: action.data };
        case actionsType.ACCOUNT:
            return { ...state, account: action.data };
        case actionsType.EVM:
            return { ...state, isEvm: action.data };
        case actionsType.INFO:
            return { ...state, info: action.data };
        case actionsType.walletId:
            return { ...state, walletId: action.data };
        default:
            return state;
    }
   
}


//composeWithDevTools(applyMiddleware(thunk))
const store = legacy_createStore(reducer,composeWithDevTools(applyMiddleware(thunk)));



export default store;


