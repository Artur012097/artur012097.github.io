import { share } from './shareLinks.js'
import { createBackButton } from './createBackButton.js'

const referals = [
	{
		id: 0,
		pie: 0.05,
	},
	{
		id: 0,
		pie: 0.025,
	},
	{
		id: 0,
		pie: 0.0125,
	},
	{
		id: 0,
		pie: 0.00625,
	},
]
const social = ['facebook', 'twitter', 'linkedin', 'telegram', 'whatsapp']
let isCopied = false

const copyAddress = (address) => {
	if (isCopied) {
	  return
	}

	if (window) {
	  navigator?.clipboard?.writeText(address)
	}
	const button = document.querySelector('.f-input')

	isCopied = true
	const check = button.querySelector('[data-name="checkmark"]')
	const copy = button.querySelector('[data-name="copy"]')

	copy.classList.add('hidden')
	check.classList.remove('hidden')
	setTimeout(() => {
		isCopied = false
		copy.classList.remove('hidden')
		check.classList.add('hidden')
	}, 1500)
  }
// Create share page
const createShare = (props) => {
	// const chance = 0.00001

	const nickname = () => `@${props?.profile?.nickname ?? ''}`
	const fio = () => props?.profile?.name
	const avatar = () => props?.profile?.avatar?.default?.thumbs?.['40x40'] ??
	props?.profile?.avatar?.default?.orig_file ??
	props?.profile?.avatar?.default?.url

	const url =
		() =>
			`https://frontend-dev.easydev.group/fennec/?referer=${props?.profile?.ref_code ?? props?.referer ?? ''
			}`

	const wrapper = document.querySelector('.f-game')
	wrapper.innerHTML = `<div class="f-share w-full h-full relative flex-col flex justify-center items-center bg-opacity-50">
	<div class="f-share__header max-w-[280px] w-full flex flex-col items-center p-20 bg-[#1A1A1A] bg-opacity-50 rounded-sm mb-10">
    <div class="w-full">
		<h3 class="text-[14px] f-semi text-white-100 mb-4 text-center">Invite your friends</h3>
		<div class="f-social-share flex justify-center gap-10"></div>
			<div class="f-input w-full relative py-10">
			<input
				value="${url()}"
				readonly
				class="w-full h-[36px] rounded-xs bg-black-100 mt-2 border-none f-regular text-sm text-white-100 px-10 pr-40"
			>
			<button class="absolute top-18 right-8">
				<svg
					data-name="copy"
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
					d="M4.16675 12.5C3.39018 12.5 3.00189 12.5 2.69561 12.3731C2.28723 12.204 1.96277 11.8795 1.79362 11.4711C1.66675 11.1649 1.66675 10.7766 1.66675 10V4.33334C1.66675 3.39992 1.66675 2.93321 1.8484 2.57669C2.00819 2.26308 2.26316 2.00812 2.57676 1.84833C2.93328 1.66667 3.39999 1.66667 4.33341 1.66667H10.0001C10.7767 1.66667 11.1649 1.66667 11.4712 1.79354C11.8796 1.9627 12.2041 2.28715 12.3732 2.69553C12.5001 3.00182 12.5001 3.3901 12.5001 4.16667M10.1667 18.3333H15.6667C16.6002 18.3333 17.0669 18.3333 17.4234 18.1517C17.737 17.9919 17.992 17.7369 18.1518 17.4233C18.3334 17.0668 18.3334 16.6001 18.3334 15.6667V10.1667C18.3334 9.23325 18.3334 8.76654 18.1518 8.41002C17.992 8.09642 17.737 7.84145 17.4234 7.68166C17.0669 7.50001 16.6002 7.50001 15.6667 7.50001H10.1667C9.23333 7.50001 8.76662 7.50001 8.4101 7.68166C8.09649 7.84145 7.84153 8.09642 7.68174 8.41002C7.50008 8.76654 7.50008 9.23325 7.50008 10.1667V15.6667C7.50008 16.6001 7.50008 17.0668 7.68174 17.4233C7.84153 17.7369 8.09649 17.9919 8.4101 18.1517C8.76662 18.3333 9.23333 18.3333 10.1667 18.3333Z"
					stroke="white"
					stroke-linecap="round"
					stroke-linejoin="round"
					/>
				</svg>
				<svg
					data-name="checkmark"
					width="24"
					height="25"
					viewBox="0 0 24 25"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="hidden"
				>
					<path
					d="M20.3536 6.85355C20.5488 6.65829 20.5488 6.34171 20.3536 6.14645C20.1583 5.95118 19.8417 5.95118 19.6464 6.14645L20.3536 6.85355ZM9 17.5L8.64645 17.8536C8.84171 18.0488 9.15829 18.0488 9.35355 17.8536L9 17.5ZM4.35355 12.1464C4.15829 11.9512 3.84171 11.9512 3.64645 12.1464C3.45118 12.3417 3.45118 12.6583 3.64645 12.8536L4.35355 12.1464ZM19.6464 6.14645L8.64645 17.1464L9.35355 17.8536L20.3536 6.85355L19.6464 6.14645ZM9.35355 17.1464L4.35355 12.1464L3.64645 12.8536L8.64645 17.8536L9.35355 17.1464Z"
					fill="#FFFFFF"
					/>
				</svg>
				</button>
			</div>
			</div>
		</div>
      <div class="f-share__table max-w-[280px] w-full p-20 bg-[#1A1A1A] bg-opacity-50 rounded-sm">
    <div class="f-share__table-user flex items-center">
      <img
        src="${avatar()}"
        class="w-[34px] h-[34px] mr-8 rounded-full overflow-hidden"
        :alt="${nickname()}"
        :title="${nickname()}"
        :width="34"
        :height="34"
      />
      <div>
        <h4 class="text-[14px] leading-20 f-semi text-white-100">
          ${ fio() }
        </h4>
        <p class="text-[10px] leading-[14px] f-regular text-white-100">
          ${ nickname() }
        </p>
      </div>
    </div>
    <table class="w-full mt-24">
      <thead>
        <tr>
          <th class="text-[10px] leading-[12px] f-regular text-white-100 bg-[#1A1A1A] p-8 border-[1px] border-black-100">
            Referer level
          </th>
          <th class="text-[10px] leading-[12px] f-regular text-white-100 bg-[#1A1A1A] p-8 border-[1px] border-black-100">
            Shared Lucky Coin
          </th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  </div>`

  document.querySelector('.f-input').addEventListener('click', () => copyAddress(url()))

  createShareIcons(url())
  createTable()
  createBackButton(props)
}
// Creeate share page share icons
const createShareIcons = (url) => {
	const shareWrapper = document.querySelector('.f-social-share')
	
	for (let i = 0; i < social.length; i++) {
		const html = `
		<button class="f-share-button">
			<img
			src="/public/icons/social/${social[i]}.svg"
			title="Twitter"
			alt="Twitter"
			width="24"
			height="24"
			class="w-lg h-lg"
			/>
		</button>
		`
		shareWrapper.insertAdjacentHTML('beforeend', html)
	}
	
	const buttons = document.querySelectorAll('.f-share-button')
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', () => share(social[i], url, 'Fennec game', 'Try your best skills to get coins', '/public/images/fennec.png'))
	}
}
// Creeate share page referals table
const createTable = () => {
	const table = document.querySelector('.f-share__table')
	const tBody = table.querySelector('table tbody')
	
	for (let i = 0; i < referals.length; i++) {
		const html = `<tr>
		<td class="text-[10px] leading-[12px] f-regular text-white-100 bg-[#1A1A1A] p-8 border-[1px] border-black-100">
		  ${ i + 1 }
		</td>
		<td class="bg-[#1A1A1A] p-8 border-[1px] border-black-100">
		  <div class="flex">
			<img
			  src="/public/icons/coin-icon.svg"
			  alt="Coin icon"
			  class="w-[12px] h-[12px] ml-1"
			  width="12"
			  height="12"
			/>
			<span
			  class="text-[10px] leading-[12px] f-regular text-white-100"
			  >${ referals?.[i]?.pie }</span
			>
		  </div>
		</td>
	  </tr>`
	  tBody.insertAdjacentHTML('beforeend', html)
	}
}

export { createShare }