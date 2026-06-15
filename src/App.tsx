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

    // ✅ CORREÇÃO 2 (agora considera turno)
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
