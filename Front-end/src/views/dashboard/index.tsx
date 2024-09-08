import useModel from '@dbfu/react-directive/useModel'
import { useEffect, useState } from 'react';
import store from '../../redux/index';
import { trace } from '../../utils/tools';


function Dashboard(){
    const model = useModel({ user: { name: 'dada' } });
    const [state] = useState('fasdfasd');
    const g = store.getState();
    trace('g=',g);
    useEffect(() => {
        console.log('model-change',model?.user?.name);
    }, [model?.user?.name]);
    useEffect(() => {
        // console.log('state',state);
    }, [state]);
    return(
        <div>
            <h1 v-animate={{name:'fade-in',loop:false}}>Home</h1>
            <input v-model={[model, 'user.name']} />
            <div>{model?.user?.name}</div>
            <div>{state}</div>
            <div style={{height:'200px',background:'red'}}></div>
            <div style={{height:'350px',background:'blue'}}></div>
            <div style={{height:'350px',background:'green'}}></div>
        </div>
    );
}
export default Dashboard;