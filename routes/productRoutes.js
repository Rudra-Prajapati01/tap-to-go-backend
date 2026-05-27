import express from "express";

import {

  createProduct,

  getUserProducts,

  getSingleProduct,

  updateProduct,

  deleteProduct,

} from "../controllers/productController.js";

const router =
  express.Router();


// CREATE PRODUCT
router.post(
  "/",
  createProduct
);


// GET USER PRODUCTS
router.get(
  "/user/:userId",
  getUserProducts
);


// GET SINGLE PRODUCT
router.get(
  "/:id",
  getSingleProduct
);


// UPDATE PRODUCT
router.put(
  "/:id",
  updateProduct
);


// DELETE PRODUCT
router.delete(
  "/:id",
  deleteProduct
);

export default router;