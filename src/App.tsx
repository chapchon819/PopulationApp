import React, { useState } from 'react';
import PrefectureList from './components/PrefectureList';
import PopulationChart from './components/PopulationChart';

const App: React.FC = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState<{ prefCode: number; prefName: string }[]>([]);

  // PrefectureList から選択された都道府県のコードと名前を取得
  const handlePrefectureSelection = (selectedPrefCodesAndNames: { prefCode: number; prefName: string }[]) => {
    setSelectedPrefectures(selectedPrefCodesAndNames);
  };

  return (
    <div>
      <h1 className='m-8'>都道府県別人口データ</h1>
      <div className="flex w-11/12 h-screen">
        <div className="w-1/3 mx-8 h-screen relative">
          <div className='absolute h-full w-full pb-8 overflow-y-scroll'>
            {/* 都道府県リストを表示 */}
            <PrefectureList onSelectionChange={handlePrefectureSelection} />
          </div>
        </div>
        <div className="w-2/3">
          {/* 選択された都道府県の人口データを表示 */}
          {selectedPrefectures.length > 0 ? (
            <PopulationChart selectedPrefectures={selectedPrefectures} />
          ) : (
            <p>都道府県を選択してください。</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default App;
