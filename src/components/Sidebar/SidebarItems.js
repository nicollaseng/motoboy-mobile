function getSideBarItems (context, currentUser) {
	let users
	let payment
	let help
	let chat
	let documents
	let indication
	let whatsapp
	let video

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
		icon: 'mobile',
		useAwesome: true,
		admin: true,
		action: context.handleChatButton
	}
	documents = {
		title: 'Documentos',
		icon: 'id-card',
		useAwesome: true,
		admin: false,
		action: context.handleDocumentsButton
	}
	indication = {
		title: 'Indicação',
		icon: 'handshake',
		useAwesome: true,
		admin: false,
		action: context.handleIndicationButton
	}
	whatsapp = {
		title: 'Grupo',
		icon: 'comments',
		useAwesome: true,
		admin: false,
		action: context.handleWhatsappButton
	}
	video = {
		title: 'Vídeos',
		icon: 'video',
		useAwesome: true,
		admin: false,
		action: context.handleYoutubeButton
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
		documents,
		indication,
		chat,
		whatsapp,
		video,
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
