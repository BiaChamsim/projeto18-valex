import { Router } from "express";
import cardTypeMiddleware from "../middlewares/cardTypeMiddleware";
import { createCard, activateCard, rechargeCard, payment, cardTransactions } from "../controllers/cardController";
import activationCardMiddleware from "../middlewares/activationCardMiddleware";
import cardAmountMiddleware from "../middlewares/cardAmountMiddleware";
import paymentMiddleware from "../middlewares/paymentMiddleware";

const cardRouter = Router();



cardRouter.post("/create-card/:id", cardTypeMiddleware, createCard);
cardRouter.post("/activate-card", activationCardMiddleware, activateCard);
cardRouter.get("/transactions/:id", cardTransactions)
cardRouter.post("/recharge-card", cardAmountMiddleware, rechargeCard);
cardRouter.post("/payment", paymentMiddleware, payment)





export default cardRouter;