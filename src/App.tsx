
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./style.css";

export default function App() {

  const [tela, setTela] = useState("inicio");
  const [modelo, setModelo] = useState("");

  const [dataAtividade, setDataAtividade] = useState("");
  const [atividade, setAtividade] = useState("");
  const [operador, setOperador] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [areaResponsavel, setAreaResponsavel] = useState("");
  const [localAtividade, setLocalAtividade] = useState("");
  const [pep, setPep] = useState("");

  const [turno, setTurno] = useState("");

  const [programacoes, setProgramacoes] = useState<any[]>([]);

  async function carregarProgramacoes() {
    const snapshot = await getDocs(collection(db, "programacoes"));
    const lista: any[] = [];
    snapshot.forEach(doc => lista.push(doc.data()));
    setProgramacoes(lista);
  }

  useEffect(() => {
    carregarProgramacoes();
  }, [tela]);

  function gerarID(modeloSelecionado: string) {
    const prefixo = modeloSelecionado.replace(/\s|–/g, "");
    const numero =
      programacoes.filter(p => p.modelo === modeloSelecionado).length + 1;

    return `${prefixo}-${String(numero).padStart(4, "0")}`;
  }

  async function confirmarSolicitacao() {
    if (
      !modelo || !dataAtividade || !atividade ||
      !operador || !responsavel ||
      !areaResponsavel || !localAtividade || !pep
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    const conflito = programacoes.some(
      p =>
        p.modelo === modelo &&
        p.dataAtividade === dataAtividade &&
        p.turno === turno
    );

    if (conflito) {
      alert("⚠ Data já reservada para esse turno!");
      return;
    }

    const id = gerarID(modelo);

    await addDoc(collection(db, "programacoes"), {
      id,
      modelo,
      dataAtividade,
      atividade,
      operador,
      responsavel,
      areaResponsavel,
      localAtividade,
      pep,
      turno,
      criadoEm: new Date()
    });

    alert(`✅ Reserva realizada!\nID: ${id}`);

    carregarProgramacoes();
  }

  function renderCalendario() {
    const dias = 30;

    return (
      <>
        <div className="header">
          <h1>PROGRAMAÇÕES</h1>
          <h2>MILLS</h2>
        </div>

        <div className="calendario-container">
          <div className="faixa-modelo">{modelo}</div>

          <h3>Turno 1</h3>
          <div className="grid-calendario">
            {Array.from({ length: dias }, (_, i) => {
              const dia = i + 1;
              const data = `2026-06-${String(dia).padStart(2, "0")}`;

              const reserva = programacoes.find(
                p =>
                  p.modelo === modelo &&
                  p.dataAtividade === data &&
                  p.turno === "Turno 1"
              );

              return (
                <div key={dia} className={`dia ${reserva ? "reservado" : ""}`}>
                  {dia}/06
                  {reserva && <div>RESERVADO</div>}
                </div>
              );
            })}
          </div>

          <h3>Turno 2</h3>
          <div className="grid-calendario">
            {Array.from({ length: dias }, (_, i) => {
              const dia = i + 1;
              const data = `2026-06-${String(dia).padStart(2, "0")}`;

              const reserva = programacoes.find(
                p =>
                  p.modelo === modelo &&
                  p.dataAtividade === data &&
                  p.turno === "Turno 2"
              );

              return (
                <div key={dia} className={`dia ${reserva ? "reservado" : ""}`}>
                  {dia}/06
                  {reserva && <div>RESERVADO</div>}
                </div>
              );
            })}
          </div>

          <h3>Turno 3</h3>
          <div className="grid-calendario">
            {Array.from({ length: dias }, (_, i) => {
              const dia = i + 1;
              const data = `2026-06-${String(dia).padStart(2, "0")}`;

              const reserva = programacoes.find(
                p =>
                  p.modelo === modelo &&
                  p.dataAtividade === data &&
                  p.turno === "Turno 3"
              );

              return (
                <div key={dia} className={`dia ${reserva ? "reservado" : ""}`}>
                  {dia}/06
                  {reserva && <div>RESERVADO</div>}
                </div>
              );
            })}
          </div>

        </div>

        <div className="acoes-rodape">
          <button className="btn-laranja" onClick={() => setTela("inicio")}>
            VOLTAR
          </button>

          <button className="btn-verde" onClick={() => setTela("programacoes")}>
            PROGRAMAÇÕES ID
          </button>
        </div>
      </>
    );
  }

  function renderProgramacoes() {
    return (
      <>
        <div className="header">
          <h1>PROGRAMAÇÕES ID</h1>
        </div>

        {/* tabela permanece igual */}
      </>
    );
  }

  return (
    <>
      <div className="app">

        {tela === "formulario" && (
          <>
            <div className="formulario">
              <div className="form-grid">

                <div className="label">TURNO</div>
                <div className="campo">
                  <select value={turno} onChange={e => setTurno(e.target.value)}>
                    <option value="">Selecione o turno</option>
                    <option value="Turno 1">Turno 1</option>
                    <option value="Turno 2">Turno 2</option>
                    <option value="Turno 3">Turno 3</option>
                  </select>
                </div>

                <div className="label">DATAS DA ATIVIDADE</div>
                <div className="campo">
                  {/* ✅ CORREÇÃO REAL */}
                  <input
                    type="date"
                    value={dataAtividade}
                    onChange={e => setDataAtividade(e.target.value)}
                  />
                </div>
                
                <div className="label">ATIVIDADE DETALHADA</div>
                <div className="campo">
                  <input onChange={e => setAtividade(e.target.value)} />
                </div>

                <div className="label">OPERADOR E EMPRESA</div>
                <div className="campo">
                  <select value={operador} onChange={e => setOperador(e.target.value)}>
                    <option value="">Selecione o operador</option>
                    <option value="">Selecione o operador. Caso haja mais de um, favor informar todos os nomes no e-mail de confirmação da programação.</option>
                    <option value="Adelmo Ricardo dos Santos - VSB">Adelmo Ricardo dos Santos - VSB</option>
                    <option value="Adriano Paixão de Souza - Progen">Adriano Paixão de Souza - Progen</option>
                    <option value="Ailton Gonçalves Do Carmo Junio - UPTEC">Ailton Gonçalves Do Carmo Junio - UPTEC</option>
                    <option value="Alex Gilsomar Soares - VSB (Ponte)">Alex Gilsomar Soares - VSB (Ponte)</option>
                    <option value="Augusto Cesar de Souza Ferreira - Caesa Vertical">Augusto Cesar de Souza Ferreira - Caesa Vertical</option>
                    <option value="Breno Cirilo Diniz Carvalho - Rocket">Breno Cirilo Diniz Carvalho - Rocket</option>
                    <option value="Carlos Alexandre Oliveira - HTG">Carlos Alexandre Oliveira - HTG</option>
                    <option value="Cléber Antônio Reis Silva - VSB">Cléber Antônio Reis Silva - VSB</option>
                    <option value="Dadson Dias Oliveira - UPTEC">Dadson Dias Oliveira - UPTEC</option>
                    <option value="David Santos Vicente - VSB (Ponte)">David Santos Vicente - VSB (Ponte)</option>
                    <option value="Deivisson Flaviano Lopes - VSB (Energ-Util)">Deivisson Flaviano Lopes - VSB (Energ-Util)</option>
                    <option value="Diego Pereira de Souza - MEC">Diego Pereira de Souza - MEC</option>
                    <option value="Edmar Antônio Assis - OPUS (Eletrica)">Edmar Antônio Assis - OPUS (Eletrica)</option>
                    <option value="Ednaldo José Vieira - Progen">Ednaldo José Vieira - Progen</option>
                    <option value="Ednilson Conceição Barbosa - MEC">Ednilson Conceição Barbosa - MEC</option>
                    <option value="Edno Soares da Silva - Napoli">Edno Soares da Silva - Napoli</option>
                    <option value="Edson Mariano da Cunha Junior - VSB">Edson Mariano da Cunha Junior - VSB</option>
                    <option value="Euder Eustáqui Godoi Junior - Rocket">Euder Eustáqui Godoi Junior - Rocket</option>
                    <option value="Fernando José Miranda - MEC">Fernando José Miranda - MEC</option>
                    <option value="Fernando Rodrigues dos Santos - HTG">Fernando Rodrigues dos Santos - HTG</option>
                    <option value="Gabriel da Silva Hilbert - MEC">Gabriel da Silva Hilbert - MEC</option>
                    <option value="Gabriel Henrique de Amorim dos Santos - UPTEC">Gabriel Henrique de Amorim dos Santos - UPTEC</option>
                    <option value="Gabriel Pereira Rocha - OPUS (Refrigeração)">Gabriel Pereira Rocha - OPUS (Refrigeração)</option>
                    <option value="Gabriel Victor Silva Reis - UPTEC">Gabriel Victor Silva Reis - UPTEC</option>
                    <option value="Gilmar Gregorio de Melo - VSB (Ponte)">Gilmar Gregorio de Melo - VSB (Ponte)</option>
                    <option value="Gilson Seabra Ribeiro - HTG">Gilson Seabra Ribeiro - HTG</option>
                    <option value="Girlanti Ramos Martins - UPTEC">Girlanti Ramos Martins - UPTEC</option>
                    <option value="Guilherme Alves Ribeiro - VSB">Guilherme Alves Ribeiro - VSB</option>
                    <option value="Guilherme Pereira Ferreira - Rocket">Guilherme Pereira Ferreira - Rocket</option>
                    <option value="Israel de Almeida - Caesa Vertical">Israel de Almeida - Caesa Vertical</option>
                    <option value="Jader Martins da Costa - Caesa Vertical">Jader Martins da Costa - Caesa Vertical</option>
                    <option value="Jhonatan Alves Costa - Progen">Jhonatan Alves Costa - Progen</option>
                    <option value="João Marcos Leite dos Santos - MEC">João Marcos Leite dos Santos - MEC</option>
                    <option value="Lincoln José da Silva Costa - VSB (Of. Central)">Lincoln José da Silva Costa - VSB (Of. Central)</option>
                    <option value="Luciano Cirino de Almeida - VSB (Ponte)">Luciano Cirino de Almeida - VSB (Ponte)</option>
                    <option value="Luiz Gustavo Ferreira - Rocket">Luiz Gustavo Ferreira - Rocket</option>
                    <option value="Natanael Moreira - Progen">Natanael Moreira - Progen</option>
                    <option value="Pablo Henrique Gonçalves Rocha - UPTEC">Pablo Henrique Gonçalves Rocha - UPTEC</option>
                    <option value="Paulo Henrique Moreira Guimaraes - Napoli">Paulo Henrique Moreira Guimaraes - Napoli</option>
                    <option value="Paulo Roberto - Caesa Vertical">Paulo Roberto - Caesa Vertical</option>
                    <option value="Philipe Trindade Silva  - OPUS (Refrigeração)">Philipe Trindade Silva  - OPUS (Refrigeração)</option>
                    <option value="Rafael de Jesus Silva - HTG">Rafael de Jesus Silva - HTG</option>
                    <option value="Ramon Mota Rodrigues - VSB (Ponte)">Ramon Mota Rodrigues - VSB (Ponte)</option>
                    <option value="Roberto Ferreira de Azevedo - OPUS (Areas Verdes)">Roberto Ferreira de Azevedo - OPUS (Areas Verdes)</option>
                    <option value="Robson Parreiras de Andrade - VSB (Ponte)">Robson Parreiras de Andrade - VSB (Ponte)</option>
                    <option value="Ronaldo Camilo de Sousa - Progen">Ronaldo Camilo de Sousa - Progen</option>
                    <option value="Sebastião Félix Gonçalves - OPUS (Eletrica)">Sebastião Félix Gonçalves - OPUS (Eletrica)</option>
                    <option value="Sergio Antônio da Silva - OPUS (Areas Verdes)">Sergio Antônio da Silva - OPUS (Areas Verdes)</option>
                    <option value="Sidney Vieira Aureliano - VSB">Sidney Vieira Aureliano - VSB</option>
                    <option value="Silvan Souza Moura - HTG">Silvan Souza Moura - HTG</option>
                    <option value="Thalles Jander da Silva Assunção - MEC">Thalles Jander da Silva Assunção - MEC</option>
                    <option value="Thiago Augusto de Souza Miranda - UPTEC">Thiago Augusto de Souza Miranda - UPTEC</option>
                    <option value="Tiago Correa Andrade - ISQ">Tiago Correa Andrade - ISQ</option>
                    <option value="Tiago Costa Ribeiro - Rocket">Tiago Costa Ribeiro - Rocket</option>
                    <option value="Valdson Ferreira da Silva - HTG">Valdson Ferreira da Silva - HTG</option>
                    <option value="Valter da Silva Santos - OPUS (Eletrica)">Valter da Silva Santos - OPUS (Eletrica)</option>
                    <option value="Vanderlei da Silva Santos - UPTEC">Vanderlei da Silva Santos - UPTEC</option>
                    <option value="Vinicius dos Santos Lopes - VSB (Ponte)">Vinicius dos Santos Lopes - VSB (Ponte)</option>
                    <option value="Wanderley Ferreira Santos - Progen">Wanderley Ferreira Santos - Progen</option>
                    <option value="Washington Luiz de Paula - VSB (Ponte)">Washington Luiz de Paula - VSB (Ponte)</option>
                    <option value="Wenderson Bessa - ISQ">Wenderson Bessa - ISQ</option>
                    <option value="Wesley Gabriel dos Santos - OPUS (Eletrica)">Wesley Gabriel dos Santos - OPUS (Eletrica)</option>
                    <option value="Willer Camilo de Amorim Junior - VSB">Willer Camilo de Amorim Junior - VSB</option>
                  </select>
                </div>

                <div className="label">RESPONSÁVEL / SOLICITANTE</div>
                <div className="campo">
                  <input onChange={e => setResponsavel(e.target.value)} />
                </div>

                <div className="label">ÁREA DO RESPONSÁVEL</div>
                <div className="campo">
                  <input onChange={e => setAreaResponsavel(e.target.value)} />
                </div>

                <div className="label">ÁREA E LOCAL DA ATIVIDADE</div>
                <div className="campo">
                  <input onChange={e => setLocalAtividade(e.target.value)} />
                </div>

                <div className="label">PEP / ORDEM</div>
                <div className="campo">
                  <input onChange={e => setPep(e.target.value)} />
                </div>

              
                </div>

              <button className="btn-solicitar" onClick={confirmarSolicitacao}>
                SOLICITAR
              </button>

            </div>
          </>
        )}

        {tela === "calendario" && renderCalendario()}
        {tela === "programacoes" && renderProgramacoes()}

      </div>
    </>
  );
}
