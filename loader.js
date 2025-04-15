/*
 *
 * (c) Copyright VNexsus 2022-2024
 *
 */

(function(window, undefined){
	
	let games = [
		{
			name: "2048",
			path: "games/2048/index.html",
			icon: "games/2048/meta/apple-touch-icon.png",
			width: 600,
			height: 600
		},
		{
			name: "LastSpartan",
			path: "games/LastSpartan/dist/index.html",
			icon: "games/LastSpartan/media/logo_small.png",
			width: 800,
			height: 600
		},
		{
			name: "Zuma",
			path: "games/Zuma/index.html",
			icon: "games/Zuma/zuma.png",
			width: 800,
			height: 600
		}
	];
	
	let baseurl = document.location.protocol == 'file:' ? 'file:///' + document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")).substring(1) + '/' : document.location.href.substring(0, document.location.href.lastIndexOf("/")+1);

	window.Asc.plugin.event_onDocumentContentReady = function() {
		var tlb = window.parent.DE || window.parent.PE || window.parent.SSE;
		if (tlb) {
			var tab = $(parent.document).find('.ribtab[data-layout-name="toolbar-games"]');
			if(tab.length == 0){
				tab = $(`<li class="ribtab" style="" data-layout-name="toolbar-games"><a data-tab="games" data-title="`+ window.Asc.plugin.name +`">`+ window.Asc.plugin.name +`</a></li>`);
				window.parent.$("section.tabs ul").append(tab);
				tlb.controllers.Toolbar.toolbar.$tabs = parent.$('.ribtab');
			}
			
			var panel = $(parent.document).find('.panel[data-tab="games"]');
			
			if(panel.length == 0){
				panel = $(`<section class="panel" data-tab="games" id="games-panel"></section>`);
				var styles = '';
				games.forEach(function(game, i){
					let group = $(`<div class="group"></div>`);
					let btn = $(`<div id="btn-game-`+ (i+1) +`"></div>`);
					group.append(btn);
					panel.append(group);
					new parent.Common.UI.Button({
                        cls: "btn-toolbar x-huge icon-top",
                        iconCls: "toolbar__icon btn-game-"+ (i+1) ,
                        disabled: false,
                        dataHint: "0",
						caption: game.name
                    }).render(panel.find('#btn-game-'+ (i+1))).on("click", function(){window.Asc.plugin.run(game)});
					styles += `.btn-game-`+ (i+1) +`{background-image: url('`+ baseurl + game.icon +`');background-size: contain;}`;
				});
				window.parent.$("section.box-panels").append(panel);
				tlb.controllers.Toolbar.toolbar.$panels = parent.$('.panel');
				panel.append(`<style>`+ styles +`</style>`);
			}
			
		}
	}
	
	window.Asc.plugin.run = function(game){
		var v = new parent.Asc.CPluginVariation();
		v.deserialize({
			url: game.path,
			description: game.name,
			isViewer: false,
			isVisual: true,
			isModal: true,
			EditorsSupport: ['word','cell','slide'],
			buttons: [],
			size: [ game.width, game.height ]
		});
		var p = new parent.Asc.CPlugin();
		p.set_Guid('asc.{-1}');
		p.set_BaseUrl(baseurl);
		p.set_Name(game.name);
		p.set_Variations([v]);
		parent.Asc.editor.asc_pluginsRegister(baseurl, [p]);
		parent.Asc.editor.asc_pluginRun('asc.{-1}', 0);
		
		// check for removed target
		var target = parent.document.getElementById("iframe_asc.{-1}");
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				var nodes = Array.from(mutation.removedNodes);
				var directMatch = nodes.indexOf(target) > -1
				var parentMatch = nodes.some(parent => parent.contains(target));
				if (directMatch || parentMatch) {
					if(parent.AscDesktopEditor)
						parent.Asc.editor.pluginMethod_RemovePlugin('asc.{-1}');
					else
						parent.Asc.editor.asc_pluginStop('asc.{-1}');
				}
			});
		});
		observer.observe(parent.document.body, {subtree: true, childList: true});
	}

    window.Asc.plugin.init = function() {}

})(window, undefined);
