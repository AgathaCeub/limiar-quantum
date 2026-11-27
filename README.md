# LIMIAR · Quantum Fieldwork

Um laboratório jogável sobre controle, fase e medição. Seis qubits, 64 amplitudes complexas e seis protocolos com orçamento de operações.

[Abrir a versão hospedada](https://limiar-quantum-agatha.cocoameadow2.chatgpt.site/) · acesso restrito à conta proprietária. Para jogar sem esse acesso, use os arquivos deste repositório conforme as instruções abaixo.

## Por que montei assim

Quis colocar a decisão no lugar certo: medir não serve apenas para descobrir uma resposta; muda o estado com o qual continuo jogando. Organizei a campanha em torno dessa tensão. Primeiro preparo correlações, depois corrijo fases, uso resultados intermediários como feedback e tento recuperar uma perturbação fraca.

Escolhi uma linguagem visual de instrumento científico: fundo escuro, tipografia editorial, esferas de Bloch e um espectro que separa probabilidade de fase. As órbitas são uma composição artística; as setas, fidelidades e matrizes reduzidas vêm do cálculo.

## Jogar

Sirva a raiz do projeto como site estático. Para desenvolvimento local, na raiz:

```sh
python3 -m http.server 8000
```

Abra `http://localhost:8000`. O projeto também funciona abrindo `index.html` diretamente em navegadores que permitem scripts locais; o histórico pode não persistir nesse modo. Não há instalação de pacotes nem serviços externos.

Para o primeiro protocolo: selecione q₀, aplique H e depois CX com destino q₁. Pressione **Verificar protocolo**. Você preparou |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 com dois pulsos. Nas missões seguintes, o histograma deixa de bastar: a fase relativa e o registro de medição entram na estratégia.

Escolha controle e destino, aplique pulsos, acompanhe fase e fidelidade e pressione **Verificar protocolo**. **Operações** abre a campanha e a bancada livre. **Nota de bancada** apresenta uma pista. **Trajetórias 2026** compara dois esquemas de monitoramento. **Caderno de pesquisa** apresenta a nota técnica e as fontes.

| Protocolo | Problema físico |
| --- | --- |
| A distância não separa | Preparação de Bell |
| O que a câmera não vê | Correção de fase relativa |
| Uma ponte que desaparece | Troca de emaranhamento e feedback |
| Seis vozes, um estado | GHZ com acoplamentos locais |
| A geometria da fase | Estado cluster de uma cadeia |
| Apagar sem esquecer | Reversão probabilística de filtro fraco |

## O detalhe por trás do gráfico

|Φ⁺⟩ e |Φ⁻⟩ dão as mesmas probabilidades na base computacional, mas interferem de maneiras diferentes. É por isso que a avaliação usa fidelidade, não apenas um histograma. Na bancada de trajetórias, a diferença é outra: a média de S₂ dos estados condicionados não coincide, em geral, com S₂ do estado médio. Descartar o registro do detector muda a pergunta.

## Estrutura

`quantum.js` contém a álgebra, os protocolos e o experimento de ensembles. `app.js` coordena entradas, trajetória e desenho em Canvas. `experiment.js` desenha a comparação dos ensembles em SVG. HTML e CSS definem a bancada responsiva. O núcleo funciona também em Node, sem DOM.

Uso vetores `Float64Array` com partes real e imaginária intercaladas. O bit menos significativo corresponde a q₀; o rótulo de base escreve q₅…q₀. A separação entre estado, observáveis e desenho permite verificar a física sem depender da animação. O histórico exportado registra operações, parâmetros, probabilidades de leitura, semente e estado final. A mesma semente reproduz a mesma sequência de ações, incluindo as leituras; mudar a ordem das ações muda o experimento.

## Verificação

```sh
npm test
```

Treze testes cobrem norma, inversas, Born, fases, matrizes reduzidas, os quatro ramos de feedback da troca de emaranhamento, reversão fraca, soluções da campanha e equivalência dos canais dos dois unravelings. O teste de equivalência compara as matrizes, não apenas um gráfico.

## Pesquisa e limites

O ponto de partida são circuitos adaptativos e trajetórias condicionadas. Leio a diferença entre média de observáveis não lineares e observáveis do estado médio como uma oportunidade de interação: o registro do detector faz parte do problema.

- [Order from chaos with adaptive circuits on quantum hardware](https://arxiv.org/abs/2509.18259), 2025.
- [Measurement-and Feedback-Driven Non-Equilibrium Phase Transitions on a Quantum Processor](https://arxiv.org/abs/2512.07966), revisão de julho de 2026, PRL 137, 010401.
- [Distinguishing synthetic unravelings on quantum computers](https://arxiv.org/abs/2601.19889), preprint de janeiro de 2026.

A bancada de trajetórias implementa um modelo pequeno inspirado no terceiro trabalho. Uma medição projetiva com probabilidade p e um pulso Z com probabilidade p/2 realizam o mesmo canal de desfasamento. Partindo de Bell e aplicando apenas rotações locais, o esquema unitário preserva o emaranhamento em cada realização; o projetivo pode destruí-lo. O gráfico calcula a média de S₂ em 256 trajetórias por esquema; diferenças entre matrizes médias estimadas são erro de amostragem. O teste automatizado verifica a identidade analítica do canal separadamente.

O projeto é uma simulação clássica de seis qubits ideais. Não reproduz os experimentos dos artigos, não demonstra transições de fase por escala finita, vantagem quântica ou correção de erros tolerante a falhas. A interface oferece acesso ao estado exato para fins de estratégia; hardware real exigiria estimar os observáveis com muitas execuções. A reversão fraca depende do resultado observado e não desfaz arbitrariamente qualquer medição.

## Dados e acesso

Sem analytics, fontes remotas ou pedidos de rede da aplicação. Melhores resultados ficam no armazenamento deste navegador, quando disponível. O botão de exportação gera um JSON local. O som é opcional e começa desligado.

Projeto de Ágatha Castro · 2026.
