class LevelGen {
	constructor() {
	}
	loadIHM() {
		/*------------------------------------
		---Chargement de l'IHM
		---
		*/
		try{
			if(navigator.userAgent.match(/(android|iphone|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
				this.Gclick['mouse'] = new ClickDirector(this.Gobjects['camera'], this.Giscene['iscene'], this.actions, "objectScene");
				//this.command = new CommandTactil();
				this.loader.addComplete(this.loadTable.command);
			}else{
				this.Gclick['mouse'] = new ClickDirector(this.Gobjects['camera'], this.Giscene['iscene'], this.actions, "objectScene");
				var length = this.commands.length,
				self = this,
				x=0,
				y=0;
				for(;x<length;x++){
					var gajax = new Ajax();
					var maFunction = function(ajx){
						var data = ajx;
						self.Gcommands[self.commands[this.valueOf()]] = new Command(data, self.actions);
						y++;
						if(y>=length){
							self.loader.addComplete(self.loadTable.command);
						}
					}.bind(x);
					gajax.load(this.configUrl+"/commands/"+this.commands[x]+".json", maFunction);
				}
				if(length == 0){
					this.loader.addComplete(this.loadTable.command);
				}
			}
		}catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de l'IHM");
		}
	}
	loadObjects() {
		/*------------------------------------
		---Chargement des objets de scene
		---
		*/
		try{
			var length = this.objectConf.length,
			lengthZ = this.objects.length,
			self = this,
			objFactory = new ObjSceneFactory(),
			x=0,
			z=0,
			y=0;
			for(;x<length;x++){
				var gajax = new Ajax();
				var mycallback = function(ajx){
					self.GobjectsConf[ajx.name] = ajx;
					y++;contents
						for(;z<lengthZ;z++){
							var obj = self.clone(self.GobjectsConf[self.objects[z].objectConf]);
							self.Gobjects[self.objects[z].id] = objFactory.getInstance(obj.type, {properties:obj, id:self.objects[z].id});
							self.Gobjects[self.objects[z].id].setActionSystem(self.actions);
							self.Gobjects[self.objects[z].id].setObjectContext(self.Gobjects);
						}
						self.loader.addComplete(self.loadTable.objects);
					}
				}.bind(x);
				gajax.load(this.configUrl+"/objects/"+this.objectConf[x]+".json", mycallback);
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de l'objet : "+this.objects[x]);
		}
	}
	loadCamera() {
		/*------------------------------------
		---Chargement des objets de scene
		---
		*/
		try{
			var self = this,
			gajax = new Ajax(),
			objFactory = new ObjSceneFactory(),
			mycallback = function(ajx){
				var obj = self.clone(self.GobjectsConf[self.objects[z].objectConf]);
				self.Gobjects[self.objects[z].id] = objFactory.getInstance(obj.type, {properties:obj, id:self.objects[z].id});
				self.Gobjects[self.objects[z].id].setActionSystem(self.actions);
				self.Gobjects[self.objects[z].id].setObjectContext(self.Gobjects);
			};
			gajax.load(this.configUrl+"/objects/"+this.objectConf+".json", mycallback);
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de l'objet : "+this.objects[x]);
		}
	}
	loadAnimationGroup() {
		/*------------------------------------
		---Chargement des groupes d'animations
		---
		*/
		try{
			var length = this.animationGroups.length,
			stockArray = [],
			self = this,
			x=0,
			z=0;
			for(;x<length;x++){
				var gajax = new Ajax();
				var maFunction = function(ajx){
					stockArray = ajx;
					var length2 = stockArray.length,
					y=0;
					self.Ganimations[self.animationGroups[this.valueOf()]] = [];
					for(;y<length2;y++){
						self.Ganimations[self.animationGroups[this.valueOf()]][y] = self.Ganimations[stockArray[y]][0];
					}
					z++;
					if(z>=length){
						self.loader.addComplete(self.loadTable.animationGroups);
					}
				}.bind(x);
				gajax.load(this.configUrl+"/animations/"+this.animationGroups[x]+".json", maFunction);
			}
			if(length == 0){
				this.loader.addComplete(this.loadTable.animationGroups);
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de l'animation : "+this.animations[a]);
		}
	}

	loadAnimations() {
		try{
			var length = this.animations.length,
			self = this,
			x=0,
			y=0;
			for(;x<length;x++){
				var gajax = new Ajax();
				var maFunction = function(ajx){
					self.Ganimations[self.animations[this.valueOf()]] = [ajx];
					self.Ganimations[self.animations[this.valueOf()]][0].spriteName = self.Gsprites[self.Ganimations[self.animations[this.valueOf()]][0].spriteName];
					y++;
					if(y == length){
						self.loadAnimationGroup();
						self.loader.addComplete(self.loadTable.animations);
					}
				}.bind(x);
				gajax.load(this.configUrl+"/animations/"+this.animations[x]+".json", maFunction);
			}
			if(length == 0){
				this.loader.addComplete(this.loadTable.animations);
				this.loader.addComplete(this.loadTable.animationGroups);
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de l'animation : "+this.animations[x]);
		}
	}
	loadGeometry() {
		/*------------------------------------
		---Chargement des animations vectoriel
		---
		*/
		try{
			var length = this.geometry.length,
			self = this,
			x=0,
			y=0;
			for(;x<length;x++){
				this.loader.upInfo("Chargement de la geometry -> "+this.geometry[x]);
				var gajax = new Ajax();
				var maFunction = function(ajx){
					self.Ggeometry[self.geometry[this.valueOf()]] = ajx;
					y++;
					if(y>=length){
						self.loader.addComplete(self.loadTable.geometry);
					}
				}.bind(x);
				gajax.load(this.configUrl+"/geometry/"+this.geometry[x]+".json", maFunction);
			}
			if(length == 0){
				this.loader.addComplete(this.loadTable.geometry);
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de l'animation vectoriel : "+this.geometry[x]);
		}
	}
	loadTrajectoires() {
		/*------------------------------------
		---Chargement des trajectoires
		---
		*/
		try{
			var length = this.trajectoires.length,
			self = this,
			x=0,
			y=0;
			for(;x<length;x++){
				this.loader.upInfo("Chargement de la trajectoire -> "+this.trajectoires[x]);
				var gajax = new Ajax();
				var maFunction = function(ajx){
					self.Gtrajectoires[self.trajectoires[this.valueOf()]] = ajx;
					y++;
					if(y>=length){
						self.loader.addComplete(self.loadTable.trajectoires);
					}
				}.bind(x);
				gajax.load(this.configUrl+"/trajectoires/"+this.trajectoires[x]+".json", maFunction);
			}
			if(length == 0){
				this.loader.addComplete(this.loadTable.trajectoires);
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de la trajectoire : "+this.trajectoires[x]);
		}
	}
	/**
		 * Load sounds configuration
		 * @method loadSoundConf
		 */
	loadSoundConf() {
		try{
			var length = this.soundConf.length,
			self = this,
			x=0,
			y=0;
			for(;x<length;x++){
				var gajax = new Ajax();
				var maFunction = function(ajx){
					self.GsoundConf[self.soundConf[this.valueOf()]] = ajx;
					self.GsoundConf[self.soundConf[this.valueOf()]].sound = self.Gsounds[self.GsoundConf[self.soundConf[this.valueOf()]].sound];
					y++;
					if(y == length){
						self.loader.addComplete(self.loadTable.soundConf);
					}
				}.bind(x);
				gajax.load(this.configUrl+"/sounds/"+this.soundConf[x]+".json", maFunction);
			}
			if(length == 0){
				this.loader.addComplete(this.loadTable.soundConf);
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de l'animation : "+this.soundConf[x]);
		}
	}
	/**
		 * Load sounds
		 * @method loadSound
		 */
	loadSound() {///bugue
		try{
			var self = this,
			url,
			x = 0,
			i = 0,
			length = this.sounds.length;

			this.GsoundContext['soundContext'] = this.sndLoader.getContext();
			if(length <= 0){
				this.loader.addComplete(this.loadTable.sounds);
				this.loader.addComplete(this.loadTable.soundConf);
			}else{
				for(;x<length;x++){
					url = this.configUrl+"/sounds/sounds/"+this.sounds[x]+".mp3";
					this.sndLoader.getSound(url, function(sound){
						self.loader.upInfo("Chargement du son -> "+self.sounds[x]+" a été chargé");
						self.Gsounds[self.sounds[x]] = sound;

						i++;
						if(i>=length){
							self.loader.addComplete(self.loadTable.sounds);
							self.loadSoundConf();
						}
					});
				}
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement des Sons");
		}
	}
	/**
		 * Load texts
		 * @method loadText
		 * @param {langage of the text} lang
		 */
	loadText(lang) {
		try{
			var length = this.words.length,
			self = this,
			x=0,
			y=0,
			txtLoad = new TextLoad();

			for(;x<length;x++){
				var url = this.configUrl+"/texts/"+lang+"/"+this.words[x]+".json",
				txtLoader,

				txtLoad.getText(function(ajx){
					txtLoader = ajx;
					var lengthW = txtLoader.length,
					w=0;
					for(;w<lengthW;w++){
						self.loader.upInfo("Chargement du texte -> "+txtLoader[w].name);
						self.Gwords[txtLoader[w].name] = txtLoader[w].value;
					}
					y++;
					if(y==length){
						self.loader.addComplete(self.loadTable.words);
					}
				});
			}
			if(length == 0){
				this.loader.addComplete(this.loadTable.words);
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement des Textes");
		}
	}
	/**
		 * Load texts graphic properties
		 * @method loadTextConf
		 */
	loadTextConf() {
		try{
			var length = this.texts.length,
			self = this,
			x=0,
			y=0;
			for(;x<length;x++){
				var gajax = new Ajax();
				this.loader.upInfo("Chargement de l'animation de text -> "+this.texts[x]);
				var maFunction = function(ajx){
					self.Gtexts[self.texts[this.valueOf()]] = ajx;
					y++;
					if(y>=length){
						self.loader.addComplete(self.loadTable.texts);
					}
				}.bind(x);
				gajax.load(this.configUrl+"/texts/"+this.texts[x]+".json", maFunction);
			}
			if(length == 0){
				this.loader.addComplete(this.loadTable.texts);
			}
		}
		catch(e){
			console.log(e.message);
			console.log("Erreur lors du chargement de l'animation text : "+this.texts[x]);
		}
	}
	start() {
		var length = this.onStart.length,
		lengthX = this.objects.length,
		cloneObj,
		x=0,
		y=0;
		for(;x<lengthX;x++){
			cloneObj = this.clone(this.GobjectsConf[this.objects[x].objectConf].config);
			var lengthZ = cloneObj.length,
			z=0;
			for(;z<lengthZ;z++){
				if(cloneObj[z].$object == "self"){
					cloneObj[z].$object = this.objects[x].id;
				}
				this.actions.setAction(cloneObj[z]);
			}
		}
		for(;y<length;y++){
			this.actions.setAction(this.onStart[y]);
		}
		this.Gobjects['camera'].setActionSystem(this.actions);
		this.Gobjects['camera'].setScene(this.Gscene['scene']);
		this.Gobjects['camera'].setPosition({x: this.levelInfo.xCam, y: this.levelInfo.yCam});
		this.Gobjects['camera'].start();
	}
	destroy() {
		this.Gobjects['camera'].stop();
		this.Gsprites = null;
		this.Ganimations = null;
		this.Ggeometry = null;
		this.GsoundConf = null;
		this.Gtrajectoires = null;
		this.Gsounds = null;
		this.Gwords = null;
		this.Gtexts = null;
		this.Gcommands = null;
		this.loader = null;
		this.Gscene = null;
		this.Giscene = null;
		this.Gclick['mouse'].killAllEvent();
		this.Gclick['mouse'] = null;
		for(id in this.Gobjects){
			if(this.Gobjects[id] != null){
				if(this.Gobjects[id].name != "camera"){
					this.Gobjects[id].destroy();
				}
			}
		}
		this.Gobjects = null;
	}
	getActionCtx(){
		return this.actions;
	}
	device() {
		var result = "desktop";
		if(typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') != -1){
			result = 'mobile';
		}
		return(result);
	}
	clone(obj) {
    	return JSON.parse(JSON.stringify(obj));
	}
}
