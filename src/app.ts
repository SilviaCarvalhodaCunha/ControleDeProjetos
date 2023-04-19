import express, { Application } from "express";
import "dotenv/config";
import { listDeveloperProjects, registerAdditionalInformationDeveloper, registerDeveloper, removeDeveloper, updateDevelopersData } from "./logics";
import { checkEmailExists, checkIdExists, informationAlreadyExists, preferredOSValid } from "./middlewares";

const app: Application = express();
app.use(express.json())

app.post('/developers', checkEmailExists, registerDeveloper)
app.get('/developers/:id', checkIdExists, listDeveloperProjects)
app.patch('/developers/:id', checkIdExists, checkEmailExists, updateDevelopersData)
app.delete('/developers/:id', checkIdExists, removeDeveloper)
app.post('/developers/:id/infos', checkIdExists, informationAlreadyExists, preferredOSValid, registerAdditionalInformationDeveloper )

app.post('/projects', )
app.get('/projects/:id', )
app.patch('/projects/:id', )
app.delete('/projects/:id', )
app.post('/projects/:id/technologies', )
app.delete('/projects/:id/technologies/:name', )

export default app;
