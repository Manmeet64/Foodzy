import React from "react";
import { useParams } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from "./Success.module.css";

const Success = ({ onClose }) => {
    React.useEffect(() => {
        if (onClose) {
            const timer = setTimeout(onClose, 4000); // 4 seconds
            return () => clearTimeout(timer);
        }
    }, [onClose]);

    return (
        <div className={styles.successContainer}>
            <h1 className={styles.title}>Order Confirmed</h1>
            <DotLottieReact
                src="https://lottie.host/cb35442b-072b-46b8-bcdf-5aa7257c6684/XUQtVuqnKt.lottie"
                loop
                autoplay
                className={styles.lottieAnimation}
            />
        </div>
    );
};

export default Success;
