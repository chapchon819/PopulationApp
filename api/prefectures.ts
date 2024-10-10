import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { apiResponse, Prefectures } from '../src/types/index'

const API_URL = 'https://opendata.resas-portal.go.jp/api/v1/'

const API_KEY = process.env.REACT_APP_RESAS_API_KEY ?? ''

async function fetchPrefectures(): Promise<apiResponse<Prefectures>> {
    console.log('fetchPrefectures function called');
    try {
        const response = await axios(`${API_URL}prefectures`, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const data = response.data
        console.log('API Response:', data)
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
    const result = await fetchPrefectures()
    res.json(result)
}