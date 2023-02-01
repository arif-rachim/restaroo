migrate((db) => {
    const collection = new Collection({
        "id": "ehwp53l5mpwy0k4",
        "created": "2023-01-06 04:23:32.636Z",
        "updated": "2023-01-06 04:23:32.636Z",
        "name": "menu",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "xnzfo5xr",
                "name": "menu",
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
                "id": "v6ke9cbx",
                "name": "products",
                "type": "relation",
                "required": false,
                "unique": false,
                "options": {
                    "maxSelect": null,
                    "collectionId": "yhpvaelfn8drtze",
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
    const collection = dao.findCollectionByNameOrId("ehwp53l5mpwy0k4");

    return dao.deleteCollection(collection);
})
