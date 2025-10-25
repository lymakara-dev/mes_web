import { ISchool } from "./learn-type";


export type PaginatedSchools = {
  data: ISchool[];
  total: number;
  page: number;
  pageSize: number;
};
