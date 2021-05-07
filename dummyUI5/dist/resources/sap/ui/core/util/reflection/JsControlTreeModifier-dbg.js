// valid-jsdoc disabled because this check is validating just the params and return statement and those are all inherited from BaseTreeModifier.
/* eslint-disable valid-jsdoc */
/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/base/BindingParser",
	"./BaseTreeModifier",
	"./XmlTreeModifier",
	"sap/base/util/ObjectPath",
	"sap/ui/util/XMLHelper",
	"sap/base/util/merge",
	"sap/ui/core/Fragment" // also needed to have sap.ui.xmlfragment
], function (
	BindingParser,
	BaseTreeModifier,
	XmlTreeModifier,
	ObjectPath,
	XMLHelper,
	merge,
	Fragment
) {


	"use strict";
	/**
	 * Static utility class to access ManagedObjects in a harmonized way with XMLNodes.
	 *
	 * @namespace sap.ui.core.util.reflection.JsControlTreeModifier
	 * @extends sap.ui.core.util.reflection.BaseTreeModifier
	 * @private
	 * @ui5-restricted
	 * @since 1.56.0
	 */
	var JsControlTreeModifier = /** @lends sap.ui.core.util.reflection.JsControlTreeModifier */ {

		targets: "jsControlTree",

		/**
		 * @inheritDoc
		 */
		setVisible: function (oControl, bVisible) {
			if (oControl.setVisible) {
				this.unbindProperty(oControl, "visible");
				oControl.setVisible(bVisible);
			} else {
				throw new Error("Provided control instance has no setVisible method");
			}
		},

		/**
		 * @inheritDoc
		 */
		getVisible: function (oControl) {
			if (oControl.getVisible) {
				return oControl.getVisible();
			} else {
				throw new Error("Provided control instance has no getVisible method");
			}
		},

		/**
		 * @inheritDoc
		 */
		setStashed: function (oControl, bStashed) {
			bStashed = !!bStashed;
			if (oControl.unstash) {
				// check if the control is stashed and should be unstashed
				if (oControl.isStashed() === true && bStashed === false) {
					oControl = oControl.unstash();
				}

				// ensure original control's visible property is set
				if (oControl.setVisible) {
					this.setVisible(oControl, !bStashed);
				}

				return oControl;
			} else {
				throw new Error("Provided control instance has no unstash method");
			}
		},

		/**
		 * @inheritDoc
		 */
		getStashed: function (oControl) {
			if (oControl.isStashed) {
				return oControl.isStashed() ? oControl.isStashed() : !this.getVisible(oControl);
			}
			throw new Error("Provided control instance has no isStashed method");
		},

		/**
		 * @inheritDoc
		 */
		bindProperty: function (oControl, sPropertyName, vBindingInfos) {
			oControl.bindProperty(sPropertyName, vBindingInfos);
		},

		/**
		 * @inheritDoc
		 */
		unbindProperty: function (oControl, sPropertyName) {
			if (oControl) {
				oControl.unbindProperty(sPropertyName, /*bSuppressReset = */true);
			}
		},

		/**
		 * @inheritDoc
		 */
		setProperty: function (oControl, sPropertyName, vPropertyValue) {
			var oMetadata = oControl.getMetadata().getPropertyLikeSetting(sPropertyName);
			var oBindingParserResult;
			var bError;

			this.unbindProperty(oControl, sPropertyName);

			try {
				oBindingParserResult = BindingParser.complexParser(vPropertyValue, undefined, true);
			} catch (error) {
				bError = true;
			}

			//For compatibility with XMLTreeModifier the value should be serializable
			if (oMetadata) {
				if (this._isSerializable(vPropertyValue)) {
					if (oBindingParserResult && typeof oBindingParserResult === "object" || bError) {
						vPropertyValue = this._escapeCurlyBracketsInString(vPropertyValue);
					}
					var sPropertySetter = oMetadata._sMutator;
					oControl[sPropertySetter](vPropertyValue);
				} else {
					throw new TypeError("Value cannot be stringified", "sap.ui.core.util.reflection.JsControlTreeModifier");
				}
			}
		},

		/**
		 * @inheritDoc
		 */
		getProperty: function (oControl, sPropertyName) {
			var oMetadata = oControl.getMetadata().getPropertyLikeSetting(sPropertyName);
			if (oMetadata) {
				var sPropertyGetter = oMetadata._sGetter;
				return oControl[sPropertyGetter]();
			}
		},

		/**
		 * @inheritDoc
		 */
		isPropertyInitial: function (oControl, sPropertyName) {
			return oControl.isPropertyInitial(sPropertyName);
		},

		/**
		 * @inheritDoc
		 */
		setPropertyBinding: function (oControl, sPropertyName, oPropertyBinding) {
			this.unbindProperty(oControl, sPropertyName);
			var mSettings = {};
			mSettings[sPropertyName] = oPropertyBinding;
			oControl.applySettings(mSettings);
		},

		/**
		 * @inheritDoc
		 */
		getPropertyBinding: function (oControl, sPropertyName) {
			return oControl.getBindingInfo(sPropertyName);
		},

		/**
		 * @inheritDoc
		 */
		createAndAddCustomData: function(oControl, sCustomDataKey, sValue, oAppComponent) {
			var oCustomData = this.createControl("sap.ui.core.CustomData", oAppComponent);
			this.setProperty(oCustomData, "key", sCustomDataKey);
			this.setProperty(oCustomData, "value", sValue);
			this.insertAggregation(oControl, "customData", oCustomData, 0);
		},

		/**
		 * @inheritDoc
		 */
		createControl: function (sClassName, oAppComponent, oView, oSelector, mSettings, bAsync) {
			var sErrorMessage;
			if (this.bySelector(oSelector, oAppComponent)) {
				sErrorMessage = "Can't create a control with duplicated ID " + (oSelector.id || oSelector);
				if (bAsync) {
					return Promise.reject(sErrorMessage);
				}
				throw new Error(sErrorMessage);
			}

			if (bAsync) {
				return new Promise(function(fnResolve, fnReject) {
					sap.ui.require([sClassName.replace(/\./g,"/")],
						function(ClassObject) {
							var sId = this.getControlIdBySelector(oSelector, oAppComponent);
							fnResolve(new ClassObject(sId, mSettings));
						}.bind(this),
						function() {
							fnReject(new Error("Required control '" + sClassName + "' couldn't be created asynchronously"));
						}
					);
				}.bind(this));
			}

			// in the synchronous case, object should already be preloaded
			var ClassObject = ObjectPath.get(sClassName);
			if (!ClassObject) {
				throw new Error("Can't create a control because the matching class object has not yet been loaded. Please preload the '" + sClassName + "' module");
			}
			var sId = this.getControlIdBySelector(oSelector, oAppComponent);
			return new ClassObject(sId, mSettings);
		},

		/**
		 * @inheritDoc
		 */
		applySettings: function(oControl, mSettings) {
			oControl.applySettings(mSettings);
		},

		/**
		 * @inheritDoc
		 */
		_byId: function (sId) {
			return sap.ui.getCore().byId(sId);
		},

		/**
		 * @inheritDoc
		 */
		getId: function (oControl) {
			return oControl.getId();
		},

		/**
		 * @inheritDoc
		 */
		getParent: function (oControl) {
			return oControl.getParent && oControl.getParent();
		},

		/**
		 * @inheritDoc
		 */
		getControlMetadata: function (oControl) {
			return oControl && oControl.getMetadata();
		},

		/**
		 * @inheritDoc
		 */
		getControlType: function (oControl) {
			return oControl && oControl.getMetadata().getName();
		},

		/**
		 * @inheritDoc
		 */
		setAssociation: function (vParent, sName, sId) {
			var oMetadata = vParent.getMetadata().getAssociation(sName);
			oMetadata.set(vParent, sId);
		},

		/**
		 * @inheritDoc
		 */
		getAssociation: function (vParent, sName) {
			var oMetadata = vParent.getMetadata().getAssociation(sName);
			return oMetadata.get(vParent);
		},

		/**
		 * @inheritDoc
		 */
		getAllAggregations: function (oParent) {
			return oParent.getMetadata().getAllAggregations();
		},

		/**
		 * @inheritDoc
		 */
		getAggregation: function (oParent, sName) {
			var oAggregation = this.findAggregation(oParent, sName);
			if (oAggregation) {
				return oParent[oAggregation._sGetter]();
			}
		},

		/**
		 * @inheritDoc
		 */
		insertAggregation: function (oParent, sName, oObject, iIndex) {
			//special handling without invalidation for customData
			if ( sName === "customData"){
				oParent.insertAggregation(sName, oObject, iIndex, /*bSuppressInvalidate=*/true);
			} else {
				var oAggregation = this.findAggregation(oParent, sName);
				if (oAggregation) {
					if (oAggregation.multiple) {
						var iInsertIndex = iIndex || 0;
						oParent[oAggregation._sInsertMutator](oObject, iInsertIndex);
					} else {
						oParent[oAggregation._sMutator](oObject);
					}
				}
			}

		},

		/**
		 * @inheritDoc
		 */
		removeAggregation: function (oControl, sName, oObject) {
			//special handling without invalidation for customData
			if ( sName === "customData"){
				oControl.removeAggregation(sName, oObject, /*bSuppressInvalidate=*/true);
			} else {
				var oAggregation = this.findAggregation(oControl, sName);
				if (oAggregation) {
					oControl[oAggregation._sRemoveMutator](oObject);
				}
			}
		},

		/**
		 * @inheritDoc
		 */
		removeAllAggregation: function (oControl, sName) {
			//special handling without invalidation for customData
			if ( sName === "customData"){
				oControl.removeAllAggregation(sName, /*bSuppressInvalidate=*/true);
			} else {
				var oAggregation = this.findAggregation(oControl, sName);
				if (oAggregation) {
					oControl[oAggregation._sRemoveAllMutator]();
				}
			}
		},

		/**
		 * @inheritDoc
		 */
		getBindingTemplate: function (oControl, sAggregationName) {
			var oBinding = oControl.getBindingInfo(sAggregationName);
			return oBinding && oBinding.template;
		},

		/**
		 * @inheritDoc
		 */
		updateAggregation: function (oControl, sAggregationName) {
			var oAggregation = this.findAggregation(oControl, sAggregationName);
			if (oAggregation && oControl.getBinding(sAggregationName)) {
				oControl[oAggregation._sDestructor]();
				oControl.updateAggregation(sAggregationName);
			}
		},

		/**
		 * @inheritDoc
		 */
		findIndexInParentAggregation: function(oControl) {
			var oParent = this.getParent(oControl),
				aControlsInAggregation;

			if (!oParent) {
				return -1;
			}

			// we need all controls in the aggregation
			aControlsInAggregation = this.getAggregation(oParent, this.getParentAggregationName(oControl));

			// if aControls is an array:
			if (Array.isArray(aControlsInAggregation)) {
				// then the aggregtion is multiple and we can find the index of
				// oControl in the array
				return aControlsInAggregation.indexOf(oControl);
			} else {
				// if aControlsInAggregation is not an array, then the aggregation is
				// of type 0..1 and aControlsInAggregation is the oControl provided
				// to the function initially, so its index is 0
				return 0;
			}
		},

		/**
		 * @inheritDoc
		 */
		getParentAggregationName: function (oControl) {
			return oControl.sParentAggregationName;
		},

		/**
		 * @inheritDoc
		 */
		findAggregation: function(oControl, sAggregationName) {
			if (oControl) {
				if (oControl.getMetadata) {
					var oMetadata = oControl.getMetadata();
					var oAggregations = oMetadata.getAllAggregations();
					if (oAggregations) {
						return oAggregations[sAggregationName];
					}
				}
			}
		},

		/**
		 * @inheritDoc
		 */
		validateType: function(oControl, oAggregationMetadata, oParent, sFragment) {
			var sTypeOrInterface = oAggregationMetadata.type;

			// if aggregation is not multiple and already has element inside, then it is not valid for element
			if (oAggregationMetadata.multiple === false && this.getAggregation(oParent, oAggregationMetadata.name) &&
					this.getAggregation(oParent, oAggregationMetadata.name).length > 0) {
				return false;
			}
			return oControl.isA(sTypeOrInterface);
		},

		/**
		 * @inheritDoc
		 */
		instantiateFragment: function(sFragment, sNamespace, oView) {
			var oFragment = XMLHelper.parse(sFragment);
			oFragment = this._checkAndPrefixIdsInFragment(oFragment, sNamespace);

			var aNewControls;
			var sId = oView && oView.getId();
			var oController = oView.getController();
			aNewControls = sap.ui.xmlfragment({
				fragmentContent: oFragment,
				sId:sId
			}, oController);

			if (!Array.isArray(aNewControls)) {
				aNewControls = [aNewControls];
			}
			return aNewControls;
		},

		/**
		 * @inheritDoc
		 */
		templateControlFragment: function(sFragmentName, mPreprocessorSettings, oView) {
			return BaseTreeModifier._templateFragment(
				sFragmentName,
				mPreprocessorSettings
			).then(function(oFragment) {
				var oController = (oView && oView.getController()) || undefined;
				return Fragment.load({
					definition: oFragment,
					controller: oController
				});
			});
		},

		/**
		 * @inheritDoc
		 */
		destroy: function(oControl, bSuppressInvalidate) {
			oControl.destroy(bSuppressInvalidate);
		},

		_getFlexCustomData: function(oControl, sType) {
			var oCustomData = typeof oControl === "object"
				&& typeof oControl.data === "function"
				&& oControl.data("sap-ui-custom-settings");
			return ObjectPath.get(["sap.ui.fl", sType], oCustomData);
		},

		/**
		 * @inheritDoc
		 */
		attachEvent: function (oObject, sEventName, sFunctionPath, vData) {
			var fnCallback = ObjectPath.get(sFunctionPath);

			if (typeof fnCallback !== "function") {
				throw new Error("Can't attach event because the event handler function is not found or not a function.");
			}

			oObject.attachEvent(sEventName, vData, fnCallback);
		},

		/**
		 * @inheritDoc
		 */
		detachEvent: function (oObject, sEventName, sFunctionPath) {
			var fnCallback = ObjectPath.get(sFunctionPath);

			if (typeof fnCallback !== "function") {
				throw new Error("Can't attach event because the event handler function is not found or not a function.");
			}

			// EventProvider.detachEvent doesn't accept vData parameter, therefore it might lead
			// to a situation when an incorrect event listener is detached.
			oObject.detachEvent(sEventName, fnCallback);
		},

		/**
		 * @inheritDoc
		 */
		bindAggregation: function (oControl, sAggregationName, oBindingInfo) {
			oControl.bindAggregation(sAggregationName, oBindingInfo);
		},

		/**
		 * @inheritDoc
		 */
		unbindAggregation: function (oControl, sAggregationName) {
			// bSuppressReset is not supported
			oControl.unbindAggregation(sAggregationName);
		},

		/**
		 * @inheritDoc
		 */
		getExtensionPointInfo: function(sExtensionPointName, oView) {
			var oViewNode = (oView._xContent) ? oView._xContent : oView;
			var oExtensionPointInfo = XmlTreeModifier.getExtensionPointInfo(sExtensionPointName, oViewNode);
			if (oExtensionPointInfo) {
				// decrease the index by 1 to get the index of the extension point itself for js-case
				oExtensionPointInfo.index--;
				oExtensionPointInfo.parent = oExtensionPointInfo.parent && this._byId(oView.createId(oExtensionPointInfo.parent.getAttribute("id")));
				oExtensionPointInfo.defaultContent = oExtensionPointInfo.defaultContent
					.map(function (oNode) {
						var sId = oView.createId(oNode.getAttribute("id"));
						return this._byId(sId);
					}.bind(this))
					.filter(function (oControl) {
						return !!oControl;
					});
			}
			return oExtensionPointInfo;
		}
	};

	return merge(
		{} /* target object, to avoid changing of original modifier */,
		BaseTreeModifier,
		JsControlTreeModifier
	);
},
/* bExport= */true);
