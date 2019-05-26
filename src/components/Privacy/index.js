import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { View, Text, TouchableOpacity } from 'react-native'
import { Content } from 'native-base'

import * as firebase from  'firebase'

class Terms extends Component {

	handleTerms = async () => {
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			privacy: true
		})
			.then(() => {})
			.catch(error => console.log('erro set terms'))
	}

    render() {
        return (
					<View style={{ flex: 1, backgroundColor: "#fff", alignItems: 'center', paddingHorizontal: 15 }}>
						<Content>
							<View style={{ flex: 1 }}>
								<Text style={{ textAlign: 'auto', fontSize: 12 }}>
									<Text style={{ marginVertical: 8, fontWeight: '500', fontSize: 22, textAlign: 'center', color: '#666', marginVertical: 15}}>Política de Privacidade{"\n"}{"\n"}</Text> 

													Os dados a seguir são coletados pela Motoboys de Plantão ou em nome dela:

												Dados fornecidos por você
												Estes dados podem incluir:

												Perfil de usuário: coletamos dados quando você cria ou altera sua conta da Motoboys de Plantão. Esses dados podem incluir seu nome, e-mail, número de telefone, nome e senha de login, endereço, dados bancários ou de pagamento (inclusive informações pertinentes a verificação de pagamento), números de identificação civil, como número do seguro social, carteira de habilitação ou passaporte, se exigido por lei, data de nascimento, foto e assinatura. Inclui ainda dados do veículo ou do seguro dos motoristas. Também estão incluídas as configurações e preferências que você seleciona na sua conta da Motoboys de Plantão.
												Dados da verificação de segurança: podemos coletar dados da verificação de segurança se você se cadastrar para usar os serviços da Motoboys de Plantão como motorista ou parceiro de entregas. Entre esses dados, podem estar seu histórico de motorista ou seus antecedentes criminais (se permitido por lei). Eles dados podem ser coletados por um prestador de serviços que esteja trabalhando em nome da Motoboys de Plantão.
												Dados demográficos: podemos coletar dados demográficos sobre você, inclusive por meio de pesquisas com usuários. Em alguns países, podemos também receber dados demográficos sobre você de terceiros.
												Conteúdo de usuários: Podemos coletar dados que você envia quando entra em contato com o suporte da Motoboys de Plantão, faz avaliações ou elogios para outros usuários ou interage com a Motoboys de Plantão de qualquer outra forma.
												Dados gerados quando você usa os nossos serviços
												Estes dados podem incluir:

												Dados de localização

												Dependendo dos serviços da Motoboys de Plantão que você usa e das configurações do seu app ou permissões do aparelho, a Motoboys de Plantão pode coletar sua localização exata ou aproximada determinada por meio de dados como GPS, endereço IP e WiFi.

												Se você for um motorista parceiro ou parceiro de entregas, a Motoboys de Plantão coleta dados de localização quando o app da Motoboys de Plantão está sendo executado em primeiro plano (app aberto e na tela) ou em segundo plano (app aberto, mas que não está na tela) do seu aparelho.
												Se você for um usuário e consentiu o processamento dos dados de localização, a Motoboys de Plantão coleta esses dados quando o app está sendo executado em primeiro plano. Em determinadas regiões, a Motoboys de Plantão também coleta esses dados quando o app da Motoboys de Plantão estiver sendo executado em segundo plano, se esta coleta estiver habilitada pelas configurações do seu app ou permissões do aparelho.
												Os usuários de viagens e os destinatários de entregas podem usar o app da Motoboys de Plantão sem permitir que a Motoboys de Plantão colete seus dados de localização. No entanto, isso pode afetar a funcionalidade disponível no seu app. Por exemplo, se você não autorizar a Motoboys de Plantão a coletar seus dados de localização, vai ser necessário inserir manualmente o endereço de partida. Além disso, os dados de localização vão ser coletados do motorista parceiro durante a viagem e relacionados à sua conta, mesmo que você não tenha ativado a coleta de dados de localização pela Motoboys de Plantão.
												Dados de transação

												Coletamos dados de transações relacionados ao uso que você faz dos nossos serviços, incluindo o tipo de serviço que você solicita ou oferece, dados dos seus pedidos, dados de entregas, data e horário em que o serviço foi prestado, valor cobrado, distância percorrida e forma de pagamento. Além disso, se alguém usar seu código promocional, podemos associar seu nome a essa pessoa.

												Dados de uso

												Coletamos dados sobre como você interage com os nossos serviços. Entre esses dados estão, por exemplo, datas e horários de acesso, recursos do app ou páginas acessadas, falhas do app e outras atividades do sistema, tipo de navegador e sites ou serviços de terceiros que você estava usando antes de interagir com os nossos serviços. Em alguns casos, fazemos essa coleta por meio de cookies, tags de pixels e tecnologias similares que criam e mantêm identificadores únicos. Para saber mais sobre essas tecnologias, confira a nossa Declaração de Cookies.
												Dados do aparelho

												Podemos coletar dados sobre os aparelhos que você usa para acessar os nossos serviços, inclusive modelos de hardware, endereço IP do aparelho, sistemas operacionais e versões, software, nomes e versões de arquivos, idioma de preferência, identificadores únicos do aparelho, identificadores de publicidade, números de série, dados de movimento do aparelho e dados da rede móvel.

												Dados de comunicação

												Permitimos que os usuários se comuniquem entre si e com a Motoboys de Plantão por meio dos apps da Motoboys de Plantão, sites e outros serviços. Por exemplo, permitimos que motoristas, usuários de viagens e parceiros e destinatários de entrega façam chamadas telefônicas ou enviem mensagens de texto uns para os outros (em certos países, isso é feito sem revelar o número de telefone). Para prestar esse serviço, a Motoboys de Plantão recebe alguns dados sobre as chamadas telefônicas ou mensagens de texto, incluindo a data, a hora e o conteúdo dessas comunicações. A Motoboys de Plantão também pode usar esses dados para serviços de suporte ao cliente (inclusive para resolver contestações entre os usuários), para fins de segurança e proteção, para melhorar os nossos produtos e serviços e para análise.

												Dados de outras fontes
												Esses dados podem incluir:

												Feedback de usuários, como avaliações ou elogios.

												Usuários que fornecem seus dados pessoais em programas de indicação.

												Usuários que solicitam serviços para você ou em seu nome.

												Usuários ou outras pessoas que fornecem dados relativos a reclamações ou contestações.

												Parceiros comerciais da Motoboys de Plantão com os quais você cria ou acessa sua conta da Motoboys de Plantão, como prestadores de serviços de pagamento, serviços de redes sociais, serviços de música sob demanda, além de apps ou sites que usam as APIs da Motoboys de Plantão ou que a API da Motoboys de Plantão usa (por exemplo, quando você solicita uma viagem pelo Google Maps.
												Seguradoras (se você for um motorista parceiro ou parceiro de entregas).

												Prestadores de serviços financeiros (se você for um motorista parceiro ou parceiro de entregas).

												Empresas de transporte parceiras (se você for um motorista que usa os nossos serviços por meio de uma conta associada a uma empresa desse tipo).

												O proprietário de um perfil da Motoboys de Plantão para Empresas ou Perfil Familiar que você usa.

												Fontes abertas ao público.

												Prestadores de serviços de marketing.

												A Motoboys de Plantão pode combinar os dados coletados dessas fontes com outros dados que possui.

												A Motoboys de Plantão usa os dados que coleta para os seguintes fins:

												Fornecer recursos e serviços
												A Motoboys de Plantão usa os dados que coleta para fornecer, personalizar, manter e melhorar seus produtos e serviços. Isso inclui usar os dados para:

												Criar e atualizar sua conta.
												Confirmar sua identidade.
												Processar ou intermediar os pagamentos desses serviços.
												Oferecer, obter, fornecer ou intermediar soluções de financiamentos e seguros relacionados aos nossos serviços.
												Acompanhar sua viagem ou entrega.
												Viabilizar recursos que permitam a você compartilhar informações com outras pessoas, como quando você envia um elogio sobre um motorista, indica um amigo para usar a Motoboys de Plantão, divide o valor da viagem ou compartilha sua previsão de chegada.
												Viabilizar recursos para personalizar sua conta da Motoboys de Plantão, como a criação de listas de locais favoritos e de acesso rápido a destinos para onde você já viajou.
												Viabilizar recursos de acessibilidade para ajudar pessoas com deficiências a utilizar nossos serviços, como os que alertam passageiros sobre a surdez ou deficiência auditiva dos motoristas, que permitem apenas SMS de usuários e para receber notificações luminosas de solicitação de viagem no lugar de alertas sonoros.
												Realizar operações internas necessárias para prestar nossos serviços, inclusive para solucionar problemas de software e operacionais, conduzir análise de dados, testes e pesquisas, e monitorar e analisar tendências de uso e atividade.
												Segurança
												A Motoboys de Plantão usa seus dados para ajudar a manter a segurança e a integridade de nossos usuários e serviços. Isso inclui, por exemplo:

												Fazer uma triagem de motoristas e parceiros de entregas antes de autorizar que eles usem nossos serviços e em intervalos subsequentes, inclusive a revisão da checagem de antecedentes quando permitido por lei, para evitar que motoristas inadequados usem nossos serviços.
												Usar dados dos aparelhos dos motoristas para identificar comportamentos de direção perigosa, como velocidade acima do limite ou frenagens e acelerações bruscas, e conscientizá-los a esse respeito.
												Nosso recurso de confirmação de identidade em tempo real, que solicita que os motoristas enviem uma selfie para poderem ficar online. Ele nos ajuda a confirmar se o motorista que está usando o app é o titular da conta da Motoboys de Plantão. Assim, evitamos fraudes e protegemos nossos usuários.
												Usar dados do aparelho, de localização, de perfil, de utilização, entre outras, para evitar, detectar e combater fraudes e atividades perigosas. Isso inclui o processamento desses dados, em certos países, para identificar práticas ou padrões que indicam fraude ou risco de incidentes relacionados à segurança. Também pode incluir dados de terceiros. Em certos casos, esses incidentes podem levar à desativação por meio de decisão automatizada. Usuários na UE têm o direito de contestar esse tipo de processamento. Consulte a seção II.I.1.d para mais informações.
												Usar avaliações de usuários para incentivar a melhoria e justificar a desativação daqueles que não atinjam a pontuação mínima, conforme exigido em cada região. O cálculo e a desativação podem ser feitos por decisão automatizada. Usuários na UE têm o direito de contestar esse tipo de processamento. Consulte a seção II.I.1.d para mais informações.
												Suporte ao cliente
												A Motoboys de Plantão usa os dados que coleta (incluindo gravações de ligações para o suporte, com o seu conhecimento e consentimento prévios) para oferecer assistência quando você entra em contato com nosso suporte ao cliente nas seguintes circunstâncias:

												Encaminhar suas dúvidas ao especialista de suporte da Motoboys de Plantão mais apropriado
												Investigar e resolver seus problemas
												Monitorar e aprimorar nosso atendimento
												Pesquisa e desenvolvimento
												A Motoboys de Plantão pode usar aos dados que coleta para fins de teste, pesquisa, análise e desenvolvimento de produtos. Isso nos permite melhorar e aumentar a segurança de nossos serviços, desenvolver novos recursos e produtos e mediar soluções financeiras e de seguros associadas aos nossos serviços.

												Comunicação entre usuários
												A Motoboys de Plantão usa os dados que coleta para possibilitar a comunicação entre os usuários. Por exemplo, o motorista pode enviar SMS ou ligar para o passageiro para confirmar o local de partida, ou o restaurante ou o parceiro de entregas pode ligar para o usuário que fez o pedido para pedir informações.

												Comunicação da Motoboys de Plantão
												A Motoboys de Plantão pode usar os dados que coleta para enviar a você informações sobre produtos, serviços, promoções, pesquisas, estudos, notícias, atualizações e eventos.

												Ela também pode usar os dados para promover e processar promoções e sorteios, entregar premiações e exibir anúncios e conteúdo relevante sobre nossos serviços e os dos nossos parceiros. Você poderá receber algumas dessas comunicações com base no seu perfil como usuário da Motoboys de Plantão. Usuários na UE têm o direito de contestar esse tipo de processamento. Consulte a seção II.I.1.d para mais informações.

												A Motoboys de Plantão também pode usar os dados para avisar você sobre eleições, votações, referendos e outros processos políticos que estejam relacionados aos nossos serviços.

												Procedimentos e exigências legais
												Podemos usar os dados que coletamos para investigar ou solucionar reclamações ou controvérsias relacionadas ao seu uso dos serviços da Motoboys de Plantão, conforme permitido pelas leis vigentes, ou em resposta a solicitações de agências reguladoras, órgãos governamentais e inquéritos oficiais.
									
								</Text>
							</View>
							<View>
								<TouchableOpacity onPress={this.handleTerms} style={{ backgroundColor: "#363777", marginVertical: 15 }}>
									<Text style={{ color: "#fff", padding: 10, textAlign: 'center', fontSize: 16, fontWeight: '500' }}> ACEITAR </Text>
								</TouchableOpacity>
							</View>
						</Content>
					</View>
        )
    }
}

const mapStateToProps = state => ({
	user: state.user.user,
})

export default connect(mapStateToProps)(Terms)