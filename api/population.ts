import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { apiResponse, PopulationData } from '../src/types/index'


const API_URL = 'https://opendata.resas-portal.go.jp/api/v1/'

const API_KEY = process.env.REACT_APP_RESAS_API_KEY ?? ''

async function fetchPopulationData(prefCode: number, cityCode: string): Promise<apiResponse<PopulationData>> {
    console.log('fetchPrefectures function called');
    try {
        const response = await axios(`${API_URL}population/composition/perYear?prefCode=${prefCode}&cityCode=${cityCode}`, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const data = response.data
        return data
    } catch (error) {
        console.error('API Error:', error)
        return {
            statusCode: '500',
            message: 'Failed to fetch data from the API',
        }
    }
}

export default async function (req: VercelRequest, res: VercelResponse) {
    const { prefCode, cityCode } = req.query

    if (!prefCode || !cityCode) {
        return res.status(400).json({
            statusCode: '400',
            message: 'Missing required parameters: prefCode or cityCode'
        })
    }

    const result = await fetchPopulationData(Number(prefCode), String(cityCode))
    res.json(result)
}