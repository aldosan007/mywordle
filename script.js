const listaDePalabras = ["JUEGO", "CASAS", "NIEVE", "PERRO", "GATOS", "COCHE", "PARTE", "LIBRO", "FUEGO", "PLATA"];
let palabraSecreta = listaDePalabras[Math.floor(Math.random() * listaDePalabras.length)].toUpperCase(); 
console.log("Palabra secreta: ", palabraSecreta); 

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

function manejarClickTeclado(letra) {
    if (letra === "DEL") {
        palabraActual.pop();
        console.log("Palabra actual después de borrar: ", palabraActual.join(""));
    } else if (letra === "ENTER") {
        let palabraIngresada = palabraActual.join("").toUpperCase();
        console.log("Palabra ingresada: ", palabraIngresada);

        if (palabraIngresada === palabraSecreta) {
            console.log("¡Bien ahí!🏆");
        } else {
            console.log("Palabra incorrecta 🙁: ", palabraIngresada);
        }

        palabraActual = [];
    } else {
        if (palabraActual.length < 5) { 
            palabraActual.push(letra);
            console.log("Palabra actual: ", palabraActual.join(""));
        }
    }
}

construirTablero();
construirTeclado();
