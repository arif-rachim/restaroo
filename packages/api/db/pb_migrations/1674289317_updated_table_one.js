migrate((db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("roihi4r8ug8dbyh")

    // update
    collection.schema.addField(new SchemaField({
        "system": false,
        "id": "dm8hybkk",
        "name": "sample_url",
        "type": "url",
        "required": false,
        "unique": false,
        "options": {
            "exceptDomains": null,
            "onlyDomains": []
        }
    }))

    return dao.saveCollection(collection)
}, (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("roihi4r8ug8dbyh")

    // update
    collection.schema.addField(new SchemaField({
        "system": false,
        "id": "dm8hybkk",
        "name": "sample_url",
        "type": "url",
        "required": false,
        "unique": false,
        "options": {
            "exceptDomains": null,
            "onlyDomains": [
                "sample.com"
            ]
        }
    }))

    return dao.saveCollection(collection)
})
