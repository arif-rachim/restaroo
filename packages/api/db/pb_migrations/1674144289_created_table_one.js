migrate((db) => {
  const collection = new Collection({
    "id": "roihi4r8ug8dbyh",
    "created": "2023-01-19 16:04:49.833Z",
    "updated": "2023-01-19 16:04:49.833Z",
    "name": "table_one",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1popcl8a",
        "name": "sample_text",
        "type": "text",
        "required": false,
        "unique": true,
        "options": {
          "min": 5,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "e9w445uq",
        "name": "sample_number",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": -10,
          "max": 10
        }
      },
      {
        "system": false,
        "id": "xkfxwjuc",
        "name": "sample_bool",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "ptpyix42",
        "name": "sample_email",
        "type": "email",
        "required": false,
        "unique": true,
        "options": {
          "exceptDomains": [],
          "onlyDomains": [
            "something.com"
          ]
        }
      },
      {
        "system": false,
        "id": "dm8hybkk",
        "name": "sample_url",
        "type": "url",
        "required": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": [
            "something.com"
          ]
        }
      },
      {
        "system": false,
        "id": "tyab0gkx",
        "name": "sample_date_time",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "2022-01-19 12:20:00.000Z",
          "max": "2029-01-24 12:00:00.000Z"
        }
      },
      {
        "system": false,
        "id": "hkjxa28y",
        "name": "sample_select",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "MAKAN NASI",
            "Makan Gudeg",
            "Makan Combro"
          ]
        }
      },
      {
        "system": false,
        "id": "rt3fumo4",
        "name": "sample_json",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "fcntheuz",
        "name": "sample_file",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [],
          "thumbs": [
            "50x50"
          ]
        }
      },
      {
        "system": false,
        "id": "0dhhq8kr",
        "name": "sample_relation",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "b1sud5b6p0i9sp9",
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
  const collection = dao.findCollectionByNameOrId("roihi4r8ug8dbyh");

  return dao.deleteCollection(collection);
})
