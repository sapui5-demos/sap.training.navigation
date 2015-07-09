sap.ui.define([
	"sap/training/navigation/controller/BaseController"
], function(BaseController) {
	"use strict";
	return BaseController.extend("sap.training.navigation.controller.Home", {

		onDisplayNotFound: function(oEvent) {
			//let's display the "notFound" target without changing the hash
			//this.getOwnerComponent().getTargets().display("notFound");
			this.getRouter().getTargets().display("notFound", {
				fromTarget: "home"
			});
		},
		
		onNavToProducts: function(oEvent) {
			this.getRouter().navTo("productList");
		},
		
		onNavToProductsOverview: function(oEvent) {
			this.getRouter().navTo("productsOverview", {}, false /*with history*/ );
		}

	});
});