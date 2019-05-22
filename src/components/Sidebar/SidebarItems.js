function getSideBarItems (context, currentUser) {
	let users
	let payment
	let help
	let chat

	users = {
		title: 'Meus dados',
		icon: 'user',
		useAwesome: true,
		admin: false,
		action: context.handleUserButton
	}
	delivery = {
		title: 'Minhas Entregas',
		icon: 'motorcycle',
		useAwesome: true,
		admin: false,
		action: context.handleDeliveryButton
	}
	payment = {
		title: 'Ganhos',
		icon: 'money-check-alt',
		useAwesome: true,
		admin: false,
		action: context.handlePaymentButton
	}
	chat = {
		title: 'Suporte',
		icon: 'comment-dots',
		useAwesome: true,
		admin: true,
		action: context.handleChatButton
	}
	// help = {
	// 	title: 'Ajuda',
	// 	icon: 'question-circle',
	// 	useAwesome: true,
	// 	action: context.handleHelpButton
	// }

	const sideBarItems = [
		users,
		delivery,
		payment,
		chat,
		// help,
		{
			title: 'Sair',
			icon: 'sign-out-alt',
			useAwesome: true,
			action: context.handleSignOutButton
		}
	]
	return sideBarItems
}

export default getSideBarItems
