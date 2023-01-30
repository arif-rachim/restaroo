migrate((db) => {
  const collection = new Collection({
    "id": "3u6zkpzpuwszwg3",
    "created": "2023-01-30 15:34:28.689Z",
    "updated": "2023-01-30 15:34:28.689Z",
    "name": "route_config",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "w5twpyez",
        "name": "data",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "qkg4pnsw",
        "name": "route",
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
        "id": "vvc4ezll",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("3u6zkpzpuwszwg3");

  return dao.deleteCollection(collection);
})
