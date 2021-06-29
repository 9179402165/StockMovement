sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("ZWM_BIN_TO_BIN_010.controller.CC_StockMovement", {

		getBinDetails: function() {
			var sId = this.getView().byId("INP_BarcodeNumber").getValue();
			if (sId === "" || sId === undefined) {
				//MessageBox.error("Please Enter BARCODE Number ");XMSG_ENTER_BARCODE
				//"{i18n>title}"
				//this.getView().getModel("i18n").getResourceBundle().getText("notificationChangeAlert");
				var msg = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_ENTER_BARCODE");
				MessageToast.show(msg, {
					width: "25rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
			} else {
				var patt = /\([^)][01]\)+[0-9]+\([^)][0]\)+[0-9]*/g; //REGEX TO MATCH BARCODE
				if (patt.test(sId)) {
					var That = this;
					this.getOwnerComponent().getModel().read("/ZStockMovementCollection('" + sId + "')", {
						success: function(oData, oResponse) {
							var oModel = new JSONModel();
							oModel.setData(oData);
							That.getView().setModel(oModel, "oModel");
							That.getView().getModel("oModel").refresh();
							this.getView().byId("LBL_DestinationBin").setVisible(true);
							this.getView().byId("INP_DestinationBin").setVisible(true);
							jQuery.sap.delayedCall(200, this, function() {
								this.getView().byId("INP_DestinationBin").focus();
							});

							//this.getView().byId("INP_DestinationBin").focus();
							var res = oModel.getProperty("/ErrorMessage");
							var quantity = oModel.getProperty("/Quantity");
							this.getView().byId("INP_Quantity").setValue(quantity);
							if (res.length !== 0) {
								//MessageBox.error(res);
								MessageToast.show(res);
								$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
								this.clearDetails();

							}

						}.bind(this),
						error: function(oError) {
							//MessageBox.error("INVALID BARCODE");
							var msg1 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_BARCODE");
							MessageToast.show(msg1);
							$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
						}.bind(this)
					});
				} else {
					//	MessageBox.error("INVALID BARCODE");
					var msg2 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_BARCODE");
					MessageToast.show(msg2, {

					});
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				}

			}
		},
		onQuanChange: function() {
			var sId = this.getView().byId("INP_BarcodeNumber").getValue();

			var x = 0;
			var That = this;
			this.getOwnerComponent().getModel().read("/ZStockMovementCollection('" + sId + "')", {
				success: function(oData, oResponse) {
					var oModel = new JSONModel();
					oModel.setData(oData);

					var decimalSep = oModel.getProperty("/DecimalSeparator");
					var thousandSep = oModel.getProperty("/ThousandSeparator");

					var quantity = this.getView().byId("INP_Quantity").getValue();
					this.getView().getModel("binModel").setProperty("/bin/quantity", quantity);
					jQuery.sap.require("sap.ui.core.format.NumberFormat");
					var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
						maxFractionDigits: 3,
						groupingEnabled: true,
						groupingSeparator: thousandSep,
						decimalSeparator: decimalSep
					});

					this.getView().byId("INP_Quantity").setValue(oNumberFormat.format(quantity));
					var quanError = this.getView().byId("INP_Quantity").getValue();

					if (quanError === "" || quanError === undefined) {
						var msg = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_QUAN");
						MessageToast.show(msg, {
							width: "15rem"
						});
						$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
					}
					jQuery.sap.delayedCall(5, this, function() {
						this.getView().byId("INP_DestinationBin").focus();
					});

				}.bind(this),
				error: function(oError) {
					//MessageBox.error("INVALID BARCODE");
					var msg1 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_BARCODE");
					MessageToast.show(msg1);
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");

				}.bind(this)

			});

		},
		clearDetails: function() {

			this.getView().byId("INP_BarcodeNumber").setValue("");
			this.getView().byId("INP_StockCat").setValue("");
			this.getView().byId("INP_StockIndicator").setValue("");
			this.getView().byId("INP_StockNumber").setValue("");
			this.getView().byId("INP_DestinationBin").setValue("");
			this.getView().byId("INP_Quantity").setValue("");
			this.getView().byId("LBL_DestinationBin").setVisible(false);
			this.getView().byId("INP_DestinationBin").setVisible(false);

			//this.getView().byId("DestRes").setVisible(false);
			this.getView().byId("TXTV_StrLoc").setText("");
			this.getView().byId("TXTV_SourceBin").setText("");
			this.getView().byId("TXTV_Matnr").setText("");
			this.getView().byId("TXTV_Batch").setText("");

			this.getView().byId("TXTV_UOM").setText("");
			this.getView().byId("TXTV_MESNumber").setText("");
			//this.getView().byId("DestRes").setText("");
			this.getView().byId("IMG_Right").setVisible(false);
			this.getView().byId("BTN_Create").setVisible(true);
			this.getView().byId("BTN_Mover").setVisible(false);
			jQuery.sap.delayedCall(200, this, function() {
				this.getView().byId("INP_BarcodeNumber").focus();
			});
		},
		validateBin: function() {
			var sId = this.getView().byId("INP_BarcodeNumber").getValue();
			if (sId === "" || sId === undefined) {
				//MessageBox.error("Please Enter BARCODE Number ");
				var msg2 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_ENTER_BARCODE");
				MessageToast.show(msg2, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}

			var sId4 = this.getView().byId("INP_DestinationBin").getValue();
			if (sId4 === "" || sId4 === undefined) {
				//	MessageBox.error("Please Enter DESTINATION Number ");
				var msg3 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_ENTER_DESTINATION_NUM");
				MessageToast.show(msg3, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}

			var sId5 = this.getView().byId("TXTV_SourceBin").getText();
			if (sId5 === sId4) {
				//MessageBox.error("SOURCE AND DEST BIN SHOULD BE DIFFERENT");
				var msg4 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_SOURCE_DESTINATION_DIFF");
				MessageToast.show(msg4, {
					width: "30rem"
				});
				$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				return;
			}
			var That = this;
			this.getOwnerComponent().getModel().callFunction("/ZValidateBin", {

				method: "GET",
				urlParameters: {
					DestinationBin: sId4
				},
				success: function(oData, oResponse) {
					var oModel = new JSONModel();
					oModel.setData(oData);

					var res = oModel.getProperty("/results/0/ValidateBin");
					//	this.getView().byId("DestRes").setText(res);
					//this.getView().byId("DestRes").setVisible(true);

					if (res === "VALID") {
						this.getView().byId("IMG_Right").setVisible(true);
						this.getView().byId("BTN_Create").setVisible(false);
						this.getView().byId("BTN_Mover").setVisible(true);
					}

				}.bind(this),
				error: function(oError) {

					var msg5 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_INVALID_DESTINATION_BIN");
					MessageToast.show(msg5);
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				}.bind(this)
			});
		},

		stockMovement: function() {
			var sBarcode = this.getView().byId("INP_BarcodeNumber").getValue();
			var sDstnBin = this.getView().byId("INP_DestinationBin").getValue();
			var sStckCat = this.getView().byId("INP_StockCat").getValue();
			var that = this;
			//var sId6 = this.getView().byId("quan").getValue();
			//var quanTest = this.getView.getModel().getProperty("/quantity");
			//MessageBox.success(quanTest);

			var quanModel;
			quanModel = this.getView().getModel("binModel").getProperty("/bin/quantity");

			//var ret = this.getView().byId("waste").getValue();
			jQuery.sap.require("sap.ui.core.format.NumberFormat");
			var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
				maxFractionDigits: 3,
				maxIntegerDigits: 10,
				groupingEnabled: false,

				decimalSeparator: "."
			});
			quanModel = oNumberFormat.format(quanModel);
			MessageBox.success(quanModel);
			//var sId9 = ret + "m";
			//MessageBox.success(sId9);
			var sStckNum = this.getView().byId("INP_StockNumber").getValue();
			var sStckIndictr = this.getView().byId("INP_StockIndicator").getValue();

			var payLoad = {
				"Barcode": sBarcode,
				"DestinationBin": sDstnBin,
				"Category": sStckCat,
				"Quantity": quanModel,
				"StockNumber": sStckNum,
				"StockIndicator": sStckIndictr
			};

			this.getOwnerComponent().getModel().create("/ZStockMovementCollection", payLoad, {
				success: function(odata, Response) {

					if (odata !== "" || odata !== undefined) {

						var oModel = new JSONModel();
						oModel.setData(odata);

						var res = oModel.getProperty("/TransferOrderNumber");
						var msg6 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_TO") + res +
							this.getView().getModel("i18n").getResourceBundle().getText("XMSG_Created");
						MessageToast.show(msg6, {
							width: "25rem"
						});
						$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
						this.clearDetails();
					} else {
						var msg7 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_No_TO");
						MessageToast.show(msg7, {
							width: "30rem"
						});
						$(".sapMMessageToast").addClass("sapMMessageToastDanger ");

					}
				}.bind(this),
				error: function(cc, vv) {
					var msg6 = this.getView().getModel("i18n").getResourceBundle().getText("XMSG_StkMovement_NotDone");
					MessageToast.show(msg6, {
						width: "30rem"
					});
					$(".sapMMessageToast").addClass("sapMMessageToastDanger ");
				}.bind(this)
			});
		}

	});
});