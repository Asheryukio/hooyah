import {router_item} from '../routes'
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuProps } from "antd";
import { trace } from "../utils/tools";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import Sider from 'antd/es/layout/Sider';

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    position: 'fixed',
    minHeight: '100vh',
  };
const Aside:FC = ()=>{
    const defaultOpenKeys = JSON.parse(sessionStorage.getItem('openKeys')||"[]") || [];
    const defaultSelectedKeys = sessionStorage.getItem('selectKeys')||"";

    const [router] = useState<object[]>(router_item);
    const navigate = useNavigate();
    const [selectKeys, setSelectKeys] = useState<string>(defaultSelectedKeys);
    const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);
    const handlerMenu:MenuProps['onClick'] = e => {
        const keyPath = e.keyPath;
        const path = '/'+keyPath.reverse().join('/');
        // const ops = JSON.parse(JSON.stringify(keyPath.slice(0,-1)));
        setSelectKeys(e.key as string);
        navigate(path);
        sessionStorage.setItem('selectKeys',e.key);
        trace('keyPath',keyPath,e.key);
    }
    const handlerChange:MenuProps['onOpenChange'] = keys => {
        setOpenKeys(keys);
        sessionStorage.setItem('openKeys',JSON.stringify(keys));    
        trace('keys',keys);
    }
    return(
        <Sider style={siderStyle}>
            {/* <Link to="/">Home</Link>
            <Link to="/info">Info</Link>
            <Link to="/dashboard">Home</Link> */}
            <Menu
                mode="inline"
                theme="dark"
                onOpenChange={handlerChange}
                onClick={handlerMenu}
                defaultOpenKeys={openKeys}
                defaultSelectedKeys={[selectKeys]}
                items={router as MenuItemType[]}
            />

        </Sider>
       
    );



}

export default Aside;