const express = require("express");
const path = require("path");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../models/product");
const cloudinary = require("cloudinary");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create product
router.post(
    "/create-product",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productData = req.body;
            const productImage = req.body.images;

            const existingProduct = await Product.findOne({ name: productData.name });

            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: "Ya existe un producto con ese nombre",
                });
            }

            const myCloud = await cloudinary.v2.uploader.upload(productImage, {
                folder: "products",
            });

            const product = {
              name: productData.name,
              description: productData.description,
              category: productData.category,
              price: productData.price,
              discount: productData.discount,
              stock: productData.stock,
              quantity: 1,
              images: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              },
            };


            const newProduct = await Product.create(product);

            res.status(201).json({
                success: true,
                newProduct,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);


// get all products
router.get(
    "/get-all-products",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);


// edit-product by ID
router.put(
    "/edit-product/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productId = req.params.id;
            const { name, price, discount, description, category, stock, state} = req.body;

            const existingProduct = await Product.findById(productId);
            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: "No se encontró ningún producto con el ID proporcionado",
                });
            }

            existingProduct.name = name;
            existingProduct.description = description;
            existingProduct.category = category;
            existingProduct.price = price;
            existingProduct.discount = discount;
            existingProduct.stock = stock;

            await existingProduct.save();

            res.status(200).json({
                success: true,
                message: "Producto actualizado exitosamente",
                updatedProduct: existingProduct,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete product by ID
router.delete(
    "/delete-product/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id);

            if (!product) {
                return next(new ErrorHandler("No se encontro ningun producto con el ID", 404));
            }

            for (let i = 0; 1 < product.images.length; i++) {
                const result = await cloudinary.v2.uploader.destroy(
                    product.images[i].public_id
                );
            }

            await product.deleteOne();

            res.status(201).json({
                success: true,
                message: "Producto eliminado!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// all products --- for admin
router.get(
    "/admin-all-products",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;