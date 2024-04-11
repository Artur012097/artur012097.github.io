import { createBackButton } from './createBackButton.js';
import { createIntro } from './createIntro.js';

const createGame = (props) => {
	// user scored value
	let score = 0
	// block, that user started to move
	let firstTargetEvent = null

	// game config
	const config = {
		rowsCount: 7,
		colsCount: 7,

		gameWrapperBg: '#000000',
		gameHeaderBg: 'rgba(26, 26, 26, .5)',

		borderRadiusXs: 4,
		borderRadiusSm: 8,

		blockSize: 40,
		blockClass: 'food-block',
		blockIdPrefix: 'block',
		blockBg: '#1A1A1A',
		blockIcons: [
			'/public/icons/baozi.svg',
			'/public/icons/coffee.svg',
			'/public/icons/donut.svg',
			'/public/icons/milk.svg',
			'/public/icons/pizza.svg',
			'/public/icons/strawberry.svg',
		],

		gameState: '',
		gameStates: ['pick', 'switch', 'revert', 'remove', 'refill'],

		movingItems: 0,
		checking: false,
		targets: {},
	}
	// player game information
	const player = {
		selectedRow: -1,
		selectedCol: -1,
		posX: '',
		posY: '',
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
	}
	// coin information
	const coin = {
		coinGenerated: false,
		coinsCollected: 0,
		collected: false,
		canGenerate: props?.gameData?.coin,
	}
	// game components
	const components = {
		wrapper: document.querySelector('#wrapper'),
		container: document.createElement("div"),
		gWrapper: document.createElement("div"),
		cursor: document.createElement("div"),
		header: document.createElement("div"),
		footer: document.createElement("div"),
		timer: document.createElement("div"),
		score: document.createElement("div"),
		targets: document.createElement("div"),
		blocks: [],
	}
	// game timer
	const timer = {
		interval: null,
		time: 120,
	}

	const timeFormatter = (seconds) => {
		if (typeof seconds === 'number') {
			const m = Math.floor(Math.round(seconds) / 60)
			const s = seconds % 60

			return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
		}
	}
	// Create game page
	const createGamePage = () => {
		components.container.classList.add('f-game-container')
		components.container.style.height = "100vh";
		components.container.style.overflow = "hidden";
		components.container.style.display = "flex";
		components.container.style.flexDirection = "column";
		components.container.style.alignItems = "center";
		components.container.style.justifyContent = "center";

		components.wrapper.append(components.container);
	}

	// Create game wrapper
	const createGameWrapper = () => {
		components.gWrapper.classList.add('f-game-wrapper')
		components.gWrapper.style.width = `${config.blockSize * config.rowsCount}px`
		components.gWrapper.style.height = `${config.blockSize * config.colsCount}px`
		components.gWrapper.style.position = 'relative'
		components.gWrapper.style.backgroundColor = config.gameWrapperBg
		components.gWrapper.style.borderRadius = `${config.borderRadiusXs}px`
		components.gWrapper.style.marginTop = '10px'

		components.gWrapper.addEventListener('mousedown', handleSwipeStart)
		components.gWrapper.addEventListener('touchstart', handleSwipeStart)
		components.gWrapper.addEventListener('mouseup', handleSwipeEnd)
		components.gWrapper.addEventListener('touchend', handleSwipeEnd)
		components.container.append(components.gWrapper)
		// click to work, put it aside for now
		// components.gWrapper.addEventListener("click", handlerTab);
	}

	// Creating a cursor for selecting coins
	const createCursor = () => {
		components.cursor.id = 'marker'
		components.cursor.style.width = config.blockSize - 2 + 'px'
		components.cursor.style.height = config.blockSize - 2 + 'px'
		components.cursor.style.border = '1px solid white'
		components.cursor.style.borderRadius = '2px'
		components.cursor.style.position = 'absolute'
		components.cursor.style.display = 'none'

		components.gWrapper.append(components.cursor)
	}

	// Create game complete stage
	const createGameComplete = () => {
		const htmlWithCoin = `
		<div
          class="w-full h-full flex flex-col justify-center items-center absolute z-[1] bg-black-100 bg-opacity-85 rounded-[8px]"
        >
		<h3 class="text-[28px] f-semi text-[#FEDA2C] mb-[30px]">
              Congratulations!
            </h3>
            <p class="text-[12px] leading-[16px] text-[#ffffff] mb-[10px]">
              You've just received
            </p>
            <div class="flex items-center">
              <span class="text-[20px] leading-[28px] text-[#ffffff]"
                >LuckyToken</span
              >
              <div class="flex items-end ml-[10px]">
                <img src="/public/icons/coin-icon.svg" alt="Coin icon" />
                <span class="text-[12px] leading-[16px] text-[#ffffff]">${coin.coinsCollected}</span>
              </div>
            </div>
            <div class="flex items-center gap-[20px] mt-[40px]">
              <button
                class="w-[50px] h-[50px] rounded-sm bg-[#1E3384] flex justify-center items-center"
				id="repeatBtn"
              >
                <img src="/public/icons/repeat.svg" alt="Repeat" />
              </button>
              <button
                class="w-[50px] h-[50px] rounded-[8px] bg-[#1E3384] flex justify-center items-center"
				id="backBtn"
              >
                <img src="/public/icons/play.svg" alt="Play" />
              </button>
            </div>
		</div>
		`
		const htmlWithoutCoin = `
		<div
          class="w-full h-full flex flex-col justify-center items-center absolute z-[1] bg-black-100 bg-opacity-85 rounded-[8px]"
        >
		<img src="/public/images/smile_face.png" alt="Smile" />
		<h3 class="text-[36px] f-semy text-white-100 mt-[10px] mb-[20px]">
		  Completed!
		</h3>
		<div class="flex items-center gap-[20px]">
		  <button
			class="w-[50px] h-[50px] rounded-[8px] bg-[#1E3384] flex justify-center items-center"
			id="repeatBtn"
		  >
			<img src="/public/icons/repeat.svg" alt="Repeat" />
		  </button>
		  <button
			class="w-[50px] h-[50px] rounded-sm bg-[#1E3384] flex justify-center items-center"
			id="backBtn"
		  >
			<img src="/public/icons/play.svg" alt="Play" />
		  </button>
		</div>
		</div>
		`

		components.gWrapper.insertAdjacentHTML('afterbegin', coin.coinsCollected > 0 && coin.collected ? htmlWithCoin : htmlWithoutCoin)
		const repeatBtn = document.querySelector('#repeatBtn')
		const backBtn = document.querySelector('#backBtn')

		if (repeatBtn) repeatBtn.addEventListener('click', () => repeatGame())
		if (backBtn) backBtn.addEventListener('click', () => backToIntro())
	}

	// Show cursor
	// const cursorShow = () => {
	//   components.cursor.style.display = 'block'
	// }

	// // Hide cursor
	// const cursorHide = () => {
	//   components.cursor.style.display = 'none'
	// }

	// Creating a block
	const createBlock = (t, l, row, col, img) => {
		const block = document.createElement('div')

		block.classList.add(config.blockClass)
		block.id = `${config.blockIdPrefix}_${row}_${col}`
		block.style.boxSizing = 'border-box'
		block.style.cursor = 'pointer'
		block.style.position = 'absolute'
		block.style.top = t + 'px'
		block.style.left = l + 'px'
		block.style.width = `${config.blockSize - 2}px`
		block.style.height = `${config.blockSize - 2}px`
		block.style.border = '1px solid transparent'
		block.style.backgroundColor = config.blockBg
		block.style.borderRadius = `${config.borderRadius}px`
		block.style.backgroundImage = `url(${img})`
		block.style.backgroundSize = 'contain'
		block.style.backgroundRepeat = 'no-repeat'
		block.style.backgroundPosition = 'center'

		components.gWrapper.append(block)
	}

	// Creating and populating the grid for blocks
	const createGameGrid = () => {
		// Creating an empty grid
		for (let i = 0; i < config.rowsCount; i++) {
			components.blocks[i] = []
			for (let j = 0; j < config.colsCount; j++) {
				components.blocks[i][j] = -1
			}
		}

		// Populating the grid
		for (let i = 0; i < config.rowsCount; i++) {
			for (let j = 0; j < config.colsCount; j++) {
				do {
					components.blocks[i][j] = Math.floor(Math.random() * 6)
				} while (isStreak(i, j))

				createBlock(
					i * config.blockSize,
					j * config.blockSize,
					i,
					j,
					config.blockIcons[components.blocks[i][j]],
				)
			}
		}
	}

	// Create game header
	const createGameHeader = () => {
		components.header.style.width = 282 + "px";
		components.header.style.display = "flex";
		components.header.style.flexDirection = "column";
		components.header.style.justifyContent = "center";
		components.header.style.alignItems = "center";
		components.header.style.backgroundColor = config.gameHeaderBg;
		components.header.style.padding = '10px 0'
		components.header.style.borderRadius = `${config.borderRadiusSm}px`

		components.header.style.fontFamily = "sans-serif";
		components.header.style.fontSize = "16px";
		components.header.style.color = "#ffffff";

		components.score.classList.add("score")
		components.timer.classList.add("timer")
		components.targets.classList.add("targets")
		// components.header.append(components.score)
		// components.header.append(components.timer)
		// components.header.append(components.targets)
		components.container.append(components.header)

		updateGameHeader()
	}

	// Create game score
	const createGameScore = () => {
		components.score.innerHTML = `Score: ${score}`

		components.score.style.display = 'flex'
		components.score.style.alignItems = 'center'
		components.score.style.fontsize = '16px'
		components.score.style.fontWeight = '600'
		components.score.style.marginBottom = '10px'
		components.header.append(components.score)
	}

	// Create game timer
	const createGameTimer = () => {
		components.timer.innerHTML = ''
		const icon = document.createElement("img");
		const time = document.createElement("span");
		time.style.fontSize = '44px'
		time.style.lineHeight = '56px'
		time.style.marginLeft = '5px'
		icon.setAttribute('src', '/public/icons/time.svg');
		time.innerHTML = timeFormatter(timer.time)

		components.timer.append(icon)
		components.timer.append(time)
		components.timer.style.display = 'flex'
		components.timer.style.alignItems = 'center'
		components.timer.style.fontWeight = '600'
		components.header.append(components.timer)
	}

	// Create game targets
	const createGameTargets = () => {
		components.targets.innerHTML = ''

		const targets = document.createElement('div')
		targets.style.display = 'flex'
		targets.style.alignItems = 'center'
		targets.style.gap = '10px'
		targets.style.marginTop = '10px'

		const targetsText = document.createElement('span')
		targetsText.style.marginRight = '10px'
		targetsText.innerHTML = 'Targets'
		targets.appendChild(targetsText)

		for (const [key, value] of Object.entries(config.targets)) {
			const target = document.createElement('div')
			target.style.display = 'flex'
			target.style.alignItems = 'flex-end'

			const icon = document.createElement('img')
			icon.setAttribute('width', 24)
			icon.setAttribute('height', 24)
			icon.setAttribute('src', config.blockIcons[key])

			const score = document.createElement('span')
			score.style.fontSize = '12px'
			score.style.fontWeight = '600'
			score.innerHTML = value

			target.append(icon)
			target.append(score)
			targets.append(target)
		}
		components.targets.append(targets)
		components.header.append(components.targets);
	}

	// Create game footer
	const createGameFooter = () => {
		components.footer.innerHTML = ''
		const title = document.createElement('span')
		const icon = document.createElement('img')
		const value = document.createElement('span')
		const wrapper = document.createElement('div')

		title.style.fontSize = '20px'
		title.style.lineHeight = '30px'
		title.style.fontWeight = '600'
		title.style.color = '#fff'
		title.style.marginRight = '30px'
		title.innerText = 'Mysterious target'

		value.style.fontSize = '12px'
		value.style.lineHeight = '14.5px'
		value.style.fontWeight = '600'
		value.style.color = '#fff'
		value.innerHTML = coin.coinsCollected

		icon.setAttribute('src', '/public/icons/coin-icon.svg')

		wrapper.style.display = 'flex'
		wrapper.style.alignItems = 'flex-end'
		wrapper.append(icon)
		wrapper.append(value)

		components.footer.style.width = 282 + "px";
		components.footer.style.display = "flex";
		components.footer.style.justifyContent = "center";
		components.footer.style.alignItems = "center";
		components.footer.style.backgroundColor = config.gameHeaderBg;
		components.footer.style.padding = '10px 0'
		components.footer.style.borderRadius = `${config.borderRadiusSm}px`
		components.footer.style.marginTop = '10px'

		components.footer.append(title)
		components.footer.append(wrapper)
		components.container.append(components.footer)
	}

	// Обновить очки на странице
	const updateGameHeader = () => {
		createGameScore()
		createGameTimer()
		createGameTargets()
	}

	// Checking for a group collection
	const isStreak = (row, col) => {
		return isVerticalStreak(row, col) || isHorizontalStreak(row, col)
	}

	// Checking for a vertical group collection
	const isVerticalStreak = (row, col) => {
		const blockValue = components.blocks[row][col]
		let streak = 0
		let tmp = row

		while (
			tmp > 0 &&
			(components.blocks[tmp - 1][col] === blockValue || blockValue === 7)
		) {
			streak++
			tmp--
		}

		tmp = row

		while (
			tmp < config.rowsCount - 1 &&
			(components.blocks[tmp + 1][col] === blockValue || blockValue === 7)
		) {
			streak++
			tmp++
		}

		return streak > 1
	}

	// Checking for a horizontal group collection
	const isHorizontalStreak = (row, col) => {
		const blockValue = components.blocks[row][col]
		let streak = 0
		let tmp = col

		while (
			tmp > 0 &&
			(components.blocks[row][tmp - 1] === blockValue || blockValue === 7)
		) {
			streak++
			tmp--
		}

		tmp = col

		while (
			tmp < config.colsCount - 1 &&
			(components.blocks[row][tmp + 1] === blockValue || blockValue === 7)
		) {
			streak++
			tmp++
		}

		return streak > 1
	}

	// Add bonus block
	const addBonusCoin = () => {
		if (coin.canGenerate) {
			// get random row
			const row = getRandomRow()
			// get ranwom column
			const col = getRandomColumn()
			// get element, that placed on that coordinats
			const el = document.querySelector(`#${config.blockIdPrefix}_${row}_${col}`)
			// remove the element
			el.remove()
			// create new element and push it to the prev element place
			createBlock(
				row * config.blockSize,
				col * config.blockSize,
				row,
				col,
				'/public/icons/coin-icon.svg',
			)
			// add value for block
			components.blocks[row][col] = 7
			// chenage state, that coin is already generated
			coin.coinGenerated = true
		}
	}

	// Generate random targets
	const generateTargets = () => {
		let targetsCount = 3
		const chosenIndexes = []

		while (targetsCount > 0) {
			let random = Math.floor(Math.random() * config.blockIcons.length)

			// check, if the random index is already in array
			while (chosenIndexes.includes(random)) {
				random = Math.floor(Math.random() * config.blockIcons.length)
			}

			// add index to indexses array to check
			chosenIndexes.push(random)

			// set new target with value
			config.targets[random] = 10
			targetsCount--
		}
	}

	// Score increment function
	const scoreIncrement = (count) => {
		// if coincidences count mote than 4 (equal 5 or more blocks in line),
		// add 15 points
		// for > 3 (equal 4 blocks in line)
		// add 10 points
		// fos > 2 (equal default 3 blocks in line)
		// add 5 points
		if (count >= 4) {
			score += 15
		} else if (count >= 3) {
			score += 10
		} else {
			score += 5
		}
		updateGameHeader()
	}

	// Get random row
	const getRandomRow = () => {
		return Math.floor(Math.random() * config.rowsCount)
	}

	// Get random column
	const getRandomColumn = () => {
		return Math.floor(Math.random() * config.colsCount)
	}

	// Swipe start action
	const handleSwipeStart = (event) => {
		if (config.checking) return
		// Save the initial targeted element
		firstTargetEvent = event
		// Remember the initial swipe coordinates
		player.startX =
			event.type === 'touchstart' ? event.touches[0].clientX : event.clientX
		player.startY =
			event.type === 'touchstart' ? event.touches[0].clientY : event.clientY
	}

	// Swipe end action
	const handleSwipeEnd = (event) => {
		if (
			config.checking ||
			!firstTargetEvent ||
			![...firstTargetEvent?.target?.classList]?.includes(
				config.blockClass,
			)
		)
			return
		// Get the final swipe coordinates
		player.endX =
			event.type === 'touchend' ? event.changedTouches[0].clientX : event.clientX
		player.endY =
			event.type === 'touchend' ? event.changedTouches[0].clientY : event.clientY

		// Calculate the swipe distance horizontally and vertically
		const deltaX = player.endX - player.startX
		const deltaY = player.endY - player.startY

		// Determine the swipe direction
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			// Horizontal swipe
			if (deltaX > 5) {
				// Swipe right
				handlerSwipe(firstTargetEvent, 'right')
			} else if (deltaX < -5) {
				// Swipe left
				handlerSwipe(firstTargetEvent, 'left')
			}
		} else if (deltaY > 5) {
			// Swipe down
			handlerSwipe(firstTargetEvent, 'down')
		} else if (deltaY < -5) {
			// Swipe up
			handlerSwipe(firstTargetEvent, 'up')
		}
	}

	// Swipe handler
	const handlerSwipe = async (targetEvent, position) => {
		config.checking = true
		const target = targetEvent?.target
		if (target.classList.contains(config.blockClass) && config.gameStates[0]) {
			// Determine row and column
			let row = parseInt(target.getAttribute('id').split('_')[1])
			let col = parseInt(target.getAttribute('id').split('_')[2])

			// Save the selection of the first position
			player.selectedRow = row
			player.selectedCol = col

			// After selection, change the game state
			config.gameState = config.gameStates[1]

			// Check the direction of the swipe
			// If swiped left, decrease the column selected by 1
			// If swiped right, increase the column selected by 1
			// If swiped up, decrease the row selected by 1
			// If swiped down, increase the row selected by 1
			switch (position) {
				case 'left':
					col--
					break
				case 'right':
					col++
					break
				case 'up':
					row--
					break
				case 'down':
					row++
					break
			}
			player.posX = col >= 0 ? col : 0
			player.posY = row >= 0 ? row : 0

			// Swap the blocks
			await swapBlocks()
		}
	}

	// Swap blocks
	const swapBlocks = async () => {
		const yOffset = player.selectedRow - player.posY
		const xOffset = player.selectedCol - player.posX

		// Mark blocks to move
		document
			.querySelector(
				`#${config.blockIdPrefix}_${player.selectedRow}_${player.selectedCol}`,
			)
			.classList.add('switch')
		document
			.querySelector(
				`#${config.blockIdPrefix}_${player.selectedRow}_${player.selectedCol}`,
			)
			.setAttribute('dir', '-1')

		document
			.querySelector(`#${config.blockIdPrefix}_${player.posY}_${player.posX}`)
			.classList.add('switch')
		document
			.querySelector(`#${config.blockIdPrefix}_${player.posY}_${player.posX}`)
			.setAttribute('dir', '1')

		// Swap blocks
		await $('.switch').each(function () {
			config.movingItems++

			$(this).animate(
				{
					left: `+=${xOffset * config.blockSize * $(this).attr('dir')}`,
					top: `+=${yOffset * config.blockSize * $(this).attr('dir')}`,
				},
				{
					duration: 200,
					complete: function () {
						// Check the availability of the move
						checkMoving()
					},
				},
			)

			$(this).removeClass('switch')
		})

		// Swap identifiers
		document
			.querySelector(
				`#${config.blockIdPrefix}_${player.selectedRow}_${player.selectedCol}`,
			)
			.setAttribute('id', 'temp')
		document
			.querySelector(`#${config.blockIdPrefix}_${player.posY}_${player.posX}`)
			.setAttribute(
				'id',
				`${config.blockIdPrefix}_${player.selectedRow}_${player.selectedCol}`,
			)
		document
			.querySelector('#temp')
			.setAttribute('id', `${config.blockIdPrefix}_${player.posY}_${player.posX}`)

		// Swap blocks in the grid
		const temp = components.blocks[player.selectedRow][player.selectedCol]
		components.blocks[player.selectedRow][player.selectedCol] =
			components.blocks[player.posY][player.posX]
		components.blocks[player.posY][player.posX] = temp
	}

	// Check moved blocks
	const checkMoving = () => {
		config.checking = true
		config.movingItems--

		// Actions after all moves
		if (config.movingItems === 0) {
			// Actions depending on the game state
			switch (config.gameState) {
				// After block movement, check for appearing streaks
				case config.gameStates[1]:
				case config.gameStates[2]:
					// Check for appearing streaks
					if (
						!isStreak(player.selectedRow, player.selectedCol) &&
						!isStreak(player.posY, player.posX)
					) {
						// If there are no streaks, revert the move
						// If the move is already being reverted, return to the initial selection state
						if (config.gameState !== config.gameStates[2]) {
							config.gameState = config.gameStates[2]
							swapBlocks()
						} else {
							config.checking = false
							firstTargetEvent = null
							config.gameState = config.gameStates[0]
							player.selectedRow = -1
							player.selectedCol = -1
						}
					} else {
						// If there are streaks, remove them
						config.gameState = config.gameStates[3]

						// Mark all blocks to remove
						if (isStreak(player.selectedRow, player.selectedCol)) {
							markRemovingBlocks(player.selectedRow, player.selectedCol)
						}

						if (isStreak(player.posY, player.posX)) {
							markRemovingBlocks(player.posY, player.posX)
						}

						// Remove from the field
						removeBlocksFromDOM()
					}
					break
				// After removal, fill the empty spaces
				case config.gameStates[3]:
					checkFalling()
					break
				case config.gameStates[4]:
					placeNewBlocks()
					break
			}
		}
	}

	// Fill the empty spaces
	const checkFalling = () => {
		let fellDown = 0

		for (let j = 0; j < config.colsCount; j++) {
			for (let i = config.rowsCount - 1; i > 0; i--) {
				if (components.blocks[i][j] === -1 && components.blocks[i - 1][j] >= 0) {
					document
						.querySelector(`#${config.blockIdPrefix}_${i - 1}_${j}`)
						.classList.add('fall')
					document
						.querySelector(`#${config.blockIdPrefix}_${i - 1}_${j}`)
						.setAttribute('id', `${config.blockIdPrefix}_${i}_${j}`)
					components.blocks[i][j] = components.blocks[i - 1][j]
					components.blocks[i - 1][j] = -1
					fellDown++
				}
			}
		}

		$('.fall').each(function () {
			config.movingItems++

			$(this).animate(
				{
					top: '+=' + config.blockSize,
				},
				{
					duration: 70,
					complete: function () {
						$(this).removeClass('fall')
						checkMoving()
					},
				},
			)
		})

		// If all elements have moved down,
		// change the game state
		if (fellDown === 0) {
			config.gameState = config.gameStates[4]
			config.movingItems = 1
			checkMoving()
		}
	}

	// Mark blocks for removal and remove them from the grid
	const markRemovingBlocks = (row, col) => {
		let removedBlocksCount = 0
		const blockValue = components.blocks[row][col]
		let tmp = row

		document
			.querySelector(`#${config.blockIdPrefix}_${row}_${col}`)
			.classList.add('remove')

		if (isVerticalStreak(row, col)) {
			tmp = row

			while (
				tmp > 0 &&
				(components.blocks[tmp - 1][col] === blockValue || blockValue === 7)
			) {
				document
					.querySelector(`#${config.blockIdPrefix}_${tmp - 1}_${col}`)
					.classList.add('remove')
				components.blocks[tmp - 1][col] = -1
				tmp--
				removedBlocksCount++
			}

			tmp = row

			while (
				tmp < config.rowsCount - 1 &&
				(components.blocks[tmp + 1][col] === blockValue || blockValue === 7)
			) {
				document
					.querySelector(`#${config.blockIdPrefix}_${tmp + 1}_${col}`)
					.classList.add('remove')
				components.blocks[tmp + 1][col] = -1
				tmp++
				removedBlocksCount++
			}
		}

		if (isHorizontalStreak(row, col)) {
			tmp = col

			while (
				tmp > 0 &&
				(components.blocks[row][tmp - 1] === blockValue || blockValue === 7)
			) {
				document
					.querySelector(`#${config.blockIdPrefix}_${row}_${tmp - 1}`)
					.classList.add('remove')
				components.blocks[row][tmp - 1] = -1
				tmp--
				removedBlocksCount++
			}

			tmp = col

			while (
				tmp < config.colsCount - 1 &&
				(components.blocks[row][tmp + 1] === blockValue || blockValue === 7)
			) {
				document
					.querySelector(`#${config.blockIdPrefix}_${row}_${tmp + 1}`)
					.classList.add('remove')
				components.blocks[row][tmp + 1] = -1
				tmp++
				removedBlocksCount++
			}
		}

		if (components.blocks[row][col] === 7) {
			coin.collected = true
			coin.coinsCollected++
			createGameFooter()
		}
		components.blocks[row][col] = -1
		if (
			config.targets[blockValue] !== undefined &&
			config.targets[blockValue] > 0
		) {
			config.targets[blockValue] - (removedBlocksCount + 1) <= 0
				? (config.targets[blockValue] = 0)
				: (config.targets[blockValue] -= removedBlocksCount + 1)
		}
		scoreIncrement(removedBlocksCount)
	}

	// Remove blocks
	const removeBlocksFromDOM = () => {
		$('.remove').each(function () {
			config.movingItems++

			$(this).animate(
				{
					opacity: 0,
				},
				{
					duration: 100,
					complete: function () {
						$(this).remove()
						checkMoving()
					},
				},
			)
		})
	}

	// Create new blocks
	const placeNewBlocks = () => {
		let blocksPlaced = 0

		// Find places to create blocks
		for (let i = 0; i < config.colsCount; i++) {
			if (components.blocks[0][i] === -1) {
				components.blocks[0][i] = Math.floor(Math.random() * 6)

				createBlock(
					0,
					i * config.blockSize,
					0,
					i,
					config.blockIcons[components.blocks[0][i]],
				)
				blocksPlaced++
			}
		}

		// If blocks are created, check if they need to be moved down.
		if (blocksPlaced) {
			config.gameState = config.gameStates[3]
			checkFalling()
		} else {
			// Check for streaks
			let combo = 0

			for (let i = 0; i < config.rowsCount; i++) {
				for (let j = 0; j < config.colsCount; j++) {
					if (
						j <= config.colsCount - 3 &&
						components.blocks[i][j] === components.blocks[i][j + 1] &&
						components.blocks[i][j] === components.blocks[i][j + 2]
					) {
						combo++
						markRemovingBlocks(i, j)
					}
					if (
						i <= config.rowsCount - 3 &&
						components.blocks[i][j] === components.blocks[i + 1][j] &&
						components.blocks[i][j] === components.blocks[i + 2][j]
					) {
						combo++
						markRemovingBlocks(i, j)
					}
				}
			}

			// Remove found streaks
			if (combo > 0) {
				config.gameState = config.gameStates[3]
				removeBlocksFromDOM()
			} else {
				// Start the main game state
				config.checking = false
				firstTargetEvent = null
				config.gameState = config.gameStates[0]
				player.selectedRow = -1
			}
		}
	}

	// Check game result
	const checkResults = async () => {
		if (timer.time === 0) {
			// remove swipe listeners when gime time is out
			components.gWrapper.removeEventListener('mousedown', handleSwipeStart)
			components.gWrapper.removeEventListener('touchstart', handleSwipeStart)
			components.gWrapper.removeEventListener('mouseup', handleSwipeEnd)
			components.gWrapper.removeEventListener('touchend', handleSwipeEnd)
			// check game targets, if there are not collected, game score will bie 0
			if (Object.values(config.targets).some((i) => +i !== 0)) score = 0
			clearTimer()
			await setRoundResults()
		}
	}

	// Start timer
	const startTimer = () => {
		const currentTimer = timer.time
		timer.interval = setInterval(() => {
			if (timer.time === 0) {
				clearTimer()
				checkResults()
				return
			}
			// if the game time is near half, check and add bonus coin
			if (timer.time === Math.round(currentTimer / 2 + 10)) {
				// random time betwen 1 and 20 seconds to generace bonus coin
				const randomTime = Math.floor(Math.random() * 20000)
				// generate bonus coin if
				// it isn't collected in the game 
				// adn
				// it isn't generated yet
				// and
				// it can generate
				if (!coin.collected && !coin.coinGenerated && coin.canGenerate)
					setTimeout(addBonusCoin, randomTime)
			}
			--timer.time
			updateGameHeader()
		}, 1000)
	}

	// Start round
	const startRound = async () => {
		try {
			const game = await fetch(`${props?.api}/api/games/5d1afcb3/start_round/?referer=${props?.profile?.ref_code ?? null}`, {
				headers: {
					Authorization: props?.token,
					"Content-Type": "application/json",
				},
			})
				.then(async res => await res.json())
	
			if (game?.id) {
				document.querySelector('.f-game').innerHTML = ''
				props.gameData = game
				initGame()
				return Boolean(game?.id)
			}
		} catch (e) {
			throw new Error(e)
		}
	}

	// Save game results
	const setRoundResults = async () => {
		try {
			const payload = {
				id: props?.gameData?.id,
				experience: score,
				gotCoin: coin.collected,
				referer: props?.refererCode ?? null,
			}
			const saved = await fetch(`${props?.api}/api/games/5d1afcb3/set_result/`, {
				headers: {
					Authorization: props?.token,
					"Content-Type": "application/json",
				},
				method: 'POST',
				body: JSON.stringify(payload)
			})
				.then(async res => await res.json())

			// clear wrapper
			if (saved?.status?.toLowerCase() === 'success') {
				createGameComplete()
				return saved?.status?.toLowerCase() === 'success'
			}
		} catch (e) {
			throw new Error(e)
		}
	}

	// Clear timer
	const clearTimer = () => {
		clearInterval(timer.interval)
		timer.interval = null
	}

	const clearData = () => {
		clearTimer()
		config.targets = {}
		config.checking = false
		timer.interval = null
		timer.time = 120
	}

	const clearWrapper = () => {
		components.container.removeEventListener('mousedown', handleSwipeStart)
		components.container.removeEventListener('touchstart', handleSwipeStart)
		components.container.removeEventListener('mouseup', handleSwipeEnd)
		components.container.removeEventListener('touchend', handleSwipeEnd)
		components.container.innerHTML = ''
		components.blocks = []
	}

	const repeatGame = async () => {
		clearData()
		clearWrapper()
		await startRound()
	}

	const backToIntro = async () => {
		clearData()
		clearWrapper()
		createIntro({
			api: props?.api,
			token: props?.token,
		})
	  }

	// Initialize all game components
	const initGame = () => {
		generateTargets()

		// create the game container
		createGamePage()
		// create the game header
		createGameHeader()
		// create the game wrapper
		createGameWrapper()
		// create the game grid (2-dimensional array)
		createGameGrid()
		// create the game footer
		createGameFooter()
		// create the game cursor
		createCursor()
		// create back button
		createBackButton(props)
		// start game timer
		startTimer()
		// switch the game state to "selection"
		config.gameState = config.gameStates[0]
	}

	if (props?.profile) initGame()
}

export { createGame }