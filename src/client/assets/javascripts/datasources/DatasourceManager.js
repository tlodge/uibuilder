import { EventEmitter } from 'fbemitter';
import {actionCreators as mapperActions} from '../features/mapper';

let _count = 0;
let _emitters = {};

export function	init(dispatch){
	
	var data1 = new EventEmitter();
	var data2 = new EventEmitter();

	const t1 = setInterval(()=>{
		data1.emit("data", {id:"data1", value:Math.random()*500})
	}, 2000);

	const t2 = setInterval(()=>{
		data2.emit("data", {id:"data2", x:Math.random()*500, y:Math.random()*500})
	}, 3500);

	this.register(data1, t1,  "a test emitter", {
														id: {type: "number", 
														description: "datasource id"},
														value: {type: "number", description: "data value"}
												 }, 
												 (registerInfo)=>{
												 	dispatch(mapperActions.registerSource(registerInfo));
												 });

	this.register(data2, t2,  "another test emitter", {
															id: {type: "number", 
															description: "datasource id"},
															x: {type: "number", description: "x data value"},
															y: {type: "number", description: "y data value"}
														},
														(registerInfo)=>{
												 			dispatch(mapperActions.registerSource(registerInfo));
														});
}

export function register(emitter, description, schema, onDone){
	 	
	const id = _count++;

	_emitters[id] = {
		emitter,
		description,
		schema,
	}
		
	onDone({id,description,schema});
}

export function get(id){
	return _emitters[id]; 
}