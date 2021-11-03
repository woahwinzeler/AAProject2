varying vec2 vCoordinates; 
uniform sampler2D imageGraphic; 
  
void main(){
  vec2 myUV = vec2(vCoordinates.x/512., vCoordinates.y/512.);
  vec4 image = texture2D(imageGraphic, myUV);
  gl_FragColor = image;
}