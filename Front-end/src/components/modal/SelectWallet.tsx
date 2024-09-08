import { Modal,Button } from "antd";
import { trace } from "../../../utils/tools";
import {  useState } from "react";

import './SelectWallet.scss';
import img1 from "@/assets/metamask.png";
import img2 from "@/assets/coinbaseWallet.png";
import img3 from "@/assets/walletConnect.png";
import img4 from "@/assets/phantom.png";
import { setWalletId } from "@/redux/action";
import store from "@/redux";

interface SelectWalletProps {
    open: boolean;
    callback: (code: number, data?: never|string) => void;
  }
// eslint-disable-next-line @typescript-eslint/ban-types
const SelectWallet = ({ open, callback }:SelectWalletProps) : JSX.Element=>{
    trace('SelectWallet',open);

    const [isLoading, setIsLoading] = useState([false,false,false,false]);
    const [isDisabled, setIsDisabled] = useState(false);

    const handleClose = () => {
        console.log('close');
        callback(0)
    }
    const connectWallet = (index:number,str:string) => {
        // //"metamask" | "walletconnect" | "coinbase",
        const a:boolean[] = [false,false,false,false];
        a[index] = true;
        setIsLoading(a);
        setIsDisabled(true);
        store.dispatch(setWalletId(index+1));
        trace('connectWallet--',str,index);
        callback(str=="phantom"?2:1,str);
        console.log('connectWallet');
    }
    return(
    <Modal 
        zIndex={2}
       title="Connect Wallet"
       open={open}
       afterClose={handleClose}
       onCancel={handleClose}
       width="580px"
       footer={null}
       keyboard={false}
       centered
     >
       <div>

         <div className="btn-con">
           <Button block className="btn-item" loading={isLoading[0]} disabled={isDisabled} onClick={()=>{connectWallet(0,"metamask");}}>
             <div className="flex-center">
                <img className="icon" src={img1} alt="metamask" />
                <span className="t1">Metamask</span>
             </div>
             <span className="t2">Popular</span>
           </Button>
           <Button block className="btn-item" loading={isLoading[1]} disabled={isDisabled} onClick={()=>{connectWallet(1,"coinbase");}}>
             <div className="flex-center">
                <img className="icon" src={img2} alt="coinbaseWallet" />
                <span className="t1">Coinbase Wallet</span>
             </div>
             <span className="t3"></span>
           </Button>
           <Button block className="btn-item" loading={isLoading[2]} disabled={isDisabled} onClick={()=>{connectWallet(2,"walletconnect");}}>
             <div className="flex-center">
                <img className="icon" src={img3} alt="walletConnect" />
                <span className="t1">Wallet Connect </span>
             </div>
             <span className="t3"></span>
           </Button>
           <Button block className="btn-item" loading={isLoading[3]} disabled={isDisabled} onClick={()=>{connectWallet(3,"phantom");}}>
             <div className="flex-center">
                <img className="icon" src={img4} alt="phantom" />
                <span className="t1">Phantom</span>
             </div>
             <span className="t3"></span>
           </Button>
         </div>
       </div>
     </Modal >
    );
}
export default SelectWallet;