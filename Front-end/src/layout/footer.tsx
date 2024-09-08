import { Footer } from "antd/es/layout/layout";
import { FC } from "react";

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
  };
const Foo:FC = ()=>{
    return (
        <Footer style={footerStyle}></Footer>
    );
}

export default Foo;