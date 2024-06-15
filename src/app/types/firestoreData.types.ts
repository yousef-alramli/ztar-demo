import { WhereFilterOp, DocumentData } from 'firebase/firestore';


export type BookData = {
  category: string,
  id?: string,
  numberOfBooks: number,
  Publisher: string,
  title: string,
  year: number,
};

export type CategoryData = {
  value: string,
  id?: string,
};

export type DocData = BookData | CategoryData;

export type UpdateDocData = DocData & {
  id: string,
};

export type QueryData = {
  customLimit?: number,
  startAfterDoc?: DocumentData,
  whereQuery?: WhereQuery[],
};

export type WhereQuery = {
  fieldToFilter: string,
  operator: WhereFilterOp,
  value: string | boolean | number,
}