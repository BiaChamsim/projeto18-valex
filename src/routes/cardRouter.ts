import { Router } from "express";
import createCardMiddleware from "../middlewares/cardTypeMiddleware";
import { createCard } from "../controllers/createCardController";

const cardRouter = Router();



cardRouter.post("/create-card/:id", createCardMiddleware, createCard);
cardRouter.post("/activate-card");




export default cardRouter;