migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("roihi4r8ug8dbyh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ptpyix42",
    "name": "sample_email",
    "type": "email",
    "required": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
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
    "id": "ptpyix42",
    "name": "sample_email",
    "type": "email",
    "required": false,
    "unique": true,
    "options": {
      "exceptDomains": [],
      "onlyDomains": [
        "sample.com"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
