const request = require('request');
const imagegenAuth = require('../../../../tokens/imagegen.json');

/* Generates a battle image by my battle image generation api */
exports.generateImage = function(teams){
	/* Construct json for POST request */
	var info = generateJson(teams);
	info.password = imagegenAuth.password;

	/* Returns a promise to avoid callback hell */
	return new Promise( (resolve, reject) => {
		request({
			method:'POST',
			uri:imagegenAuth.battleImageUri,
			encoding:null,
			json:true,
			body: info,
		},(error,res,body)=>{
			if(error){
				reject(error);
				console.error(error);
				return;
			}
			resolve(body);
		});
	});
}

/* Generates a json depending on the battle info */
function generateJson(teams){
	var json = {
		player:{
			teamName:teams.player.name,
			animals:[]
		},
		enemy:{
			teamName:teams.enemy.name,
			animals:[]
		}
	};

	for(i=0;i<teams.player.team.length;i++)
		json.player.animals.push(generateAnimalJson(teams.player.team[i]));
	for(i=0;i<teams.enemy.team.length;i++)
		json.enemy.animals.push(generateAnimalJson(teams.enemy.team[i]));
	return json;
}

function generateAnimalJson(animal){
	let weapon = animal.weapon;
	let stat = animal.stats;
	
	/* Parse animal info */
	let animalID = animal.animal.value.match(/:[0-9]+>/g);
	if(animalID) animalID = animalID[0].match(/[0-9]+/g)[0];
	else animalID = animal.animal.value.substring(1,animal.animal.value.length-1);
	if(!animal.animal.nickname) animal.animal.nickname = animal.animal.value;

	/* Parse weapon info */
	let weaponID = weapon.emoji.match(/:[0-9]+>/g);
	if(weaponID) weaponID = weaponID[0].match(/[0-9]+/g)[0];

	return {
		animal_name:animal.animal.nickname,
		animal_image:animalID,
		weapon_image:weaponID,
		animal_level:stat.lvl,
		animal_hp:{
			current:stat.hp[0],
			max:stat.hp[1],
			previous:stat.hp[2]
		},
		animal_wp:{
			current:stat.wp[0],
			max:stat.wp[1],
			previous:stat.wp[2]
		},
		animal_att:stat.att[0]+stat.att[1],
		animal_mag:stat.mag[0]+stat.mag[1],
		animal_pr:stat.pr[0]+stat.pr[1],
		animal_mr:stat.mr[0]+stat.mr[1],
		animal_debuff:{}
	}
}