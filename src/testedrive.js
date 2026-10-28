import "./comum.js";
import { carregarCarros } from "./dados.js";
import { iniciarTestDrive } from "./testdrive-form.js";

// Carrega os carros e pré-seleciona o da URL (?carro=Nome)
carregarCarros().then((cars) => {
  const td = iniciarTestDrive(cars);
  const pre = new URLSearchParams(location.search).get("carro");
  if (pre && cars.some((c) => c.nome === pre)) td.escolher(pre);
});