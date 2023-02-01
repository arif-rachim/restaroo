migrate((db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("yhpvaelfn8drtze")

    // update
    collection.schema.addField(new SchemaField({
        "system": false,
        "id": "pjpu1lxf",
        "name": "configs",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
            "maxSelect": null,
            "collectionId": "i4zzxygre3mr7py",
            "cascadeDelete": false
        }
    }))

    return dao.saveCollection(collection)
}, (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("yhpvaelfn8drtze")

    // update
    collection.schema.addField(new SchemaField({
        "system": false,
        "id": "pjpu1lxf",
        "name": "config",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
            "maxSelect": null,
            "collectionId": "i4zzxygre3mr7py",
            "cascadeDelete": false
        }
    }))

    return dao.saveCollection(collection)
})
