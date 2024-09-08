import { showToast, trace } from '../../../utils/tools';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { addOrder, payOrder, queryOrder } from '../../api/user';
import { MessageType } from '../../../utils/type';
import {  getTokenBalance, getTokensBalance, transfer, transferETH, transferSol, transferToken } from '../../../utils/sdk';
import { useEffect, useState } from 'react';
import Payment from '../../components/modal/Payment';
import Paying from '../../components/modal/Paying';
import PaySuccess from '../../components/modal/PaySuccess';
import img1 from '@/assets/sp.png';


function Home(){
    const {isEvm,isLogin,info} = useSelector((state:any)=>state);
    // const { isEvm,isLogin } = useContext(CountContext);
    // const isEvm = useSelector((state) => state.isEvm);
    // const isLogin = useSelector((state)=>state.isLogin);
    const [showPay,setShowPay] = useState(false);
    const [showPaying,setShowPaying] = useState(false);
    const [showPaySuccess,setShowPaySuccess] = useState(false);
    const [paymentInfo,setPaymentInfo] = useState("");
    const [curToken,setCurToken] = useState("");
    const [hash,setHash] = useState("");
    const [balanceUsdt,setBalanceUsdt] = useState(0);
    const [balanceEth,setBalanceEth] = useState(0);
    const [balanceSol,setBalanceSol] = useState(0);

    // const getbal = async ()=>{
        
    // }

    // getbal();

    useEffect(()=>{
        if(isLogin){
            if(isEvm){
                trace('getTokensBalance evm-getTokensBalance');
                getTokensBalance().then((eth)=>{
                trace('getTokensBalance evm',eth);
                setBalanceEth(+eth[1].balance);
                setBalanceUsdt(+eth[0].balance);
                });
            }else{
                getTokenBalance(info.SOLANA_USDT_CONTRACT).then((sol)=>{
                    trace('getTokenBalance',sol);
                    setBalanceSol(+sol[1].balance);
                    setBalanceUsdt(+sol[0].balance);
                });
            }
        }
    },[isLogin,isEvm]);
    

    const toPay = (code)=>{
        if(code==1) createOrder(curToken);
        else setShowPay(false);
    }
    const closePaying = ()=>{
        setShowPaying(false);
    }
    const closePaySuccess = ()=>{
        setShowPaySuccess(false);
    }


    const createOrder = async (str:string)=>{
        console.log('createOrder');
        if(isLogin){

            if((str === 'USDT')&&balanceUsdt < +info.USDT_PRICE){
                showToast('Insufficient balance',MessageType.error);
                return;
            }else if((str === 'ETH')&&balanceEth < +info.ETH_PRICE){
                showToast('Insufficient balance',MessageType.error);
                return;
            }else if((str === 'SOLANA')&&balanceSol < +info.SOLANA_PRICE){
                showToast('Insufficient balance',MessageType.error);
                return;
            }


            setShowPay(false);
            setShowPaying(true);
            

            const res = await addOrder(str=="SOLANA"?"SOL":str);
            if(res.code === 200){
                console.log('createOrder',res);
                if(str === 'USDT'){
                    if(isEvm) {
                        buyUsdt(res.data.orderId);
                    }
                    else SOLbuyUsdt(res.data.orderId);
                }else if(str === 'ETH'){
                    buyEth(res.data.orderId);
                }else if(str === 'SOLANA'){
                    buySol(res.data.orderId);
                }
            }else{
                showToast(res.message,MessageType.error);
            }
        }
    }

    const confirmOrder = async (str:string,hash:string)=>{
        console.log('confirmOrder');
        if(isLogin){
            const res = await payOrder(str,hash);
            if(res.code === 200){
                console.log('confirmOrder',res);

                checkOrder(str);
            }else{
                showToast(res.message,MessageType.error);
            }
        }
    }


    let orderTimer;
    const checkOrder = async (str:string)=>{
        console.log('checkOrder');
        if(isLogin){
            const res = await queryOrder(str);
            trace('checkOrder',res);
            if(res.code === 200){
                if(res.data.status == 2){
                    setShowPaying(false);

                    setHash(res.data.tx_hash);
                    setPaymentInfo(res.data.price+" "+res.data.payCoin);
                    setShowPaySuccess(true);
                }else if(res.data.status == 1){
                    if(orderTimer) clearTimeout(orderTimer);
                    orderTimer = setTimeout(()=>{
                        checkOrder(str);
                    },2500);
                }
            }else{
                showToast(res.message,MessageType.error);
            }
        }
    }

    const buyEth = (orderId:string)=>{
        transferETH(info.ETH_RECEIVER_ADDRESS,info.ETH_PRICE,(code:number,hash:string)=>{
            if(code === 1){
                console.log('buyEth');
                confirmOrder(orderId,hash);
            }else if(code>1){
                showToast(hash,MessageType.error);
            }
        });
    }
    const buyUsdt = (orderId:string)=>{
        
        transfer(info.EVM_USDT_CONTRACT,info.ETH_RECEIVER_ADDRESS,info.USDT_PRICE,(code:number,hash:string)=>{
            if(code === 1){
                console.log('buyUsdt');
                confirmOrder(orderId,hash);
            }else if(code>1){
                showToast(hash,MessageType.error);
            }
        });
    }
    const SOLbuyUsdt = async (orderId:string)=>{
        const {code,hash} = await transferToken(info.SOLANA_RECEIVER_ADDRESS,info.SOLANA_USDT_CONTRACT,info.USDT_PRICE);
        if(code === 1){
            console.log('buyUsdt');
            confirmOrder(orderId,hash);
        }else if(code>1){
            showToast(hash,MessageType.error);
        }
    }
    const buySol = async (orderId:string)=>{
        const {code,hash} = await transferSol(info.SOLANA_RECEIVER_ADDRESS,info.SOLANA_PRICE);
        if(code === 1){
            console.log('buySol');
            confirmOrder(orderId,hash);
        }else if(code>1){
            showToast(hash,MessageType.error);
        }
    }

    const toBuy = (str:string)=>{
        console.log('toBuy',str);
        if(isLogin){
            setCurToken(str);
            setPaymentInfo(info[str+"_PRICE"]+" "+str);
            setShowPay(true);
        }
    }
    return(
        <div>
            <div style={{
                marginTop: '120px',
            }}>
                <img src={img1} alt="img" />
            </div>
            {   
                isLogin && 
                (
                    isEvm ? 
                    (
                        <div>
                            <Button type="primary" style={{marginInline:6}} onClick={()=>{toBuy("USDT")}}>Buy({info.USDT_PRICE} USDT)</Button>
                            <Button type="primary" style={{marginInline:6}} onClick={()=>{toBuy("ETH")}}>Buy({info.ETH_PRICE} ETH)</Button>
                        </div>
                    )
                    :
                    (
                        <div>
                            <Button type="primary" style={{marginInline:6}} onClick={()=>{toBuy("USDT")}}>Buy({info.USDT_PRICE} USDT)</Button>
                            <Button type="primary" style={{marginInline:6}} onClick={()=>{toBuy("SOLANA")}}>Buy({info.SOLANA_PRICE} SOL)</Button>
                        </div>
                    )

                )
            }
            {
                showPay &&
                <Payment data={paymentInfo} callback={toPay} />
            }
            {
                showPaying &&
                <Paying data={paymentInfo} callback={closePaying} />
            }
            {
                showPaySuccess &&
                <PaySuccess data={paymentInfo} hash={hash} callback={closePaySuccess} />
            }
        </div>
    );
}

export default Home;