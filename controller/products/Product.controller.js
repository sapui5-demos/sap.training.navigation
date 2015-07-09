sap.ui.define([
   "sap/training/navigation/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.training.navigation.controller.products.Product", {

		onInit: function() {
			var oRouter = this.getRouter();
			this._sProductId = "";

			oRouter.getRoute("product").attachMatched(function(oEvent) {
				this._onRouteMatched(oEvent);
			}, this);

			//Hint: we don't want to do it this way
			/*
         oRouter.attachRouteMatched(function (oEvent){
            var sRouteName, oArgs, oView;

            sRouteName = oEvent.getParameter("name");
            if (sRouteName === "employee"){
               this._onRouteMatched(oEvent);
            }
         }, this);
         */

		},

		_onRouteMatched: function(oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			this._sProductId = oArgs.productId;
			oView = this.getView();

			oView.bindElement({
				path: "product>/Products(" + this._sProductId + ")",
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function(oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function(oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},

		_onBindingChange: function(oEvent) {
			var oElementBinding;

			oElementBinding = this.getView().getElementBinding("product");

			// No data for the binding
			if (oElementBinding && !oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

		onShowSupplier: function(oEvent) {
			var oRouter = this.getRouter();
			oRouter.navTo("productSupplier", {
				productId: this._sProductId
			}, false /*with history*/ );
		}

	});

});