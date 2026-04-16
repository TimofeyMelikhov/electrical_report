import { useCallback, useEffect, useState } from "react";

import axios from "axios";

import type {
  IDateRange,
  IFilterSelection,
  IReportData,
  IFiltersData,
  IFilters,
} from "@/models/types";
import { env } from "@/config/global";

const api = axios.create({
  baseURL: `${env.apiBaseUrl}?object_id=${env.objectId}`,
  headers: { "Content-Type": "application/json" },
  timeout: 100000,
});

export const useElectricalReport = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<IFilters | null>(null);
  const [selectedSubdivisions, setSelectedSubdivisions] =
    useState<IFilterSelection | null>(null);

  const [selectedDate, setSelectedDate] = useState<IDateRange>({
    start_date: null,
    finish_date: null,
  });
  const [selectedCourses, setSelectedCourses] =
    useState<IFilterSelection | null>(null);
  const [selectedTests, setSelectedTests] = useState<IFilterSelection | null>(
    null,
  );
  const [positionName, setPositionName] = useState<string>("");
  const [tableData, setTableData] = useState<IReportData[]>([]);

  useEffect(() => {
    const loadFilters = async () => {
      setIsLoadingFilters(true);
      try {
        const response = await api.get<IFilters>("", {
          params: { method: "getFiltersData" },
        });
        if (response?.data) {
          setFilters(response.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки фильтров:", error);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  const postReport = useCallback(
    async (
      method: string,
      payload: IFiltersData,
      onSuccess: (result: IReportData[] | string | null) => void,
    ) => {
      setIsLoading(true);
      try {
        const response = await api.post<IReportData[]>("", payload, {
          params: { method },
        });

        onSuccess(response.data);
      } catch (err) {
        console.error(`Ошибка при ${method}: `, err);

        const errorMessage =
          method === "getTableData" ? "Ничего не найдено" : null;
        onSuccess(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );
  const handleCreateReport = () => {
    setTableData([]);
    setHasFetched(false);

    const firstSelectedSubdivision = selectedSubdivisions?.[0] ?? null;
    const firstSelectedCourse = selectedCourses?.[0] ?? null;
    const firstSelectedTest = selectedTests?.[0] ?? null;

    const data: IFiltersData = {
      selectedSubdivision: firstSelectedSubdivision,
      selectedSubdivisions,
      selectedCourse: firstSelectedCourse,
      selectedCourses,
      selectedTest: firstSelectedTest,
      selectedTests,
      positionName,
      selectedDate,
    };

    postReport("getData", data, (result) => {
      setHasFetched(true);
      setTableData(Array.isArray(result) && result.length > 0 ? result : []);
    });
  };

  return {
    isLoadingFilters,
    selectedSubdivisions,
    isLoading,
    hasFetched,
    filters,
    positionName,
    tableData,
    selectedCourses,
    selectedTests,
    setSelectedSubdivisions,
    setSelectedDate,
    setPositionName,
    handleCreateReport,
    setSelectedCourses,
    setSelectedTests,
  };
};
