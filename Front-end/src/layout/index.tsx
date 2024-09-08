import {   Outlet } from "react-router-dom";

import {  Layout } from 'antd';


import Foo from "./footer";
import Hed from "./header";
import { FC } from "react";


const {  Content } = Layout;



const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  // height: '100%',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};



const layoutStyle = {
  width: '100%',
  minHeight: '100vh',
};
// const layoutRightStyle = {
//   marginLeft: '200px',
//   overflowX: 'hidden',
// }
const Lay = () : JSX.Element=>{

    return (
    <>
      <Layout style={layoutStyle}>
        <Hed></Hed>
        <Content style={contentStyle}>
            <Outlet />
        </Content>
        <Foo />
      </Layout>
    </>
       

    );
}
export default Lay;