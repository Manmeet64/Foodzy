// Feature.jsx
import React from "react";
import styles from "./Feature.module.css";

const Feature = () => {
    const features = [
        {
            id: 1,
            icon: "fas fa-mobile-alt",
            title: "Easy To Order",
            description:
                "Consectetur Adipiscing Elit, Sed Do Eiusm Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.",
        },
        {
            id: 2,
            icon: "fas fa-truck",
            title: "Fastest Delivery",
            description:
                "Consectetur Adipiscing Elit, Sed Do Eiusm Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.",
        },
        {
            id: 3,
            icon: "fas fa-award",
            title: "Best Quality",
            description:
                "Consectetur Adipiscing Elit, Sed Do Eiusm Tempor Incididunt Ut Labore Et Dolore Magna Aliqua.",
        },
    ];

    return (
        <div className={styles.featureContainer}>
            <div className={styles.decorativeCurve}></div>
            <div className={styles.featuresWrapper}>
                {features.map((feature) => (
                    <div key={feature.id} className={styles.featureCard}>
                        <div className={styles.iconWrapper}>
                            <i className={feature.icon}></i>
                        </div>
                        <h3 className={styles.title}>{feature.title}</h3>
                        <p className={styles.description}>
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feature;
