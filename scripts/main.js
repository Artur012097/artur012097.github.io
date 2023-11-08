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