migrate((db) => {
  const collection = new Collection({
    "id": "nxz97722ujz6wve",
    "created": "2023-01-30 15:43:11.437Z",
    "updated": "2023-01-30 15:43:11.437Z",
    "name": "panel_config",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7lawwkiz",
        "name": "data",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("nxz97722ujz6wve");

  return dao.deleteCollection(collection);
})
