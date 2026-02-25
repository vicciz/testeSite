export default function Privacidade() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto pt-20">
        <h1 className="text-5xl font-bold mb-8">Política de Privacidade</h1>

        <div className="space-y-8 text-gray-300 text-sm">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introdução</h2>
            <p className="leading-relaxed">
              A IMBALÁVEL está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, 
              usamos, divulgamos e protegemos suas informações quando você usa nosso site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Informações que Coletamos</h2>
            <p className="leading-relaxed mb-4">Podemos coletar informações sobre você de várias formas:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Informações de Identificação Pessoal:</strong> Nome, endereço de e-mail, número de telefone, endereço físico</li>
              <li><strong>Informações de Pagamento:</strong> Informações do cartão de crédito (processadas por terceiros seguros)</li>
              <li><strong>Informações de Navegação:</strong> Páginas visitadas, tempo gasto no site, cliques e interações</li>
              <li><strong>Informações do Dispositivo:</strong> Tipo de navegador, endereço IP, sistema operacional</li>
              <li><strong>Cookies:</strong> Identificadores únicos para rastrear preferências e melhorar a experiência</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Como Usamos Suas Informações</h2>
            <p className="leading-relaxed mb-4">Usamos as informações coletadas para:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Processar suas pedidos e enviar atualizações de envio</li>
              <li>Comunicar-nos com você sobre sua conta e atividades</li>
              <li>Personalizar sua experiência no site</li>
              <li>Melhorar nossos produtos e serviços</li>
              <li>Enviar comunicações de marketing (se consentido)</li>
              <li>Detectar e prevenir fraudes e atividades ilícitas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Compartilhamento de Informações</h2>
            <p className="leading-relaxed mb-4">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto nos seguintes casos:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Prestadores de Serviços:</strong> Empresas que nos ajudam a operar o site (pagamentos, envios, análises)</li>
              <li><strong>Exigências Legais:</strong> Quando exigido por lei ou por autoridades governamentais</li>
              <li><strong>Proteção de Direitos:</strong> Para proteger os direitos, privacidade ou segurança da IMBALÁVEL ou outros usuários</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Segurança dos Dados</h2>
            <p className="leading-relaxed">
              Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações contra 
              acesso não autorizado, alteração, divulgação ou destruição. Usamos criptografia SSL para dados sensíveis. 
              No entanto, nenhum método de transmissão pela Internet é 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies e Tecnologias de Rastreamento</h2>
            <p className="leading-relaxed mb-4">
              Usamos cookies para melhorar sua experiência. Você pode controlar as configurações de cookies em seu navegador. 
              Alguns cookies são essenciais para o funcionamento do site, enquanto outros são usados para análises e marketing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Seus Direitos</h2>
            <p className="leading-relaxed mb-4">Você tem o direito de:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Acessar e receber uma cópia de suas informações pessoais</li>
              <li>Corrigir informações imprecisas ou incompletas</li>
              <li>Solicitar a exclusão de suas informações (direito ao esquecimento)</li>
              <li>Optar por não receber comunicações de marketing</li>
              <li>Revogar seu consentimento para processamento de dados</li>
            </ul>
            <p className="mt-4">
              Para exercer esses direitos, entre em contato conosco através do e-mail: privacidade@imbalavel.com.br
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Retenção de Dados</h2>
            <p className="leading-relaxed">
              Retemos suas informações pessoais apenas pelo tempo necessário para cumprir os objetivos descritos nesta política 
              ou conforme exigido por lei. Dados de transação são mantidos por até 5 anos para conformidade fiscal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Links Externos</h2>
            <p className="leading-relaxed">
              Nosso site pode conter links para sites de terceiros. Não somos responsáveis pelas práticas de privacidade 
              desses sites externos. Recomendamos revisar as políticas de privacidade deles antes de fornecer suas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contato</h2>
            <p className="leading-relaxed">
              Se tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
            </p>
            <p className="mt-4 text-indigo-400">
              📧 privacidade@imbalavel.com.br<br />
              📍 São Paulo, SP - Brasil
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded-lg">
            <p className="text-xs text-gray-500">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
