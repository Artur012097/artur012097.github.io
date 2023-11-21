const parallax = (event) => {
	if (window?.innerWidth > 768) {
		const paralaxEls = document.querySelectorAll('.parallax__el')

		paralaxEls.forEach((el) => {
			const size = el?.getAttribute('size') ?? 30
			const eventX = event.clientX
			const eventY = event.clientY

			const x = (window.innerWidth - eventX) / size
			const y = (window.innerHeight - eventY) / size

			if (el.classList?.contains('aos-init')) {
				if (!el.getAttribute('loaded')) {
					setTimeout(() => {
						el.setAttribute('loaded', true)
					}, 400)
				}
				if (
					el.classList?.contains('aos-animate') &&
					el.getAttribute('loaded')
				) {
					el.style.transition = '.1s ease'
					el.style.transform = `translateX(${x}px) translateY(${y}px)`
				}
			} else {
				el.style.transition = '.1s ease'
				el.style.transform = `translateX(${x}px) translateY(${y}px)`
			}
		})
	}
}

const swiper = new Swiper('.our-technics__swiper', {
	// Optional parameters
	direction: 'horizontal',
	slidesPerView: 1,
	speed: 400,
	animations: false,
	loop: false,
	effect: "creative",
	creativeEffect: {
		prev: {
			shadow: true,
			translate: ["-20%", 0, -1],
		},
		next: {
			translate: ["100%", 0, 0],
		},
	},

	// Navigation arrows
	navigation: {
		nextEl: '.swiper-button--next',
		prevEl: '.swiper-button--prev',
	},
});

window.addEventListener('mousemove', parallax)

// menu element in DOM
const navMenu = document.querySelector('.nav-menu')
// menu links
const menuLinks = navMenu.querySelectorAll('li a')

// close menu function
const closeMenu = () => {
	burgerButton.classList.remove('_active')
	navMenu.classList.remove('_active')
}

// toggle menu function
const toggleMenu = () => {
	if (window.innerWidth <= 1024) {

		burgerButton.classList.toggle('_active')
		navMenu.classList.toggle('_active')
	}

	for (l of menuLinks) {
		if (navMenu.classList.contains('_active')) {
			l.addEventListener('click', closeMenu)
		} else {
			l.removeEventListener('click', closeMenu)
		}
	}

}

const burgerButton = document.getElementById('burgerButton')

burgerButton.addEventListener('click', toggleMenu)

const removeModal = () => {
	const modalCloseButton = document.querySelector('.modal__close')
	const modal = document.querySelector('.modal')
	
	modalCloseButton.addEventListener('click', () => {
		modal.remove()
	})
}

const sendMail = (name, from, subj, text) => {
	const data = JSON.stringify({
	  "Messages": [{
		"From": {"Email": from, "Name": name},
		"To": [{"Email": 'artur012097.ax@gmail', "Name": 'Gmail'}],
		"Subject": subj,
		"TextPart": text
	  }]
	});

	const requestOptions = {
		mode: "cors",
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Basic ${btoa('944d87027a92e8d33bbf513297fc8aa7:faec3d6be8d9c9da26136b1931830914')})`
		},
		body: data,
	  };

	fetch("https://api.mailjet.com/v3.1/send", requestOptions)
	  .then(response => response.text())
	  .then(result => console.log(result))
	  .catch(error => console.log('error', error));
}

const createOrderModal = (name) => {
	const html = `
	<div class="modal">
		<div class="modal-content" data-model="${name}">
			<h4 class="modal__title">Забронировать</h4>
			<button class="modal__close">
				<img src="./assets/icons/close.svg" alt="Close" width="30" height="30">
			</button>
			<label for="modalName">Имя</label>
			<input type="text" id="modalName">
			<label for="modalNumber">Tелефон</label>
			<input type="text" id="modalNumber">
			<label for="modalMessage">Сообщение</label>
			<textarea type="text" id="modalMessage"></textarea>
			<button class="main-button modal-button" onclick="sendMail()">
				Забронировать
			</button>
		</div>
	</div>`

	document.body.insertAdjacentHTML('beforebegin', html)
	
	document.querySelector('.modal-button').addEventListener('click', () => {
		const authorName = document.getElementById('modalName').value
		const phone = document.getElementById('modalNumber').value
		const subj = `Заказать квадрацикл ${name}, Tелефон: ${phone}`
		const text = document.getElementById('modalMessage').value

		sendMail(authorName, null, subj, text)
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
			<label for="modalName">Имя</label>
			<input type="text" id="modalName">
			<label for="modalNumber">Tелефон</label>
			<input type="text" id="modalNumber">
			<button class="main-button">
				Заказать
			</button>
		</div>
	</div>`

	document.body.insertAdjacentHTML('beforebegin', html)

	removeModal()
}