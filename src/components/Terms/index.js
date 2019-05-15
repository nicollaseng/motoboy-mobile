import React, { Component, Fragment } from 'react'

import { connect } from 'react-redux'

import { View, Text, TouchableOpacity } from 'react-native'
import { Content } from 'native-base'

import * as firebase from  'firebase'

class Terms extends Component {

	handleTerms = async () => {
		await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
			terms: true
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
									<Text style={{ marginVertical: 8, fontWeight: '500', fontSize: 22, textAlign: 'center', color: '#666', marginVertical: 15}}>Termos de uso {"\n"}{"\n"}</Text> 
									Os termos e condições abaixo são vinculantes entre as partes que concordam com este Contrato (coletivamente, o “Contrato”). O Contrato de prestação de serviço constitui um acordo entre você e Motoboys de Plantão, uma sociedade limitada (“Empresa”). Para utilizar o Serviço e o Aplicativo associado você deve concordar com os termos e condições que estão a seguir indicados.{"\n"}
									<Text style={{ fontWeight: '500', marginVertical: 5}}> 1. RELACIONAMENTO CONTRATUAL{"\n"}{"\n"}</Text>

									
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

									Caso qualquer disposição destes Termos seja tida como ilegal, inválida ou inexequível total ou parcialmente, por qualquer legislação, essa disposição ou parte dela será, naquela medida, considerada como não existente para os efeitos destes Termos, mas a legalidade, validade e exequibilidade das demais disposições contidas nestes Termos não serão afetadas. Nesse caso, as partes substituirão a disposição ilegal, inválida ou inexequível, ou parte dela, por outra que seja legal, válida e exequível e que, na máxima medida possível, tenha efeito similar à disposição tida como ilegal, inválida ou inexequível para fins de conteúdo e finalidade dos presentes Termos. Estes Termos constituem a totalidade do acordo e entendimento das partes sobre este assunto e substituem e prevalecem sobre todos os entendimentos e compromissos anteriores sobre este assunto. Nestes Termos, as palavras “inclusive” e “inclui” significam “incluindo, sem limitação”.
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