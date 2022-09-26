import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {loadDictionaries} from './utils';

const initialState = {
    text: '',
    dictionaries: {},
    documentName: '',
    supportedLanguages: [
        {name: 'english', download_name: 'English (American)'},
        // {name: 'mongolian', download_name: 'Mongolian'},
        {name: 'spanish', download_name: 'Spanish'}
    ],
    status: 'idle',
    language: 'english'
};

export const downloadDictionaryAsync = createAsyncThunk(
    'editor/fetchCount',
    async (lang) => {
        console.log('downloading dict: ' + lang)
        return await loadDictionaries(lang);
    }
);

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        set_text: (state, action) => {
            state.text = action.payload
        },
        set_document_name: (state, action) => {
            state.documentName = action.payload
        },
        set_language: (state, action) => {
            state.language = action.payload
        },
        set_status : (state, action) => {
            state.status = action.payload
        },
        change_word: (state, action) => {
            const {line, ch, len, newWord} = action.payload
            let lines = state.text.split('\n')
            lines[line] = lines[line].slice(0, ch) + newWord + lines[line].slice(ch + len)
            state.text = lines.join('\n')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(downloadDictionaryAsync.pending, (state) => {
                state.status = 'loading dictionaries';
            })
            .addCase(downloadDictionaryAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.dictionaries[action.payload.language] = {aff: action.payload.aff, dic: action.payload.dic}
            });
    },
});

export const {set_text, set_document_name, set_status, change_word} = editorSlice.actions;

export const selectDictionaries = (state) => state.editor.dictionaries;
export const selectTheme = (state) => state.editor.theme
export const selectText = (state) => state.editor.text
export const selectDocumentName = (state) => state.editor.documentName
export const selectSupportedLanguages = (state) => state.editor.supportedLanguages
export const selectLanguage = (state) => {
    return state.editor.supportedLanguages.find(x => x.name === state.editor.language)
}
export const selectStatus = (state) => state.editor.status

export const setLanguage = (lang) => (dispatch, getState) => {
    const dictionaries = selectDictionaries(getState())
    if (!(lang.download_name in dictionaries)) {
        dispatch(downloadDictionaryAsync(lang.download_name))
    }
    dispatch(editorSlice.actions.set_language(lang.name))
};

export default editorSlice.reducer;
