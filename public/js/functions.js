
function imo(){
    console.log("hbjvkmc");
}
function initScene(objPath) {
  // Set up the scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add a light to the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Load the OBJ file
  const loader = new THREE.OBJLoader();
  loader.load(
      objPath, // Path to the OBJ file
      (object) => {
          scene.add(object); // Add the loaded object to the scene
      },
      (xhr) => {
          console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
          console.error('Error loading OBJ file:', error);
      }
  );

  // Set the camera position
  camera.position.z = 5;

  // Animation loop
  const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
  };

  animate();

  // Handle window resizing
  window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("uyubjb");
    const fileInput = document.getElementById('inputGroupFile01');
    fileInput.addEventListener('change', function(event) {
        filetinker(event.target);
    });
});

function filetinker(inputElement) {
    // Your original filetinker logic here
    console.log("File selected.");
    if (inputElement.files.length > 0) {
        var model="/model/pants.obj";
        var tex="/model/texture.jpg";
        generateTexture(model,tex,1.0,);
    } else {
        alert('No file selected.');
    }
}
function toggleMenu() {
    const menu = document.getElementById('formatSelect');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
  

 
  

 
  
  window.onclick = function (event) {
    const menu = document.getElementById('formatSelect');
    if (event.target !== menu && event.target.tagName !== 'BUTTON') {
      menu.style.display = 'none';
    }
  };
  function generateTexture(objPath, texturePath, scaleFactor = 1.0) {
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(texturePath, () => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });
  
    const loader = new THREE.OBJLoader();
    loader.load(
      objPath,
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            const geometry = child.geometry;
            geometry.computeBoundingBox();
            const min = geometry.boundingBox.min;
            const max = geometry.boundingBox.max;
            const size = new THREE.Vector3().subVectors(max, min);
  
            const uvAttribute = geometry.getAttribute('position').array;
            const uvs = [];
  
            for (let i = 0; i < uvAttribute.length; i += 3) {
              const x = (uvAttribute[i] - min.x) / size.x;
              const y = (uvAttribute[i + 1] - min.y) / size.y;
              uvs.push(x * scaleFactor, y * scaleFactor);
            }
  
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            child.material = new THREE.MeshBasicMaterial({ map: texture });
          }
        });
  
        const exporter = new THREE.OBJExporter();
        const content = exporter.parse(object);
        
        const link = document.createElement('a');
        const blob = new Blob([content], { type: 'application/octet-stream' });
        link.href = URL.createObjectURL(blob);
        link.download = 'model.obj'; // Specify the filename directly
        document.body.appendChild(link); // Append to the body to make it clickable
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the link
        
  
        URL.revokeObjectURL(link.href);
      },
      (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
      (error) => console.error('Error loading OBJ file:', error)
    );
  }
function convertOBJtoSTL(objPath) {
  const loader = new THREE.OBJLoader();
  loader.load(
      objPath,
      (object) => {
          const exporter = new THREE.STLExporter();
          const stlData = exporter.parse(object);

          // Create a Blob from the exported STL data
          const blob = new Blob([stlData], { type: 'application/octet-stream' });

          // Create a link to download the STL file
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'model.stl'; // Specify the filename
          link.click();

          // Clean up the object URL
          URL.revokeObjectURL(link.href);
      },
      (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
      (error) => console.error('Error loading OBJ file:', error)
  );
}



function saveOBJLocally(objPath) {
  const loader = new THREE.OBJLoader();
  loader.load(
    objPath,
    (object) => {
      const exporter = new THREE.OBJExporter();
      const content = exporter.parse(object);

      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'exported_model.obj'; // Specify the filename
      link.click();
      URL.revokeObjectURL(link.href);
    },
    (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
    (error) => console.error('Error loading OBJ file:', error)
  );
}


function convertOBJtoGLTF(objPath) {
  const loader = new THREE.OBJLoader();
  loader.load(
      objPath,
      (object) => {
          const exporter = new THREE.GLTFExporter();
          exporter.parse(
              object,
              (result) => {
                  // Check if the result is a Blob or JSON
                  let blob;
                  if (result instanceof ArrayBuffer) {
                      blob = new Blob([result], { type: 'application/octet-stream' });
                  } else if (result instanceof Blob) {
                      blob = result; // If it's already a Blob
                  } else {
                      const json = JSON.stringify(result);
                      blob = new Blob([json], { type: 'application/json' });
                  }

                  // Create a link to download the file
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'model.gltf'; // Specify the filename
                  link.click();

                  // Clean up the object URL
                  URL.revokeObjectURL(link.href);
              },
              (error) => console.error('Error exporting GLTF:', error)
          );
      },
      (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
      (error) => console.error('Error loading OBJ file:', error)
  );
}
