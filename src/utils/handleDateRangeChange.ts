import type { Dispatch, SetStateAction } from "react";

import type { IDateRange } from "@/models/types";

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

type DateType = "start_date" | "finish_date";

export const handleDateRangeChange = (
  value: [Date, Date] | null,
  dateType: DateType,
  setSelectedDate: Dispatch<SetStateAction<IDateRange>>,
): void => {
  if (!value) {
    const formattedDateRange: IDateRange = {
      start_date: null,
      finish_date: null,
    };

    if (dateType === "start_date") {
      setSelectedDate(formattedDateRange);
    }

    return;
  }

  const [startDate, endDate] = value;

  const formattedDateRange: IDateRange = {
    start_date: startDate ? formatDate(startDate) : null,
    finish_date: endDate ? formatDate(endDate) : null,
  };

  if (dateType === "start_date") {
    setSelectedDate(formattedDateRange);
  }
};
