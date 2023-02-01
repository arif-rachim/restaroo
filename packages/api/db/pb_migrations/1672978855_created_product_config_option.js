migrate((db) => {
    const collection = new Collection({
        "id": "mnupn5mmhsz3eve",
        "created": "2023-01-06 04:20:55.124Z",
        "updated": "2023-01-06 04:20:55.124Z",
        "name": "product_config_option",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "qvhgmsch",
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
                "id": "lqymhl1g",
                "name": "price",
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
                "id": "xnx8963q",
                "name": "isVegan",
                "type": "bool",
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
    const collection = dao.findCollectionByNameOrId("mnupn5mmhsz3eve");

    return dao.deleteCollection(collection);
})
