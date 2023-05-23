  // Configuración del tamaño y color de fondo del renderizador
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

  // Crear la Grilla
  var gridHelperXZ = new THREE.GridHelper( size, divisions, color2, color2);

  // Flechas
  var arrowX = new THREE.ArrowHelper( x, origin, arrowSize, colorR );
  var arrowY = new THREE.ArrowHelper( y, origin, arrowSize, colorG );
  var arrowZ = new THREE.ArrowHelper( z, origin, arrowSize, colorB );

  // Posición de la cámara
  var camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT);
  camera.position.x = 0;
  camera.position.y = 2;
  camera.position.z = 10;

  const light = new THREE.AmbientLight(0x404040, 5);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Se añaden los elementos a la escena
  scene.add(light);
  scene.add(camera);
  scene.add(gridHelperXZ);
  scene.add(arrowX);
  scene.add(arrowY);
  scene.add(arrowZ);

  // Función para crear un polígono 3D
  function crearPoligono3D(nlados, radio, altura) {
    const geometry = new THREE.CylinderBufferGeometry();
    const vertices = [];
    const indices = [];

    // Se calculan los vértices del polígono
    const ang = (2 * Math.PI) / nlados;
    for (let i = 0; i < nlados + 1; i++) {
      const x = radio * Math.cos(i * ang);
      const y = radio * Math.sin(i * ang);
      vertices.push(x, y, 0);
      vertices.push(x / 3, y / 3, altura);
    }

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

    // Se genera un color aleatorio
    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());

    // Se crea un material con el color aleatorio
    const material = new THREE.MeshBasicMaterial({ color: randomColor });

    // Se crea un objeto de malla que combina la geometría y el material
    const poligono = new THREE.Mesh(geometry, material);
    poligono.castShadow = true; // Habilitar lanzamiento de sombras
    poligono.receiveShadow = true; // Habilitar recepción de sombras

    return poligono;
  }

  // Función para crear los polígonos
  function crearPoligonos() {
    const cantidadPoligonos = 4;
    const radio = 1;
    const altura = 2;
    const separacion = 3;

    // Se crean los 4 polígonos inferiores
    for (let i = 0; i < cantidadPoligonos; i++) {
      const nlados = 5;
      const poligono = crearPoligono3D(nlados, radio, altura);

      const posicionX = (i - (cantidadPoligonos - 1) / 2) * separacion;
      poligono.position.x = posicionX;
      poligono.rotation.x = Math.PI/0.67;
      scene.add(poligono);
    }

    // Se crean los 4 polígonos superiores
    for (let i = 0; i < cantidadPoligonos; i++) {
      const nlados = 5;
      const poligono = crearPoligono3D(nlados, radio, altura);

      const posicionX = (i - (cantidadPoligonos - 1) / 2) * separacion;
      const posicionY = altura * 2; // Colocar encima de los primeros polígonos
      poligono.position.set(posicionX, posicionY, 0);
      poligono.rotation.x = Math.PI/0.67;
      scene.add(poligono);
    }
  }

  // Se llaman a las funciones para crear los polígonos y animar la escena
  crearPoligonos();

  const controls = new THREE.OrbitControls(camera, renderer.domElement);  

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
  renderer.shadowMap.enabled = true;
