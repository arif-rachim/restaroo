migrate((db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("9z25jschv62pe5t")

    collection.listRule = ""
    collection.viewRule = ""
    collection.createRule = ""
    collection.updateRule = ""
    collection.deleteRule = ""

    return dao.saveCollection(collection)
}, (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("9z25jschv62pe5t")

    collection.listRule = null
    collection.viewRule = null
    collection.createRule = null
    collection.updateRule = null
    collection.deleteRule = null

    return dao.saveCollection(collection)
})
