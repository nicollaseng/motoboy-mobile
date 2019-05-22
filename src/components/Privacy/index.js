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


									
									
									{/* <Text style={{ fontWeight: '500', marginVertical: 5}}> 1. RELACIONAMENTO CONTRATUAL{"\n"}{"\n"}</Text>

									
									Estes Termos de uso (“Termos”) regem seu acesso e uso, como pessoa física, dentro do Brasil, de aplicativos, sítios de Internet, conteúdos, bens e também serviços (os “Serviços”) disponibilizados pela Motoboys de Plantao.

									POR FAVOR, LEIA COM ATENÇÃO ESTES TERMOS ANTES DE ACESSAR OU USAR OS SERVIÇOS.

									Ao acessar e usar os Serviços você concorda com os presentes termos e condições, que estabelecem o relacionamento contratual entre você e a Motoboys de Plantao. Se você não concorda com estes Termos, você não pode acessar nem usar os Serviços. Mediante referido acesso e uso, estes Termos imediatamente encerram, substituem e superam todos os acordos, Termos e acertos anteriores entre você e qualquer Afiliada da Motoboys de Plantao. A Motoboys de Plantao poderá imediatamente encerrar estes Termos ou quaisquer Serviços em relação a você ou, de modo geral, deixar de oferecer ou negar acesso aos Serviços ou a qualquer parte deles, a qualquer momento e por qualquer motivo.

									Termos adicionais poderão se aplicar a determinados Serviços, tais como condições para um evento, atividade ou promoção em particular, e esses Termos adicionais serão divulgados em relação aos respectivos Serviços. Termos adicionais são complementares e considerados parte integrante destes Termos para os efeitos dos respectivos Serviços. Termos adicionais prevalecerão sobre estes Termos em caso de conflito com relação aos referidos Serviços.

									A Motoboys de Plantao poderá alterar os Termos relativos aos Serviços a qualquer momento. Aditamentos entrarão em vigor quando a Motoboys de Plantao fizer a postagem da versão atualizada dos Termos neste local ou das condições atualizadas ou Termos adicionais sobre o respectivo Serviço. O fato de você continuar a acessar ou usar os Serviços após essa postagem representa seu consentimento em vincular-se aos Termos alterados.

									<Text style={{ fontWeight: '500', marginVertical: 5}}> 2. OS SERVIÇOS {"\n"}{"\n"}</Text>
									Os Serviços integram uma plataforma de tecnologia que permite aos(às) Usuários(as) de aplicativos móveis ou sítios de Internet da Motoboys de Plantao, fornecidos como parte dos Serviços (cada qual um “Aplicativo”), providenciar e programar Serviços de transporte e/ou logística e/ou compra de certos bens com terceiros provedores independentes desses Serviços, inclusive terceiros fornecedores independentes de transporte, terceiros fornecedores independentes de logística e terceiros fornecedores independentes de bens, mediante contrato com a Motoboys de Plantao ou determinadas Afiliadas da Motoboys de Plantao (“Prestadores Terceiros”). A menos que diversamente acordado pela Motoboys de Plantao em contrato escrito em separado firmado com você, os Serviços são disponibilizados para seu uso pessoal e não comercial. VOCÊ RECONHECE QUE A Motoboys de Plantao NÃO É FORNECEDORA DE BENS, NÃO PRESTA SERVIÇOS DE TRANSPORTE OU LOGÍSTICA, NEM FUNCIONA COMO TRANSPORTADORA, E QUE TODOS ESSES SERVIÇOS DE TRANSPORTE OU LOGÍSTICA SÃO PRESTADOS POR PRESTADORES TERCEIROS INDEPENDENTES QUE NÃO SÃO EMPREGADOS(AS) E NEM REPRESENTANTES DA Motoboys de Plantao, NEM DE QUALQUER DE SUAS AFILIADAS.

									LICENÇA.
									Sujeito ao cumprimento destes Termos, a Motoboys de Plantao outorga a você uma licença limitada, não exclusiva, não passível de sublicença, revogável e não transferível para: (i) acesso e uso dos Aplicativos em seu dispositivo pessoal, exclusivamente para o seu uso dos Serviços; e (ii) acesso e uso de qualquer conteúdo, informação e material correlato que possa ser disponibilizado por meio dos Serviços, em cada caso, para seu uso pessoal, nunca comercial. Quaisquer direitos não expressamente outorgados por estes Termos são reservados à Motoboys de Plantao e suas afiliadas licenciadoras.

									RESTRIÇÕES.
									Você não poderá: (i) remover qualquer aviso de direito autoral, direito de marca ou outro aviso de direito de propriedade de qualquer parte dos Serviços; (ii) reproduzir, modificar, preparar obras derivadas, distribuir, licenciar, locar, vender, revender, transferir, exibir, veicular, transmitir ou, de qualquer outro modo, explorar os Serviços, exceto da forma expressamente permitida pela Motoboys de Plantao; (iii) decompilar, realizar engenharia reversa ou desmontar os Serviços, exceto conforme permitido pela legislação aplicável; (iv) conectar, espelhar ou recortar qualquer parte dos Serviços; (v) fazer ou lançar quaisquer programas ou scripts com a finalidade de fazer scraping, indexação, pesquisa ou qualquer outra forma de obtenção de dados de qualquer parte dos Serviços, ou de sobrecarregar ou prejudicar indevidamente a operação e/ou funcionalidade de qualquer aspecto dos Serviços; ou (vi) tentar obter acesso não autorizado aos Serviços ou prejudicar qualquer aspecto dos Serviços ou seus sistemas ou redes correlatas.

									PRESTAÇÃO DOS SERVIÇOS.
									Você reconhece que os Serviços podem ser disponibilizados sob diferentes marcas da Motoboys de Plantao ou diferentes opções de solicitação associadas aos serviços de transporte ou logística prestados por terceiros independentes.

									SERVIÇOS E CONTEÚDO DE TERCEIROS(AS).
									Os Serviços poderão ser disponibilizados e acessados em conexão com Serviços e conteúdo de terceiros(as) (inclusive publicidade) que a Motoboys de Plantao não controlará. VOCÊ RECONHECE QUE TERMOS DE USO E POLÍTICAS DE PRIVACIDADE DIFERENTES PODERÃO SER APLICÁVEIS AO USO DESSES SERVIÇOS E CONTEÚDO DE TERCEIROS(AS). A Motoboys de Plantao NÃO ENDOSSA ESSES SERVIÇOS E CONTEÚDO DE TERCEIROS(AS) E A Motoboys de Plantao NÃO SERÁ, EM HIPÓTESE ALGUMA, RESPONSÁVEL POR NENHUM PRODUTO OU SERVIÇO DESSES(AS) TERCEIROS(AS) FORNECEDORES(AS). Além disto, Apple Inc., Google, Inc., Microsoft Corporation ou BlackBerry Limited e/ou suas subsidiárias e afiliadas internacionais serão terceiros(as) beneficiários(as) deste Contrato, caso você acesse os Serviços usando aplicativos desenvolvidos para dispositivos móveis baseados em Apple iOS, Android, Microsoft Windows, ou Blackberry, respectivamente. Esses(as) terceiros(as) beneficiários(as) não são partes deste Contrato e não são responsáveis pela prestação dos Serviços ou por qualquer forma de suporte aos Serviços. Seu acesso aos Serviços usando esses dispositivos está sujeito às condições estabelecidas nos termos de serviços dos respectivos terceiros(as) beneficiários(as).

									TITULARIDADE.
									Os Serviços e todos os direitos sobre eles são e permanecerão de propriedade da Motoboys de Plantao ou de propriedade das Afiliadas da Motoboys de Plantao, ou de suas respectivas licenciadoras, conforme o caso. Estes Termos e o uso dos Serviços não lhe outorgam nem lhe conferem qualquer direito: (i) sobre os Serviços, exceto pela licença limitada concedida acima; ou (ii) de usar ou, de qualquer modo, fazer referência a nomes societários, logotipos, nomes de produtos ou de Serviços, marcas comerciais ou marcas de serviço da Motoboys de Plantao ou de qualquer licenciadora da Motoboys de Plantao.

									<Text style={{ fontWeight: '500', marginVertical: 5}}> 3. O USO DOS SERVIÇOS {"\n"}{"\n"}</Text>
									CONTAS DE USUÁRIOS.
									Para utilizar grande parte dos Serviços, você deve registrar-se e manter uma conta pessoal de usuário de Serviços (“Conta”). Você deve ter pelo menos 18 anos ou a maioridade exigida por lei em seu foro (se for diferente de 18 anos) para abrir uma Conta. Registro de Conta exige que você apresente à Motoboys de Plantao certas informações pessoais, tais como seu nome, endereço, número de telefone celular e idade, assim como pelo menos um método de pagamento válido (cartão de crédito ou parceiro de pagamento aceito). Você concorda em manter informações corretas, completas e atualizadas em sua Conta. Se você não mantiver informações corretas, completas e atualizadas em sua Conta, inclusive se o método de pagamento informado for inválido ou expirado, você poderá ficar impossibilitado(a) de acessar e usar os Serviços ou a Motoboys de Plantao poderá resolver estes Termos. Você é responsável por todas as atividades realizadas na sua Conta e concorda em manter sempre a segurança e o sigilo do nome de usuário e senha da sua Conta. A menos que diversamente permitido pela Motoboys de Plantao por escrito, você poderá manter apenas uma Conta.

									CONDUTA E OBRIGAÇÕES DO USUÁRIO.
									O Serviço não está disponível para uso para indivíduos menores de 18 anos. Você não poderá autorizar terceiros(as) a usar sua Conta, você não poderá permitir que pessoas menores de 18 anos recebam Serviços de transporte ou logística de Prestadores Terceiros, salvo se estiverem em sua companhia. Você não poderá ceder, nem de qualquer outro modo transferir, sua Conta a nenhuma outra pessoa ou entidade. Você concorda em cumprir todas as leis aplicáveis quando usar os Serviços e que somente poderá usar os Serviços para finalidades legítimas (por ex. não transportar materiais ilegais ou perigosos). Você não poderá, quando usar os Serviços, causar transtorno, aborrecimento, inconveniente ou danos à propriedade dos Prestadores Terceiros ou de qualquer outro terceiro. Em determinadas situações, você poderá ser solicitado(a) a fornecer comprovante de identidade para acessar ou usar os Serviços, e concorda que poderá ter seu acesso ou uso dos Serviços negado caso você se recuse a fornecer comprovante de identidade.

									MENSAGEM DE TEXTO.
									Ao criar uma Conta, você concorda que os Serviços poderão lhe enviar mensagens de textos informativas (SMS) como parte das operações comerciais regulares para o uso dos Serviços. Você poderá optar por não receber mensagens de texto (SMS) da Motoboys de Plantao a qualquer momento enviando e-mail para support@Motoboys de Plantao.com e indicando que não mais deseja receber essas mensagens, juntamente com o número do telefone celular que as recebe. Você reconhece que ao optar por não receber as mensagens de texto poderá impactar o uso dos Serviços.

									CÓDIGOS PROMOCIONAIS.
									A Motoboys de Plantao poderá, a seu exclusivo critério, criar códigos promocionais que poderão ser resgatados para crédito na Conta ou outras características ou benefícios relacionados aos Serviços e/ou a Serviços de Prestadores Terceiros, sujeitos a quaisquer condições adicionais que a Motoboys de Plantao estabelecer para cada um dos códigos promocionais (“Códigos Promocionais”). Você concorda que Códigos Promocionais: (i) devem ser usados de forma legal para a finalidade e o público a que se destinam; (ii) não devem ser duplicados, de qualquer forma vendidos, transferidos ou disponibilizados ao público em geral (seja por meio de postagem ao público ou qualquer outro método), a menos que expressamente permitido pela Motoboys de Plantao; (iii) poderão ser desabilitados pela Motoboys de Plantao a qualquer momento por motivos legalmente legítimos, sem que disto resulte qualquer responsabilidade para a Motoboys de Plantao; (iv) somente poderão ser usados de acordo com as condições específicas que a Motoboys de Plantao estabelecer para esses Código Promocional; (v) não são válidos como dinheiro; e (vi) poderão expirar antes de serem usados. A Motoboys de Plantao se reserva o direito de reter ou deduzir créditos ou outras funcionalidades ou vantagens obtidas por meio do uso dos Códigos Promocionais por você ou por outro usuário, caso a Motoboys de Plantao apure ou acredite que o uso ou resgate do Código Promocional foi feito com erro, fraude, ilegalidade ou violação às condições do respectivo Código Promocional.

									CONTEÚDO FORNECIDO PELO(A) USUÁRIO(A).
									A Motoboys de Plantao poderá, a seu exclusivo critério, permitir que você ou qualquer pessoa apresente, carregue, publique ou, de qualquer modo, disponibilize para a Motoboys de Plantao por meio dos Serviços, conteúdo e informações de texto, áudio ou vídeo, inclusive comentários e feedbacks relacionados aos Serviços, iniciação de solicitação de suporte e registro em concursos e promoções (“Conteúdo de Usuário(a)"). Qualquer Conteúdo de Usuário(a) fornecido por você permanece de sua propriedade. Contudo, ao fornecer Conteúdo de Usuário(a) para a Motoboys de Plantao, você outorga a Motoboys de Plantao e suas afiliadas uma licença em nível mundial, perpétua, irrevogável, transferível, isenta de royalties, e com direito a sublicenciar, usar, copiar, modificar, criar obras derivadas, distribuir, publicar, exibir, executar em público e, de qualquer outro modo, explorar esse Conteúdo de Usuário(a) em todos os formatos e canais de distribuição hoje conhecidos ou desenvolvidos no futuro (inclusive em conexão com os Serviços e com os negócios da Motoboys de Plantao e em sites e Serviços de terceiros), sem ulterior aviso a você ou seu consentimento, e sem necessidade de pagamento a você ou a qualquer outra pessoa ou entidade.

									Você declara e garante que: (i) é o(a) único(a) e exclusivo(a) proprietário(a) de todo Conteúdo de Usuário(a) ou tem todos os direitos, licenças, consentimentos e liberações necessários para outorgar à Motoboys de Plantao a licença sobre o Conteúdo de Usuário(a) acima referido; e (ii) nem o Conteúdo de Usuário(a) nem sua apresentação, carregamento, publicação ou outra forma de disponibilização desse Conteúdo de Usuário(a) tampouco o uso do Conteúdo de Usuário(a) pela Motoboys de Plantao da forma aqui permitida infringirá, constituirá apropriação indevida nem violará propriedade intelectual ou direito de propriedade de terceiros(a), nem direitos de publicidade ou privacidade e também não resultarão na violação de qualquer lei ou regulamento aplicável.

									Você concorda em não fornecer Conteúdo de Usuário(a) que seja difamatório, calunioso, injurioso, violento, obsceno, pornográfico, ilegal ou de qualquer modo ofensivo, conforme apuração da Motoboys de Plantao a seu critério exclusivo, seja ou não esse material protegido por lei. A Motoboys de Plantao poderá, mas não está obrigada a, analisar, monitorar ou remover Conteúdo de Usuário(a), a critério exclusivo da Motoboys de Plantao, a qualquer momento e por qualquer motivo, sem nenhum aviso a você.

									ACESSO À REDE E EQUIPAMENTOS.
									Você é responsável por obter o acesso a rede de dados necessário para usar os Serviços. As taxas e encargos de sua rede de dados e mensagens poderão se aplicar se você acessar ou usar os Serviços de um dispositivo sem fio e você será responsável por essas taxas e encargos. Você é responsável por adquirir e atualizar os equipamentos e dispositivos necessários para acessar e usar os Serviços e Aplicativos e quaisquer de suas atualizações. A Motoboys de Plantao NÃO GARANTE QUE OS SERVIÇOS, OU QUALQUER PARTE DELES, FUNCIONARÃO EM QUALQUER EQUIPAMENTO OU DISPOSITIVO EM PARTICULAR. Além disso, os Serviços poderão estar sujeitos a mau funcionamento e atrasos inerentes ao uso da Internet e de comunicações eletrônicas.

									<Text style={{ fontWeight: '500', marginVertical: 5}}> 	4. PAGAMENTO {"\n"}{"\n"}</Text>
									O pagamento por cada respectivo serviço de entrega gerado será pago única e exclusivamente pelo estabelecimento onde foi coletado o pedido. O valor recebido ja é liquido, ou seja, decontado as taxas de serviço e utilização da plataforma
									Motoboys de Plantão. A porcentagem dessa taxa é variável e varia entre 10% a 13,5% sobre cada entrega

									TAXA DE REPAROS OU LIMPEZA.
									Você será responsável pelos custos de reparos a danos ou pela limpeza de veículos de Prestadores Terceiros resultantes do uso dos Serviços através da sua Conta que excedam os danos naturais decorrentes do uso (“Reparos ou Limpeza”). Caso um Prestador Terceiro relate a necessidade de Reparos ou Limpeza e essa solicitação de Reparos ou Limpeza seja confirmada pela Motoboys de Plantao, a critério razoável da Motoboys de Plantao, a Motoboys de Plantao reserva-se o direito de facilitar o pagamento desses Reparos ou Limpeza em nome do Prestador Terceiro usando o método de pagamento indicado em sua Conta. Referidos valores serão transferidos pela Motoboys de Plantao ao respectivo Prestador Terceiro e não serão reembolsáveis.

									
									<Text style={{ fontWeight: '500', marginVertical: 5}}> 5. RECUSA DE GARANTIA; LIMITAÇÃO DE RESPONSABILIDADE; INDENIZAÇÃO.
									RECUSA DE GARANTIA.{"\n"}{"\n"}</Text>
									OS SERVIÇOS SÃO PRESTADOS “NO ESTADO” E “COMO DISPONÍVEIS”. A Motoboys de Plantao RECUSA TODAS AS DECLARAÇÕES E GARANTIAS, EXPRESSAS, IMPLÍCITAS OU LEGAIS, NÃO EXPRESSAMENTE CONTIDAS NESTES TERMOS, INCLUSIVE AS GARANTIAS IMPLÍCITAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA E NÃO INFRINGÊNCIA. ADEMAIS, A Motoboys de Plantao NÃO FAZ NENHUMA DECLARAÇÃO NEM DÁ GARANTIA SOBRE A CONFIABILIDADE, PONTUALIDADE, QUALIDADE, ADEQUAÇÃO OU DISPONIBILIDADE DOS SERVIÇOS OU DE QUAISQUER SERVIÇOS OU BENS SOLICITADOS POR MEIO DO USO DOS SERVIÇOS, NEM QUE OS SERVIÇOS SERÃO ININTERRUPTOS OU LIVRES DE ERROS. A Motoboys de Plantao NÃO GARANTE A QUALIDADE, ADEQUAÇÃO, SEGURANÇA OU HABILIDADE DE PRESTADORES TERCEIROS. VOCÊ CONCORDA QUE TODO O RISCO DECORRENTE DO USO DOS SERVIÇOS E DE QUALQUER SERVIÇO OU BEM SOLICITADO POR MEIO DA TECNOLOGIA SERÁ SEMPRE SEU NA MÁXIMA MEDIDA PERMITIDA PELA LEI APLICÁVEL.

									LIMITAÇÃO DE RESPONSABILIDADE.
									A Motoboys de Plantao NÃO SERÁ RESPONSÁVEL POR DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, PUNITIVOS OU EMERGENTES, INCLUSIVE LUCROS CESSANTES, PERDA DE DADOS, DANOS MORAIS OU PATRIMONIAIS RELACIONADOS, ASSOCIADOS OU DECORRENTES DE QUALQUER USO DOS SERVIÇOS AINDA QUE A Motoboys de Plantao TENHA SIDO ALERTADA PARA A POSSIBILIDADE DESSES DANOS. A Motoboys de Plantao NÃO SERÁ RESPONSÁVEL POR NENHUM DANO, OBRIGAÇÃO OU PREJUÍZO DECORRENTE DO: (i) SEU USO DOS SERVIÇOS OU SUA INCAPACIDADE DE ACESSAR OU USAR OS SERVIÇOS; OU (ii) QUALQUER OPERAÇÃO OU RELACIONAMENTO ENTRE VOCÊ E QUALQUER PRESTADOR TERCEIRO, AINDA QUE A Motoboys de Plantao TENHA SIDO ALERTADA PARA A POSSIBILIDADE DESSES DANOS. A Motoboys de Plantao NÃO SERÁ RESPONSÁVEL POR ATRASOS OU FALHAS DECORRENTES DE CAUSAS FORA DO CONTROLE RAZOÁVEL DA Motoboys de Plantao E, TAMPOUCO, PELA QUALIDADE E INTEGRIDADE DOS BENS DISPONIBILIZADOS POR PRESTADORES TERCEIROS. VOCÊ RECONHECE QUE PRESTADORES TERCEIROS QUE PRESTAREM SERVIÇOS DE TRANSPORTE SOLICITADOS POR MEIO DE ALGUMAS MARCAS PODERÃO OFERECER SERVIÇOS DE TRANSPORTE DO TIPO "DIVISÃO DE VIAGEM" (RIDESHARING) OU PONTO A PONTO (PEER-TO-PEER).

									VOCÊ CONCORDA QUE QUALQUER PAGAMENTO FEITO A VOCÊ COM BASE NO SEGURO CONTRA ACIDENTES PESSOAIS DE PASSAGEIROS (APP) MANTIDO PELA Motoboys de Plantao OU PELO PRESTADOR TERCEIRO REDUZIRÁ QUALQUER INDENIZAÇÃO DEVIDA A VOCÊ DECORRENTE DAQUELE MESMO ACIDENTE.

									OS SERVIÇOS DA Motoboys de Plantao PODERÃO SER USADOS POR VOCÊ PARA SOLICITAR E PROGRAMAR SERVIÇOS DE TRANSPORTE, BENS OU LOGÍSTICA PRESTADOS POR PRESTADORES TERCEIROS, MAS VOCÊ CONCORDA QUE A Motoboys de Plantao NÃO TEM RESPONSABILIDADE EM RELAÇÃO A VOCÊ, POR CONTA DE QUALQUER SERVIÇO DE TRANSPORTE, BENS OU LOGÍSTICA REALIZADOS POR PRESTADORES TERCEIROS, SALVO SE EXPRESSAMENTE ESTABELECIDA NESTES TERMOS. COMO CONSEQUÊNCIA, A Motoboys de Plantao NÃO TEM QUALQUER RESPONSABILIDADE POR ROTAS ADOTADAS POR PRESTADORES TERCEIROS OU POR QUAISQUER ITENS PERDIDOS NOS VEÍCULOS DE PRESTADORES TERCEIROS.

									AS LIMITAÇÕES E RECUSA DE GARANTIAS CONTIDAS NESTA CLÁUSULA 5 NÃO POSSUEM O OBJETIVO DE LIMITAR RESPONSABILIDADES OU ALTERAR DIREITOS DE CONSUMIDOR QUE DE ACORDO COM A LEI APLICÁVEL NÃO PODEM SER LIMITADOS OU ALTERADOS.

									INDENIZAÇÃO.
									Você concorda em indenizar e manter a Motoboys de Plantao, seus diretores(as), conselheiros(as), empregados(as) e agentes isentos(as) de responsabilidade por todas e quaisquer reclamações, cobranças, prejuízos, responsabilidades e despesas (inclusive honorários advocatícios) decorrentes ou relacionados: (i) ao uso dos Serviços, de serviços ou bens obtidos por meio do uso dos Serviços; (ii) descumprimento ou violação de qualquer disposição destes Termos; (iii) o uso, pela Motoboys de Plantao, do Conteúdo de Usuário(a); ou (iv) violação dos direitos de terceiros, inclusive Prestadores Terceiros.

									<Text style={{ fontWeight: '500', marginVertical: 5}}> 		6. LEGISLAÇÃO APLICÁVEL; JURISDIÇÃO {"\n"}{"\n"}</Text>
									Estes Termos serão regidos e interpretados exclusivamente de acordo com as leis do Brasil. Qualquer reclamação, conflito ou controvérsia que surgir deste contrato ou a ele relacionada, inclusive que diga respeito a sua validade, interpretação ou exequibilidade, será solucionada exclusivamente pelos tribunais do foro de seu domicílio.

									<Text style={{ fontWeight: '500', marginVertical: 5}}> AVISOS {"\n"}{"\n"}</Text>
									
									A Motoboys de Plantao poderá enviar avisos por meio de notificações gerais nos Serviços, correio eletrônico para seu endereço de e-mail em sua Conta, ou por comunicação escrita enviada ao endereço indicado em sua Conta. Você poderá notificar a Motoboys de Plantao por meio do Aplicativo, comunicação pelo endereço eletrônico help.Motoboys de Plantao.com ou fazer comunicação escrita para o endereço da Motoboys de Plantao na Avenida Brigadeiro Faria Lima, nº 201, 26º e 27º andares, salas 2601 e 2701, CEP 05426-100, São Paulo/SP, Brasil.

									<Text style={{ fontWeight: '500', marginVertical: 5}}> 	DISPOSIÇÕES GERAIS. {"\n"}{"\n"}</Text>
									Você não poderá ceder tampouco transferir estes Termos, total ou parcialmente, sem prévia aprovação por escrito da Motoboys de Plantao. Você concede sua aprovação para que a Motoboys de Plantao ceda e transfira estes Termos total ou parcialmente, inclusive: (i) para uma subsidiária ou afiliada; (ii) um adquirente das participações acionárias, negócios ou bens da Motoboys de Plantao; ou (iii) para um sucessor em razão de qualquer operação societária. Não existe joint-venture, sociedade, emprego ou relação de representação entre você, a Motoboys de Plantao ou quaisquer Prestadores Terceiros como resultado do contrato entre você e a Motoboys de Plantao ou pelo uso dos Serviços.

									Caso qualquer disposição destes Termos seja tida como ilegal, inválida ou inexequível total ou parcialmente, por qualquer legislação, essa disposição ou parte dela será, naquela medida, considerada como não existente para os efeitos destes Termos, mas a legalidade, validade e exequibilidade das demais disposições contidas nestes Termos não serão afetadas. Nesse caso, as partes substituirão a disposição ilegal, inválida ou inexequível, ou parte dela, por outra que seja legal, válida e exequível e que, na máxima medida possível, tenha efeito similar à disposição tida como ilegal, inválida ou inexequível para fins de conteúdo e finalidade dos presentes Termos. Estes Termos constituem a totalidade do acordo e entendimento das partes sobre este assunto e substituem e prevalecem sobre todos os entendimentos e compromissos anteriores sobre este assunto. Nestes Termos, as palavras “inclusive” e “inclui” significam “incluindo, sem limitação”. */}
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