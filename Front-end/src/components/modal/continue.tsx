import { Modal,Button } from "antd";
import {  trace } from "../../../utils/tools";
// import { FC, useState } from "react";

import './continue.scss';
import store from "../../redux";

interface ContinueProps {
    open: boolean;
    callback: (code: number, data?: never) => void;
  }
// eslint-disable-next-line @typescript-eslint/ban-types
const Continue = ({ open, callback }:ContinueProps) : JSX.Element=>{
    trace('Continue',open);
    const {userInfo} = store.getState();

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
       
       open={open}
       afterClose={handleClose}
       onCancel={handleClose}
       width="580px"
       footer={null}
       keyboard={false}
       closable={false}
       centered
     >
       <div className="container">

       
        <div className="content">
            Well, Look who it is
        </div>
        <div className="content2">
            Hey {userInfo?.email}
        </div>

         <div className="btn-con" style={{marginTop:36}}>
           <Button type="primary" block  onClick={toContinue}>
           Continue
           </Button>
         </div>
       </div>
     </Modal >
    );
}
export default Continue;