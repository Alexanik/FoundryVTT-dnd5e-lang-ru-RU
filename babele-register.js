
import { ActorSheet5eCharacter } from "../../systems/dnd5e/module/actor/sheets/character.js";

Hooks.once('init', () => {

	if(typeof Babele !== 'undefined') {
		
		Babele.get().register({
			module: 'FoundryVTT-dnd5e-ru',
			lang: 'ru',
			dir: 'compendium'
		});

		Babele.get().registerConverters({
			"weight": (value) => { return parseInt(value)/2 },
			"range": (range) => {
				if(range) {
					if(range.units === 'ft') {
						if(range.long) {
							range = mergeObject(range, { long: range.long*0.3 });
						}
						return mergeObject(range, { value: range.value*0.3 });
					}
					if(range.units === 'mi') {
						if(range.long) {
							range = mergeObject(range, { long: range.long*1.5 });
						}
						return mergeObject(range, { value: range.value*1.5 });
					}
					return range;
				}
			}
		});
	}
});

class ActorSheet5eCharacterIt extends ActorSheet5eCharacter {

	_computeEncumbrance(totalWeight, actorData) {
		let enc = super._computeEncumbrance(totalWeight, actorData);
		enc.max = enc.max/2;
		enc.pct = Math.min(enc.value * 100 / enc.max, 99);
		enc.encumbered = enc.pct > (2/3);
		return enc;
	}
}

Hooks.once("ready", () => {

	Actors.unregisterSheet("dnd5e", ActorSheet5eCharacter);
	Actors.registerSheet("dnd5e", ActorSheet5eCharacterIt, { types: ["character"], makeDefault: true });
});

Hooks.on("renderActorSheet5eCharacterIt", (app, html, data) => {
	Hooks.call("renderActorSheet5eCharacter", app, html, data);
});