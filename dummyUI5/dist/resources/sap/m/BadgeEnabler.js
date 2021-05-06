/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/BadgeCustomData","sap/base/Log","sap/m/library"],function(t,a,e){"use strict";var i="sapMBadge";var s={topLeft:"sapMBadgeTopLeft",topRight:"sapMBadgeTopRight",inline:"sapMBadgeInline"};var n=e.BadgeState;var o=e.BadgeStyle;var d=["","undefined","null",false];var g=function(){this.initBadgeEnablement=function(t,a){var i=a?a:this;this._oBadgeConfig=t||{};i.addEventDelegate({onAfterRendering:e},this)};function a(t,a){if(t.suffix){return a.$(t.suffix)}if(t.selector){return a.$().find(t.selector).first()}}function e(){this._isBadgeAttached=false;if(!this.getBadgeCustomData()||!this.getBadgeCustomData().getVisible()){return false}l.call(this);if(!Object.keys(this._oBadgeConfig).length){return this}return this}function g(){var t=r.call(this);t.removeClass("sapMBadgeAnimationUpdate");t.removeClass("sapMBadgeAnimationAdd");t.width();t.addClass("sapMBadgeAnimationRemove");t.removeAttr("aria-label");this._isBadgeAttached=false;f.call(this,"",n["Disappear"]);return this}function r(){return this.$(i)}function h(){return this.getId()+"-"+i}function l(){var t,e=h.call(this),d=r.call(this),g=typeof this.badgeValueFormatter==="function"&&this.badgeValueFormatter,l=B(g?g.call(this,this.getBadgeCustomData().getValue()):this.getBadgeCustomData().getValue())||"",C=this._oBadgeConfig.style?this._oBadgeConfig.style:o.Default,c=this.getBadgeCustomData().getAnimation();this._oBadgeContainer=this._oBadgeConfig&&this._oBadgeConfig.selector?a(this._oBadgeConfig.selector,this):this.$();if(d.length){d.remove()}t=jQuery("<div></div>").addClass(i+"Indicator");t.addClass(i+C);t.attr("id",e);t.attr("data-badge",l);t.attr("aria-label",u.call(this));t.appendTo(this._oBadgeContainer);t.addClass("sapMBadgeAnimationAdd");this._isBadgeAttached=true;this._oBadgeContainer.addClass(i);if(this._oBadgeConfig.position){this._oBadgeContainer.addClass(s[this._oBadgeConfig.position])}if(this._oBadgeConfig.accentColor){this._oBadgeContainer.addClass(i+this._oBadgeConfig.accentColor)}this._oBadgeContainer.addClass(this.getBadgeAnimationClass(this.getBadgeCustomData().getAnimation()));this._badgeAnimaionType=c;f.call(this,l,n["Appear"])}this.updateBadgeValue=function(t){var a=typeof this.badgeValueFormatter==="function"&&this.badgeValueFormatter,e;t=B(a?a.call(this,t):t)||"";if(!this.getBadgeCustomData().getVisible()){return false}e=r.call(this);e.removeClass("sapMBadgeAnimationUpdate");e.attr("data-badge",t);e.attr("aria-label",u.call(this));e.width();e.addClass("sapMBadgeAnimationUpdate");f.call(this,t,n["Updated"])};function u(){var t=this.getAriaLabelBadgeText;return t&&typeof t==="function"&&t.call(this)}function f(t,a){if(this.onBadgeUpdate&&typeof this.onBadgeUpdate==="function"){var e=h.call(this);return this.onBadgeUpdate(t,a,e)}}function B(t){return d.indexOf(t)===-1&&t}this.addCustomData=function(t){if(t.isA("sap.m.BadgeCustomData")){this.removeAggregation("customData",this._oBadgeCustomData,true);this._oBadgeCustomData=t;this.addAggregation("customData",t,true);return this.updateBadgeVisibility(t.getVisible())}return this.addAggregation("customData",t)};this.insertCustomData=function(t){if(t.isA("sap.m.BadgeCustomData")){this.removeAggregation("customData",this._oBadgeCustomData,true);this._oBadgeCustomData=t;this.addAggregation("customData",t,true);return this.updateBadgeVisibility(t.getVisible())}return this.insertAggregation("customData",t)};this.getBadgeCustomData=function(){var a=this.getCustomData().filter(function(a){return a instanceof t});return a.length?a[0]:undefined};this.getBadgeAnimationClass=function(t){return i+"AnimationType"+t};this.removeBadgeCustomData=function(){var t;t=this._oBadgeCustomData;this._oBadgeCustomData=null;return this.removeAggregation("customData",t,true)};this.setBadgeAccentColor=function(t){if(!this._oBadgeContainer){return false}this._oBadgeContainer.removeClass(i+this._oBadgeConfig.accentColor);this._oBadgeContainer.addClass(i+t);this._oBadgeConfig.accentColor=t};this.setBadgePosition=function(t){if(!this._oBadgeContainer){return false}this._oBadgeContainer.removeClass(i+this._oBadgeConfig.position);this._oBadgeContainer.addClass(s[t]);this._oBadgeConfig.position=t};this.updateBadgeVisibility=function(t){return t?l.call(this):g.call(this)};this._renderBadge=function(){e.call(this)};this.updateBadgeAnimation=function(t){if(this._oBadgeContainer){this._badgeAnimaionType&&this._oBadgeContainer.removeClass(this.getBadgeAnimationClass(this._badgeAnimaionType));this._oBadgeContainer.addClass(this.getBadgeAnimationClass(t))}this._badgeAnimaionType=t}};return g});