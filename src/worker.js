console.log("Eu estou aqui!");
postMessage("Ready");

onmessage = ({ data }) => {
  console.log("Olá sou o Worker", data);
};
