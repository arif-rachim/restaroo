migrate((db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("nxz97722ujz6wve")

    // add
    collection.schema.addField(new SchemaField({
        "system": false,
        "id": "qbslkes0",
        "name": "path",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
            "min": null,
            "max": null,
            "pattern": ""
        }
    }))

    return dao.saveCollection(collection)
}, (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("nxz97722ujz6wve")

    // remove
    collection.schema.removeField("qbslkes0")

    return dao.saveCollection(collection)
})
