import { Modal,Button, Input } from "antd";
import { isValidEmail, trace } from "../../../utils/tools";
import {  useState } from "react";

import './bind.scss';

interface BindProps {
    open: boolean;
    callback: (code: number, data?: any) => void;
  }
// eslint-disable-next-line @typescript-eslint/ban-types
const Bind = ({ open, callback }:BindProps): JSX.Element=>{
    trace('Bind',open);

    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');

    const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue1(e.target.value);
      setIsDisabled(!isValidEmail(e.target.value));
    };
    const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue2(e.target.value);

    };

    const handleClose = () => {
        console.log('close');
        callback(0)
    }

    const toBind = ()=>{
        callback(1,{email:inputValue1,name:inputValue2});
        setIsLoading(true)
    }
    
    return(
    <Modal 
        zIndex={2}
       title="Create an Account"
       open={open}
       afterClose={handleClose}
       onCancel={handleClose}
       width="580px"
       footer={null}
       keyboard={false}
       closable={false}
       maskClosable={false}
       centered

     >
       <div className="container-bind">

        <div className="input-con">
            <Input placeholder="Enter your email" value={inputValue1} onChange={handleInputChange1} />
        </div>
        <div className="input-con">
            <Input placeholder="Full Name (Optional)" value={inputValue2} onChange={handleInputChange2} />
        </div>
        <div className="content-bind">
            By creating account, I agree to the <span className="t2">terms of use</span> and acknowledge that i have read the <span className="t2">Privacy Policy</span>.
        </div>

         <div className="btn-con" style={{marginTop:24}}>
           <Button type="primary" block loading={isLoading} disabled={isDisabled} onClick={toBind}>
             Submit
           </Button>
         </div>
       </div>
     </Modal >
    );
}
export default Bind;