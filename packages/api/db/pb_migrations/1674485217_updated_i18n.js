migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tm3ljpneu6lursw")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7hfszgfq",
    "name": "name",
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
  const collection = dao.findCollectionByNameOrId("tm3ljpneu6lursw")

  // remove
  collection.schema.removeField("7hfszgfq")

  return dao.saveCollection(collection)
})
