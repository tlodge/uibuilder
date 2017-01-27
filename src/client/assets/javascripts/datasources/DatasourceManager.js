import { EventEmitter } from 'fbemitter';
import {actionCreators as mapperActions} from '../features/mapper';

let _count = 0;
let _emitters = {};

export function	init(registerCallback){
	
	var data1 = new EventEmitter();
	var data2 = new EventEmitter();

	const t1 = setInterval(()=>{
		data1.emit("data", 
							{
									id:"data1", 
									value: {
										x:	Math.random() *100,
										y: Math.random()  * 300,
										z: Math.random()  * 20,
										name: "dskldjs",
									}
							}
				  );
	}, 2000);

	const keys = ["data2","data3","data4"];

	const t2 = setInterval(()=>{
		data2.emit("data", {id:keys[Math.round(2 * Math.random())], x:Math.random()*500, y:Math.random()*500})
	}, 3500);

	this.register(data1, t1,  {
								name: "source1", 
							  	description: "a test emitter",
							  	schema: {
									id: {type: "number", description: "datasource id"},
									value: {
												type: "object", 
												description: "object data value",
												properties: {
													x: {type: "number", description: "x value"},
													y: {type: "number", description: "y value"},
													z: {type: "number", description: "z value"},
													name: {type: "string", description: "a name"}
												}
									}
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