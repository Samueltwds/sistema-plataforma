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
      !areaResponsavel || !localAtividade || !pep || !turno
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

  // ✅ CALENDÁRIO POR TURNO
  function renderCalendarioPorTurno(nomeTurno: string) {
    const dias = 31;

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + 1;
    const mesFormatado = String(mes).padStart(2, "0");

    return (
      <div>
        <h3 style={{ marginTop: "20px" }}>{nomeTurno}</h3>

        <div className="grid-calendario">
          {Array.from({ length: dias }, (_, i) => {
            const dia = i + 1;

            const data = `${ano}-${mesFormatado}-${String(dia).padStart(2, "0")}`;

            const reserva = programacoes.find(
              p =>
                p.modelo === modelo &&
                p.dataAtividade === data &&
                p.turno === nomeTurno
            );

            return (
              <div key={dia} className={`dia ${reserva ? "reservado" : ""}`}>
                {dia}/{mesFormatado}
                {reserva && <div>RESERVADO</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderCalendario() {
    return (
      <>
        <div className="header">
          <h1>PROGRAMAÇÕES</h1>
          <h2>MILLS</h2>
        </div>

        <div className="calendario-container">

          <div className="faixa-modelo">{modelo}</div>

          <h3>Turno 1 - Horário do turno 00:04 às 07:56</h3>
          {renderCalendarioPorTurno("Turno 1")}

          <h3>Turno 2 - Horário do turno 07:45 às 16:15</h3>
          {renderCalendarioPorTurno("Turno 2")}

          <h3>Turno 3 - Horário do turno 16:04 às 00:15</h3>
          {renderCalendarioPorTurno("Turno 3")}

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
              <th>TURNO</th>
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
                <td>{p.turno}</td>
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

              <div className="modelos">

                <div className="card">
                  <img src="https://cdn.corenexis.com/files/c/2338645720.png" />
                  <h3>800 AJ – 26 METROS</h3>
                  <button className="btn-verde" onClick={() => setModelo("800 AJ – 26 METROS")}>
                    SOLICITAR
                  </button>
                </div>

                <div className="card">
                  <img src="https://www.image2url.com/r2/default/images/1777469123991-f15ef490-97d8-40a3-9f72-f699e88629d1.blob" />
                  <h3>Z45 – 16 METROS</h3>
                  <button className="btn-verde" onClick={() => setModelo("Z45 – 16 METROS")}>
                    SOLICITAR
                  </button>
                </div>

              </div>

              <div className="acoes">
                <p><strong>MODELO SELECIONADO</strong></p>
                <p>{modelo || "Nenhum"}</p>

                <button className="btn-laranja" disabled={!modelo} onClick={() => setTela("calendario")}>
                  VISUALIZAR CALENDÁRIO
                </button>

                <button className="btn-laranja" disabled={!modelo} onClick={() => setTela("formulario")}>
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

            <div className="barra-voltar">
              <button className="btn-voltar" onClick={() => setTela("inicio")}>
                ← VOLTAR
              </button>
            </div>

            <div className="formulario">

              <div className="modelo-info">
                <strong>MODELO SELECIONADO:</strong> {modelo}
              </div>

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
                  <input type="date" onChange={e => setDataAtividade(e.target.value)} />
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
