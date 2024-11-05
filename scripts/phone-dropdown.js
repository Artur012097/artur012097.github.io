document.addEventListener("DOMContentLoaded", () => {
	const countryCodeSelect = document.getElementById('country-code');
	const flagElement = document.getElementById('flag');
	const phoneInput = document.getElementById('phone-input');

	// Function to update flag and placeholder based on selected option
	const updateFlagAndPlaceholder = () => {
		const selectedOption = countryCodeSelect.options[countryCodeSelect.selectedIndex];
		const countryFlagCode = selectedOption.getAttribute('data-flag');
		const placeholder = selectedOption.getAttribute('data-placeholder');

		// Update flag background image
		flagElement.style.backgroundImage = `url('https://flagcdn.com/w20/${countryFlagCode}.png')`;

		// Update phone input placeholder
		phoneInput.placeholder = placeholder;
	}

	// Initialize flag and placeholder on load
	updateFlagAndPlaceholder();

	// Update flag and placeholder when country code changes
	countryCodeSelect.addEventListener('change', updateFlagAndPlaceholder);

	const formatPhoneNumber = (e) => {
		// Remove non-numeric characters
		let input = e.target.value.replace(/\D/g, '');
		let formatted = '';

		if (input.length > 3 && input.length <= 6) {
			formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
		} else if (input.length > 6) {
			formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 7)}`;
		} else {
			formatted = input;
		}

		phoneInput.value = formatted;
	}

	// Basic JavaScript for formatting phone number (optional)
	phoneInput.addEventListener('input', formatPhoneNumber);
})