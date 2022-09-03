import { Router } from "express";
import cardTypeMiddleware from "../middlewares/cardTypeMiddleware";
import { createCard, activateCard } from "../controllers/cardController";
import activationCardMiddleware from "../middlewares/activationCardMiddleware";

const cardRouter = Router();



cardRouter.post("/create-card/:id", cardTypeMiddleware, createCard);
cardRouter.post("/activate-card", activationCardMiddleware, activateCard);




export default cardRouter;