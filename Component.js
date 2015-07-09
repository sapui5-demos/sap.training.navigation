sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/resource/ResourceModel",
   "sap/ui/model/odata/v2/ODataModel"
], function(UIComponent, ResourceModel, ODataModel) {
	"use strict";
	return UIComponent.extend("sap.training.navigation.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set i18n model
			var i18nModel = new ResourceModel({
				bundleName: "sap.training.navigation.i18n.i18n"
			});
			this.setModel(i18nModel, "i18n");

			// set invoice model - remote
			var mAppData = this.getMetadata().getManifestEntry("sap.app");
			var sServiceUrl = mAppData.dataSources.demoService.uri;
			var oProductModel = new ODataModel(sServiceUrl);
			this.setModel(oProductModel, "product");

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});