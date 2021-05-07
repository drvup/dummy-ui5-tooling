/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/security/encodeXML"],function(t){"use strict";var e=5;var a={apiVersion:2};a.render=function(t,a){var i=sap.ui.getCore().getConfiguration().getLocale().getLanguage();var n=a.getTooltip_AsString();var s=a.getId();var l=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified").getText("CALENDAR_BTN_NEXT");var o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified").getText("CALENDAR_BTN_PREV");t.openStart("div",a);t.class("sapUiCalHead");if(n){t.attr("title",n)}t.accessibilityState(a);t.openEnd();t.openStart("button",s+"-prev");t.attr("title",o);t.accessibilityState(null,{label:o});t.class("sapUiCalHeadPrev");if(!a.getEnabledPrevious()){t.class("sapUiCalDsbl");t.attr("disabled","disabled")}t.attr("tabindex","-1");t.openEnd();t.icon("sap-icon://slim-arrow-left",null,{title:null});t.close("button");var r=-1;var u=-1;var d=0;var c;for(d=0;d<e;d++){if(this.getVisibleButton(a,d)){if(r<0){r=d}u=d}}for(d=0;d<e;d++){if(i.toLowerCase()==="ja"||i.toLowerCase()==="zh"){c=e-1-d;if(this._isTwoMonthsCalendar(a)){switch(d){case 0:c=2;break;case 2:c=4;break;case 1:c=1;break;case 3:c=3;break}}}else{c=d}if(this._isTwoMonthsCalendar(a)){r=2;u=3}this.renderCalendarButtons(t,a,s,r,u,c)}t.openStart("button",s+"-next");t.attr("title",l);t.accessibilityState(null,{label:l});t.class("sapUiCalHeadNext");if(!a.getEnabledNext()){t.class("sapUiCalDsbl");t.attr("disabled","disabled")}t.attr("tabindex","-1");t.openEnd();t.icon("sap-icon://slim-arrow-right",null,{title:null});t.close("button");t.close("div")};a.renderCalendarButtons=function(t,e,a,i,n,s){var l={};if(this.getVisibleButton(e,s)){t.openStart("button",a+"-B"+s);t.class("sapUiCalHeadB");t.class("sapUiCalHeadB"+s);if(i===s){t.class("sapUiCalHeadBFirst")}if(n===s){t.class("sapUiCalHeadBLast")}t.attr("tabindex","-1");if(this.getAriaLabelButton(e,s)){l["label"]=this.getAriaLabelButton(e,s)}t.accessibilityState(null,l);l={};t.openEnd();var o=this.getTextButton(e,s)||"";var r=this.getAdditionalTextButton(e,s)||"";if(r){t.openStart("span",a+"-B"+s+"-Text");t.class("sapUiCalHeadBText");t.openEnd();t.text(o);t.close("span");t.openStart("span",a+"-B"+s+"-AddText");t.class("sapUiCalHeadBAddText");t.openEnd();t.text(r);t.close("span")}else{t.text(o)}t.close("button")}};a.getVisibleButton=function(t,e){var a=false;if(t["getVisibleButton"+e]){a=t["getVisibleButton"+e]()}else if(t["_getVisibleButton"+e]){a=t["_getVisibleButton"+e]()}return a};a.getAriaLabelButton=function(t,e){var a;if(t["getAriaLabelButton"+e]){a=t["getAriaLabelButton"+e]()}else if(t["_getAriaLabelButton"+e]){a=t["_getAriaLabelButton"+e]()}return a};a.getTextButton=function(t,e){var a;if(t["getTextButton"+e]){a=t["getTextButton"+e]()}else if(t["_getTextButton"+e]){a=t["_getTextButton"+e]()}return a};a.getAdditionalTextButton=function(t,e){var a;if(t["getAdditionalTextButton"+e]){a=t["getAdditionalTextButton"+e]()}else if(t["_getAdditionalTextButton"+e]){a=t["_getAdditionalTextButton"+e]()}return a};a._isTwoMonthsCalendar=function(t){return t.getParent()instanceof sap.ui.unified.Calendar&&t.getParent().getMonths()>=2};return a},true);