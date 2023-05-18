var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();

// Variables para la Grilla y Flechas
var size = 20;
var arrowSize = 5;
var divisions = 20;
var origin = new THREE.Vector3( 0, 0, 0 );
var x = new THREE.Vector3( 1, 0, 0 );
var y = new THREE.Vector3( 0, 1, 0 );
var z = new THREE.Vector3( 0, 0, 1 );
var color2 = new THREE.Color( 0x333333 ); 
var colorR = new THREE.Color( 0xAA0000 );
var colorG = new THREE.Color( 0x00AA00 );
var colorB = new THREE.Color( 0x0000AA );

//Crear la Grilla
var gridHelperXZ = new THREE.GridHelper( size, divisions, color2, color2);

//Flechas
var arrowX = new THREE.ArrowHelper( x, origin, arrowSize, colorR );
var arrowY = new THREE.ArrowHelper( y, origin, arrowSize, colorG );
var arrowZ = new THREE.ArrowHelper( z, origin, arrowSize, colorB );

// Posición de la camara
var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 10;
const light = new THREE.AmbientLight(0x404040, 5);

// Se añaden los elementos a la escena
scene.add(light);
scene.add(camera);
scene.add(gridHelperXZ);
scene.add(arrowX);
scene.add(arrowY);
scene.add(arrowZ);

// Funciones

function crearPoligono(nlados, radio) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
  
    // Se calculan de los vértices del polígono
    const ang = (2 * Math.PI) / nlados;
    for (let i = 0; i < nlados + 1; i++) {
      const x = radio * Math.cos(i * ang);
      const y = radio * Math.sin(i * ang);
      vertices.push(x, y, 0); // Se agregan la coordenada Z como 0
    }
  
    // Se agregan los vértices a la geometría
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  
    // Se crea un material para el polígono
    const material = new THREE.LineBasicMaterial({ color: 0x000fff });
  
    // Se crea un objeto de malla que combina la geometría y el material
    const poligono = new THREE.Line(geometry, material);
  
    return poligono;
  }

  function crearPoligono3D(nlados, radio, altura) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];

    // Se calculan los vértices del polígono
    const ang = (2 * Math.PI) / nlados;
    for (let i = 0; i < nlados; i++) {
        const x = radio * Math.cos(i * ang);
        const y = radio * Math.sin(i * ang);
        vertices.push(x, y, 0);
        vertices.push(x, y, altura);
    }

    // Se agrega los dos últimos vértices para cerrar las caras
    vertices.push(radio, 0, 0);
    vertices.push(radio, 0, altura);

    // Se asigna los vértices a la geometría
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Se agrega los índices para definir las caras
    for (let i = 0; i < nlados; i++) {
        const startIndex = i * 2;
        indices.push(startIndex, startIndex + 1, startIndex + 3);
        indices.push(startIndex, startIndex + 3, startIndex + 2);
    }

    // Añadimos los índices para cerrar las caras superior e inferior
    const numVertices = vertices.length / 3;
    const ultimoVertice = numVertices - 1;
    const penultimoVertice = numVertices - 2;
    for (let i = 0; i < nlados; i++) {
        indices.push(ultimoVertice - i * 2, ultimoVertice - (i + 1) * 2, penultimoVertice);
        indices.push(i * 2, (i + 1) * 2, ultimoVertice - i * 2 - 1);
    }

    // Se asignan los índices a la geometría
    geometry.setIndex(indices);

    // Se crea un material para el polígono
    const material = new THREE.LineBasicMaterial({ color: 0x000fff });

    // Se crea un objeto de malla que combina la geometría y el material
    const poligono = new THREE.Line(geometry, material);

    return poligono;
}


var poligoninho = crearPoligono(5,1);
//scene.add(poligoninho);

Piramide1 = crearPoligono3D(5,1,2);
Piramide2 = crearPoligono3D(5,1,2);
Piramide3 = crearPoligono3D(5,1,2);
Piramide4 = crearPoligono3D(5,1,2);

scene.add(Piramide1);
scene.add(Piramide2);
scene.add(Piramide3);
scene.add(Piramide4);

Piramide1.rotation.x = Math.PI/0.67
Piramide2.rotation.x = Math.PI/0.67
Piramide3.rotation.x = Math.PI/0.67
Piramide4.rotation.x = Math.PI/0.67

Piramide1.position.x = 5
Piramide2.position.x = 1.5
Piramide3.position.x = -1.5
Piramide4.position.x = -5


const controls = new THREE.OrbitControls(camera, renderer.domElement);  

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

