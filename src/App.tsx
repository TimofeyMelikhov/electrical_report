import { CustomProvider, DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import ru from "rsuite/locales/ru_RU";

import type { ISubdivisionAndCourseResponse } from "@/models/types";

import { Preloader } from "@/components/preloader/Preloader";
import { SimpleSelect } from "@/components/select/SimpleSelect";
import { ExcelTable } from "@/components/table/ExcelTable";
import { handleDateRangeChange } from "@/utils/handleDateRangeChange";

import { useElectricalReport } from "./hooks/useElectricalReport";
import "./App.css";

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

  const hasTableData = tableData.length > 0;

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">Отчет по электрике</p>
        <h1 className="app__title">Контроль обучения, тестов и мероприятий</h1>
        <p className="app__description">
          Выберите нужные параметры, сформируйте отчет и при необходимости
          выгрузите результат в Excel.
        </p>
      </header>

      {isLoadingFilters ? (
        <Preloader />
      ) : (
        <section className="filters-card">
          <div className="filters-card__header">
            <div>
              <h2 className="filters-card__title">Фильтры отчета</h2>
              <p className="filters-card__subtitle">
                Фильтры применяются к текущему отчету, а выбор курса и теста
                теперь участвует в запросе данных.
              </p>
            </div>

            <button
              className="btn btn--primary"
              type="button"
              onClick={handleCreateReport}
              disabled={isLoading}
            >
              {isLoading ? "Формирование..." : "Сформировать отчет"}
            </button>
          </div>

          <div className="filters">
            <div className="filter-field">
              <span className="filter-field__label">Подразделение</span>
              <SimpleSelect<ISubdivisionAndCourseResponse>
                placeholder="Все подразделения"
                value={selectedSubdivision}
                options={filters?.subdivisionList}
                setOption={setSelectedSubdivision}
                className="simple"
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div className="filter-field">
              <span className="filter-field__label">Курс</span>
              <SimpleSelect<ISubdivisionAndCourseResponse>
                placeholder="Все курсы"
                value={selectedCourse}
                options={filters?.coursesList}
                setOption={setSelectedCourse}
                className="simple"
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div className="filter-field">
              <span className="filter-field__label">Тест</span>
              <SimpleSelect<ISubdivisionAndCourseResponse>
                placeholder="Все тесты"
                value={selectedTest}
                options={filters?.testsList}
                setOption={setSelectedTest}
                className="simple"
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div className="filter-field filter-field--wide">
              <label className="filter-field__label" htmlFor="positionName">
                Должность
              </label>
              <input
                id="positionName"
                className="filters__input"
                type="text"
                placeholder="Введите должность"
                value={positionName}
                onChange={(event) => setPositionName(event.target.value)}
              />
            </div>

            <div className="filter-field filter-field--wide">
              <span className="filter-field__label">Период</span>
              <CustomProvider locale={ru}>
                <DateRangePicker
                  block
                  className="filters__date-picker"
                  character=" по "
                  placeholder="Дата с... по..."
                  format="dd.MM.yyyy"
                  onChange={(value) =>
                    handleDateRangeChange(
                      value as [Date, Date] | null,
                      "start_date",
                      setSelectedDate,
                    )
                  }
                />
              </CustomProvider>
            </div>
          </div>
        </section>
      )}

      {isLoading && <Preloader />}

      {hasTableData && <ExcelTable data={tableData} />}

      {hasFetched && !hasTableData && (
        <p className="warning">
          Ничего не найдено. Попробуйте изменить фильтры и сформировать отчет
          заново.
        </p>
      )}
    </div>
  );
};
