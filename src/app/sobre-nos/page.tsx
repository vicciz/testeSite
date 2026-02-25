export default function SobreNos() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto pt-20">
        <h1 className="text-5xl font-bold mb-8">Sobre Nós</h1>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Nossa História</h2>
            <p className="leading-relaxed">
              A IMBALÁVEL nasceu da paixão por fragrâncias masculinas premium e pela busca do aperfeiçoamento pessoal. 
              Somos uma curadoria especializada em perfumes, colognes e cosméticos para homens que se impõem no mercado 
              e na vida.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Nossa Missão</h2>
            <p className="leading-relaxed">
              Conectar homens aos melhores perfumes do mundo, oferecendo uma experiência de compra premium com produtos 
              autênticos, selecionados criteriosamente e com atendimento excepcional. Acreditamos que uma boa fragrância 
              é um reflexo da personalidade e do caráter de quem a usa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Nossa Visão</h2>
            <p className="leading-relaxed">
              Ser a plataforma de referência na América Latina para fragrâncias masculinas premium, reconhecida pela qualidade, 
              autenticidade e expertise. Queremos que cada cliente IMBALÁVEL se sinta confiante em sua escolha e orgulhoso 
              de suas aquisições.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Nossos Valores</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-indigo-400">✓</span>
                <div>
                  <strong className="text-white">Autenticidade:</strong> Apenas produtos originais e certificados
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400">✓</span>
                <div>
                  <strong className="text-white">Qualidade:</strong> Curadoria rigorosa de cada produto
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400">✓</span>
                <div>
                  <strong className="text-white">Transparência:</strong> Informações claras e honestas sobre nossos produtos
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400">✓</span>
                <div>
                  <strong className="text-white">Excelência:</strong> Atendimento ao cliente de primeira classe
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400">✓</span>
                <div>
                  <strong className="text-white">Confiabilidade:</strong> Compromisso com prazos e qualidade
                </div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Por Que Escolher IMBALÁVEL?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-indigo-400 font-bold mb-2">Produtos Originais</h3>
                <p className="text-sm">Garantia 100% de autenticidade em todos os nossos produtos</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-indigo-400 font-bold mb-2">Curadoria Expert</h3>
                <p className="text-sm">Seleção especial feita por especialistas em fragrâncias</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-indigo-400 font-bold mb-2">Preços Competitivos</h3>
                <p className="text-sm">Os melhores preços do mercado com parcelamento disponível</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-indigo-400 font-bold mb-2">Entrega Rápida</h3>
                <p className="text-sm">Rastreamento completo e entrega em todo o Brasil</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contato</h2>
            <p className="leading-relaxed">
              Tem dúvidas ou sugestões? Adoraríamos ouvir você!
            </p>
            <p className="mt-4 text-indigo-400">
              📧 contato@imbalavel.com.br<br />
              📱 (11) 98765-4321<br />
              📍 São Paulo, SP - Brasil
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
