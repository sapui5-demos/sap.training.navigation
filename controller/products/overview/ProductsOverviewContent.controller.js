sap.ui.define([
   "sap/training/navigation/controller/BaseController",
   "sap/ui/model/Filter",
   "sap/ui/model/FilterOperator",
   "sap/ui/model/Sorter"
], function(BaseController, Filter, FilterOperator, Sorter) {
	"use strict";

	return BaseController.extend("sap.training.navigation.controller.products.overview.ProductsOverviewContent", {

		onInit: function() {
			var oRouter = this.getRouter();

			this._oTable = this.getView().byId("idProductsTable");
			this._oVsd = null; //View Settings Dialog
			this._sSortField = null; //the current path in the model used for sorting
			this._bSortDescending = false; //the current path in the model used for sorting
			this._aValidSortFields = ["ID", "Name", "Rating", "Price"];
			this._sSearchQuery = null;

			this._oRouterArgs = null;

			this._initViewSettingsDialog();

			//we want to allow bookmarks
			oRouter.getRoute("productsOverview").attachMatched(function(oEvent) {
				this._onRouteMatched(oEvent);
			}, this);

		},

		_onRouteMatched: function(oEvent) {
			//save the current query for an easier navigation to the same view
			this._oRouterArgs = oEvent.getParameter("arguments");
			this._oRouterArgs.query = this._oRouterArgs["?query"] || {};
			delete this._oRouterArgs["?query"];

			if (this._oRouterArgs.query) {

				//search/filter via url hash
				this._applySearchFilter(this._oRouterArgs.query.search);

				//sorting via url hash
				this._applySorter(this._oRouterArgs.query.sortField, this._oRouterArgs.query.sortDescending);

			}
		},

		onSortButtonPressed: function(oEvent) {

			this._oVsd.open();

		},

		onSearchProductsTable: function(oEvent) {
			var oRouter = this.getRouter();
			//navTo in order to change the hash
			this._oRouterArgs.query.search = oEvent.getSource().getValue();
			oRouter.navTo("productsOverview", this._oRouterArgs, false /*with history*/ );

		},

		_initViewSettingsDialog: function() {
			var oRouter = this.getRouter();
			this._oVsd = new sap.m.ViewSettingsDialog("vsd", {
				confirm: function(oEvent) {
					var oSortItem = oEvent.getParameter("sortItem");

					this._oRouterArgs.query.sortField = oSortItem.getKey();
					this._oRouterArgs.query.sortDescending = oEvent.getParameter("sortDescending");

					oRouter.navTo("productsOverview", this._oRouterArgs, true /*without history*/ );

				}.bind(this),

				cancel: function(oEvent) {

					oRouter.navTo("productsOverview", this._oRouterArgs, true /*without history*/ );
				}.bind(this)

			});

			// init sorting (with simple sorters as custom data for all fields)
			this._oVsd.addSortItem(new sap.m.ViewSettingsItem({
				key: "ID",
				text: "Product ID",
				selected: true
			}));

			this._oVsd.addSortItem(new sap.m.ViewSettingsItem({
				key: "Name",
				text: "Name",
				selected: false
			}));

			this._oVsd.addSortItem(new sap.m.ViewSettingsItem({
				key: "Rating",
				text: "Rating",
				selected: false
			}));

			this._oVsd.addSortItem(new sap.m.ViewSettingsItem({
				key: "Price",
				text: "Price",
				selected: false
			}));
		},

		_applySearchFilter: function(sSearchQuery) {
			var aFilters, oFilter, oBinding;

			//first check if we already have this search value
			if (this._sSearchQuery === sSearchQuery) {
				return;
			}
			this._sSearchQuery = sSearchQuery;
			this.byId("idSearchField").setValue(sSearchQuery);

			// add filters for search
			aFilters = [];
			if (sSearchQuery && sSearchQuery.length > 0) {
				aFilters.push(new Filter("Name", FilterOperator.Contains, sSearchQuery));
				aFilters.push(new Filter("Description", FilterOperator.Contains, sSearchQuery));
				oFilter = new Filter({
					filters: aFilters,
					and: false
				}); //OR filter
			} else {
				oFilter = null;
			}

			// update list binding
			oBinding = this._oTable.getBinding("items");
			oBinding.filter(oFilter, "Application");
		},

		/**
		 * Applies sorting on our table control.
		 * @param {string} sSortField     the name of the field used for sorting
		 * @param {string} sortDescending  true or false as a string or boolean value to specify a descending sorting
		 * @private
		 */
		_applySorter: function(sSortField, sortDescending) {
			var bSortDescending, oBinding, oSorter;

			//only continue if we have a valid sort field
			if (sSortField && this._aValidSortFields.indexOf(sSortField) > -1) {

				//make sure we convert to the correct boolean value
				if (typeof sortDescending === "string") {
					bSortDescending = sortDescending === "true";
				} else if (typeof sortDescending === "boolean") {
					bSortDescending = sortDescending;
				} else {
					bSortDescending = false;
				}

				//make sure we only sort if the sorter has changed
				if (this._sSortField && this._sSortField === sSortField && this._bSortDescending === bSortDescending) {
					return;
				}

				this._sSortField = sSortField;
				this._bSortDescending = bSortDescending;
				oSorter = new Sorter(sSortField, bSortDescending);

				//sync with View Settings Dialog
				this._syncViewSettingsDialogSorter(sSortField, bSortDescending);

				oBinding = this._oTable.getBinding("items");
				oBinding.sort(oSorter);
			}
		},

		_syncViewSettingsDialogSorter: function(sSortField, bSortDescending) {
			//we trust the caller to receive valid values and we don't care if the same values are already set
			this._oVsd.setSelectedSortItem(sSortField);
			this._oVsd.setSortDescending(bSortDescending);
		},

		onItemPressed: function(oEvent) {
			var oItem, oCtx, oRouter;
			oItem = oEvent.getParameter("listItem");
			oCtx = oItem.getBindingContext("product");
			oRouter = this.getRouter();

			oRouter.navTo("productSupplier", {
				productId: oCtx.getProperty("ID"),
				query: {
					tab: "Info"
				}
			}, false /*with history*/ );
		}

	});

});