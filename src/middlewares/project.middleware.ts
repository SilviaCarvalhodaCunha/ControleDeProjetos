import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { IDevelopers } from "../interfaces/developer.interface";
import { IProject } from "../interfaces/project.interface";

const idExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = req.body.developerId;

  const queryString: string = `
      SELECT * FROM developers
      WHERE id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found.",
    });
  }

  res.locals.project = queryResult.rows[0];

  return next();
};

const projectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT * FROM projects
      WHERE id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProject> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  return next();
};

const technologyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let name = req.body.name;

  if (
    req.route.path === "/projects/:id/technologies/:name" &&
    req.method === "DELETE"
  ) {
    name = req.params.name;
  }

  const queryString: string = `
      SELECT * FROM technologies
      WHERE name = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.technologies = queryResult.rows[0];

  return next();
};

const registeredTechnology = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);
  const technologyId = res.locals.technologies.id;

  const queryString: string = `
      SELECT * FROM projects_technologies
      WHERE "projectId" = $1 AND "technologyId" = $2;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, technologyId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount !== 0) {
    return res.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  return next();
};

const technologyAssociatedProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);
  const technologyId = res.locals.technologies.id;

  const queryString: string = `
      SELECT * FROM projects_technologies
      WHERE "projectId" = $1 AND "technologyId" = $2;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, technologyId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: "Technology not related to the project.",
    });
  }

  return next();
};

export {
  idExists,
  projectExists,
  technologyExists,
  registeredTechnology,
  technologyAssociatedProject,
};