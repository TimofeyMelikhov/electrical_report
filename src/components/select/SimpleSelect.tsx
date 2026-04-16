import { type Dispatch, type SetStateAction, useMemo } from 'react'
import Select from 'react-select'

import select_style from '@/utils/select-style'

import styles from './SimpleSelect.module.css'
import type { IBaseOption, SimpleSelectProps } from './SimpleSelect.type'

export const SimpleSelect = <T extends IBaseOption>({
	options,
	setOption,
	isMulti,
	placeholder,
	className,
	value,
	labelKey,
	disabled
}: SimpleSelectProps<T>) => {
	const curOptions =
		options?.map(opt => ({
			value: opt,
			label: String(opt[labelKey])
		})) || []

	const selectValue = useMemo(() => {
		if (isMulti) {
			const multiValue = value as T[] | null
			return multiValue
				? multiValue.map(val => ({ value: val, label: String(val[labelKey]) }))
				: null
		} else {
			const singleValue = value as T | null
			return singleValue
				? { value: singleValue, label: String(singleValue[labelKey]) }
				: null
		}
	}, [value, isMulti, labelKey])

	return (
		<div className={className ? styles[className] : undefined}>
			<Select
				styles={select_style as any}
				options={curOptions}
				placeholder={placeholder}
				isMulti={isMulti}
				isClearable
				isDisabled={disabled}
				value={selectValue}
				onChange={selected => {
					if (isMulti) {
						const newValue = selected
							? (selected as { value: T; label: string }[]).map(
									item => item.value
								)
							: null
						;(setOption as Dispatch<SetStateAction<T[] | null>>)(newValue)
					} else {
						const newValue = selected
							? (selected as { value: T; label: string }).value
							: null
						;(setOption as Dispatch<SetStateAction<T | null>>)(newValue)
					}
				}}
			/>
		</div>
	)
}
