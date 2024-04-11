import { createGame } from './createGame.js'
import { createShare } from './createShare.js'
import { createSpinner } from './createSpinner.js'

const levelIdent = 1000
// count of progress indicator
const indicatorsCount = 7

const createIntro = async (props) => {
	// user profile
	let currentProfile = null
	
	const getRouteParam = (idx) => {
		const route = window.location.href
		return route.split("/")[idx ?? 3];
	}
	// route ref code
	const refererCode = getRouteParam().includes('referer') ? getRouteParam().replace('referer', '').replace('?', '').replace('=', '') : null

	// calculate level
	const level = () => {
		return Math.ceil(currentProfile?.exp / levelIdent) || 1
	}

	// calculate target point
	const targetPoint = () => {
		let point = currentProfile?.exp ?? 0
		if (+currentProfile?.exp < 10) {
			point = +currentProfile?.exp * 100
		} else if (+currentProfile?.exp < 100) {
			point = +currentProfile?.exp * 10
		}

		return Math.ceil((point + 1) / 1000) * 1000
	}

	// calculate progress percentage
	const percentOfFill = () => {
		// Calculate the remaining experience points needed to reach the next level
		const remainingExp = targetPoint() - currentProfile?.exp
		// Calculate the percentage of the level that needs to be filled
		// Return the percentage of the level that needs to be filled
		return ((levelIdent - remainingExp) / levelIdent) * 100
	}

	// start round
	const startRound = async () => {
		const wrapper = document.querySelector('.f-game')
		createSpinner(wrapper)

		try {
			document.querySelector('.f-spinner').classList.remove('hidden')
			const game = await fetch(`${props?.api}/api/games/5d1afcb3/start_round/?referer=${refererCode ?? null}`, {
				headers: {
					Authorization: props?.token,
					"Content-Type": "application/json",
				},
			})
				.then(async res => await res.json())
			
				document.querySelector('.f-spinner').classList.add('hidden')
			if (game?.id) {
				document.querySelector('.f-game').innerHTML = ''
				createGame({ ...props, profile: currentProfile, gameData: game })
				return Boolean(game?.id)
			}
		} catch (e) {
			throw new Error(e)
		}
	}
	
	// get game profile
	const getProfile = async () => {
		try {
			document.querySelector('.f-spinner').classList.remove('hidden')
			const profile = await fetch(`${props?.api}/api/games/5d1afcb3/profile/${refererCode ? `?referer=${refererCode}` : ''}`, {
				headers: {
					Authorization: props?.token,
					"Content-Type": "application/json",
				},
			})
				.then(async res => res.json())
	
			document.querySelector('.f-spinner').classList.add('hidden')
			if (profile) {
				currentProfile = profile
				return profile
			}
			return null
		} catch (e) {
			throw new Error(e)
		}
	}

	
	// calculate filled index
	const filledIndex =
	() => percentOfFill() / (100 / indicatorsCount)

	// create spinner
	const wrapper = document.querySelector('.f-game')
	createSpinner(wrapper)
	// fetch profile
	await getProfile()

	wrapper.innerHTML = `<div class="f-intro w-full h-full relative flex-col flex justify-center items-center bg-opacity-50">
	<div class="f-intro__header flex items-center mb-30">
	  <img src="/public/icons/logo.svg" alt="Logo" width="38" height="38" />
	  <span class="text-[28px] f-semi text-white-100 ml-10"
		>Feed The Fennec</span
	  >
	</div>
	<div class="f-intro__content flex max-w-[280px] w-full">
	  <img
		src="/public/images/fennec.png"
		alt="Fennec"
		class="w-[142px] h-[228px]"
	  />
	  <div class="w-[130px] ml-8">
		<div class="level flex justify-between items-center mb-10">
		  <span class="text-[14px] f-semi text-white-100">L. ${level()} </span>
		  <span class="text-[14px] f-semi text-white-100"
			>${currentProfile?.exp ?? 0}/${targetPoint()}</span
		  >
		</div>
		<div class="food flex"></div>
		<button id="gameStartBtn" class="start w-full h-[48px] text-md text-white-100 rounded-sm bg-blue-100 mt-30">Feed</button>
	  </div>
	</div>
	<div class="f-intro__footer max-w-[280px] w-full p-20 bg-[#1A1A1A] bg-opacity-50 rounded-[6px] mt-[36px]">
	  <div class="flex justify-between">
		<span class="text-[14px] f-semi text-white-100">LuckyToken balance</span>
		<div class="flex items-end">
		  <img src="/public/icons/coin-icon.svg" alt="Coin icon" />
		  <span class="text-12 f-semi text-white-100">${currentProfile?.mined_coins ?? 0}</span>
		</div>
	  </div>
	  <span
		class="block text-12 leading-[16px] f-regular text-white-100 mt-10 mb-20"
		>In order to earn more Lucky Tokens and XP, invite your friends to feed
		the Fennek</span
	  >
	  <button class="claim w-full h-[34px] text-[14px] text-white-100 rounded-sm bg-blue-100">Claim to cryptowallet</button>
	  <button id="showRefs" class="refrals w-full h-[34px] text-[14px] text-white-100 rounded-sm bg-[#255FC0] mt-10">
		Look your farm of referrals
	  </button>
	</div>
  </div>`

	createIndicators(indicatorsCount, percentOfFill(), filledIndex(), startRound)
  document.querySelector('#showRefs').addEventListener('click', () => createShare({ ...props, profile: currentProfile }))

  
  const backButton = document.querySelector('#gameBack')
  if (backButton) backButton.style.display = 'none' 
}

const createIndicators = (count, percent, index, startFunc) => {
	for (let i = 0; i < count; i++) {
		const el = document.querySelector('.food')
		const icon = document.createElement('img')
		icon.setAttribute('alt', 'Progress')
		if (i === Math.round(index) &&
			percent % (100 / count) !== 0) {
			icon.setAttribute('src', '/public/icons/apple_half.svg')
		} else if (i <= Math.round(index)) {
			icon.setAttribute('src', '/public/icons/apple_full.svg')
		} else {
			icon.setAttribute('src', '/public/icons/apple_empty.svg')
		}

		el.append(icon)
	}

	const gameStart = document.querySelector('#gameStartBtn')
	gameStart.addEventListener('click', startFunc)
}


export { createIntro }