import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IDevelopers, IDevelopersInfos } from "./interface";
import { client } from "./database";

const checkEmailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email } = req.body;

  const queryString: string = `
        SELECT * FROM developers
        WHERE email = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount !== 0) {
    return res.status(409).json({
      message: "Email already exists.",
    });
  }
  return next();
};

const checkIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

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

  res.locals.developers = queryResult.rows[0];

  return next();
};

const informationAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
          SELECT * FROM developer_infos
          WHERE "developerId" = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDevelopersInfos> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount !== 0) {
    return res.status(409).json({
      message: "Developer infos already exists.",
    });
  }

  return next();
};

const preferredOSValid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { preferredOS } = req.body;

  if (
    preferredOS !== "Windows" &&
    preferredOS !== "Linux" &&
    preferredOS !== "MacOS"
  ) {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  return next();
};

export {
  checkEmailExists,
  checkIdExists,
  informationAlreadyExists,
  preferredOSValid,
};
