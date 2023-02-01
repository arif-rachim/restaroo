migrate((db) => {
    const collection = new Collection({
        "id": "yhpvaelfn8drtze",
        "created": "2023-01-06 04:22:07.048Z",
        "updated": "2023-01-06 04:22:07.048Z",
        "name": "product",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "psnvj7se",
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
                "id": "l03paxqg",
                "name": "isVegan",
                "type": "bool",
                "required": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "q39uqyqk",
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
                "id": "bjflzejp",
                "name": "currency",
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
                "id": "ms9rsdge",
                "name": "discount",
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
                "id": "gujtx9xu",
                "name": "description",
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
                "id": "gbdfblxy",
                "name": "servesFor",
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
                "id": "yf9hrwlv",
                "name": "image",
                "type": "file",
                "required": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "mimeTypes": [
                        "image/png"
                    ],
                    "thumbs": []
                }
            },
            {
                "system": false,
                "id": "pjpu1lxf",
                "name": "config",
                "type": "relation",
                "required": false,
                "unique": false,
                "options": {
                    "maxSelect": null,
                    "collectionId": "i4zzxygre3mr7py",
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
    const collection = dao.findCollectionByNameOrId("yhpvaelfn8drtze");

    return dao.deleteCollection(collection);
})
