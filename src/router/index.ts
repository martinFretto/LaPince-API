import { Router } from 'express';
import { authRouter } from './authRouter';
import { expenditureRouter } from './expenditureRouter';
import { budgetRouter } from './budgetRouter';
import { userRouter } from './userRouter';
import YAML from 'yamljs';
import swaggerUi from "swagger-ui-express"


const router = Router();

router.use("/auth", authRouter);
router.use("/expenses", expenditureRouter)
router.use("/budgets", budgetRouter)
router.use("/users", userRouter)

const swaggerDocument = YAML.load("./src/swagger/swagger.yaml");
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { router };