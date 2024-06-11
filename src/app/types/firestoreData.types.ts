import { WhereFilterOp } from 'firebase/firestore';


export type BookData = {
  title: string,
  category: string,
  year: number,
  id?: string,
};

export type CategoryData = {
  nave: string,
  value: string,
  id?: string,
};

export type DocData = BookData | CategoryData;

export type UpdateDocData = & {
  id: string,
};

export type QueryData = {
  customLimit?: number,
  fieldToFilter?: string,
  operator?: WhereFilterOp,
  value?: string | boolean | number,
};