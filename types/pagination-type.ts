import { School } from "./school";

export type PaginatedSchools = {
  data: School[];
  total: number;
  page: number;
  pageSize: number;
};
