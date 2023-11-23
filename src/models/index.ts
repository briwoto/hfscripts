export * from './userSegmentSchema';
export interface TableSchema {
  tableName: string;
  columns: {
    [key: string]: string;
  };
}
