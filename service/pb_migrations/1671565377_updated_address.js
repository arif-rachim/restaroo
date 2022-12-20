migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b1sud5b6p0i9sp9")

  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b1sud5b6p0i9sp9")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
