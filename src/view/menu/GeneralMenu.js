var SubMenu = require("./SubMenu.js");
var LifeMenu = require("./LifeMenu.js");
var EmitDirectionMenu = require("./EmitDirectionMenu.js");
var DefaultEmissionMenu = require("./DefaultEmissionMenu.js");
var RandomEmissionMenu = require("./RandomEmissionMenu.js");
var StandardEmissionMenu = require("./StandardEmissionMenu.js");
var util = require("../../util");
var service = require("../../service");
var projectModel = require("../../model").projectModel;

function GeneralMenu() {
	SubMenu.call(this);
	util.bind(this);

	this.lifeMenu = new LifeMenu();
	this.emitDirectionMenu = new EmitDirectionMenu();
	this.emissionMenus = this.getEmissionMenus();
	this.currentControllerMenu = null;

	this.ui = {
		rows: [
			this.section("Emission type:"),
			this.getEmissionMenu(),
			this.section("Duration:"),
			{id: "duration", view: "text", value: -1, label: "Duration", labelAlign: "left"},
			this.section("Life:"),
			this.lifeMenu.ui,
			this.section("Emission direction:"),
			this.emitDirectionMenu.ui
		]
	};
}

util.inherit(GeneralMenu, SubMenu);

GeneralMenu.prototype.getEmissionMenus = function() {
	return [
		{name: jupiter.EmissionTypes.DEFAULT, menu: new DefaultEmissionMenu()},
		{name: jupiter.EmissionTypes.RANDOM, menu: new RandomEmissionMenu()},
		{name: jupiter.EmissionTypes.UNIFORM, menu: new StandardEmissionMenu()}
	];
};

GeneralMenu.prototype.getEmissionNames = function() {
	return this.getEmissionMenus().map(function(menu) {
		return menu.name;
	});
};

GeneralMenu.prototype.getEmitControllerMenuByName = function(name) {
	var index = this.getEmissionNames().indexOf(name);
	return this.getEmissionMenus()[index].menu;
};

GeneralMenu.prototype.getEmissionMenu = function() {
	return {
		view: "menu",
		id: "emission_menu",
		subMenuPos: "right",
		layout: "y",
		height: 30,

		data: [{
			id: "emission_menu_item",
			value: "Select emit settings",
			submenu: this.getEmissionNames(true),
			config: {
				width: 200,
				on: {onItemClick: this.setEmissionMenu}
			}
		}],
		type: {subsign: true, height: 50,}
	};
};

GeneralMenu.prototype.onActive = function() {
	SubMenu.prototype.onActive.call(this);
	this.lifeMenu.onActive();
	this.emitDirectionMenu.onActive();
};

GeneralMenu.prototype.onMenuCreated = function() {
	this.setEmissionMenu(this.getEmissionNames()[0]);

	$$("duration").attachEvent("onChange", this.onDurationChanged);
	service.msg.on("emitter/changed", this.onEmitterChanged);
};

GeneralMenu.prototype.setEmissionMenu = function(name) {
	if (this.currentControllerMenu) {
		this.currentControllerMenu.onDestroy();
		$$(this.ui.id).removeView(this.currentControllerMenu.ui.id);
	}

	this.currentControllerMenu = this.getEmitControllerMenuByName(name);
	$$(this.ui.id).addView(this.currentControllerMenu.ui, 2);
	this.currentControllerMenu.onActive();
	$$("emission_menu").getMenuItem("emission_menu_item").value = name;
	$$("emission_menu").refresh();
	this.onActive();

	service.msg.emit("emission/change", name);

};

GeneralMenu.prototype.onDurationChanged = function(value) {
	value = parseFloat(value);
	if (!isNaN(value)) {
		projectModel.emitter.duration.maxTime = value;
	}

	$$("duration").setValue(projectModel.emitter.duration.maxTime);
};

GeneralMenu.prototype.onEmitterChanged = function() {
	$$("duration").setValue(projectModel.emitter.duration.maxTime);
	this.setEmissionMenu(projectModel.emitter.emitController.getName());
};

module.exports = GeneralMenu;