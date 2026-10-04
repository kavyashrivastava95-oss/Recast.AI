"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "@designcodeio/threeui/style.css";

export interface ThreeDPaperProps {
  variant?: "original" | "glass" | "dark" | "iridescent";
  className?: string;
  speed?: number;
  interactive?: boolean;
}

// GLSL Vertex Shader: 3D Procedural Paper Wave Deformation
const VERTEX_SHADER = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_speed;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vElevation;

  // Simplex-inspired procedural noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    
    vec3 pos = position;
    float t = u_time * 0.35 * u_speed;
    
    // Multi-octave wave displacement simulating flexible archival vellum / parchment sheet
    float wave1 = sin(pos.x * 2.0 + t) * cos(pos.y * 1.6 + t * 0.8) * 0.32;
    float wave2 = sin(pos.x * 4.2 - t * 1.1) * sin(pos.y * 3.4 + t * 0.6) * 0.12;
    float noiseWave = snoise(pos.xy * 1.1 + vec2(t * 0.18)) * 0.20;
    
    // Interactive mouse tension ripple
    float distToMouse = distance(uv, u_mouse);
    float mouseWave = exp(-distToMouse * 3.8) * sin(distToMouse * 14.0 - t * 2.8) * 0.24;

    float totalElevation = wave1 + wave2 + noiseWave + mouseWave;
    pos.z += totalElevation;
    vElevation = totalElevation;

    // Approximate surface normal calculation
    vec3 neighborA = position + vec3(0.01, 0.0, 0.0);
    vec3 neighborB = position + vec3(0.0, 0.01, 0.0);
    neighborA.z += sin(neighborA.x * 2.0 + t) * cos(neighborA.y * 1.6 + t * 0.8) * 0.32;
    neighborB.z += sin(neighborB.x * 2.0 + t) * cos(neighborB.y * 1.6 + t * 0.8) * 0.32;
    
    vec3 tangentX = normalize(neighborA - pos);
    vec3 tangentY = normalize(neighborB - pos);
    vNormal = normalize(cross(tangentX, tangentY));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// GLSL Fragment Shader: Pure Light Mode Archival Book & Vellum Parchment Shader
const FRAGMENT_SHADER = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_variant;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vElevation;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Subtle edge rim for realistic paper borders
    float edgeRim = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

    // Warm directional lamp lighting
    vec3 lightDir = normalize(vec3(0.35, 0.85, 0.9));
    vec3 halfVector = normalize(lightDir + viewDir);
    float NdotH = max(dot(normal, halfVector), 0.0);
    float paperSheen = pow(NdotH, 36.0) * 0.38;

    // Archival Palette (Pure Light Theme)
    // Warm ivory parchment base, gentle sepia fold shadows, warm amber tone, soft deckled edge
    vec3 vellumCream = vec3(0.985, 0.978, 0.960);      // #fcfaf6 crisp light parchment
    vec3 foldShadow  = vec3(0.910, 0.880, 0.835);      // #e8e0d5 soft sepia shadow
    vec3 warmAmber   = vec3(0.945, 0.910, 0.855);      // #f1e8da warm paper tone
    vec3 edgeDeckle  = vec3(0.865, 0.825, 0.765);      // #ddd3c3 antique page rim

    // Light dispersion across elevation folds
    float foldFactor = smoothstep(-0.35, 0.35, vElevation);
    vec3 paperColor = mix(foldShadow, vellumCream, foldFactor);

    // Subtle lateral gradation across document page
    paperColor = mix(paperColor, warmAmber, vUv.x * 0.3 + vUv.y * 0.15);

    // Subtle antique rim shading
    paperColor = mix(paperColor, edgeDeckle, edgeRim * 0.30);

    // Soft satin paper specular highlight
    paperColor += vec3(0.995, 0.990, 0.980) * paperSheen;

    // Archival rag paper micro-fiber grain texture
    float grain = (fract(sin(dot(vUv * 480.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.032;
    paperColor += grain;

    // Gentle page vignette framing
    float vignette = smoothstep(0.98, 0.38, distance(vUv, vec2(0.5)));
    paperColor *= (vignette * 0.06 + 0.94);

    gl_FragColor = vec4(paperColor, 0.98);
  }
`;

export const ThreeDPaper: React.FC<ThreeDPaperProps> = ({
  variant = "original",
  className = "",
  speed = 1.0,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize Three.js scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    container.appendChild(canvas);

    // Procedural Archival 3D Paper Sheet Geometry
    const geometry = new THREE.PlaneGeometry(5.2, 3.2, 128, 128);

    const uniforms = {
      u_time: { value: 0.0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_speed: { value: speed },
      u_variant: { value: variant === "original" ? 0.0 : 1.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.22; // Gentle perspective tilt
    mesh.position.y = 0.1;
    scene.add(mesh);

    // Smooth Mouse tracking
    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, 1.0 - (e.clientY - rect.top) / rect.height));
      targetMouse = { x, y };
    };

    window.addEventListener("pointermove", handlePointerMove);

    // Resize Observer for responsive framing
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Render loop
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getElapsedTime();
      uniforms.u_time.value = delta;

      // Smooth damping on mouse input
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.06;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.06;
      uniforms.u_mouse.value.set(currentMouse.x, currentMouse.y);

      // Subtle dynamic camera float
      camera.position.x = (currentMouse.x - 0.5) * 0.35;
      camera.position.y = (currentMouse.y - 0.5) * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);
    setIsReady(true);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      if (container && canvas && canvas.parentNode === container) {
        container.removeChild(canvas);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [speed, variant, interactive]);

  return (
    <div
      ref={containerRef}
      className={`shader-frame relative w-full h-full min-h-[460px] overflow-hidden bg-[#fbf9f4] select-none ${className}`}
      data-threeui-variant={variant}
    >
      {/* Light archival ambient tone prior to hydration */}
      {!isReady && (
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-100 via-[#fbf9f4] to-amber-50 animate-pulse" />
      )}
    </div>
  );
};

export default ThreeDPaper;
