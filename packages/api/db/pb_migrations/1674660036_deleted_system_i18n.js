migrate((db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("tm3ljpneu6lursw");

    return dao.deleteCollection(collection);
}, (db) => {
    const collection = new Collection({
        "id": "tm3ljpneu6lursw",
        "created": "2023-01-23 14:46:36.972Z",
        "updated": "2023-01-23 16:17:29.480Z",
        "name": "system_i18n",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "yyo6zypu",
                "name": "fieldId",
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
                "id": "7hfszgfq",
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
                "id": "zqwm73y8",
                "name": "locale",
                "type": "select",
                "required": true,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "values": [
                        "en-us",
                        "ar-ae"
                    ]
                }
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
