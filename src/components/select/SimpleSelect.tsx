import { useMemo } from "react";
import Select, { type MultiValue, type SingleValue } from "react-select";

import { getSelectStyle } from "@/utils/select-style";

import styles from "./SimpleSelect.module.css";
import type {
  IBaseOption,
  ISelectOption,
  SimpleSelectProps,
} from "./SimpleSelect.type";

const isMultiValue = <T extends IBaseOption>(
  selected: MultiValue<ISelectOption<T>> | SingleValue<ISelectOption<T>>,
): selected is MultiValue<ISelectOption<T>> => Array.isArray(selected);

export const SimpleSelect = <T extends IBaseOption>(
  props: SimpleSelectProps<T>,
) => {
  const {
    options,
    placeholder,
    className,
    labelKey,
    disabled,
    isMulti,
  } = props;

  const currentOptions: ISelectOption<T>[] =
    options?.map((option) => ({
      value: option,
      label: String(option[labelKey]),
    })) ?? [];

  const selectValue = useMemo<
    ISelectOption<T> | readonly ISelectOption<T>[] | null
  >(() => {
    if (props.isMulti) {
      return props.value
        ? props.value.map((item) => ({
            value: item,
            label: String(item[labelKey]),
          }))
        : null;
    }

    return props.value
      ? {
          value: props.value,
          label: String(props.value[labelKey]),
        }
      : null;
  }, [labelKey, props.isMulti, props.value]);

  const handleChange = (
    selected: MultiValue<ISelectOption<T>> | SingleValue<ISelectOption<T>>,
  ) => {
    if (props.isMulti) {
      const multiValue = isMultiValue(selected)
        ? selected.map((item) => item.value)
        : null;

      props.setOption(multiValue);
      return;
    }

    const singleValue = isMultiValue(selected) ? null : selected;

    props.setOption(singleValue ? singleValue.value : null);
  };

  return (
    <div className={className ? styles[className] : undefined}>
      <Select<ISelectOption<T>, boolean>
        styles={getSelectStyle<T>()}
        options={currentOptions}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable
        isDisabled={disabled}
        value={selectValue}
        onChange={handleChange}
      />
    </div>
  );
};
