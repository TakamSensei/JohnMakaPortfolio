<script type="module">
    // --- Scene Setup ---
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x4D96FF, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // --- Shapes ---
    const shapes = [];
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0x4D96FF,
        emissive: 0x4D96FF,
        emissiveIntensity: 0.5,
        metalness: 0.1,
        roughness: 0.4,
    });

    for (let i = 0; i < 50; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        mesh.scale.setScalar(Math.random() * 0.2 + 0.1);
        mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        shapes.push(mesh);
    }
    scene.add(...shapes);

    camera.position.z = 15;

    // --- Interactivity ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedObject = null;

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);

        // Update raycaster
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(shapes);

        if (intersects.length > 0) {
            if (intersectedObject !== intersects[0].object) {
                // If we are hovering over a new object
                if (intersectedObject) {
                    // Restore the previous object
                    gsap.to(intersectedObject.scale, { x: intersectedObject.userData.initialScale, y: intersectedObject.userData.initialScale, z: intersectedObject.userData.initialScale, duration: 0.5 });
                    gsap.to(intersectedObject.material, { emissiveIntensity: 0.5, duration: 0.5 });
                }
                intersectedObject = intersects[0].object;
                intersectedObject.userData.initialScale = intersectedObject.scale.x;
                // Animate the new hovered object
                gsap.to(intersectedObject.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
                gsap.to(intersectedObject.material, { emissiveIntensity: 2, duration: 0.5 });
            }
        } else {
            // If not hovering over any object
            if (intersectedObject) {
                // Restore the last hovered object
                gsap.to(intersectedObject.scale, { x: intersectedObject.userData.initialScale, y: intersectedObject.userData.initialScale, z: intersectedObject.userData.initialScale, duration: 0.5 });
                gsap.to(intersectedObject.material, { emissiveIntensity: 0.5, duration: 0.5 });
                intersectedObject = null;
            }
        }

        // Animate shapes
        shapes.forEach(shape => {
            shape.rotation.x += 0.001;
            shape.rotation.y += 0.001;
        });

        renderer.render(scene, camera);
    }
    animate();

    // --- Handle Window Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

</script>