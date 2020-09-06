import Shop from "../models/shop.model";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import fs from "fs";
import defaultImage from "./../../client/assets/images/default.png";

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({
        message: "Image could not be uploaded",
      });
    }
    let shop = new Shop(fields);
    shop.owner = req.profile;
    if (files.image) {
      shop.image.data = fs.readFileSync(files.image.path);
      shop.image.contentType = files.image.type;
    }
    try {
      let result = await shop.save();
      res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const list = async (req, res) => {
  try {
    let shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByOwner = async (req, res) => {
  try {
    let shops = await Shop.find({ owner: req.profile._id }).populate(
      "owner",
      "_id name"
    );
    res.json(shops);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let shop = req.shop;
    let deletedShop = shop.remove();
    res.json(deletedShop);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isOwner = (req, res, next) => {
  const isOwner = req.shop && req.auth && req.shop.owner._id == req.auth._id;
  if (!isOwner) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

export default {
  create,
  list,
  listByOwner,
  remove,
  isOwner,
};
