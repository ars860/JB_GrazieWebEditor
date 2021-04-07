import styles from "./Header.module.css";
import {
    selectDocumentName, selectLanguage, selectStatus,
    selectSupportedLanguages, selectText,
    set_document_name, set_text,
    setLanguage
} from "./features/editor/editorSlice";
import React from "react";
import Select from 'react-select'
import {useDispatch, useSelector} from "react-redux";
import Loader from "react-loader-spinner";

function Header() {
    const dispatch = useDispatch()
    const documentName = useSelector(selectDocumentName)
    const supportedLanguages = useSelector(selectSupportedLanguages)
    const status = useSelector(selectStatus)
    const language = useSelector(selectLanguage)
    const text = useSelector(selectText)

    const selectStyles = {
        control: base => ({
            ...base,
            width: '200px'
        }),
        menu: provided => ({...provided, zIndex: 9999})
    };

    return (
        <div className={styles.headerBody}>
            <div className={styles.logo}>
                Grazie<span>Web</span>
            </div>
            <input
                className={styles.documentName}
                placeholder='Document name'
                value={documentName}
                type='text'
                onChange={e => dispatch(set_document_name(e.target.value))}
            />
            <button
                className={styles.saveDocumentButton}
                onClick={() => {
                    if (text.length === 0) {
                        const item = localStorage.getItem(documentName)
                        if (item !== null) {
                            dispatch(set_text(item))
                        } else {
                            dispatch(set_document_name('Bad name'))
                        }
                    } else {
                        localStorage.setItem(documentName, text)
                    }
                }}
                disabled={documentName.length === 0}
            >
                {text.length === 0 ? 'Load document' : 'Save document'}
            </button>
            <span className={styles.smallText}>Spellcheck language:</span>
            <Select
                defaultValue={{value: language.download_name, label: language.name}}
                options={supportedLanguages.map(l => ({value: l.download_name, label: l.name}))}
                styles={selectStyles}
                placeholder='Select language'
                onChange={e => dispatch(setLanguage({name: e.label, download_name: e.value}))}
                isDisabled={status !== 'idle'}
            />
            <Loader
                visible={status !== 'idle'}
                type='TailSpin'
                color='blue'
                height='30px'
                width='30px'
            />
            {status === 'idle' ? '' : status}
        </div>
    )
}

export default Header