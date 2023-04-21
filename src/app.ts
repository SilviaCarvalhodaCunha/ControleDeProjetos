import express, { Application } from "express";
import "dotenv/config";
import {
  listDeveloperProjects,
  registerAdditionalInformationDeveloper,
  registerDeveloper,
  removeDeveloper,
  updateDevelopersData,
} from "./logics/developer.logics";
import {
  checkEmailExists,
  checkIdExists,
  informationAlreadyExists,
  preferredOSValid,
} from "./middlewares/developer.middlewares";
import {
  deleteProject,
  deleteTechnologyProject,
  listProjectById,
  registerNewProject,
  registerTechnologyProject,
  updateProject,
} from "./logics/project.logics";
import {
  idExists,
  projectExists,
  registeredTechnology,
  technologyAssociatedProject,
  technologyExists,
} from "./middlewares/project.middleware";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkEmailExists, registerDeveloper);
app.get("/developers/:id", checkIdExists, listDeveloperProjects);
app.patch(
  "/developers/:id",
  checkIdExists,
  checkEmailExists,
  updateDevelopersData
);
app.delete("/developers/:id", checkIdExists, removeDeveloper);
app.post(
  "/developers/:id/infos",
  checkIdExists,
  informationAlreadyExists,
  preferredOSValid,
  registerAdditionalInformationDeveloper
);

app.post("/projects", idExists, registerNewProject);
app.get("/projects/:id", projectExists, listProjectById);
app.patch("/projects/:id", projectExists, idExists, updateProject);
app.delete("/projects/:id", projectExists, deleteProject);
app.post(
  "/projects/:id/technologies",
  projectExists,
  technologyExists,
  registeredTechnology,
  registerTechnologyProject
);
app.delete(
  "/projects/:id/technologies/:name",
  projectExists,
  technologyExists,
  technologyAssociatedProject,
  deleteTechnologyProject
);

export default app;