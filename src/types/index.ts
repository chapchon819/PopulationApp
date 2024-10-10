export type apiResponse<T> = {
    statusCode?: string
    message: string | null
    description?: string
    result?: T
}

export type Prefectures = {
    prefCode: number
    prefName: string
}

export type PopulationData = {
    year: number
    value: number
    rate?: number
}

export type PopulationLabel = {
    label: string
    data: PopulationData[]
}

