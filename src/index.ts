import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
import cardRouter from "./routes/createCardRouter";


dotenv.config();

const app = express();
app.use(json());
app.use(cors());


app.use(cardRouter);



const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`server funcionando: ${port}`)
});