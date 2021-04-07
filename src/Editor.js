import 'codemirror'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/gfm/gfm.js';

import {Controlled as CodeMirror} from 'react-codemirror2'
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    change_word,
    downloadDictionaryAsync,
    selectDictionaries,
    selectLanguage,
    selectStatus,
    selectText, set_status,
    set_text
} from "./features/editor/editorSlice";
import Nspell from 'nspell'
import {startSpellCheck} from "./features/editor/utils";
import HintsList from "./HintsList";

const defaultHintListParams = {
    position: [0, 0],
    list: [],
    visible: false,
    changeWord: _ => {}
}

function Editor() {
    const text = useSelector(selectText)
    const dispatch = useDispatch()
    const language = useSelector(selectLanguage)
    const dictionaries = useSelector(selectDictionaries)
    const status = useSelector(selectStatus)

    const [hintsListParams, setHintsListParams] = useState(defaultHintListParams)

    const cm = useRef()
    const spellchecker = useRef()

    useEffect(() => {
        if (!(language.download_name in dictionaries) && status === 'idle') {
            dispatch(downloadDictionaryAsync(language.download_name))
        }
    }, [language, dictionaries, dispatch, status])

    useEffect(() => {
        if (language.download_name in dictionaries) {
            dispatch(set_status('building spellchecker'));
            (async () => {
                spellchecker.current = Nspell(dictionaries[language.download_name].aff, dictionaries[language.download_name].dic)
                startSpellCheck(cm.current, spellchecker.current)
                dispatch(set_status('idle'))
                console.log('Spellcheck changed: ', language.name)
            })()
        }
    }, [dictionaries, dispatch, language])

    return (
        <div onClick={e => {
            const target = e.target
            const ignoreSpellChecking = ['cm-comment', 'cm-url', 'cm-link']
            if (target.classList.contains('cm-spell-error') && !ignoreSpellChecking.map(className => target.classList.contains(className)).reduce((a, b) => a || b)) {
                const rect = target.getBoundingClientRect()

                setHintsListParams({
                    position: [rect.left, rect.top],
                    list: spellchecker.current.suggest(e.target.textContent),
                    visible: true,
                    changeWord: (newWord) => {
                        const {line, ch} = cm.current.coordsChar({left: rect.left, top: rect.top}, 'page')
                        dispatch(change_word({line, ch, len: target.textContent.length, newWord}))
                        setHintsListParams(defaultHintListParams)
                    }
                })
            } else {
                setHintsListParams(defaultHintListParams)
            }
        }}>
            <CodeMirror
                value={text}
                options={{
                    mode: 'gfm',
                    lineNumbers: true,
                    lineWrapping: true
                }}
                editorDidMount={editor => {
                    editor.setSize('100%', 'var(--child-height)')
                    cm.current = editor
                }}
                onBeforeChange={(editor, data, value) => {
                    dispatch(set_text(value))
                }}
                onScroll={() => setHintsListParams(defaultHintListParams)}
            />
            <HintsList
                position={hintsListParams.position}
                list={hintsListParams.list}
                visible={hintsListParams.visible}
                changeWord={hintsListParams.changeWord}
            />
        </div>
    );
}

export default Editor;
