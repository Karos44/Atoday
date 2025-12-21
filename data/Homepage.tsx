import React from 'react';
import { MemoryRecord } from '../types';
import { RecordItem } from '../components/feed/RecordItem';

interface HomePageProps {
  filteredData: MemoryRecord[];
  onSelectRecord: (record: MemoryRecord) => void;
}

export function HomePage({
  filteredData,
  onSelectRecord,
}: HomePageProps) {
  return (
    <div className="min-h-full">
      {filteredData.length > 0 ? (
        filteredData.map((record) => (
          <RecordItem
            key={record.id}
            data={record}
            onClick={() => onSelectRecord(record)}
          />
        ))
      ) : (
        <div className="p-10 flex flex-col items-center justify-center h-64">
          未找到
        </div>
      )}
    </div>
  );
}
