in vec3 vNormal;
uniform sampler2D envMap;

#include <common>
#include <cube_uv_reflection_fragment>
// #include <envmap_physical_pars_fragment>

void main() {
    vec3 worldNormal = inverseTransformDirection( vNormal, viewMatrix );
    vec3 envMapTexel = textureCubeUV(envMap, worldNormal, 0.0).rgb;
    gl_FragColor = vec4(envMapTexel, 1.0);
}