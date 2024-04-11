const fullScreenHandler = async () => {
	const element = document.body
	const requestMethod =
	  element.requestFullScreen ||
	  element.webkitRequestFullScreen ||
	  element.mozRequestFullScreen ||
	  element.msRequestFullScreen
	if (requestMethod) {
	  requestMethod.call(element)
	}
}

const exitFullScreen = async () => {
	const requestMethod =
	document.exitFullscreen ||
	document.webkitExitFullscreen ||
	document.mozExitFullscreen ||
	document.msExitFullscreen
	
	if (document && document.fullscreenElement && requestMethod) {
		await requestMethod.call(document)
	  }
}

export { fullScreenHandler, exitFullScreen }