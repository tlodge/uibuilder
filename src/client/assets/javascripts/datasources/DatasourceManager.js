import { EventEmitter } from 'fbemitter';
import {actionCreators as mapperActions} from '../features/mapper';

let _count = 0;
let _emitters = {};

export function	init(registerCallback){
	
	var data1 = new EventEmitter();
	var data2 = new EventEmitter();

	const t1 = setInterval(()=>{
		data1.emit("data", {id:"data1", value:Math.random()*500})
	}, 2000);

	const t2 = setInterval(()=>{
		data2.emit("data", {id:"data2", x:Math.random()*500, y:Math.random()*500})
	}, 3500);

	this.register(data1, t1,  {
								name: "source1", 
							  	description: "a test emitter",
							  	schema: {
									id: {type: "number", description: "datasource id"},
									value: {type: "number", description: "data value"}
								}, 
							},
							(registerInfo)=>{registerCallback(registerInfo);}
				);

	this.register(data2, t2,  {
								name: "source2", 
							  	description: "another test emitter",
							  	schema: {
									id: {type: "number", description: "datasource id"},
									x: {type: "number", description: "x data value"},
									y: {type: "number", description: "y data value"}
								}, 
							},
							(registerInfo)=>{registerCallback(registerInfo);});

}

export function register(emitter, timer, source, onDone){
	 	
	const id = _count++;

	_emitters[id] = {
		emitter,
	}
		
	onDone(Object.assign({},source, {id:id}));
}

export function get(id){
	return _emitters[id]; 
}