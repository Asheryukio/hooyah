import store from '../redux/index';
import { setChainId,  setEvm, setAccount, setNetwork, setLogin, setUser, setInfo } from "../redux/action";
import { trace ,replaceStr, copy, showToast} from "../../utils/tools";
import {  FC, useState } from "react";
import { Button, Flex,Popover,Divider } from 'antd';
import { connect,connectWallet,signSolana, signEvm,logout, logoutPhantom } from "../../utils/sdk";
import "./header.scss";

import SelectWallet from "../components/modal/SelectWallet";
import { bindAddress, login } from "../api/user";
import { MessageType } from "../../utils/type";
import Bind from "../components/modal/bind";
import { useSelector } from "react-redux";
import Continue from "../components/modal/continue";
import { Header } from 'antd/es/layout/layout';
import { phaChainId } from '../../utils/sdk/phantom';

import logo from "@/assets/logo.png";
import img1 from "@/assets/metamask.png";
import img2 from "@/assets/coinbaseWallet.png";
import img3 from "@/assets/walletConnect.png";
import img4 from "@/assets/phantom.png";



export const defaultChainId = 421614;   //1



const Hed:FC = ()=>{
    // const [isMask] = useState(false);   //isMask?'heard heard-on':
    const [showConnect, setShowConnect] = useState<boolean>(false);
    const [showBind,setShowBind] = useState<boolean>(false);
    const [showContinue, setShowContinue] = useState<boolean>(false);

    // const { address,chain,chainID,providerInfo} = useAccountInfo();

    // const {account,isLogin,network,isMobile,userInfo} = store.getState();
    const {isLogin,userInfo,account,network,isMobile,isEvm,walletId} = useSelector((state:never)=>state);
    
    // const resizeWindow = ()=>{
    //     store.dispatch(setGHeight(window.innerWidth));
    //     store.dispatch(setGHeight(window.innerHeight));
    //     store.dispatch(setMobile(window.innerWidth<=640));

    // }
    // window.addEventListener('resize', resizeWindow);
    // resizeWindow();

    trace('isLogin',isLogin,userInfo,account,network,isMobile);

    const toHome = ()=>{
    }
    const connecWallet = ()=>{
        trace('connect wallet');
        setShowConnect(true);
    }

    const toBind = async (code:number,dada:any)=>{
        // setShowBind(false);
        if(code==0){
            setShowBind(false);
            // showToast('Bind Success',MessageType.success);
        }else if(code==1){
            const res = await bindAddress(dada.email,dada.name);
            if(res.code==200){
                setShowBind(false);
                showToast('Bind Success',MessageType.success);
                store.dispatch(setUser(res.data as never));
                setShowContinue(true);
            }else{
                showToast(res.message,MessageType.error);
            }

        }
    }
    const toContinue = (code:number)=>{
        setShowContinue(false);
    }

    const selectCallback = (code,data)=>{
        trace('selectCallback',code,data);

        if(code==1){    //evm
            // //"metamask" | "walletconnect" | "coinbase",
            connect(data,(data:any)=>{
                if(!data.account){
                    showToast(data.message,MessageType.error);
                    setShowConnect(false);
                }else{
                    updateAccount(data);
                }
                
            }).then((data2:any)=>{
                trace('connect-wallet-1',data2);
                if(!data2.account){
                    showToast(data2.message,MessageType.error);
                    setShowConnect(false);
                }else{
                    updateAccount(data2);
                }
                
            });
        }else if(code==2){ //sol
            if(data=='phantom'){
                connectWallet((data1)=>{
                    if(!data1.account){
                        showToast(data1.message,MessageType.error);
                        setShowConnect(false);
                    }else{
                        updateAccount(data1);
                    }
                    
                }).then((data2)=>{
                    trace('connect-wallet-data2',data2);
                    if(!data2.account){
                        showToast(data2.message,MessageType.error);
                        setShowConnect(false);
                    }else{
                        updateAccount(data2);
                    }
                    
                });
                return;
            }
        }else if(code==0){
            setShowConnect(false);
        }
        // setShowConnect(false);
        
    }
    let updateAccountTimer;
    const updateAccount = (data:any)=>{
        if(updateAccountTimer) clearTimeout(updateAccountTimer);
        updateAccountTimer = setTimeout(()=>{
            updateAccount2(data);
        },850);
    }

    const updateAccount2 = async (data:any)=>{
        trace('connect wallet-data',data);
        if(defaultChainId==data?.chainID||data?.chainID==phaChainId){
            const t = Date.now().toString();
            const sig = (data?.chainID==defaultChainId)?await signEvm(t):await signSolana(t);
            trace('signEvm',sig,data?.chainID);
            if(sig.code!=1){
                showToast(sig.sign,MessageType.error);
                setShowConnect(false);
                store.dispatch(setLogin(false));
            }else{
                const res = await login(data.account,sig.sign,t);
                setShowConnect(false);
                trace('login-res',res);
                if(res.code==200){
                    store.dispatch(setAccount(data.account));
                    store.dispatch(setChainId(data.chainID));
                    store.dispatch(setNetwork(data.chain));
                    store.dispatch(setUser(res.data.userInfo as never));
                    store.dispatch(setInfo(res.data as never));

                    store.dispatch(setEvm(data?.chainID==defaultChainId));
                    store.dispatch(setLogin(true));

                    if(!res.data.bind){
                        setShowBind(true);
                    }
                        showToast('Login Success',MessageType.success);
                }else{
                    store.dispatch(setLogin(false));
                    showToast(res.message,MessageType.error);
                }
            }
        }else{
            store.dispatch(setLogin(false));
            showToast('Please switch to corresponding Chain first',MessageType.info);
            setShowConnect(false);
        }
    };

    const copyToAcc = ()=>{
        trace('copyToAcc');
        copy(account?account:'',()=>{
            showToast('Copy Success',MessageType.success);
        });
    }

    const toLogOut = ()=>{
        if(isEvm) logout();
        else{
            logoutPhantom();
        }
        localStorage.removeItem("token");
        store.dispatch(setLogin(false));
        trace('logout');
    }
    const getIcon = ()=>{
        if(walletId==1) return img1;
        else if(walletId==2) return img2;
        else if(walletId==3) return img3;
        else if(walletId==4) return img4;
        else return img1;
    }

    const pContent = ()=>{
        return(
            <div className="accoutInfo">
                <div>
                    <div className="accoutInfoTitle">Network：</div>
                    <div className="ainf-t1">
                        <span className="ainf-dot"
                        ></span>
                        { network }
                    </div>
                </div>
                <Divider style={{
                    position: 'absolute',left: 0,top: 52,
                }} />
                <div>
                    <div className="accoutInfoTitle" style={{marginTop:24}}>Account</div>
                    <div className="ainf-t1">
                        { userInfo?.email }
                    </div>
                </div>
                <Divider style={{
                    position: 'absolute',left: 0,top: 120,
                }} />
                <div style={{height:14}}></div>
                <div 
                    style={{
                        width: 200,
                        marginLeft: -20
                    }}
                    
                ></div>
                <div className="ainf-t2"
                    onClick={copyToAcc}>
                
                    <span style={{marginRight:8}}>
                    <svg className="svg-copy"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="9" width="10" height="10" rx="2" fill="transparent"  strokeWidth="1.5"/>
                        <path d="M6.63636 14V14C5.73262 14 5 13.2674 5 12.3636V7C5 5.89543 5.89543 5 7 5H12.3636C13.2674 5 14 5.73262 14 6.63636V6.63636" fill="transparent"  strokeWidth="1.5"/>
                    </svg>
                    </span>
                    Copy Address
                </div>
                <div className="ainf-t2" onClick={toLogOut}>
                    <span style={{marginRight:8}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7.57871 4.84341C7.57871 4.37761 7.95631 4 8.42211 4C8.88791 4 9.26552 4.37761 9.26552 4.84341V6.03616C9.26552 6.50196 8.88791 6.87957 8.42211 6.87957C7.95631 6.87957 7.57871 6.50196 7.57871 6.03616V4.84341Z" />
                            <path d="M7.22904 16.7708C5.91156 15.4533 5.91156 13.3172 7.22904 11.9997L7.82542 11.4034C8.15479 11.074 8.15479 10.54 7.82542 10.2106C7.49605 9.88124 6.96204 9.88124 6.63267 10.2106L6.03629 10.807C4.06007 12.7832 4.06007 15.9873 6.03629 17.9635C8.01251 19.9397 11.2166 19.9397 13.1928 17.9635L13.7892 17.3671C14.1186 17.0378 14.1186 16.5038 13.7892 16.1744C13.4598 15.845 12.9258 15.845 12.5964 16.1744L12.0001 16.7708C10.6826 18.0882 8.54653 18.0882 7.22904 16.7708Z" />
                            <path d="M10.2109 6.63234C9.88156 6.96171 9.88156 7.49573 10.2109 7.8251C10.5403 8.15447 11.0743 8.15447 11.4037 7.8251L12.0001 7.22872C13.3175 5.91124 15.4536 5.91124 16.7711 7.22872C18.0886 8.5462 18.0886 10.6823 16.7711 11.9997L16.1747 12.5961C15.8453 12.9255 15.8453 13.4595 16.1747 13.7889C16.5041 14.1182 17.0381 14.1182 17.3675 13.7889L17.9638 13.1925C19.9401 11.2163 19.9401 8.01219 17.9638 6.03597C15.9876 4.05974 12.7835 4.05974 10.8073 6.03597L10.2109 6.63234Z" />
                            <path d="M4.84341 7.57871C4.37761 7.57871 4 7.95631 4 8.42211C4 8.88791 4.37761 9.26552 4.84341 9.26552H6.03616C6.50196 9.26552 6.87957 8.88791 6.87957 8.42211C6.87957 7.95631 6.50196 7.57871 6.03616 7.57871H4.84341Z" />
                            <path d="M15.5779 20C16.0437 20 16.4213 19.6224 16.4213 19.1566V17.9638C16.4213 17.498 16.0437 17.1204 15.5779 17.1204C15.1121 17.1204 14.7345 17.498 14.7345 17.9638V19.1566C14.7345 19.6224 15.1121 20 15.5779 20Z" />
                            <path d="M20 15.5779C20 16.0437 19.6224 16.4213 19.1566 16.4213H17.9638C17.498 16.4213 17.1204 16.0437 17.1204 15.5779C17.1204 15.1121 17.498 14.7345 17.9638 14.7345H19.1566C19.6224 14.7345 20 15.1121 20 15.5779Z" />
                            <path d="M9.61468 13.1926C9.28531 13.5219 9.28531 14.056 9.61468 14.3853C9.94405 14.7147 10.4781 14.7147 10.8074 14.3853L14.3857 10.8071C14.7151 10.4777 14.7151 9.94367 14.3857 9.6143C14.0563 9.28493 13.5223 9.28493 13.1929 9.6143L9.61468 13.1926Z" />
                        </svg>
                    </span>
                    Disconnect
                </div>
            </div>);
    }
    const pTitle = ()=>{
        return(
            <div className="mcon">
                <img
                style={{
                    height: 25, marginRight: 6
                } }
                src={getIcon()} alt="icon"
                />
                <span className="mcont1">
                {replaceStr(account)}</span>
                <span style={{marginLeft:16}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="8" viewBox="0 0 13 8" fill="none">
                    <path d="M1 1.25L6.5 6.75L12 1.25" stroke="black" strokeWidth="1.5"/>
                    </svg>
                </span>
            </div>
        );
    }

    return (
        <Header className="heardp">
            <Flex className='heard'  justify="space-between" align="center">
                
                <div className={isMobile?'logo-con-mobile':'logo-con'}>
                    <a onClick={toHome}>
                        <img className="con-logo" src={logo} alt="logo" />
                    </a>
                </div>
                {
                    !isMobile &&
                    (
                        <div className="flex-center">
                            <Button type="link" className="nav-on"><span>The Game</span></Button>
                            <Button type="link" ><span >Tokens</span></Button>
                            <Button type="link" ><span >About Us</span></Button>
                            <Button type="link" ><span >Community</span></Button>
                        </div>
                    )
                }

                <Flex  style={
                    isMobile?{}:
                    {
                        minWidth: '400',
                        justifyContent: 'flex-end',
                    }
                }>
                { 
                    !isLogin ?
                    (
                        <span className="btn-primary-filter">
                            <Button
                            
                            className="title-btn"
                            onClick={connecWallet}
                            >Connect Wallet</Button>
                        </span>
                    )
                    :
                    (
                        <Flex >
                            <Popover placement="bottomRight" trigger="click" content={pContent} >
                                {pTitle()}
                            </Popover>
                        </Flex>
                    )
                }
                </Flex>
                {/* <contextHolder /> */}
            </Flex>
            {
                showConnect &&
                <SelectWallet open={true} callback={selectCallback} />
            }
            {
                showBind &&
                <Bind open={true} callback={toBind} />
            }
            {
                showContinue &&
                <Continue open={true} callback={toContinue} />
            }
        </Header>
    );
}

export default Hed;