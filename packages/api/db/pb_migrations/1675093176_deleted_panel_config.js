migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("egg66elub90tf35");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "egg66elub90tf35",
    "created": "2023-01-25 15:22:08.464Z",
    "updated": "2023-01-29 17:07:47.756Z",
    "name": "panel_config",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ibowooqt",
        "name": "data",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
