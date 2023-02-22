const loadGlossary = async () => {
    try {
        const res = await fetch('/assets/voice/glossary.json')
        const result = await res.json()
        return result
    } catch (err) {
        console.log(err)
        return []
    }
}

const newGlossaryJson = loadGlossary()

const newGlossary = newGlossaryJson.then(result => result.map((elem) => {
    const voiceFunction = {
        command: looseJsonParse(elem.command),
        conditions: elem.conditions.map((str) => {
            return RegExp(`${str.substring(1, str.length - 1)}`)
        })
    }
    return voiceFunction;
}))

function looseJsonParse(obj) {
    return new Function('matchResult, history, myCarouselRef, audio', obj)
}

export default newGlossary