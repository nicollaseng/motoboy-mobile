function getSideBarItems (context, currentUser) {
	let users
	let payment
	let help

	users = {
		title: 'Meus dados',
		icon: 'user',
		useAwesome: true,
		action: context.handleUserButton
	}
	delivery = {
		title: 'Minhas Entregas',
		icon: 'motorcycle',
		useAwesome: true,
		action: context.handleDeliveryButton
	}
	payment = {
		title: 'Ganhos',
		icon: 'money-check-alt',
		useAwesome: true,
		action: context.handlePaymentButton
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
