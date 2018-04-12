var express = require('express');
var router = express.Router();
var classes = require('../business/classes');


router.get("/progress", classes.getAllProgress);
router.get("/:id/detail", classes.getClassById);
router.get("/:id/finish", classes.finishClassById);
router.delete("/:id", classes.deleteClassById);
router.post("/", classes.createNewClass);

module.exports = router;