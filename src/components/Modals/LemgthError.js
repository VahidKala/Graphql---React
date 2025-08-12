import { useContext } from 'react';
import Button from '../UI/Button';
import infoCtx from '../../context/use-contect';
import classes from './LengthError.module.css'

const LengthError = () =>{

    const ctx = useContext(infoCtx)

    const showLengthHandler = ()=>{
        ctx.lengthHandler()
    }

    return <div className={classes.length}>
        <h2>Length of inputs are incorrect.</h2>
        <Button onClick={showLengthHandler}>Confirm</Button>
    </div>
}

export default LengthError;