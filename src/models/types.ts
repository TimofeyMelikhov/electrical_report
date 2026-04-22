export interface IDateRange {
  start_date: string | null;
  finish_date: string | null;
}

export interface IFiltersResponse {
  id: string;
  name: string;
}

export type IFilterSelection = IFiltersResponse[];

export interface IFiltersData {
  selectedSubdivisions?: IFilterSelection | null;
  selectedCourses?: IFilterSelection | null;
  selectedTests?: IFilterSelection | null;
  selectedDate?: IDateRange | null;
  positionName?: string | null;
  selectedEvents: IFilterSelection | null;
}

export interface IFilters {
  coursesList: IFiltersResponse[];
  testsList: IFiltersResponse[];
  subdivisionList: IFiltersResponse[];
  eventsList: IFiltersResponse[];
}

export interface IReportData {
  fullname: string;
  code: string;
  positionParentName: string;
  positionName: string;
  hireDate: string;
  itemType: string;
  itemName: string;
  startUsageDate: string;
  lastUsageDate: string;
  score: string | null;
  stateDescription: string;
}
