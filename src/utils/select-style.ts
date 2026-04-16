import type { GroupBase, StylesConfig } from "react-select";

import type {
  IBaseOption,
  ISelectOption,
} from "@/components/select/SimpleSelect.type";

export const getSelectStyle = <T extends IBaseOption>(): StylesConfig<
  ISelectOption<T>,
  boolean,
  GroupBase<ISelectOption<T>>
> => ({
  container: (base) => ({
    ...base,
    width: "100%",
  }),
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    paddingBlock: "2px",
    border: `1px solid ${state.isFocused ? "#0b63ce" : "#b9c8da"}`,
    boxShadow: state.isFocused ? "0 0 0 4px rgba(11, 99, 206, 0.12)" : "none",
    borderRadius: "14px",
    backgroundColor: state.isDisabled ? "#edf2f7" : "#f6f9fc",
    fontSize: "15px",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
    "&:hover": {
      borderColor: "#0b63ce",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#8ea0b4",
  }),
  valueContainer: (base) => ({
    ...base,
    gap: "4px",
    padding: "4px 12px",
    fontSize: "15px",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    paddingBlock: 0,
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#0b63ce" : "#64748b",
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "#64748b",
  }),
  menu: (base) => ({
    ...base,
    marginTop: "6px",
    border: "1px solid #d6dfeb",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 16px 36px rgba(16, 36, 58, 0.16)",
  }),
  menuList: (base) => ({
    ...base,
    padding: "8px",
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: "10px",
    backgroundColor: state.isSelected
      ? "#0b63ce"
      : state.isFocused
        ? "#e8f0fb"
        : "#fff",
    color: state.isSelected ? "#fff" : "#11243a",
    cursor: "pointer",
    "&:active": {
      backgroundColor: state.isSelected ? "#0b63ce" : "#dce8f7",
    },
  }),
  multiValue: (base) => ({
    ...base,
    borderRadius: "8px",
    margin: "2px 4px 2px 0",
    backgroundColor: "#e8f0fb",
  }),
  multiValueLabel: (base) => ({
    ...base,
    padding: "4px 6px 4px 8px",
    color: "#0b63ce",
    fontWeight: 600,
  }),
  multiValueRemove: (base) => ({
    ...base,
    paddingInline: "6px",
    color: "#0b63ce",
    "&:hover": {
      backgroundColor: "#d7e6f7",
      color: "#084d9f",
    },
  }),
});
