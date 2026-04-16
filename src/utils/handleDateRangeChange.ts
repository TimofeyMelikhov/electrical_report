export const formatDate = (date: Date): string => {
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()
	return `${year}-${month}-${day}`
}

interface DateRange {
	start_date: string | null
	finish_date: string | null
}

type DateType = 'start_date' | 'finish_date'

export const handleDateRangeChange = (
	value: [Date, Date] | null,
	date_type: DateType,
	setSelectedStartDate: React.Dispatch<React.SetStateAction<DateRange>>
): void => {
	if (!value) {
		const formattedDateRange: DateRange = {
			start_date: null,
			finish_date: null
		}

		if (date_type === 'start_date') {
			setSelectedStartDate(formattedDateRange)
		}

		return
	}

	const [startDate, endDate] = value

	const formattedDateRange: DateRange = {
		start_date: startDate ? formatDate(startDate) : null,
		finish_date: endDate ? formatDate(endDate) : null
	}

	if (date_type === 'start_date') {
		setSelectedStartDate(formattedDateRange)
	}
}
