document.addEventListener('DOMContentLoaded', () => {
	const dropdowns = document.querySelectorAll('.dropdown')
	
	dropdowns.forEach(function (dropdownWrapper) {
		const dropdownBtn = dropdownWrapper.querySelector('.dropdown__button');
		const dropdownList = dropdownWrapper.querySelector('.dropdown__list');
		const dropdownItems = dropdownList.querySelectorAll('.dropdown__list-item');
		const dropdownInput = dropdownWrapper.querySelector('.dropdown__input_hidden')
		const dropdownLabel = dropdownWrapper.querySelector('label')
		
		dropdownBtn.addEventListener('click', function () {
			dropdownList.classList.toggle('dropdown__list_visible');
			this.classList.toggle('dropdown__button_active');

			dropdowns.forEach(dropdown => {
				const list = dropdown.querySelector('.dropdown__list')
				const btn = dropdown.querySelector('.dropdown__button')
				
				if (dropdownList !== list) {
					list.classList.remove('dropdown__list_visible')
					btn.classList.remove('dropdown__button_active')
				}
			});
		});
	
		dropdownItems.forEach(function (listItem) {
			listItem.addEventListener('click', function (e) {
				dropdownItems.forEach(function (el) {
					el.classList.remove('dropdown__list-item_active');
				})
				
				e.currentTarget.classList.add('dropdown__list-item_active');
				dropdownBtn.innerText = this.querySelector('span') ? this.querySelector('span')?.innerText : this.innerText;
				dropdownInput.value = this.dataset.value;
				dropdownList.classList.remove('dropdown__list_visible');
	
				dropdownLabel && dropdownLabel.classList.add('active')
			})
		})
	
		document.addEventListener('click', function (e) {
			if (!e.target.classList.contains('dropdown__list-item')) return
	
			if (e.target !== dropdownBtn) {
				dropdownBtn.classList.remove('dropdown__button_active');
				dropdownList.classList.remove('dropdown__list_visible');
			}
		})
	
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Tab' || e.key === 'Escape') {
				dropdownBtn.classList.remove('dropdown__button_active');
				dropdownList.classList.remove('dropdown__list_visible');
			}
		})
	})
})