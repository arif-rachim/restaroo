migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yhpvaelfn8drtze")

  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yhpvaelfn8drtze")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
