import readXlsxFile from 'read-excel-file'

const readExcel = async (blob, options) => {
    const file = await readXlsxFile(blob, options).then(({ rows, errors }) => {
        if (errors.length !== 0) {
            console.error('Failed to load file', errors)
        }
        return rows;
    })
    return file;
}

const loadFile = async () => {
    let excelData = {};
    const response = await fetch('/assets/askFuture/glossary.xlsx');
    const blob = await response.blob();
    excelData = await readExcel(blob, { map: glossaryMap })
    return excelData
}

const glossaryMap = {
    "Key Words_zh-HK": "conditions1",
    "Key Words_zh-CN": "conditions2",
    "Key Words_en-US": "conditions3",
    "Image Name": "imageName",
    "Voice Name": "voiceName",
    "Video Name": "videoName",
}

const loadGlossary = async () => {
    try {
        const result = await loadFile()
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
        return []
    }
}

const newGlossary = loadGlossary().then(result => {
    console.log(result)
    return result.map((elem) => {
        const voiceFunction = {
            command: function cb(matchResult, history, myCarouselRef) {
                history.push(`/app/emptyPage/${elem.imageName}/${elem.voiceName}/${elem.videoName}`)
                myCarouselRef.current.setStoreState({ currentSlide: 1 })
            },
            conditions1: elem.conditions1.split(',').map((str) => {
                return RegExp(`${str.substring(1, str.length - 1)}`)
            }),
            conditions2: elem.conditions2.split(',').map((str) => {
                return RegExp(`${str.substring(1, str.length - 1)}`)
            }),
            conditions3: elem.conditions3.split(',').map((str) => {
                return RegExp(`${str.substring(1, str.length - 1)}`)
            })
        }
        console.log(voiceFunction)
        return voiceFunction;
    })
})

export default newGlossary
