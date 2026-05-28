import express from "express";

import {

  createLead,
  getLeads,
  updateLead,
  deleteLead,

} from "../controllers/leadController.js";

const router =
  express.Router();

/* CREATE */

router.post(
  "/",
  createLead
);

/* UPDATE */

router.put(
  "/update/:id",
  updateLead
);

/* DELETE */

router.delete(
  "/delete/:id",
  deleteLead
);

/* GET LEADS */

router.get(
  "/:ownerId",
  getLeads
);

export default router;