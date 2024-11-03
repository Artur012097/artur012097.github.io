document.querySelectorAll('.dropdown').forEach(function (dropdownWrapper) {
	const dropdownBtn = dropdownWrapper.querySelector('.dropdown__button');
	const dropdownList = dropdownWrapper.querySelector('.dropdown__list');
	const dropdownItems = dropdownList.querySelectorAll('.dropdown__list-item');
	const dropdownInput = dropdownWrapper.querySelector('.dropdown__input_hidden')
	
	dropdownBtn.addEventListener('click', function () {
	  dropdownList.classList.toggle('dropdown__list_visible');
	  this.classList.toggle('dropdown__button_active');
	});
	
	dropdownItems.forEach(function(listItem) {
	  listItem.addEventListener('click', function (e) {
		if (!e.target?.classList?.contains('dropdown__list-item')) return
		
		dropdownItems.forEach(function(el) {
		  el.classList.remove('dropdown__list-item_active');
		})
		e.target.classList.add('dropdown__list-item_active');
		dropdownBtn.innerText = this.innerText;
		dropdownInput.value = this.dataset.value;
		dropdownList.classList.remove('dropdown__list_visible');
	  })
	})
	
	document.addEventListener('click', function (e) {
	  if ( e.target !== dropdownBtn ){
		dropdownBtn.classList.remove('dropdown__button_active');
		dropdownList.classList.remove('dropdown__list_visible');
	  }
	})
	
	document.addEventListener('keydown', function (e) {
	  if( e.key === 'Tab' || e.key === 'Escape' ) {
		dropdownBtn.classList.remove('dropdown__button_active');
		dropdownList.classList.remove('dropdown__list_visible');
	  }
	}) 
  })

  const countryCodeSelect = document.getElementById('country-code');
  const flagElement = document.getElementById('flag');
  const phoneInput = document.getElementById('phone-input');

  // Function to update flag and placeholder based on selected option
  function updateFlagAndPlaceholder() {
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

  // Basic JavaScript for formatting phone number (optional)
  phoneInput.addEventListener('input', formatPhoneNumber);

  function formatPhoneNumber(e) {
	  let input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
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