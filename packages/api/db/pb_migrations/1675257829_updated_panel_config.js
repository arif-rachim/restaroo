migrate((db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("nxz97722ujz6wve")

    collection.name = "route_config"

    return dao.saveCollection(collection)
}, (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId("nxz97722ujz6wve")

    collection.name = "panel_config"

    return dao.saveCollection(collection)
})
