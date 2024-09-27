import { Button, Modal } from "antd";
import {  openNewPage, trace } from "../../../utils/tools";

import store from "../../redux";
import linkImg from "@/assets/icon_link.png";

interface PaySuccessProps {
    data: string;
    hash: string;
    callback: (code: number, data?: never) => void;
  }
// eslint-disable-next-line @typescript-eslint/ban-types
const PaySuccess = ({ data,hash, callback }:PaySuccessProps) : JSX.Element =>{
    trace('PaySuccess-info',open,data,hash,);
    const {isEvm} = store.getState();

    const handleClose = () => {
        console.log('close');
        callback(0)
    }
    const toContinue = ()=>{
        window.location.href = "http://hooyah-admin.neicela.com/tokens";
    }

    const openUrl = ()=>{
        if(isEvm){
            openNewPage(`https://sepolia.arbiscan.io/tx/${hash}`);
        }else{
            openNewPage(`https://explorer.solana.com/tx/${hash}?cluster=devnet`);
        }
        
    }
    
    return(
    <Modal 
        zIndex={2}
       title="Transaction complete!"
       open={true}
       afterClose={handleClose}
       onCancel={handleClose}
       width="580px"
       footer={null}
       keyboard={false}
       centered
     >
       <div className="container">

       
        <div className="content">
            <div 
                style={{
                    color: "white",
                    fontFamily: "Poppins",
                    fontSize: 30,
                    fontWeight: 600,
                    lineHeight: "39px",
                    marginTop: "24px",
                }}
            >{data}</div>
            <div style={{
                marginTop: "40px",
                fontFamily: "Poppins",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: "21px",
                color: "while",



            }}>you will pay {data}</div>
        </div>
       

         <div style={{
            textAlign: "center",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "24px",
         }}>
           <span style={{
            fontFamily: "Poppins",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "20px",
            textAlign: "left",
            marginRight: "16px",
           }}>Tx Hash</span>
           <span onClick={openUrl} style={{
            cursor:"pointer",
            color: "#F3FBFF",
            textDecoration: "underline",
            fontFamily: "Poppins",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "20px",
            textAlign: "left",
            marginRight: "4px",
           }}>{hash.slice(0,12)}...{hash.slice(-12)}</span>
           <img onClick={openUrl} style={{
            width: "24px",
            cursor:"pointer",
           }} src={linkImg} />
         </div>
         <div style={{
            marginTop: "24px",
            textAlign: "center",
         }}>
           <Button className="title-btn" type="primary"   onClick={toContinue}>
             Back
           </Button>
         </div>
       </div>
     </Modal >
    );
}
export default PaySuccess;