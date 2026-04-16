import { CustomProvider, DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import ru from "rsuite/locales/ru_RU";

import type { ISubdivisionAndCourseResponse } from "@/models/types";

import { Preloader } from "@/components/preloader/Preloader";
import { SimpleSelect } from "@/components/select/SimpleSelect";
import { ExcelTable } from "@/components/table/ExcelTable";

import { handleDateRangeChange } from "@/utils/handleDateRangeChange";

import "./App.css";
import { useElectricalReport } from "./hooks/useElectricalReport";

export const App = () => {
  const {
    hasFetched,
    isLoading,
    isLoadingFilters,
    selectedSubdivision,
    filters,
    positionName,
    tableData,
    selectedCourse,
    selectedTest,
    setSelectedCourse,
    setSelectedTest,
    setSelectedDate,
    setSelectedSubdivision,
    setPositionName,
    handleCreateReport,
  } = useElectricalReport();

  return (
    <div className="app">
      <h3>Отчет по электрике</h3>
      {isLoadingFilters ? (
        <Preloader />
      ) : (
        <>
          <div className="filters">
            {/* <div
              style={{
                color: "hsl(0, 0%, 40%)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: 14,
                fontStyle: "italic",
              }}
            > */}
            <SimpleSelect<ISubdivisionAndCourseResponse>
              placeholder="Подразделение"
              value={selectedSubdivision}
              options={filters?.subdivisionList}
              setOption={setSelectedSubdivision}
              className="simple"
              valueKey="id"
              labelKey="name"
            />
            <SimpleSelect<ISubdivisionAndCourseResponse>
              placeholder="Курс"
              value={selectedCourse}
              options={filters?.coursesList}
              setOption={setSelectedCourse}
              className="simple"
              valueKey="id"
              labelKey="name"
            />
            <SimpleSelect<ISubdivisionAndCourseResponse>
              placeholder="Тест"
              value={selectedTest}
              options={filters?.testsList}
              setOption={setSelectedTest}
              className="simple"
              valueKey="id"
              labelKey="name"
            />
            {/* </div> */}

            {/* <div> */}
            <input
              type="text"
              placeholder="Введите должность"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
            />
            {/* </div> */}

            <CustomProvider locale={ru}>
              <DateRangePicker
                character={" по "}
                placeholder={"Дата с... по..."}
                format={"dd.MM.yyyy"}
                onChange={(value) =>
                  handleDateRangeChange(value, "start_date", setSelectedDate)
                }
              />
            </CustomProvider>
          </div>
          <div className="btn-box">
            <button className="btn" onClick={handleCreateReport}>
              Создать отчет
            </button>
          </div>
        </>
      )}
      {isLoading && <Preloader />}

      {Array.isArray(tableData) && tableData?.length > 0 && (
        <ExcelTable data={tableData} />
      )}

      {hasFetched && tableData.length === 0 && (
        <p className="warning">
          Ничего не найдено, попробуйте изменить фильтр.
        </p>
      )}
    </div>
  );
};
