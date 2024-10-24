// Función que obtiene la palabra secreta desde la API pública y la valida
async function obtenerPalabraSecreta() {
    try {
        let palabraValida = false;
        let palabra;

        while (!palabraValida) {
            const response = await fetch('https://clientes.api.greenborn.com.ar/public-random-word?c=1&l=5');
            const data = await response.json();
            palabra = data[0].toUpperCase();

            if (/^[A-Z]{5}$/.test(palabra)) {
                palabraValida = true;
                console.log("Palabra inválida, solicitando otra...");
            }
        }

        console.log("Palabra secreta válida desde API: ", palabra);
        return palabra;

    } catch (error) {
        console.error("Error al obtener la palabra secreta: ", error);
        return listaDePalabras[Math.floor(Math.random() * listaDePalabras.length)].toUpperCase();
    }
}


let palabraSecreta;
(async function() {
    palabraSecreta = await obtenerPalabraSecreta();
    construirTablero();
    construirTeclado();
})();

//Funcion para construir el Tablero
function construirTablero(){
   const tablero = document.getElementById("tablero");
    for(let i = 0; i < 6; i++){
        let fila = document.createElement("div"); 
        fila.className = "fila";

        for(let j = 0; j < 5; j++){
            let caja = document.createElement("div");
            caja.className = "caja";
            fila.appendChild(caja);
        }

        tablero.appendChild(fila);
    }
}

//Funcion para construir el Teclado
function construirTeclado() {
    const teclado = document.getElementById("teclado");

    // Definición de las letras por fila
    const letrasPorFila = [
        "QWERTYUIOP",
        "ASDFGHJKLÑ",
        "DELZXCVBNMENTER"
    ];

    letrasPorFila.forEach(filaLetras => {
        let fila = document.createElement("div"); 
        fila.className = "fila-letras";

        for (let i = 0; i < filaLetras.length; i++) {
            let letra = filaLetras[i];
            let boton = document.createElement("button");

            if (filaLetras.startsWith("DEL", i)) {
                boton.textContent = "DEL";
                boton.className = "espacio";
                i += 2;
            } else if (filaLetras.startsWith("ENTER", i)) {
                boton.textContent = "ENTER";
                boton.className = "espacio";
                i += 4;
            } else {
                boton.textContent = letra;
            }

            boton.addEventListener('click', function () {
                manejarClickTeclado(boton.textContent);
            });

            fila.appendChild(boton);
        }

        teclado.appendChild(fila);
    });
}

let palabraActual = [];
let filaActual = 0;

// Función para manejar el teclado
function manejarClickTeclado(letra) {
    const filas = document.querySelectorAll(".fila");
    const celdas = filas[filaActual].children;
    const mensaje = document.getElementById("mensaje"); 

    if (letra === "DEL") {
        if (palabraActual.length > 0) {
            palabraActual.pop();
            celdas[palabraActual.length].textContent = ""; 
            console.log("Palabra actual después de borrar: ", palabraActual.join(""));
        }
    }
    
    else if (letra === "ENTER") {
        if (palabraActual.length === 5) { 
            let palabraIngresada = palabraActual.join("").toUpperCase();
            console.log("Palabra ingresada: ", palabraIngresada);

            if (palabraIngresada === palabraSecreta) {
                mensaje.textContent = "¡Bien ahí!🏆";
                mensaje.style.color = "green";

                validarPalabra(palabraIngresada);
                setTimeout(reiniciarJuego, 3000); 

            } else {
                mensaje.textContent = "Palabra incorrecta 🙁";
                mensaje.style.color = "red";
                validarPalabra(palabraIngresada);

                setTimeout(() => {
                    mensaje.textContent = ""; 
                }, 3000);

                palabraActual = [];
                filaActual++;

                if (filaActual >= 6) {
                    mensaje.textContent = "Se terminaron los intentos😭. La palabra era: " + palabraSecreta;
                    mensaje.style.color = "red";

                    setTimeout(reiniciarJuego, 3000); 
                }
            }
        } else {
            mensaje.textContent = "Debes ingresar 5 letras";
            mensaje.style.color = "red";
            setTimeout(() => {
                mensaje.textContent = "";
            }, 3000);
        }
    }
    
    else {
        if (palabraActual.length < 5) { 
            palabraActual.push(letra);
            celdas[palabraActual.length - 1].textContent = letra; 
            console.log("Palabra actual: ", palabraActual.join(""));
        }
    }
}


// Validar la palabra ingresada letra por letra y pintar las celdas
function validarPalabra(palabraIngresada) {
    const filas = document.querySelectorAll(".fila");
    const celdas = filas[filaActual].children; 

    for (let i = 0; i < palabraIngresada.length; i++) {
        let letra = palabraIngresada[i];
        let celda = celdas[i];

        if (letra === palabraSecreta[i]) {
            celda.style.backgroundColor = "green"; 
        } else if (palabraSecreta.includes(letra)) {
            celda.style.backgroundColor = "yellow";
        } else {
            celda.style.backgroundColor = "gray";
        }
    }
}


// Función para reiniciar el juego
function reiniciarJuego() {

    const celdas = document.querySelectorAll(".caja");
    celdas.forEach(celda => {
        celda.textContent = ""; 
        celda.style.backgroundColor = ""; 
    });

    palabraActual = [];
    filaActual = 0;

    obtenerPalabraSecreta().then(nuevaPalabra => {
        palabraSecreta = nuevaPalabra;
        console.log("Nueva palabra secreta: ", palabraSecreta);
    });

    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = "";
}

