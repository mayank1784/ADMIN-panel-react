import React, { useState, KeyboardEvent } from 'react'

interface AutoCompleteProps {
	data: string[]
	label: string
	onSelect: (selectedValue: string) => void
	disabled?: boolean
	placeholder?: string
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
	data,
	label,
	onSelect,
	disabled = false,
	placeholder = 'city',
}) => {
	const [suggestions, setSuggestions] = useState<string[]>(data)
	const [suggestionIndex, setSuggestionIndex] = useState<number>(0)
	const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false)
	const [value, setValue] = useState<string>('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value.toLowerCase()
		setValue(query)
		if (query.length > 1) {
			const filterSuggestions = data.filter(
				(suggestion) => suggestion.toLowerCase().indexOf(query) > -1
			)
			setSuggestions(filterSuggestions)
			setSuggestionsActive(true)
		} else {
			setSuggestionsActive(false)
		}
	}

	const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
		const selectedValue = e.currentTarget.innerText
		setSuggestions([])
		setValue(selectedValue)

		setSuggestionsActive(false)
		onSelect(selectedValue)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		// UP ARROW
		if (e.key === 'ArrowUp') {
			if (suggestionIndex === 0) {
				return
			}
			setSuggestionIndex(suggestionIndex - 1)
		}
		// DOWN ARROW
		else if (e.key === 'ArrowDown') {
			if (suggestionIndex - 1 === suggestions.length) {
				return
			}
			setSuggestionIndex(suggestionIndex + 1)
		}
		// ENTER
		else if (e.key === 'Enter') {
			e.preventDefault()
			setValue(suggestions[suggestionIndex])
			setSuggestionIndex(0)
			setSuggestionsActive(false)
			onSelect(suggestions[suggestionIndex])
		}
	}

	const Suggestions: React.FC = () => {
		return (
			// <ul className="suggestions relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
			<ul className="relative z-20 bg-transparent dark:bg-form-input text-left">
				{suggestions.map((suggestion, index) => (
					<li
						className={
							index === suggestionIndex
								? 'text-black p-2 dark:text-white border-solid border-2 dark:border-primary border-slate-500'
								: 'text-body dark:text-bodydark'
						}
						key={index}
						onClick={handleClick}>
						{suggestion}
					</li>
				))}
			</ul>
		)
	}

	return (
		<div className="autocomplete">
			<div className="mb-4.5">
				<label className="mb-2.5 block text-black dark:text-white text-left">
					{' '}
					{label}{' '}
				</label>
				<input
					className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
					type="text"
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					placeholder={placeholder}
				/>
				{suggestionsActive && !disabled && <Suggestions />}
			</div>
		</div>
	)
}

export default AutoComplete
