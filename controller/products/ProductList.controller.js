sap.ui.define(
    ["sap/training/navigation/controller/BaseController"],
	function(BaseController) {
		"use strict";
		return BaseController.extend("sap.training.navigation.controller.products.ProductList", {

			onListItemPressed: function(oEvent) {
				var oItem, oCtx, iProductId, oRouter;

				oItem = oEvent.getSource();
				oCtx = oItem.getBindingContext("product");
				iProductId = oCtx.getProperty("ID");
				oRouter = this.getRouter();

				oRouter.navTo("product", {
					productId: iProductId
				}, false /*with history*/ );

			}

		});
	}
);