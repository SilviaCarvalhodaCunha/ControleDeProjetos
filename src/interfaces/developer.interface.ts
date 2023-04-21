interface IDevelopers {
  id: number;
  name: string;
  email: string;
}

type TDevelopersRequest = Omit<IDevelopers, "id">;

interface IDeveloperInfoGet {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
}

interface IDevelopersInfos {
  id: number;
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
  developerId: number;
}

type TDevelopersInfosRequest = Omit<IDevelopersInfos, "id">;

export {
  IDevelopers,
  TDevelopersRequest,
  IDeveloperInfoGet,
  IDevelopersInfos,
  TDevelopersInfosRequest,
};
