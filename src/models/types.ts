export interface IDateRange {
  start_date: string | null;
  finish_date: string | null;
}

export interface ISubdivisionAndCourseResponse {
  id: string;
  name: string;
}

export type IFilterSelection = ISubdivisionAndCourseResponse[];

export interface IFiltersData {
  selectedSubdivision?: ISubdivisionAndCourseResponse | null;
  selectedSubdivisions?: IFilterSelection | null;
  selectedCourse?: ISubdivisionAndCourseResponse | null;
  selectedCourses?: IFilterSelection | null;
  selectedTest?: ISubdivisionAndCourseResponse | null;
  selectedTests?: IFilterSelection | null;
  selectedDate?: IDateRange | null;
  positionName?: string | null;
}

export interface IFilters {
  coursesList: ISubdivisionAndCourseResponse[];
  testsList: ISubdivisionAndCourseResponse[];
  subdivisionList: ISubdivisionAndCourseResponse[];
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
