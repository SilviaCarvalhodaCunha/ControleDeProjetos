interface IProject {
    id: number,
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: Date,
    endDate: Date | null,
    developerId: number
}

type TProjectRequest = Omit<IProject, 'id'>

interface ITechnologyProject extends IProject {
    technologyId: number | null,
    technologyName: string | null
}

interface ITechnology {
    id: number,
    name: string
}

type TTechnologyRequest = Omit<IProject, 'id'>

export { IProject, TProjectRequest, ITechnologyProject, ITechnology, TTechnologyRequest }