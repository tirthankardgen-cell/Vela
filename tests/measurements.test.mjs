import test from 'node:test';
import assert from 'node:assert/strict';
import {feetAndInches,convertMeasurement,centimetres} from '../src/lib/measurements.js';
import {measurementToMetres} from '../src/lib/room.js';
test('imperial labels retain fractional inches, carry at 12 and handle negative positions',()=>{
 assert.equal(feetAndInches(.95),'3′ 1.4″');
 assert.equal(feetAndInches(.3048),'1′ 0″');
 assert.equal(feetAndInches(-.95),'−3′ 1.4″');
 assert.equal(centimetres(1.23456),123.456);
});
test('repeated unit switches preserve measurements including boundary values',()=>{
 for(const cm of [150,182.88,304.8,396.24,500.125,2000]){
  let v=String(cm),inch='0';
  for(let i=0;i<20;i++){
   [v,inch]=convertMeasurement(v,inch,'cm','ft-in');assert.ok(Number(inch)<12);
   assert.ok(Math.abs(measurementToMetres('ft-in',v,inch)-cm/100)<1e-8);
   [v,inch]=convertMeasurement(v,inch,'ft-in','cm');
  }
  assert.ok(Math.abs(Number(v)-cm)<1e-6);
 }
 assert.equal(measurementToMetres('ft-in','13','1.5'),4.0005);
});
