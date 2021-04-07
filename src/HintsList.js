import React from "react";
import styles from "./HintsList.module.css";

function HintsList({position, list, visible, changeWord}) {
    const [left, top] = position

    const onClick = e => {
        e.stopPropagation()
        if (e.target.classList.contains(styles.listChild)) {
            changeWord(e.target.textContent)
        }
    }

    return (
        <div
            className={styles.listBody}
            onClick={onClick}
            style={{position: 'absolute', left: left, top: top + 20, visibility: visible ? 'visible' : 'hidden'}}
        >
            {list.length === 0
                ? <div className={styles.noCorrections}>no replacements</div>
                : list.map((e, i) => <div className={styles.listChild} key={i}>{e}</div>)}
        </div>
    )
}

export default HintsList