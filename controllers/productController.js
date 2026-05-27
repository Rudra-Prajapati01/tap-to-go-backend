import Product from "../models/Product.js";


// GET USER PRODUCTS
export const getUserProducts =
  async (req, res) => {

    try {

      const products =
        await Product.find({

          userId:
            req.params.userId,

          isActive: true,
        })

          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        products
      );

    } catch (err) {

      res.status(500).json({

        message:
          "Failed to fetch products",

        error:
          err.message,
      });
    }
  };


// CREATE PRODUCT
export const createProduct =
  async (req, res) => {

    try {

      const {

        userId,

        image,

        name,

        description,

        price,

        currency,

        showPrice,

      } = req.body;

      if (
        !userId ||
        !name
      ) {

        return res.status(400).json({

          message:
            "userId and name are required.",
        });
      }

      const product =
        await Product.create({

          userId,

          image:
            image || "",

          name,

          description:
            description || "",

          price:
            price || "",

          currency:
            currency || "₹",

          showPrice:
            showPrice !== false,
        });

      res.status(201).json(
        product
      );

    } catch (err) {

      res.status(500).json({

        message:
          "Failed to create product",

        error:
          err.message,
      });
    }
  };


// UPDATE PRODUCT
export const updateProduct =
  async (req, res) => {

    try {

      const updated =
        await Product.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,

            runValidators: true,
          }
        );

      if (!updated) {

        return res.status(404).json({

          message:
            "Product not found.",
        });
      }

      res.status(200).json(
        updated
      );

    } catch (err) {

      res.status(500).json({

        message:
          "Failed to update product",

        error:
          err.message,
      });
    }
  };


// DELETE PRODUCT
export const deleteProduct =
  async (req, res) => {

    try {

      const deleted =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {

        return res.status(404).json({

          message:
            "Product not found.",
        });
      }

      res.status(200).json({

        message:
          "Product deleted successfully.",
      });

    } catch (err) {

      res.status(500).json({

        message:
          "Failed to delete product",

        error:
          err.message,
      });
    }
  };

// GET SINGLE PRODUCT
export const getSingleProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({

          message:
            "Product not found.",
        });
      }

      res.status(200).json(
        product
      );

    } catch (err) {

      res.status(500).json({

        message:
          "Failed to fetch product",

        error:
          err.message,
      });
    }
  };