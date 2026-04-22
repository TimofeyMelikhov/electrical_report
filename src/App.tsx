import { lazy, Suspense } from "react";
import { CustomProvider, DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import ru from "rsuite/locales/ru_RU";

import type { IFiltersResponse } from "@/models/types";

import { Preloader } from "@/components/preloader/Preloader";
import { SimpleSelect } from "@/components/select/SimpleSelect";
import { handleDateRangeChange } from "@/utils/handleDateRangeChange";
import buttonStyles from "@/styles/Button.module.css";

import { useElectricalReport } from "./hooks/useElectricalReport";
import styles from "./App.module.css";

const LazyExcelTable = lazy(() =>
  import("@/components/table/ExcelTable").then((module) => ({
    default: module.ExcelTable,
  })),
);

export const App = () => {
  const {
    hasFetched,
    isLoading,
    isLoadingFilters,
    selectedSubdivisions,
    filters,
    positionName,
    tableData,
    selectedCourses,
    selectedTests,
    selectedEvents,
    setSelectedCourses,
    setSelectedTests,
    setSelectedDate,
    setSelectedSubdivisions,
    setPositionName,
    handleCreateReport,
    setSelectedEvents,
  } = useElectricalReport();

  const hasTableData = tableData.length > 0;

  return (
    <div className={styles.app}>
      {isLoadingFilters ? (
        <Preloader />
      ) : (
        <section className={styles.filtersCard}>
          <h1 className={styles.filtersCardPageTitle}>
            {"Отчет по электрике"}
          </h1>

          <div className={styles.filters}>
            <div className={styles.filterField}>
              <span className={styles.filterFieldLabel}>Подразделение</span>
              <SimpleSelect<IFiltersResponse>
                placeholder="Все подразделения"
                isMulti
                value={selectedSubdivisions}
                options={filters?.subdivisionList}
                setOption={setSelectedSubdivisions}
                className="simple"
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div className={styles.filterField}>
              <span className={styles.filterFieldLabel}>Курс</span>
              <SimpleSelect<IFiltersResponse>
                placeholder="Все курсы"
                isMulti
                value={selectedCourses}
                options={filters?.coursesList}
                setOption={setSelectedCourses}
                className="simple"
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div className={styles.filterField}>
              <span className={styles.filterFieldLabel}>Тест</span>
              <SimpleSelect<IFiltersResponse>
                placeholder="Все тесты"
                isMulti
                value={selectedTests}
                options={filters?.testsList}
                setOption={setSelectedTests}
                className="simple"
                valueKey="id"
                labelKey="name"
              />
            </div>
            <div className={styles.filterField}>
              <span className={styles.filterFieldLabel}>Мероприятия</span>
              <SimpleSelect<IFiltersResponse>
                placeholder="Все мероприятия"
                isMulti
                value={selectedEvents}
                options={filters?.eventsList}
                setOption={setSelectedEvents}
                className="simple"
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div className={`${styles.filterField} ${styles.filterFieldWide}`}>
              <label className={styles.filterFieldLabel} htmlFor="positionName">
                Должность
              </label>
              <input
                id="positionName"
                className={styles.input}
                type="text"
                placeholder="Введите должность"
                value={positionName}
                onChange={(event) => setPositionName(event.target.value)}
              />
            </div>

            <div className={`${styles.filterField} ${styles.filterFieldWide}`}>
              <span className={styles.filterFieldLabel}>Период</span>
              <div className={styles.datePicker}>
                <CustomProvider locale={ru}>
                  <DateRangePicker
                    block
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
          </div>

          <button
            className={`${buttonStyles.button} ${buttonStyles.primary}`}
            type="button"
            onClick={handleCreateReport}
            disabled={isLoading}
          >
            {isLoading ? "Формирование..." : "Сформировать отчет"}
          </button>
        </section>
      )}

      {isLoading && <Preloader />}

      {hasTableData && (
        <Suspense fallback={<Preloader />}>
          <LazyExcelTable data={tableData} />
        </Suspense>
      )}

      {hasFetched && !hasTableData && (
        <p className={styles.warning}>
          Ничего не найдено. Попробуйте изменить фильтры и сформировать отчет
          заново.
        </p>
      )}
    </div>
  );
};
