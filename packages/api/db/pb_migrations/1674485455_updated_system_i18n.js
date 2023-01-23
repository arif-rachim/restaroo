migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tm3ljpneu6lursw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zqwm73y8",
    "name": "locale",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "en-us",
        "ar-ae"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tm3ljpneu6lursw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zqwm73y8",
    "name": "language",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "en-us",
        "ar-ae"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
