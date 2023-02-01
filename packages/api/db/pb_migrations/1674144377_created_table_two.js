migrate((db) => {
    const collection = new Collection({
        "id": "9z25jschv62pe5t",
        "created": "2023-01-19 16:06:17.206Z",
        "updated": "2023-01-19 16:06:17.206Z",
        "name": "table_two",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "qrcd9bya",
                "name": "table_two",
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
                "id": "9junwgzc",
                "name": "table_one",
                "type": "relation",
                "required": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "collectionId": "roihi4r8ug8dbyh",
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
    const collection = dao.findCollectionByNameOrId("9z25jschv62pe5t");

    return dao.deleteCollection(collection);
})
