import { Modal,Button } from "antd";
import {  trace } from "../../../utils/tools";


interface PaymentProps {
    data: string;
    callback: (code: number, data?: any) => void;
  }
// eslint-disable-next-line @typescript-eslint/ban-types
const Payment = ({ data, callback }:PaymentProps) : JSX.Element =>{
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
       title="Buy Hoo Tokens!"
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
                    color: "#FFFFFF99",
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "25.11px",
                    textAlign: "left"
                }}
            >You Pay</div>
            <div style={{
                background: "#FFFFFF1A",
                borderRadius: "20px",
                padding: "24px",
                marginTop: "16px",
                fontFamily: "Poppins",
                fontSize: 22,
                fontWeight: 800,
                lineHeight: "25.11px",
                color:"white",



            }}>{data}</div>
            <div 
                style={{
                    color: "#FFFFFF99",
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "25.11px",
                    textAlign: "left",
                    marginTop: "30px",
                }}
            >You Receive</div>
            <div style={{
                background: "#FFFFFF1A",
                borderRadius: "20px",
                padding: "24px",
                marginTop: "16px",
                fontFamily: "Poppins",
                fontSize: 22,
                fontWeight: 800,
                lineHeight: "25.11px",
                color:"white",



            }}>1,000 HOO</div>
        </div>
       

         <div style={{
            marginTop: "24px",
            textAlign: "center",
         }}>
           <Button className="title-btn" type="primary"   onClick={toContinue}>
             Pay
           </Button>
         </div>
       </div>
     </Modal >
    );
}
export default Payment;