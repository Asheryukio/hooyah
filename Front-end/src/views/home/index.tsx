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
import Terms from '@/components/modal/terms';
import { mul } from '../../../utils/sdk/tools.ts';

// import "./home.scss";


function Home(){
    const {isEvm,isLogin,info,isNetwork} = useSelector((state:any)=>state);
    // const { isEvm,isLogin } = useContext(CountContext);
    // const isEvm = useSelector((state) => state.isEvm);
    // const isLogin = useSelector((state)=>state.isLogin);
    const [showPay,setShowPay] = useState(false);
    const [showPaying,setShowPaying] = useState(false);
    const [showPaySuccess,setShowPaySuccess] = useState(false);
    const [showTerms,setShowTerms] = useState(false);
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
        trace('paymentInfo-change',paymentInfo,isLogin,isNetwork);
        if(isLogin&&isNetwork){
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
        
    },[isLogin,isEvm,showPaySuccess]);
    

    const toPay = (code)=>{
        setShowTerms(false);
        if(code==1) createOrder(curToken);
        
    }
    const closePaying = ()=>{
        setShowPaying(false);
    }
    const closePaySuccess = ()=>{
        setShowPaySuccess(false);
    }

    const getprice = (token:string):string => {
        trace('getprice',token,paymentInfo);

        if(token === 'USDT'||token.includes("USDT")) return getTokenNum(token,info.tokens["USDT"+(isEvm?"_ETHEREUM":"_SOLANA")].price,info.tokens["USDT"+(isEvm?"_ETHEREUM":"_SOLANA")].decimals);
        else if(token === 'ETH') return getTokenNum(token,info.tokens["ETH"].price,info.tokens["ETH"].decimals);
        else if(token === 'SOLANA'||token === 'SOL') return getTokenNum('SOLANA',info.tokens["SOL"].price,info.tokens["SOL"].decimals);
        else return "0";
    }

    const createOrder = async (str:string)=>{
        console.log('createOrder');
        if(isLogin){

            if((str === 'USDT')&&balanceUsdt < +getprice('USDT')){
                showToast('Insufficient balance',MessageType.error);
                return;
            }else if((str === 'ETH')&&balanceEth < +getprice('ETH')){
                showToast('Insufficient balance',MessageType.error);
                return;
            }else if((str === 'SOLANA')&&balanceSol < +getprice('SOLANA')){
                showToast('Insufficient balance',MessageType.error);
                return;
            }


            setShowPay(false);
            setShowPaying(true);
            

            const res = await addOrder(str=="SOLANA"?"SOL":(str=="USDT"?(isEvm?"USDT_ETHEREUM":"USDT_SOLANA"):str));
            if(res.code === 200){
                console.log('createOrder',res);
                if(str === 'USDT'){
                    if(isEvm) {
                        buyUsdt(res.data.orderId,res.data.totalPrice);
                    }
                    else SOLbuyUsdt(res.data.orderId,res.data.totalPrice);
                }else if(str === 'ETH'){
                    buyEth(res.data.orderId,res.data.totalPrice);
                }else if(str === 'SOLANA'){
                    buySol(res.data.orderId,res.data.totalPrice);
                }
            }else{
                showToast(res.message,MessageType.error);
                setShowPaying(false);
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
            trace('checkOrder',res,getprice(res.data.payCoin));
            if(res.code === 200){
                if(res.data.status == 2){
                    setShowPaying(false);

                    setHash(res.data.tx_hash);
                    // setPaymentInfo(getprice(res.data.payCoin)+" "+(res.data.payCoin.includes("USDT"))?"USDT":res.data.payCoin);
                    trace('checkOrder111',paymentInfo);
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

    const buyEth = (orderId:string,amount:string)=>{
        transferETH(info.ETH_RECEIVER_ADDRESS,amount,(code:number,hash:string)=>{
            if(code === 1){
                console.log('buyEth');
                confirmOrder(orderId,hash);
            }else if(code>1){
                showToast(hash,MessageType.error);
                setShowPaying(false);
            }
        });
    }
    const buyUsdt = (orderId:string,amount:string)=>{
        
        transfer(info.EVM_USDT_CONTRACT,info.ETH_RECEIVER_ADDRESS,amount,(code:number,hash:string)=>{
            if(code === 1){
                console.log('buyUsdt');
                confirmOrder(orderId,hash);
            }else if(code>1){
                showToast(hash,MessageType.error);
                setShowPaying(false);
            }
        });
    }
    const SOLbuyUsdt = async (orderId:string,amount:string)=>{
        const {code,hash} = await transferToken(info.SOLANA_RECEIVER_ADDRESS,info.SOLANA_USDT_CONTRACT,amount);
        if(code === 1){
            console.log('buyUsdt');
            confirmOrder(orderId,hash);
        }else if(code>1){
            showToast(hash,MessageType.error);
            setShowPaying(false);
        }
    }
    const buySol = async (orderId:string,amount:string)=>{
        const {code,hash} = await transferSol(info.SOLANA_RECEIVER_ADDRESS,amount);
        if(code === 1){
            console.log('buySol');
            confirmOrder(orderId,hash);
        }else if(code>1){
            showToast(hash,MessageType.error);
            setShowPaying(false);
        }
    }

    const toShowTerms = (code)=>{
        setShowPay(false);
        if(code!=1) return;
        setShowTerms(true);
    }

    const getTokenNum = (token:string,str:any,len:number)=>{
        // if(token == "USDT") len = isEvm?18:6;
        trace('getTokenNum',token,str,len);
        trace('checkOrder222',paymentInfo);
        return mul(str,"1000",Math.min(4,len));
    }

    const toBuy = (str:string)=>{
        setCurToken(str);
        console.log('toBuy',str,isLogin,isNetwork);
        if(isLogin){
            if(!isNetwork){
                showToast('Please switch to Arbitrum Sepolia Network.',MessageType.info);
                return;
            }
           
            setPaymentInfo(getprice(str)+" "+str);
            trace('checkOrder333',paymentInfo);
            setShowPay(true);
        }
    }
    return(
        <div>
            <div style={{
                marginTop: '120px',
            }}>
                <img style={{width:390,maxWidth:"90%"}} src={img1} alt="img" />
                <div style={{
                    fontFamily: "Poppins",
                    fontSize: 40,
                    fontWeight: 600,
                    lineHeight: "25.11px",
                    textAlign: "center",
                    color: "white",
                    marginTop: 16,
                    marginBottom: 26,
                    
                }}>Buy Hoo Tokens!</div>
            </div>
            {   
                isLogin && 
                (
                    isEvm ? 
                    (
                        <div>
                            <Button type="primary" className="title-btn" style={{marginInline:6}} onClick={()=>{toBuy("USDT")}}>Buy( USDT)</Button>
                            <Button type="primary" className="title-btn" style={{marginInline:6}} onClick={()=>{toBuy("ETH")}}>Buy( ETH)</Button>
                        </div>
                    )
                    :
                    (
                        <div>
                            <Button type="primary" className="title-btn" style={{marginInline:6}} onClick={()=>{toBuy("USDT")}}>Buy( USDT)</Button>
                            <Button type="primary" className="title-btn" style={{marginInline:6}} onClick={()=>{toBuy("SOLANA")}}>Buy( SOL)</Button>
                        </div>
                    )

                )
            }
            {/* <div>
                <Button type="primary" className="title-btn" style={{marginTop:24}} onClick={()=>{window.location.href = 'http://hooyah-admin.neicela.com/';}}>Go Home</Button>
            </div> */}
            {
                showPay &&
                <Payment data={paymentInfo} callback={toShowTerms} />
            }
            {
                showPaying &&
                <Paying data={paymentInfo} callback={closePaying} />
            }
            {
                showPaySuccess &&
                <PaySuccess data={paymentInfo} hash={hash} callback={closePaySuccess} />
            }
            {
                showTerms &&
                <Terms callback={toPay} />
            }
        </div>
    );
}

export default Home;