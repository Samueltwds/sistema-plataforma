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

  const [programacoes, setProgramacoes] = useState<any[]>([]);

  async function carregarProgramacoes() {
    const snapshot = await getDocs(collection(db, "programacoes"));
    const lista: any[] = [];
    snapshot.forEach(doc => lista.push(doc.data()));
    setProgramacoes(lista);
  }

  useEffect(() => {
    carregarProgramacoes();
  }, []);

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
      p => p.modelo === modelo && p.dataAtividade === dataAtividade
    );

    if (conflito) {
      alert("⚠ Data já reservada!");
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
      criadoEm: new Date()
    });

    alert(`✅ Reserva realizada!\nID: ${id}`);
    carregarProgramacoes();
  }

  function renderCalendario() {
    const dias = 31;

    return (
      <>
        <div className="header">
          <h1>PROGRAMAÇÕES</h1>
          <h2>MILLS</h2>
        </div>

        <div className="calendario-container">
          <div className="faixa-modelo">{modelo}</div>

          <div className="grid-calendario">
            {Array.from({ length: dias }, (_, i) => {
              const dia = i + 1;
              const data = `2026-05-${String(dia).padStart(2, "0")}`;

              const reserva = programacoes.find(
                p => p.modelo === modelo && p.dataAtividade === data
              );

              return (
                <div key={dia} className={`dia ${reserva ? "reservado" : ""}`}>
                  {dia}/05
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

        <table border={1} width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATA</th>
              <th>ATIVIDADE</th>
              <th>OPERADOR</th>
              <th>RESPONSÁVEL</th>
              <th>ÁREA</th>
              <th>LOCAL</th>
              <th>PEP</th>
            </tr>
          </thead>
          <tbody>
            {programacoes.map((p, i) => (
              <tr key={i}>
                <td>{p.id}</td>
                <td>{p.dataAtividade}</td>
                <td>{p.atividade}</td>
                <td>{p.operador}</td>
                <td>{p.responsavel}</td>
                <td>{p.areaResponsavel}</td>
                <td>{p.localAtividade}</td>
                <td>{p.pep}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <br />

        <button className="btn-laranja" onClick={() => setTela("inicio")}>
          VOLTAR
        </button>
      </>
    );
  }

  return (
    <>
      <div className="app">

        {tela === "inicio" && (
          <>
            <div className="header">
              <h1>SOLICITAR PLATAFORMA</h1>
              <h2>MILLS</h2>
            </div>

            <div className="inicio-grid">

              <div className="modelos"></div>

              <div className="acoes">
                <button onClick={() => setTela("formulario")}>
                  SOLICITAR MODELO
                </button>
              </div>

            </div>
          </>
        )}

        {tela === "formulario" && (
          <>
            <div className="header">
              <h1>SOLICITAR PLATAFORMA FIXA</h1>
            </div>

            <div className="formulario">

              <div className="modelo-info">
                <strong>MODELO SELECIONADO:</strong> {modelo}
              </div>

              <div className="form-grid">

                <div className="label">OPERADOR E EMPRESA</div>
                <div className="campo">

                  <select value={operador} onChange={e => setOperador(e.target.value)}>
                    <option value="">Selecione o operador</option>

                    <option value="Adelmo Ricardo dos Santos - VSB">Adelmo Ricardo dos Santos - VSB</option>
                    <option value="Adriano Paixão de Souza - Progen">Adriano Paixão de Souza - Progen</option>
                    <option value="Ailton Gonçalves Do Carmo Junior - UPTEC">Ailton Gonçalves Do Carmo Junior - UPTEC</option>
                    <option value="Alex Gilsom Soares - VSB (Ponte)">Alex Gilsom Soares - VSB (Ponte)</option>
                    <option value="Augusto Cesar de Souza Ferreira - Caesa Vertical">Augusto Cesar de Souza Ferreira - Caesa Vertical</option>
                    <option value="Breno Cirilo Diniz Carvalho - Rocket">Breno Cirilo Diniz Carvalho - Rocket</option>
                    <option value="Carlos Alexandre Oliveira - HTG">Carlos Alexandre Oliveira - HTG</option>
                    <option value="Cleber Antônio Reis Silva - VSB">Cleber Antônio Reis Silva - VSB</option>
                    <option value="Dadson Dias Oliveira - UPTEC">Dadson Dias Oliveira - UPTEC</option>
                    <option value="Edno Soares da Silva - Napoli">Edno Soares da Silva - Napoli</option>
                  </select>

                </div>

              </div>

            </div>
          </>
        )}

        {tela === "calendario" && renderCalendario()}
        {tela === "programacoes" && renderProgramacoes()}

      </div>
    </>
  );
}
