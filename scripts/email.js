const sendMail = ({ data, template, successText }) => {
	const serviceId = 'service_cvcx775'
	const btn = document.querySelector('.modal-button')
	const btnText = btn.innerText
	btn.innerText = 'Отправка...'
	btn.disabled = true

	emailjs.send(serviceId, template, data)
		.then(() => {
			const succesEl = `<p class="modal__success">${successText}</p>`

			document.querySelector('.modal-content--inner').innerHTML = succesEl
			btn.innerText = btnText
			btn.disabled = false
		})
		.catch(err => {
			console.error(err)
			btn.innerText = btnText
			btn.disabled = false
		})
}

const removeModal = () => {
	const modalCloseButton = document.querySelector('.modal__close')
	const modal = document.querySelector('.modal')

	modalCloseButton.addEventListener('click', () => {
		modal.remove()
	})
}

const checkError = (elId, errorText) => {
	const val = document.getElementById(elId).value

	if (!val) {
		const el = document.getElementById(elId)
		el.classList.add('error')
		const errorSpan = `<span class="input-row__error">${errorText}</span>`
		el.insertAdjacentHTML('afterend', errorSpan)
	}
}

const clearError = (el) => {
	const val = el.value

	if (val && el?.nextElementSibling?.classList?.contains?.('input-row__error')) {
		el.nextElementSibling.remove();
	}
}

const createOrderModal = (model) => {
	const html = `
	<div class="modal">
		<div class="modal-content" data-model="${model}">
			<h4 class="modal__title">Забронировать</h4>
			<button class="modal__close">
				<img src="./assets/icons/close.svg" alt="Close" width="30" height="30">
			</button>
			<div class="modal-content--inner">
				<div class="input-row">
					<label for="modalName">Имя</label>
					<input type="text" id="modalName"  onblur="clearError(modalName)">
				</div>
				<div class="input-row">
					<label for="modalNumber">Tелефон</label>
					<input type="text" id="modalNumber"  onblur="clearError(modalNumber)">
				</div>
				<div class="input-row">
					<label for="modalMessage">Сообщение</label>
					<textarea type="text" id="modalMessage"></textarea>
				</div>
				<button class="main-button modal-button"">
					Забронировать
				</button>
			</div>
		</div>
	</div>`

	document.body.insertAdjacentHTML('beforebegin', html)

	document.querySelector('.modal-button').addEventListener('click', () => {
		const name = document.getElementById('modalName').value
		const phone = document.getElementById('modalNumber').value
		const message = modalMessage.value

		checkError('modalName', 'Введите ваше имя')
		checkError('modalNumber', 'Введите номер телефона')

		if (name && phone) {
			sendMail({
				data: {
					name,
					phone,
					message,
					model,
				},
				successText: 'Ваш заказ отправлен на почту, мы скоро с вами свяжемся',
				template: 'template_wnr3p67'
			})
		}
	})

	removeModal()
}

const createSupportModal = () => {
	const html = `
	<div class="modal">
		<div class="modal-content">
			<h4 class="modal__title">Заказать звонок</h4>
			<button class="modal__close">
				<img src="./assets/icons/close.svg" alt="Close" width="30" height="30">
			</button>
			<div class="modal-content--inner">
				<div class="input-row">
					<label for="modalName">Имя</label>
					<input type="text" id="modalName" onblur="clearError(modalName)">
				</div>
				<div class="input-row">
					<label for="modalNumber">Tелефон</label>
					<input type="text" id="modalNumber" onblur="clearError(modalNumber)">
				</div>
				<button class="main-button modal-button">
					Заказать
				</button>
			</div>
		</div>
	</div>`

	document.body.insertAdjacentHTML('beforebegin', html)

	document.querySelector('.modal-button').addEventListener('click', () => {
		const name = document.getElementById('modalName').value
		const phone = document.getElementById('modalNumber').value

		checkError('modalName', 'Введите ваше имя')
		checkError('modalNumber', 'Введите номер телефона')

		if (name && phone) {
			sendMail({
				data: {
					name,
					phone,
				},
				successText: 'Ваша заявка отправлена, мы скоро с вами свяжемся',
				template: 'template_daeq4u7'
			})
		}

	})

	removeModal()
}