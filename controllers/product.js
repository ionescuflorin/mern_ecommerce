const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }
    req.product = product;
    next()
  });
};

exports.read = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }

    // check for all fields
    const { name, description, price, category, qunatity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !qunatity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    let product = new Product(fields);

    // 1kb = 1000
    // 1mb = 1000000

    if (files.photo) {
      //  console.log("FILES PHOTO:", files.photo)
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(error)
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (res, req) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(error)
              });
        }
        res.json({
            deletedProduct,
            message: "Product deleted succesfully"
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: 'Image could not be uploaded'
        });
      }
  
      // check for all fields
      const { name, description, price, category, qunatity, shipping } = fields;
  
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !qunatity ||
        !shipping
      ) {
        return res.status(400).json({
          error: 'All fields are required'
        });
      }
  
      let product = req.product;
      product = _.extend(product, fields)
  
      // 1kb = 1000
      // 1mb = 1000000
  
      if (files.photo) {
        //  console.log("FILES PHOTO:", files.photo)
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: 'Image should be less than 1mb in size'
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }
  
      product.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(error)
          });
        }
        res.json(result);
      });
    });
  };

  /**
   * RETURN DATA TO THE FRONTEND
   * sell / arrival
   * by sell = /products?sortBy=sold&order=desc&limit=4
   * by arrival = /products?sortBy=createdAt&order=desc&limit=4
   * if no params are sent, then all products are returned
   */

   exports.list = (req, res) => {
     let order = req.query.order ? req.query.order : 'asc'
     let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
     let limit = req.query.limit ? parseInt(req.query.limit) : 6


     Product.find()
     .select('-photo')
     .populate('category')
     .sortBy([[sortBy, order]])
     .limit(limit)
     .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found'
        });
      }
      res.json(products)
     })
   }

   /**
    * it will find the products based on the req product category
    * other products that has the same category, will be returned
    */
   exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    // find other products not including itself
    // $ne - not including
    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found'
        });
      }
      res.json(products)
    })
   }

   /**
    * List products by search
    * we'll implement product search in react frontend
    * we'll show categories in checkbox and price range in radio buttons
    * as the user clicks on those checkbox and radio buttons
    * we will make api request and show the products to users based on what he wants
    */

   exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

// for every request we will request the photo so it will be acting as a middleware
exports.photo = (req, res, next) => {
  if(res.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}