import { Request, Response } from "express";
import {
  IProject,
  IProjectTechnology,
  ITechnologyProject,
  TProjectRequest,
} from "../interfaces/project.interface";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const registerNewProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: Partial<TProjectRequest> = req.body;

  const queryString: string = format(
    `
      INSERT INTO projects(%I)
      VALUES(%L)
      RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: QueryResult<IProject> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const listProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT
        p.id AS "projectId",
        p.name AS "projectName",
        p.description AS "projectDescription",
        p."estimatedTime" AS "projectEstimatedTime",
        p.repository AS "projectRepository",
        p."startDate" AS "projectStartDate",
        p."endDate" AS "projectEndDate",
        p."developerId" AS "projectDeveloperId",
        t.id AS "technologyId",
        t.name AS "technologyName"
      FROM projects p
      FULL OUTER JOIN 
        projects_technologies pt ON p.id = pt."projectId"
      FULL OUTER JOIN
        technologies t ON pt."technologyId" = t.id  
      WHERE p.id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<ITechnologyProject> = await client.query(
    queryConfig
  );

  return res.status(200).json(queryResult.rows);
};

const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: Partial<TProjectRequest> = req.body;

  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
      UPDATE projects
      SET(%I) = ROW(%L)
      WHERE id = $1
      RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProject> = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      DELETE FROM projects
      WHERE id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

const registerTechnologyProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const technologiesData: IProjectTechnology = {
    addedIn: new Date(),
    technologyId: res.locals.technologies.id,
    projectId: id,
  };

  const queryString: string = format(
    `
      INSERT INTO projects_technologies(%I)
      VALUES(%L);
    `,
    Object.keys(technologiesData),
    Object.values(technologiesData)
  );

  const queryResult: QueryResult<IProjectTechnology> = await client.query(
    queryString
  );

  const queryStringSelect: string = `
    SELECT
      t.id AS "technologyId",
      t.name AS "technologyName",
      p.id AS "projectId",
      p.name AS "projectName",
      p.description AS "projectDescription",
      p."estimatedTime" AS "projectEstimatedTime",
      p.repository AS "projectRepository",
      p."startDate" AS "projectStartDate",
      p."endDate" AS "projectEndDate"
    FROM projects p
    FULL OUTER JOIN 
      projects_technologies pt ON p.id = pt."projectId"
    FULL OUTER JOIN
      technologies t ON pt."technologyId" = t.id  
    WHERE p.id = $1;          
  `;
  const queryConfig: QueryConfig = {
    text: queryStringSelect,
    values: [id],
  };

  const queryResultSelect: QueryResult<ITechnologyProject> = await client.query(
    queryConfig
  );

  return res.status(201).json(queryResultSelect.rows[0]);
};

const deleteTechnologyProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId: number = parseInt(req.params.id);
  const technologyId: number = res.locals.technologies.id;

  const queryString: string = `
    DELETE FROM projects_technologies
    WHERE "technologyId" = $1 AND "projectId" = $2;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [technologyId, projectId],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

export {
  registerNewProject,
  listProjectById,
  updateProject,
  deleteProject,
  registerTechnologyProject,
  deleteTechnologyProject,
};
