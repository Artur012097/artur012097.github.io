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