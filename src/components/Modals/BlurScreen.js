import classes from './BlurScreen.module.css'

const BlurScreen = (props) => {
    return <div className={classes.blurScreen} onClick={props.onClick}/>
}

export default BlurScreen