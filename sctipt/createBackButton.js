import { createIntro } from './createIntro.js'
import { exitFullScreen } from './fullScreenHandlers.js'

const createBackButton = async (props) => {
	const button = `
	<button id="gameBack" class="absolute top-20 left-20 z-[1]">
		<img src="/public/icons/back-arrow.svg" alt="Back" />
	</button>`

	if (document.querySelector('#gameBack')) {
		document.querySelector('#gameBack').remove()
	}
	const wrapper = document.querySelector('.f-game')
	wrapper.insertAdjacentHTML('beforebegin', button)

	document.querySelector('#gameBack').addEventListener('click', async () => {
		await exitFullScreen()
		createIntro({
			api: props?.api,
			token: props?.token,
			refererCode: props?.refererCode
		})
	})
}

export { createBackButton }