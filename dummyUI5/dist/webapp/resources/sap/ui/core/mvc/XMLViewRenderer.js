/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ViewRenderer","../RenderManager","sap/ui/thirdparty/jquery"],function(e,t,r){"use strict";var n=t.RenderPrefixes.Dummy,i=t.RenderPrefixes.Invisible,d=t.RenderPrefixes.Temporary;var s={apiVersion:1};s.render=function(s,a){var o,l=a._$oldContent=t.findPreservedContent(a.getId());if(l.length===0){var p=a.isSubView();if(!p){s.openStart("div",a);s.class("sapUiView");s.class("sapUiXMLView");e.addDisplayClass(s,a);if(!a.oAsyncState||!a.oAsyncState.suppressPreserve){s.attr("data-sap-ui-preserve",a.getId())}s.style("width",a.getWidth());s.style("height",a.getHeight());s.openEnd()}if(a._aParsedContent){for(var f=0;f<a._aParsedContent.length;f++){o=a._aParsedContent[f];if(o&&typeof o==="string"){s.write(o)}else{s.renderControl(o);if(!o.bOutput){s.openStart("div",n+o.getId());s.class("sapUiHidden");s.openEnd()}}}}if(!p){s.close("div")}}else{s.renderControl(a.oAfterRenderingNotifier);s.openStart("div",d+a.getId());s.class("sapUiHidden");s.openEnd();for(var g=0;g<a._aParsedContent.length;g++){o=a._aParsedContent[g];if(typeof o!=="string"){s.renderControl(o);var v=o.getId(),u=r(document.getElementById(v));if(u.length==0){u=r(document.getElementById(i+v))}if(!t.isPreservedContent(u[0])){u.replaceWith('<div id="'+n+v+'" class="sapUiHidden"></div>')}}}s.close("div")}};return s},true);