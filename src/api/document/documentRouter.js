import express from "express";

import authenticate from "../middlewares/authentication.js";
import upload from "../middlewares/upload.js";
import { preloadFont } from "next/dist/server/app-render/entry-base.js";
import {uploadDocument,getAllDocuments,updateDocument,deleteDocument,getDocumentById} from "./documentController.js"
const documentRouter = express.Router();

documentRouter.post("/",authenticate,
     upload.fields([
          {name:"image",maxCount:1},
          {name:"pdf",maxCount:1},
     ]),
     uploadDocument
     
);
documentRouter.get("/",getAllDocuments);
documentRouter.get("/:id",getDocumentById);
documentRouter.patch("/",authenticate,
     upload.fields([
          {name:"image",maxCount:1},
          {name:"pdf",maxCount:1},
     ]),
     updateDocument);
documentRouter.delete("/:id",authenticate,deleteDocument);

export default documentRouter;
