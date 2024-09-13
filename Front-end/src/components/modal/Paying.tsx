import { Modal } from "antd";
import {  trace } from "../../../utils/tools";
import img1 from "@/assets/icon_loading.png";

// import store from "@/redux";

interface PayingProps {
    data: string;
    callback: (code: number, data?: never) => void;
  }
// eslint-disable-next-line @typescript-eslint/ban-types
const Paying = ({ data, callback }:PayingProps) : JSX.Element =>{
    trace('Continue',open);
    // const {userInfo} = store.getState();

    const handleClose = () => {
        console.log('close');
        callback(0)
    }

    return(
    <Modal 
        zIndex={2}
       title="You Are Paying"
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
            marginTop: "24px",
         }}>
           <img style={{
            width: "150px",
            animation: "spin 1s linear infinite",
           }}  src={img1} />
         </div>
       </div>
     </Modal >
    );
}
export default Paying;