import { Request, Response } from "express";
import {
  IDeveloperInfoGet,
  IDevelopers,
  IDevelopersInfos,
  TDevelopersInfosRequest,
  TDevelopersRequest,
} from "../interfaces/developer.interface";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const registerDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: TDevelopersRequest = req.body;

  const queryString: string = format(
    `
      INSERT INTO developers(%I)
      VALUES(%L)
      RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: QueryResult<IDevelopers> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const listDeveloperProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      SELECT 
          d.id AS "developerId",
          d.name AS "developerName",
          d.email AS "developerEmail",
          di."developerSince" AS "developerInfoDeveloperSince",
          di."preferredOS" AS "developerInfoPreferredOS"
      FROM developers d
      LEFT JOIN developer_infos di ON d.id = di."developerId"
      WHERE d.id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloperInfoGet> = await client.query(
    queryConfig
  );

  return res.status(200).json(queryResult.rows[0]);
};

const updateDevelopersData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: Partial<TDevelopersRequest> = req.body;

  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
      UPDATE developers
      SET(%I) = ROW(%L)
      WHERE id = $1
      RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  return res.status(200).json(queryResult.rows[0]);
};

const removeDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
      DELETE FROM developers
      WHERE id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

const registerAdditionalInformationDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: TDevelopersInfosRequest = req.body;
  developerData.developerId = parseInt(req.params.id);

  const queryString: string = format(
    `
      INSERT INTO developer_infos(%I)
      VALUES(%L)
      RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryResult: QueryResult<IDevelopersInfos> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};

export {
  registerDeveloper,
  listDeveloperProjects,
  updateDevelopersData,
  removeDeveloper,
  registerAdditionalInformationDeveloper,
};
