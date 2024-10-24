import React, { useState, useEffect } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { PopulationData, ChartSeries } from '../types/index';

type PopulationChartProps = {
    selectedPrefectures: { prefCode: number; prefName: string }[];
    };

    const PopulationChart: React.FC<PopulationChartProps> = ({ selectedPrefectures }) => {
    const [chartData, setChartData] = useState<ChartSeries[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('総人口');

    useEffect(() => {
        const fetchPopulationData = async () => {
        const promises = selectedPrefectures.map(async (pref) => {
            try {
                    // 都道府県の人口データを取得
                    const response = await axios.get(`/api/population?prefCode=${pref.prefCode}&cityCode=-`);
                    const data = response.data.result.data.find(
                        (categoryData: { label: string }) => categoryData.label === selectedCategory
                    )?.data;

                    // データが持っている年を取得
                    const yearsFromData = data.map((item: PopulationData) => item.year);

                    // X軸用に一番長いデータセットの年を取得
                    if (yearsFromData.length > years.length) {
                        setYears(yearsFromData); // 年の配列を更新
                    }

                    return {
                    name: pref.prefName, // グラフ上に都道府県名を表示
                    data: data.map((item: PopulationData) => item.value), // 人口データ
                    };
                } catch (error) {
                    console.error(`Failed to fetch population data for ${pref.prefName}:`, error);
                    return { name: pref.prefName, data: [] };
                }
            },[years]);
    
        const results = await Promise.all(promises);
        setChartData(results);
        };
        
        if (selectedPrefectures.length > 0) {
        fetchPopulationData();
        }
    }, [selectedPrefectures, selectedCategory]);

    const chartOptions: Highcharts.Options = {
        title: {
            text: '選択された都道府県の人口データ',
        },
        xAxis: {
            title: { text: '年' },
            categories: years.map((year) => year.toString()),
        },
        yAxis: {
            title: { text: '人口数' },
        },
        series: chartData.map((series) => ({
            type: 'line',
            name: series.name,
            data: series.data,
        })),
    };

    return (
        <div>
            <div className="mb-4">
                <label className="mr-4">人口の種類：</label>
                <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded"
                >
                    <option value="総人口">総人口</option>
                    <option value="年少人口">年少人口</option>
                    <option value="生産年齢人口">生産年齢人口</option>
                    <option value="老年人口">老年人口</option>
                </select>
            </div>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        );
    };

export default PopulationChart;