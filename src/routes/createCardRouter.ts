import { Router } from "express";
import createCardMiddleware from "../middlewares/cardMiddlewares";
import { createCard } from "../controllers/createCardController";

const cardRouter = Router();



cardRouter.post("/create-card", createCardMiddleware, createCard);




export default cardRouter;