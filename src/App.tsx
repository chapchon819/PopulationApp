import React, { useState } from 'react';
import PrefectureList from './components/PrefectureList';
import PopulationChart from './components/PopulationChart';

const App: React.FC = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState<{ prefCode: number; prefName: string }[]>([]);

  // PrefectureListから選択された都道府県のコードと名前を取得
  const handlePrefectureSelection = (selectedPrefCodesAndNames: { prefCode: number; prefName: string }[]) => {
    setSelectedPrefectures(selectedPrefCodesAndNames);
  };

  return (
    <div>
      <h1 className='m-8 font-bold text-xl sticky top-0 z-30'>都道府県別人口データ</h1>
      <div className="flex w-11/12 h-screen">
        <div className="w-1/4 mx-8 h-screen relative">
          <div className='absolute h-full w-full pb-16 overflow-y-scroll'>
            <PrefectureList onSelectionChange={handlePrefectureSelection} />
          </div>
        </div>
        <div className="w-3/4">
          {selectedPrefectures.length > 0 ? (
            <PopulationChart selectedPrefectures={selectedPrefectures} />
          ) : (
            <p className='p-4 font-semibold'>都道府県を選択してください。</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default App;
