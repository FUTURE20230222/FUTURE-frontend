// delete item
const url = urls[robot].db_update
let update_body = {
    "collection": "robots",
    "conditions": {
        "rid": robot,
        "maps.name": mapName
    },
    "update": {
        "$pull": {
            "maps.$.points": {
                "name": ele.name
            }
        }
    }
}
try {
    const db_update_res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update_body)
    })
    const res_json = await db_update_res.json()
    console.log(res_json)
} catch (error) {
    console.error(error)
}

// add item
const url = urls[robot].db_update
let update_body = {
    "collection": "robots",
    "conditions": {
        "rid": robot,
        "maps.name": mapName
    },
    "update": {
        "$push": {
            "maps.$.points": result
        }
    }
}
try {
    const db_update_res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update_body)
    })
    const res_json = await db_update_res.json()
    console.log(res_json)
    setPoints([...points, result])
} catch (error) {
    console.error(error)
}
