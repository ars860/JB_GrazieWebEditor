import ReactMarkdown from 'react-markdown'
import {useSelector} from "react-redux";
import {selectText} from "./features/editor/editorSlice";
import gfm from 'remark-gfm'

function View() {
    const text = useSelector(selectText)

    return (
        <ReactMarkdown plugins={[gfm]}>{text}</ReactMarkdown>
    )
}

export default View