migrate((db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("i4zzxygre3mr7py")

    collection.listRule = "@request.auth.id != \"\""
    collection.viewRule = "@request.auth.id != \"\""
    collection.createRule = "@request.auth.id != \"\""
    collection.updateRule = "@request.auth.id != \"\""

    return dao.saveCollection(collection)
}, (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("i4zzxygre3mr7py")

    collection.listRule = null
    collection.viewRule = null
    collection.createRule = null
    collection.updateRule = null

    return dao.saveCollection(collection)
})
