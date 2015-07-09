sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("sap.training.navigation.controller.BaseController", {

		onInit: function() {
			var oRouter = this.getRouter();

			oRouter.attachBypassed(function(oEvent) {
				var sHash = oEvent.getParameter("hash");
				// do something here, i.e. some app telemetry to send logging data to the backend
				// telling what resource the user tried to access...
			    //jQuery.sap.log.info("Sorry, but the hash '" + sHash + "' is invalid. The resource was not found.");
				console.log("Sorry, but the hash '" + sHash + "' is invalid. The resource was not found.");
			});

			oRouter.attachRouteMatched(function(oEvent) {
				var sRouteName = oEvent.getParameter("name");
				// we could use this for some app telemetry, i.e. to find out how the users use our app
				// in order to improve our app and the user experience (Build-Measure-Learn cycle)
				//jQuery.sap.log.info("User accessed route " + sRouteName + ", timestamp = " + new Date().getTime());
				console.log("User accessed route " + sRouteName + ", timestamp = " + new Date().getTime());
			});

		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function(oEvent) {
			var oHistory, sPreviousHash, oRouter;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				oRouter = this.getRouter();
				oRouter.navTo("appHome", {}, true /*no history*/ );
			}
		}

	});

});