import Editor from './Editor'
import View from './View'
import Header from './Header'
import './Layout.css'
import {useDispatch} from "react-redux";
import {set_text} from "./features/editor/editorSlice";

function Layout() {
    const dispatch = useDispatch()

    return (
        <div className='box'>
            <div className='header'>
                <Header/>
            </div>
            <div className='editor'>
                <div className='column-header'>
                    Markdown:
                    <button
                        className='clear-button'
                        onClick={() => dispatch(set_text(''))}
                    >
                        x
                    </button>
                </div>
                <Editor/>
            </div>
            <div className='view'>
                <div className='column-header'>
                    Preview:
                </div>
                <div style={{overflow: "auto", paddingLeft: '10px'}}>
                    <View/>
                </div>
            </div>
        </div>
    )
}

export default Layout