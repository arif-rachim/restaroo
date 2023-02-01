migrate((db) => {
    const collection = new Collection({
        "id": "tm3ljpneu6lursw",
        "created": "2023-01-23 14:46:36.972Z",
        "updated": "2023-01-23 14:46:36.972Z",
        "name": "i18n",
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
    const collection = dao.findCollectionByNameOrId("tm3ljpneu6lursw");

    return dao.deleteCollection(collection);
})
