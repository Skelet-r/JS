import styles from './component.module.css';
console.log(styles);
function Button(props) {
    const { text, disabled } = props;
    return (
        <div className={styles.button}>
            <button disabled={disabled} onClick={props.onClick}>{text}</button>
        </div>
    );
}

export default Button;
