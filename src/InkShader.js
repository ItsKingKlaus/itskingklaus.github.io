import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
//import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

//import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import { SobelOperatorShader } from './Shaders/SobelOperatorShader.js';


//////////////////////////////////////////////////////////////////////////////////////////////
/// shaders //////////////////////////////////////////////////////////////////////////////////


// Shader code adapted from --> https://webgl-shaders.com/pencil-example.html

const vshader = `
#define GLSLIFY 1
// Common varyings
varying vec3 v_position;
varying vec3 v_normal;
varying vec2 vUv;

/*
 * The main program
 */
void main() {
    // Save the varyings
    v_position = position;
    v_normal = normalize(normalMatrix * normal);

    // Vertex shader output

    // model matrix -> position, scale, rotation of model
    // view matrix -> position, orientation of camera
    // projection matrix -> projects object onto screen ( aspect ratio and perspective )


    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const fshader = `
#define GLSLIFY 1

uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec3 v_position;
varying vec3 v_normal;


////////////////////////////////////
// noise ///////////////////////////


//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//      https://github.com/visionary-3d/noise-collection/blob/main/glsl/perlin.glsl

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float noise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}



////////////////////////////////////
// lines ///////////////////////////

mat2 rotate(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float diffuseFactor(vec3 normal, vec3 light_direction) {
    float df = dot(normalize(normal), normalize(light_direction));
    if (gl_FrontFacing) df = -df;
    return max(0.0, df);
}

float horizontalLine(vec2 pixel, float y_pos, float width) {
    return 1.0 - smoothstep(-1.0, 1.0, abs(pixel.y - y_pos) - 0.5 * width);
}

////////////////////////////////////
// main ////////////////////////////


void main() {

    float min_resolution = min(u_resolution.x, u_resolution.y);
    vec3 light_direction = vec3((u_mouse - 0.3 * u_resolution) / min_resolution, -.99);
    float df = diffuseFactor(v_normal, light_direction) * .90;

    vec2 pos = gl_FragCoord.xy - 0.5 * u_resolution;

    // NOISE: warp coordinate space (main effect)
    float warp = noise(vec3(pos * 0.02, 0.4));
    pos.y += warp * 8.0;

    // rotate
    pos = rotate(radians(90.0)) * pos;

    // noise for local variation
    float n1 = noise(vec3(pos * 0.05, 1.));
    float n2 = noise(vec3(pos * 0.1,  0.7));

    // line properties
    float line_width = 6.0 * (1.0 - smoothstep(0.0, 0.5, df)) + 0.4;
    line_width += n2 * 1.2;
    

    float lines_sep = 5.0;

    vec2 grid_pos = vec2(pos.x, mod(pos.y, lines_sep));

    float line_1 = horizontalLine(
        grid_pos,
        lines_sep / 8.0 + n1 * 2.0,
        line_width
    );

    grid_pos.y = mod(pos.y + lines_sep / 2.0, lines_sep);

    float line_2 = horizontalLine(
        grid_pos,
        lines_sep / 8.0 + n1 * 2.0,
        line_width
    );

    // second set
    pos = rotate(radians(-0.5)) * pos;
  
    lines_sep = 4.0;

    grid_pos = vec2(pos.x, mod(pos.y, lines_sep));

    float n3 = noise(vec3(pos * 0.03, 1.));

    float line_3 = horizontalLine(
        grid_pos,
        lines_sep / 2.0 + n3 * 2.0,
        line_width
    );

    grid_pos.y = mod(pos.y + lines_sep / 2.0, lines_sep);

    float line_4 = horizontalLine(
        grid_pos,
        lines_sep / 1.0 + n3 * 2.0,
        line_width * 0.7
    );

    // shading
    float surface_color = 0.9;

    surface_color -= 1.0 * line_1 * (1.0 - smoothstep(0.7, 0.9, df / 1.02));
    surface_color -= 0.8 * line_2 * (1.0 - smoothstep(0.35, 0.5, df));
    surface_color -= 0.8 * line_3 * (1.0 - smoothstep(0.6, 0.65, df));
    surface_color -= 0.8 * line_4 * (1.0 - smoothstep(0.3, 0.4, df));

    surface_color = clamp(surface_color, 0.05, 1.0);

    gl_FragColor = vec4(vec3(surface_color), 1.0);
}
`

//////////////////////////////////////////////////////////////////////////////////////////////
/// setup ////////////////////////////////////////////////////////////////////////////////////

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.setClearColor('#000000')

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

////////////////////////////////////
// camera //////////////////////////

// Camera - fov, aspect, near, far
const camera = new THREE.PerspectiveCamera(
    45, //fov
    window.innerWidth / window.innerHeight, //aspect
    0.1, //near clip
    10000 //far clip
);
//                   x    y    z
camera.position.set(0, 0, 40);
camera.lookAt(0, 10, -40);

//camera.position.y = 50;
//camera.position.z = 20;


// orbit controls // 
const controls = new OrbitControls(camera, canvas);
controls.update();
renderer.render(scene, camera);

const color = 0xFFFFFF;
const intensity = 10;
const light = new THREE.DirectionalLight( color, intensity );
light.position.set( - 1, 2, 4 );
scene.add( light );

//////////////////////////////////////////////////////////////////////////////////////////////
/// geometry /////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////
// materials ///////////////////////
const uniforms = {
  u_resolution: { value:{ x:0, y:0 }},
}

const material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader,
} );

//const material = new THREE.MeshPhongMaterial();
//material.color.setHSL(0, 1, .5);  // red


////////////////////////////////////
// meshes //////////////////////////

const objLoader = new OBJLoader();
//const fbxLoader = new FBXLoader();

objLoader.load('/3D_Robot_Man/Model_All_Low.obj', (object) => {
    ////Now we find each Mesh...
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {

            ////...and we replace the material with our custom one
            child.material = material;
            
            child.material.side = THREE.DoubleSide;

        }
    });
  


  object.position.set(0, -13, 0)
  object.scale.set(.07, .07, .07)
  scene.add(object);
});



scene.background = new THREE.Color(0xe5e5e5);


//////////////////////////////////////////////////////////////////////////////////////////////
/// Rendering ////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////
// passes //////////////////////////

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

//const outlinesPass = new OutlinesPass()

composer.addPass(renderPass);
//composer.addPass(outlinesPass)

// Sobel operator

const sobelEffect = new ShaderPass(SobelOperatorShader);
sobelEffect.uniforms['resolution'].value.x = (window.innerWidth * window.devicePixelRatio);
sobelEffect.uniforms['resolution'].value.y = (window.innerHeight * window.devicePixelRatio);

//composer.addPass(sobelEffect);

//sobelEffect.renderToScreen = true;


// film pass
const filmPass = new FilmPass(
  1.5, // intensity
  false, // grayscale
);
//composer.addPass( filmPass );

//filmPass.renderToScreen = true;




onWindowResize();


console.log(scene);
animate();



function onWindowResize( event ) {
  const aspectRatio = window.innerWidth/window.innerHeight;
  let width, height;
  if (aspectRatio>=1){
    width = 1;
    height = (window.innerHeight/window.innerWidth) * width;
  }else{
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  composer.setSize( window.innerWidth, window.innerHeight );
  uniforms.u_resolution.value.x = window.innerWidth;
  uniforms.u_resolution.value.y = window.innerHeight;
}

window.addEventListener('resize', onWindowResize);

function animate() {
    requestAnimationFrame(animate);
    composer.render();
    
}
animate();
