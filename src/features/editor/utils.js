async function loadDictionaries(language) {
    const req = 'https://raw.githubusercontent.com/titoBouzout/Dictionaries/master/'

    let aff_dict_path = `${req}${language}.aff`
    let dic_dict_path = `${req}${language}.dic`

    const aff = await fetch(aff_dict_path).then(r => r.status === 200 ? r.text() : '')
    const dic = await fetch(dic_dict_path).then(r => r.status === 200 ? r.text() : '')

    return {language, aff, dic}
}

function startSpellCheck(cm, spellchecker) {
    if (cm.spellcheckOverlay) {
        cm.removeOverlay(cm.spellcheckOverlay)
    }

    const separators = '!\'"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ '
    cm.spellcheckOverlay = {
        token: function (stream) {
            let ch = stream.peek()
            let word = ""

            if (separators.includes(ch) || ch === '\uE000' || ch === '\uE001') {
                stream.next()
                return null
            }

            while ((ch = stream.peek()) && !separators.includes(ch)) {
                word += ch
                stream.next()
            }

            if (!/^[\p{L}]+$/u.test(word))
                return null

            if (!spellchecker.correct(word)) {
                return "spell-error"
            }
        }
    }

    cm.addOverlay(cm.spellcheckOverlay)
}

export {loadDictionaries, startSpellCheck}