import { Modal,Button } from "antd";
import {  trace } from "../../../utils/tools";


interface TermsProps {
    callback: (code: number, data?: any) => void;
  }
// eslint-disable-next-line @typescript-eslint/ban-types
const Terms = ({ callback }:TermsProps) : JSX.Element =>{
    trace('Continue',open);
    // const {userInfo} = store.getState();

    const handleClose = () => {
        console.log('close');
        callback(0)
    }

    const toContinue = ()=>{
        callback(1);
    }
    
    return(
    <Modal 
        zIndex={2}
       title="Terms of Sale"
       open={true}
       afterClose={handleClose}
       onCancel={handleClose}
       width="980px"
       footer={null}
       keyboard={false}
       centered
     >
       <div className="container">

       
        <div className="content">
            {/* <div 
                style={{
                    color: "#FFFFFF99",
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "25.11px",
                    textAlign: "left"
                }}
            >Terms of Sale</div> */}
            <div style={{
                background: "#FFFFFF1A",
                borderRadius: "20px",
                padding: "42px 32px",
                marginTop: "16px",
                fontFamily: "Sora",
                fontSize: 16,
                fontWeight: 800,
                lineHeight: "20.8px",
                color:"white",
                textAlign: "left",
            }}>
                Effective Date: 9/15/2024
                <br/>1. Introduction
                <br/>Welcome to the Hooyah Hoos Token Sale. This document outlines the terms and conditions governing the purchase of Hoos tokens ("Hoos" or "Tokens") in connection with Hooyah's Web3 gaming platform ("Hooyah" or "Company"). By participating in this sale, you agree to these Terms of Sale.
                <br/>2. Definitions
                <br/> <span style={{marginInline:4}}>.</span>Token Sale: The private or public sale of Hoos tokens conducted by Hooyah.
                <br/><span style={{marginInline:4}}>.</span>Buyer: An individual or entity that purchases Hoos tokens during the Token Sale.
                <br/><span style={{marginInline:4}}>.</span>Smart Contract: The automated contract deployed on the Solana blockchain for the Token Sale.
                <br/><span style={{marginInline:4}}>.</span>Tokenomics: The economic model and distribution plan for Hoos tokens as detailed in the Hooyah whitepaper.
                <br/>3. Token Sale Details
                <br/>3.1 Sale Period
                <br/>The Token Sale will commence on 9/15/2024 and end on 4/15/2025, unless terminated earlier or extended at Hooyah’s sole discretion.
                <br/>3.2 Token Price
                <br/>The price of Hoos tokens is 30 cents per token. The price may vary based on the sale phase or additional discounts offered.
                <br/>3.3 Minimum Purchase
                <br/>The minimum purchase amount for Hoos tokens is $500.
                <br/>3.4 Payment Method
                <br/>Payments must be made in Sol, Ethereum, USDT, USDC, Bitcoin. Payments in other currencies are not accepted.
                <br/>3.5 Allocation and Distribution
                <br/>Hoo tokens will be allocated to the Buyer’s wallet address upon receipt of payment, subject to the smart contract's rules. The distribution will occur within [5] days after the end of the Token Sale.
                <br/>4. Use of Tokens
                <br/>4.1 Utility
                <br/>Hoo tokens are utility tokens used within the Hooyah gaming ecosystem. They p

            </div>
        </div>
       

         <div style={{
            marginTop: "24px",
         }}>
           <Button type="primary" block  onClick={toContinue}>
                I Argee
           </Button>
         </div>
       </div>
     </Modal >
    );
}
export default Terms;