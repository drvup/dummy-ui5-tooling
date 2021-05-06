/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log"],function(e){"use strict";return{display:function(e,t,r){var i=Promise.resolve();return this._display(e,t,r,i)},_display:function(e,t,r,i){var a=this,n=[];if(!Array.isArray(e)){e=[e]}this._attachTitleChanged(e,r);return this._alignTargetsInfo(e).reduce(function(e,r){var i={prefix:r.prefix,propagateTitle:r.propagateTitle||false};return a._displaySingleTarget(r,t,e,i).then(function(e){e=e||{};e.targetInfo=r;n.push(e)})},i).then(function(){return n})},_addDynamicTargetToRoute:function(e){if(this._oRouter){var t=this._oRouter._getLastMatchedRouteName();var r,i;if(t){r=this._oRouter.getRoute(t);if(r&&r._oConfig&&r._oConfig.target){i=this._alignTargetsInfo(r._oConfig.target).some(function(t){return t.name===e.name});if(!i){r._oConfig.dynamicTarget=r._oConfig.dynamicTarget||[];r._oConfig.dynamicTarget.push(e)}}}}},_displaySingleTarget:function(t,r,i,a){var n=t.name,o=this.getTarget(n);if(o!==undefined){o._routeRelevant=t.routeRelevant||false;if(t.routeRelevant){this._addDynamicTargetToRoute(t)}return o._display(r,i,a)}else{var s='The target with the name "'+n+'" does not exist!';e.error(s,this);return Promise.resolve({name:n,error:s})}}}});