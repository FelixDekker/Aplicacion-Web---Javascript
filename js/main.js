class Alumno {
  constructor(nombre, curso, nota1erparcial, nota2doparcial, notaconcepto) {
    this.nombre = nombre;
    this.curso = curso;
    this.nota1erparcial = nota1erparcial;
    this.nota2doparcial = nota2doparcial;
    this.notaconcepto = notaconcepto;
  }
}

let listadoAlumnos = [];

let formulario = document.getElementById("formulario");

function enviarinfoform(event) {
  event.preventDefault();

  let nombre = document.getElementById("nombre").value;
  let curso = document.getElementById("curso").value;
  let nota1erparcial = document.getElementById("nota1erparcial").value;
  let nota2doparcial = document.getElementById("nota2doparcial").value;
  let notaconcepto = document.getElementById("notaconcepto").value;

  if (nombre === "" || curso === "" || nota1erparcial === "" || nota2doparcial === "" || notaconcepto === "") {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, complete todos los campos",
    });
    return;
  }

  let alumno = new Alumno(nombre, curso, parseFloat(nota1erparcial), parseFloat(nota2doparcial), parseFloat(notaconcepto));

  listadoAlumnos.push(alumno);

  guardarNotasEnLocalStorage();

  Swal.fire({
    icon: "success",
    title: "Alumno agregado",
    text: "Los datos del alumno se han agregado correctamente",
  });

  formulario.reset();
}

function guardarNotasEnLocalStorage() {
  localStorage.setItem("listadoAlumnos", JSON.stringify(listadoAlumnos));
}

function obtenerNotasDeLocalStorage() {
  const notasGuardadas = localStorage.getItem("listadoAlumnos");
  if (notasGuardadas) {
    listadoAlumnos = JSON.parse(notasGuardadas);
  }
}

formulario.addEventListener("submit", enviarinfoform);

document.getElementById("btn-mejor-promedio").addEventListener("click", () => {
  if (listadoAlumnos.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se ha ingresado ningún alumno.",
    });
    return;
  }

  let mejorPromedio = listadoAlumnos.reduce((prev, current) =>
    calcularPromedio(current) > calcularPromedio(prev) ? current : prev
  );

  Swal.fire({
    icon: "info",
    title: "Mejor promedio",
    html: `<strong>Alumno:</strong> ${mejorPromedio.nombre}<br><strong>Promedio:</strong> ${calcularPromedio(mejorPromedio)}`,
  });
});

document.getElementById("btn-peor-promedio").addEventListener("click", () => {
  if (listadoAlumnos.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se ha ingresado ningún alumno.",
    });
    return;
  }

  let peorPromedio = listadoAlumnos.reduce((prev, current) =>
    calcularPromedio(current) < calcularPromedio(prev) ? current : prev
  );

  Swal.fire({
    icon: "info",
    title: "Peor promedio",
    html: `<strong>Alumno:</strong> ${peorPromedio.nombre}<br><strong>Promedio:</strong> ${calcularPromedio(peorPromedio)}`,
  });
});

function calcularPromedio(alumno) {
  let sumaNotas = alumno.nota1erparcial + alumno.nota2doparcial + alumno.notaconcepto;

  return sumaNotas / 3;
}

obtenerNotasDeLocalStorage();

document.getElementById("btn-generar-grafico").addEventListener("click", () => {
  if (listadoAlumnos.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se ha ingresado ningún alumno.",
    });
    return;
  }

  const alumnosAprobados = listadoAlumnos.filter(
    (alumno) => calcularPromedio(alumno) > 7
  );

  const alumnosDesaprobados = listadoAlumnos.filter(
    (alumno) => calcularPromedio(alumno) <= 7
  );

  const cantidadAprobados = alumnosAprobados.length;
  const cantidadDesaprobados = alumnosDesaprobados.length;

  const ctx = document.getElementById("grafico").getContext("2d");

  window.grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Aprobados", "Desaprobados"],
      datasets: [
        {
          label: "Cantidad",
          backgroundColor: ["green", "red"],
          data: [cantidadAprobados, cantidadDesaprobados],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(cantidadAprobados, cantidadDesaprobados) + 1,
        },
      },
    },
  });
});
 

document.getElementById("btn-borrar-datos").addEventListener("click", () => {

  localStorage.removeItem("listadoAlumnos");
  listadoAlumnos = [];

  Swal.fire({
    icon: "success",
    title: "Datos borrados",
    text: "Se han eliminado todos los datos almacenados",
  });
});
