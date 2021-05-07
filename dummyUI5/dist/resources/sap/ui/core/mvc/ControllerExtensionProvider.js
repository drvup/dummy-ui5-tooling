/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/Component"],function(e,r){"use strict";var n={};var o={};o._sExtensionProvider=null;o.registerExtensionProvider=function(e){o._sExtensionProvider=e};o.getControllerExtensions=function(n,s,l,u){var a={customizingControllerNames:[],providerControllers:[]};var f=r.get(s);if(f&&f.getLocalId){l=f.getLocalId(l)||l}var v=t(n,f,l);a.customizingControllerNames=v;if(u){if(o._sExtensionProvider){return i(u).then(function(e){return e.getControllerExtensions(n,s,u,l)}).then(function(e){a.providerControllers=e||[];return a})}else{return Promise.resolve(a)}}else{if(o._sExtensionProvider){var c=i();if(c){var g=c.getControllerExtensions(n,s,u,l);if(g&&Array.isArray(g)){a.providerControllers=g}else{e.error("Controller Extension Provider: Error in ExtensionProvider.getControllerExtensions: "+o._sExtensionProvider+" - no valid extensions returned. Return value must be an array of ControllerExtensions.")}}}return a}};function t(e,r,n){var o=[];if(!sap.ui.getCore().getConfiguration().getDisableCustomizing()){if(r){r=r.getExtensionComponent&&r.getExtensionComponent()||r;var t=r._getManifestEntry("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/"+e+"#"+n,true);var i=[];if(t){i.push(t)}else{var s=r._getManifestEntry("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/"+e,true);if(s){i.push(s)}}for(var l=0;l<i.length;l++){var u=i[l];if(u){var a=typeof u==="string"?u:u.controllerName;o=o.concat(u.controllerNames||[]);if(a){o.unshift(a)}}}}}return o}function i(e){var r=o._sExtensionProvider.replace(/\./g,"/"),t=n[r];if(t){return e?Promise.resolve(t):t}if(r){if(e){return new Promise(function(e,o){sap.ui.require([r],function(o){t=new o;n[r]=t;e(t)},o)})}else{var i=sap.ui.requireSync(r);t=new i;n[r]=t;return t}}else{return e?Promise.resolve():undefined}}return o});