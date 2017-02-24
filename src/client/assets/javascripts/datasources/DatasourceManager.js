import { EventEmitter } from 'fbemitter';
import {actionCreators as mapperActions} from '../features/mapper';

let _count = 0;
let _emitters = {};

const locations = [
		{
			person:"dad",
			location: "home",
			time: "8:00",
			percentage: 60,
		},
		{
			person:"mum",
			location: "home",
			time: "8:10",
			percentage: 70,
		},
		{
			person:"jamie",
			location: "home",
			time: "8:15",
			percentage: 70,
		},
		{
			person:"alice",
			location: "home",
			time: "8:15",
			percentage: 70,
		},
		{
			person:"mum",
			location: "junior school",
			time: "8:45",
			percentage: 1,
		},
		{
			person:"jamie",
			location: "junior school",
			time: "8:45",
			percentage: 15,
		},
		{
			person:"alice",
			location: "infant school",
			time: "8.55",
			percentage: 20,
		},
		{
			person:"mum",
			location: "infant school",
			time: "8.55",
			percentage: 1,
		},
		{
			person:"dad",
			location: "work",
			time: "9.00",
			percentage: 30,
		},
		{
			person:"mum",
			location: "home",
			time: "9.30",
			percentage: 70,
		},
		{
			person:"dad",
			location: "starbucks",
			time: "9.18",
			percentage: 3,
		},
		{
			person:"dad",
			location: "work",
			time: "9.40",
			percentage: 30,
		},
		{
			person:"mum",
			location: "co-op",
			time: "9.53",
			percentage: 2,
		},
		{
			person:"mum",
			location: "work",
			time: "10.03",
			percentage: 18
		},
		{
			person:"jamie",
			location: "swimming pool",
			time: "10.12",
			percentage: 1,
		},
		{
			person:"jamie",
			location: "junior school",
			time: "11.32",
			percentage: 15,
		},
		{
			person:"mum",
			location: "cafe nero",
			time: "12.05",
			percentage: 1,
		},
		{
			person:"dad",
			location: "cafe nero",
			time: "12.15",
			percentage: 2,
		},
		{
			person:"dad",
			location: "work",
			time: "13.35",
			percentage: 30,
		},
		{
			person:"mum",
			location: "work",
			time: "13.45",
			percentage: 18,
		}
]

const tweets = [
	{
		tweet: "Very much enjoyed my tour of the Smithsonian's National Museum of African American History and Culture...A great job done by amazing people!",
		score: 2,
	},
	{
		tweet: "One thing I will say about Rep. Keith Ellison, in his fight to lead the DNC, is that he was the one who predicted early that I would win!",
		score: 3,
	},
	{
		tweet: "The so-called angry crowds in home districts of some Republicans are actually, in numerous cases, planned out by liberal activists. Sad!",
		score: 7,
	},
	{
		tweet: "'Americans overwhelmingly oppose sanctuary cities'",
		score: 6,
	},
	{
		tweet: "Congratulations to our new National Security Advisor, General H.R. McMaster.",
		score: 6,
	},
	{
		tweet: "Just named General H.R. McMaster National Security Advisor.",
		score: 5,
	},
	{
		tweet: "HAPPY PRESIDENTS DAY - MAKE AMERICA GREAT AGAIN!",
		score: 3,
	},
	{
		tweet: "Give the public a break - The FAKE NEWS media is trying to say that large scale immigration in Sweden is working out just beautifully. NOT!",
		score: 8,
	},
	{
		tweet: "My statement as to what's happening in Sweden was in reference to a story that was broadcast on @FoxNews concerning immigrants & Sweden.",
		score: 7,
	},
	{
		tweet: "Will be having many meetings this weekend at The Southern White House. Big 5:00 P.M. speech in Melbourne, Florida. A lot to talk about!",
		score: 4,
	},
	{
		tweet: "Don't believe the main stream (fake news) media.The White House is running VERY WELL. I inherited a MESS and am in the process of fixing it.",
		score: 7,
	},
	{
		tweet: "Looking forward to the Florida rally tomorrow. Big crowd expected!",
		score: 4,
	},
	{
		tweet: "'One of the most effective press conferences I've ever seen!' says Rush Limbaugh. Many agree.Yet FAKE MEDIA  calls it differently! Dishonest",
		score: 2,
	},
	{
		tweet: "The FAKE NEWS media (failing @nytimes, @NBCNews, @ABC, @CBS, @CNN) is not my enemy, it is the enemy of the American People!",
		score: 7,
	},
	{
		tweet: "Join me at 11:00am: Watch here: http://45.wh.gov/XYQXNw" ,
		score: 7,
	},
	{
		tweet: "General Keith Kellogg, who I have known for a long time, is very much in play for NSA - as are three others.",
		score: 5,
	},
	{
		tweet: "Thank you for all of the nice statements on the Press Conference yesterday. Rush Limbaugh said one of greatest ever. Fake media not happy!",
		score: 1,
	},
	{
		tweet:"Going to Charleston, South Carolina, in order to spend time with Boeing and talk jobs! Look forward to it.",
		score: 2,
	},
	{
		tweet: "Despite the long delays by the Democrats in finally approving Dr. Tom Price, the repeal and replacement of ObamaCare is moving fast!",
		score: 6,
	},
	{
		tweet:"'Trump signs bill undoing Obama coal mining rule'",
		score: 4,
	}
].reverse();

export function	init(registerCallback){
	
	var data1 = new EventEmitter();
	var data2 = new EventEmitter();
	var trumptweets = new EventEmitter();
	var whereiseveryone = new EventEmitter();

	let trumpindex = 0;
	const t0 = setInterval(()=>{
			
			trumptweets.emit("data", 
							{
									id:"tweet", 
									tweet: tweets[trumpindex % tweets.length].tweet,
									score: tweets[trumpindex % tweets.length].score,
							}
			);
			trumpindex +=1;
	}, 2000);

	const t1 = setInterval(()=>{
		const multiplier = 1;// Math.floor(Math.random()*2) == 1 ? 1 : -1;
		data1.emit("data", 
							{
									id:"data1", 
									value: {
										x: (Math.random() * 100) * multiplier,
										y: (Math.random()  * 100) * multiplier,
										z: (Math.random()  * 100) * multiplier,
										a: (Math.random()  * 100) * multiplier,
										name: "dskldjs",
									}
							}
				  );
	}, 1500);

	const keys = ["data2","data3","data4"];

	const t2 = setInterval(()=>{
		data2.emit("data", {id:keys[Math.round(2 * Math.random())], x:Math.random()*1000, y:Math.random()*1000})
	}, 500);


	let whereisindex = 0;

	const t3 = setInterval(()=>{
			
			whereiseveryone.emit("data", 
							{
									id:"location", 
									person: locations[whereisindex % locations.length].person,
									location: locations[whereisindex % locations.length].location,
									time: locations[whereisindex % locations.length].time,
									percentage: locations[whereisindex % locations.length].percentage,
							}
			);
			whereisindex +=1;
	}, 2000);

	this.register(trumptweets, t0, {
									name: "trumptweets",
									description: "trump tweets with sentiment analysis",
									schema:{
										id: {type: "string", description: "datasource id"},
										tweet: {type: "string", description: "datasource id"},
										score: {type: "number", description: "sentiment score"},
									}
								},		
								(registerInfo)=>{registerCallback(registerInfo);}
	);

	this.register(data1, t1,  {
								name: "source1", 
							  	description: "a test emitter",
							  	schema: {
									id: {type: "string", description: "datasource id"},
									value: {
												type: "object", 
												description: "object data value",
												properties: {
													x: {type: "number", description: "x value"},
													y: {type: "number", description: "y value"},
													z: {type: "number", description: "z value"},
													a: {type: "number", description: "a value"},
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
									id: {type: "string", description: "datasource id"},
									x: {type: "number", description: "x data value"},
									y: {type: "number", description: "y data value"}
								}, 
							},
							(registerInfo)=>{registerCallback(registerInfo);});

	this.register(whereiseveryone, t3, {
									name: "whereiseveryone",
									description: "location tracking of the household",
									schema:{
										id: {type: "string", description: "datasource id"},
										person: {type: "string", description: "the person"},
										location: {type: "string", description: "the person's location"},
										time: {type: "string", description: "string value of time h:mm"},
										percentage: {type: "number", description: "time spent in this location"},
									}
								},		
								(registerInfo)=>{registerCallback(registerInfo);}
	);



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