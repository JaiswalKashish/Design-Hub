import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import complaintsRouter from "./complaints";
import schemesRouter from "./schemes";
import documentsRouter from "./documents";
import profileRouter from "./profile";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/chat", chatRouter);
router.use("/complaints", complaintsRouter);
router.use("/schemes", schemesRouter);
router.use("/documents", documentsRouter);
router.use("/profile", profileRouter);
router.use("/admin", adminRouter);

export default router;
