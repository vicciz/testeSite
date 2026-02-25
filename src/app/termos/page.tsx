export default function Termos() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto pt-20">
        <h1 className="text-5xl font-bold mb-8">Termos de Uso</h1>

        <div className="space-y-8 text-gray-300 text-sm">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="leading-relaxed">
              Ao acessar e usar o site IMBALÁVEL, você concorda em aceitar estes Termos de Uso na íntegra. 
              Se você não concordar com qualquer parte destes termos, não utilize o site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Uso do Site</h2>
            <p className="leading-relaxed mb-4">
              Você concorda em utilizar este site apenas para fins legais e de forma que não infrinja os direitos 
              de terceiros ou restrinja seu uso e gozo. Comportamento proibido inclui:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Assediar ou causar constrangimento a qualquer pessoa</li>
              <li>Obscuridade ou postagem de conteúdo ofensivo ou obsceno</li>
              <li>Interrupção do fluxo normal de diálogo no site</li>
              <li>Tentativas de ganhar acesso não autorizado aos nossos sistemas</li>
              <li>Coleta de dados pessoais de terceiros sem consentimento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Contas de Usuário</h2>
            <p className="leading-relaxed">
              Ao criar uma conta, você é responsável por manter a confidencialidade de sua senha e é totalmente 
              responsável por todas as atividades que ocorram em sua conta. Você concorda em notificar-nos imediatamente 
              de qualquer uso não autorizado de sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Direitos de Propriedade Intelectual</h2>
            <p className="leading-relaxed">
              Todo o conteúdo do site IMBALÁVEL, incluindo texto, gráficos, logotipos, imagens e software, é propriedade 
              da IMBALÁVEL ou seus fornecedores de conteúdo e está protegido por leis internacionais de direitos autorais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Descrição dos Produtos</h2>
            <p className="leading-relaxed">
              Fazemos um esforço para descrever com precisão nossos produtos. No entanto, não garantimos que as descrições, 
              preços ou outras informações sobre produtos sejam precisas, completas ou livres de erros. Reservamo-nos o direito 
              de corrigir qualquer erro e alterar ou atualizar as informações a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Política de Preços</h2>
            <p className="leading-relaxed">
              A IMBALÁVEL reserva-se o direito de alterar os preços de produtos a qualquer momento. Os preços estão sujeitos 
              a alteração sem aviso prévio. O preço que você paga é o preço mostrado no momento da finalização da compra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Política de Reembolso</h2>
            <p className="leading-relaxed">
              Os produtos podem ser devolvidos dentro de 30 dias da data de recebimento, desde que estejam em condições 
              originais, não utilizados e com a embalagem intacta. Reembolsos serão processados dentro de 10 dias úteis 
              após a aprovação da devolução.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitação de Responsabilidade</h2>
            <p className="leading-relaxed">
              NA MEDIDA DO PERMITIDO PELA LEI, A IMBALÁVEL NÃO SERÁ RESPONSÁVEL POR DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, 
              CONSEQUENCIAIS OU PUNITIVOS RESULTANTES DE SEU USO OU INCAPACIDADE DE USAR O SITE OU OS SERVIÇOS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Alterações aos Termos</h2>
            <p className="leading-relaxed">
              A IMBALÁVEL reserva-se o direito de alterar estes Termos de Uso a qualquer momento. Alterações entram em 
              vigor quando publicadas no site. Seu uso contínuo do site após tais alterações constitui sua aceitação 
              dos novos Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Legislação Aplicável</h2>
            <p className="leading-relaxed">
              Estes Termos de Uso serão regidos e interpretados de acordo com as leis da República Federativa do Brasil, 
              e você irrevogavelmente se submete à jurisdição exclusiva dos tribunais localizados no Brasil.
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
