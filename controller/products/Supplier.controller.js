sap.ui.define([
   "sap/training/navigation/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.training.navigation.controller.products.Supplier", {

		onInit: function() {
			var oRouter = this.getRouter();

			this._sProductId = null;

			this._aValidTabKeys = ["Info", "Address"];

			oRouter.getRoute("productSupplier").attachMatched(function(oEvent) {
				this._onRouteMatched(oEvent);
			}, this);

		},

		_onRouteMatched: function(oEvent) {
			var oArgs, oView, oRouter, oIconTabBar;

			oRouter = this.getRouter();
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

			if (oArgs["?query"] && this._aValidTabKeys.indexOf(oArgs["?query"].tab) > -1) {
				oIconTabBar = this.byId("idIconTabBarNoIcons");
				if (oIconTabBar.getSelectedKey() !== oArgs["?query"].tab) {
					oIconTabBar.setSelectedKey(oArgs["?query"].tab);
				}

				//we support lazy loading only for Address
				if (oIconTabBar.getSelectedKey() === "Address") {
					//the target is "supplierTabsAddress"
					oRouter.getTargets().display("supplierTabs" + oIconTabBar.getSelectedKey());
				}

			} else {
				//we want the default query param to be visible at all time.
				oRouter.navTo("productSupplier", {
					productId: this._sProductId,
					query: {
						tab: this._aValidTabKeys[0]
					}
				}, true /*no history*/ );
			}

		},

		_onBindingChange: function(oEvent) {
			var oView, oElementBinding;

			oView = this.getView();
			oElementBinding = oView.getElementBinding("product");

			// No data for the binding
			if (oElementBinding && !oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		},

		/**
		 * We use this to update the hash in case a new tab is selected.
		 * @param oEvent
		 */
		onTabSelect: function(oEvent) {
			var oRouter = this.getRouter();

			oRouter.navTo("productSupplier", {
				productId: this._sProductId,
				query: {
					tab: oEvent.getParameter("selectedKey")
				}
			}, true /*without history*/ );
		}

	});

});