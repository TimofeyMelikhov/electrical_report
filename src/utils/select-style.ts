import type { StylesConfig } from 'react-select'

// Тип для опции
interface OptionType {
	value: any
	label: string
}

const select_style: StylesConfig<OptionType> = {
	control: (base, state) => ({
		...base,
		border: state.isFocused ? '2px solid #3498ff' : '2px solid #BCBBBC',
		boxShadow: state.isFocused ? 'none' : 'none',
		outline: 'none',
		borderRadius: '2px',
		// minWidth: '335px',
		maxWidth: '283px',
		fontSize: '14px',

		'&:hover': {
			border: '2px solid #3498ff',
			boxShadow: 'none'
		}
	}),
	valueContainer: base => ({
		...base,
		overflowY: 'auto',
		maxHeight: '82px',
		// minWidth: '280px',
		fontSize: '14px'
	}),
	option: (base, state) => ({
		...base,
		backgroundColor: state.isSelected ? '#BCBBBC' : base.backgroundColor,
		fontSize: '14px',

		'&:hover': {
			backgroundColor: '#CD2C40',
			color: 'white'
		}
	})
}

export default select_style
