import React, { useState, useEffect } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import { PopulationData } from '../types/index';

type PopulationChartProps = {
    selectedPrefectures: { prefCode: number; prefName: string }[];
  };
  
  const PopulationChart: React.FC<PopulationChartProps> = ({ selectedPrefectures }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [years, setYears] = useState<number[]>([]);
  
    useEffect(() => {
        const fetchPopulationData = async () => {
        const promises = selectedPrefectures.map(async (pref) => {
            try {
                    // 都道府県の人口データを取得
                    const response = await axios.get(`/api/population?prefCode=${pref.prefCode}&cityCode=-`);
                    const data = response.data.result.data[0].data; // 総人口データを取得

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
    }, [selectedPrefectures]);

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
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        );
    };

export default PopulationChart;