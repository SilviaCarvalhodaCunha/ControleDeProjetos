interface IProject {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
}

type TProjectRequest = Omit<IProject, "id">;

interface ITechnologyProject extends IProject {
  technologyId: number | null;
  technologyName: string | null;
}

interface ITechnology {
  id: number;
  name: string;
}

type TTechnologyRequest = Omit<IProject, "id">;

interface IProjectTechnology {
  addedIn: Date;
  technologyId: number;
  projectId: number;
}

interface ITechnologyProject {
  technologyId: number | null;
  technologyName: string | null;
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date;
}

export {
  IProject,
  TProjectRequest,
  ITechnologyProject,
  ITechnology,
  TTechnologyRequest,
  IProjectTechnology,
};
