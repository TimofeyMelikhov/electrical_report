import type { Dispatch, SetStateAction } from 'react'

export interface IBaseOption {
	id: string | number
	name: string
	[key: string]: any
}

interface BaseSimpleSelectProps<T = IBaseOption> {
	options?: T[] | null
	placeholder?: string
	className?: string
	valueKey: keyof T
	labelKey: keyof T
	disabled?: boolean
}
interface SingleSelectProps<T = IBaseOption> extends BaseSimpleSelectProps<T> {
	isMulti?: false
	value?: T | null
	setOption: Dispatch<SetStateAction<T | null>>
}

interface MultiSelectProps<T = IBaseOption> extends BaseSimpleSelectProps<T> {
	isMulti: true
	value?: T[] | null
	setOption: Dispatch<SetStateAction<T[] | null>>
}

export type SimpleSelectProps<T> = SingleSelectProps<T> | MultiSelectProps<T>
