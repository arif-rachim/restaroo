migrate((db) => {
  const collection = new Collection({
    "id": "i4zzxygre3mr7py",
    "created": "2023-01-06 04:21:44.328Z",
    "updated": "2023-01-06 04:21:44.328Z",
    "name": "product_config",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fwjpayti",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "xizyym6a",
        "name": "required",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "8pw8dqka",
        "name": "maximumSelection",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "vyvlsriu",
        "name": "options",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "mnupn5mmhsz3eve",
          "cascadeDelete": false
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("i4zzxygre3mr7py");

  return dao.deleteCollection(collection);
})
