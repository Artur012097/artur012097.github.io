const form = document.querySelector('.form')
const success = document.querySelector('.contact-form__success')

const sendForm = () => {
	return new Promise((resolve) => {
		form.style.display = 'none'
		success.style.display = 'block'
		setTimeout(() => {
			resolve()
		}, 200)
	})
}

if (form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		sendForm()
	})
}

const doneBtn = document.querySelector('.done-btn')

if (doneBtn) {
	doneBtn.addEventListener('click', () => {
		success.style.display = 'none'
		form.style.display = 'block'
	})
}