import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Prefectures } from '../types/index'; // 必要に応じて正しいパスに変更してください

type PrefectureListProps = {
  onSelectionChange: (selectedPrefCodesAndNames: { prefCode: number; prefName: string }[]) => void;
};

const PrefectureList: React.FC<PrefectureListProps> = ({ onSelectionChange }) => {
  const [prefectures, setPrefectures] = useState<Prefectures[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<{ prefCode: number; prefName: string }[]>([]);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const response = await axios.get('/api/prefectures');
        setPrefectures(response.data.result); // APIレスポンスの都道府県データ
      } catch (error) {
        console.error('Failed to fetch prefectures:', error);
      }
    };

    fetchPrefectures();
  }, []);

  const handleCheckboxChange = (prefCode: number, prefName: string) => {
    const updatedSelectedPrefectures = selectedPrefectures.some((pref) => pref.prefCode === prefCode)
      ? selectedPrefectures.filter((pref) => pref.prefCode !== prefCode)
      : [...selectedPrefectures, { prefCode, prefName }];

    setSelectedPrefectures(updatedSelectedPrefectures);
    onSelectionChange(updatedSelectedPrefectures); // 選択された都道府県を親コンポーネントに通知
  };

  return (
    <div>
      <h2>都道府県一覧</h2>
      <ul>
        {prefectures.map((prefecture) => (
          <li className='my-2' key={prefecture.prefCode}>
            <label>
              <input
                className='mr-2'
                type="checkbox"
                value={prefecture.prefCode}
                checked={selectedPrefectures.some((pref) => pref.prefCode === prefecture.prefCode)}
                onChange={() => handleCheckboxChange(prefecture.prefCode, prefecture.prefName)}
              />
              {prefecture.prefName}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default PrefectureList;