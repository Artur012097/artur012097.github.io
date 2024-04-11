import { createIntro } from './createIntro.js'

const api = 'https://dev.easydev.group'
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzNTI5MTkxLCJpYXQiOjE3MTIyMzMxOTEsImp0aSI6ImI3OWM1OTFjOTFmNzQ2MzdhZTVlMTk4ODdlMGIyMjhjIiwidXNlcl9pZCI6MTQzfQ.3Jz4J3YAwSOlaJA2M2XQkATNnEesoLtB47H0ycobPeQ'

document.addEventListener('DOMContentLoaded', async () => {
	// create game intro page
	createIntro({ api, token })
})