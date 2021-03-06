import express from "express";
import userCtrl from "../controllers/user.controller";
import authCtrl from "../controllers/auth.controller";
import shopCtrl from "../controllers/shop.controller";

const router = express.Router();

router.route("/api/shops").get(shopCtrl.list);

router
  .route("/api/shops/by/:userId")
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.isSeller,
    shopCtrl.create
  )
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, shopCtrl.listByOwner);

  router.route('/api/shops/:shopId')
  .delete(authCtrl.requireSignin, shopCtrl.isOwner, shopCtrl.remove)

router.param("userId", userCtrl.userByID);

export default router;
