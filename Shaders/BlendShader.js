const BlendShader = {
  uniforms: {
    baseTexture: { value: null },
    edgeTexture: { value: null }
  },
  vertexShader: `varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position,1.0);
  }`,
  fragmentShader: `
    uniform sampler2D baseTexture;
    uniform sampler2D edgeTexture;
    varying vec2 vUv;

    void main(){
      vec3 base = texture2D(baseTexture, vUv).rgb;
      float edge = texture2D(edgeTexture, vUv).r;

      vec3 finalColor = base * (1.0 - edge);

      gl_FragColor = vec4(finalColor,1.0);
    }
  `
};

export { BlendShader };