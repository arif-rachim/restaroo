migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("roihi4r8ug8dbyh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0dhhq8kr",
    "name": "sample_relation",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "9z25jschv62pe5t",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("roihi4r8ug8dbyh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0dhhq8kr",
    "name": "sample_relation",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "b1sud5b6p0i9sp9",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
})
