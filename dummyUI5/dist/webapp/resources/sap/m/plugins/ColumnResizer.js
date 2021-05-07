/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./PluginBase","sap/ui/core/Core","sap/ui/core/InvisibleText","sap/ui/Device","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/control","sap/ui/dom/jquery/Aria"],function(t,e,i,n,o){"use strict";var s=t.extend("sap.m.plugins.ColumnResizer",{metadata:{library:"sap.m",properties:{},events:{columnResize:{allowPreventDefault:true,parameters:{column:{type:"sap.ui.core.Element"},width:{type:"sap.ui.core.CSSSize"}}}}}});var a={};var r=false;var l="sapMPluginsColumnResizer";var u=e.getConfiguration().getRTL();var h=u?"right":"left";var d=u?"left":"right";var c=u?-1:1;s.prototype.init=function(){this._iHoveredColumnIndex=-1;this._aPositions=[];this._oHandle=null};s.prototype.isApplicable=function(t){return t.isA(["sap.m.Table"])};s.prototype.onActivate=function(t){t.addEventDelegate(this,this);if(t.isActive()){this.onAfterRendering()}};s.prototype.onDeactivate=function(t){t.removeEventDelegate(this,this);this.onBeforeRendering();this._oHandle=null};s.prototype.onBeforeRendering=function(){if(this._$Container){this._$Container.removeClass(l+"Container").off("."+l);this._$Container.find(this.getControlPluginConfig("resizable")).removeClass(l+"Resizable");this._updateAriaDescribedBy("remove")}};s.prototype.onAfterRendering=function(){this._$Container=this.getControl().$(this.getControlPluginConfig("container"));n.system.desktop&&this._$Container.on("mousemove."+l,this._onmousemove.bind(this));this._$Container.addClass(l+"Container").on("mouseleave."+l,this._onmouseleave.bind(this));this._aResizables=this._$Container.find(this.getControlPluginConfig("resizable")).addClass(l+"Resizable").get();this._updateAriaDescribedBy("add");this._invalidatePositions()};s.prototype._updateAriaDescribedBy=function(t){this._aResizables.forEach(function(e){var n=o(e).control(0,true);var s=n.getFocusDomRef();o(s)[t+"AriaDescribedBy"](i.getStaticId("sap.m","COLUMNRESIZER_RESIZABLE"))})};s.prototype.ontouchstart=function(t){if(this._iHoveredColumnIndex==-1&&this._oHandle&&this._oHandle.style[h]){this._onmousemove(t);if(this._iHoveredColumnIndex==-1){this._oHandle.style[h]="";this._oAlternateHandle.style[h]=""}}r=this._iHoveredColumnIndex>-1;if(!r){return}t.preventDefault();this._startResizeSession(this._iHoveredColumnIndex);a.iTouchStartX=t.targetTouches[0].clientX;a.fHandleX=parseFloat(this._oHandle.style[h]);this._$Container.addClass(l+"Resizing");o(document).on("touchend."+l+" mouseup."+l,this._ontouchend.bind(this))};s.prototype.ontouchmove=function(t){if(!r){return}this._setSessionDistanceX(t.targetTouches[0].clientX-a.iTouchStartX);this._oHandle.style[h]=a.fHandleX+a.iDistanceX+"px"};s.prototype._onmousemove=function(t){if(r){return}this._setPositions();var e=t.targetTouches?t.targetTouches[0].clientX:t.clientX;var i=this._aPositions.findIndex(function(t){return Math.abs(t-e)<=(this._oAlternateHandle?20:3)},this);this._displayHandle(i)};s.prototype._onmouseleave=function(){this._invalidatePositions()};s.prototype._ontouchend=function(){this._setColumnWidth();this._cancelResizing()};s.prototype.onsapescape=function(){if(r){this._cancelResizing()}};s.prototype.onsaprightmodifiers=function(t){this._onLeftRightModifiersKeyDown(t,16)};s.prototype.onsapleftmodifiers=function(t){this._onLeftRightModifiersKeyDown(t,-16)};s.prototype._invalidatePositions=function(){window.setTimeout(function(){this._bPositionsInvalid=true}.bind(this))};s.prototype._displayHandle=function(t,e){if(this._iHoveredColumnIndex==t){return}if(!this._oHandle){this._oHandle=document.createElement("div");this._oHandle.className=l+"Handle";if(e){var i=document.createElement("div");i.className=l+"HandleCircle";i.style.top=this._aResizables[t].offsetHeight-8+"px";this._oHandle.appendChild(i);this._oAlternateHandle=this._oHandle.cloneNode(true)}}if(!this._oHandle.parentNode){this._$Container.append(this._oHandle);if(e){this._$Container.append(this._oAlternateHandle)}}this._oHandle.style[h]=t>-1?(this._aPositions[t]-this._fContainerX)*c+"px":"";if(e){this._oAlternateHandle.style[h]=--t>-1?(this._aPositions[t]-this._fContainerX)*c+"px":""}else{if(this._oAlternateHandle){this._oAlternateHandle.style[h]=""}this._iHoveredColumnIndex=t}};s.prototype._cancelResizing=function(){this._$Container.removeClass(l+"Resizing");this._oHandle.style[h]="";this._iHoveredColumnIndex=-1;o(document).off("."+l);this._endResizeSession();r=false};s.prototype._getColumnMinWidth=function(t){return t?48:0};s.prototype._startResizeSession=function(t){a.$CurrentColumn=o(this._aResizables[t]);a.oCurrentColumn=a.$CurrentColumn.control(0,true);a.fCurrentColumnWidth=a.$CurrentColumn.width();a.iMaxDecrease=this._getColumnMinWidth(a.oCurrentColumn)-a.fCurrentColumnWidth;a.iEmptySpace=this.getControlPluginConfig("emptySpace",-1,this.getControl());if(a.iEmptySpace!=-1){a.$NextColumn=o(this._aResizables[t+1]);a.oNextColumn=a.$NextColumn.control(0,true);a.fNextColumnWidth=a.$NextColumn.width()||0;a.iMaxIncrease=a.iEmptySpace+a.fNextColumnWidth-this._getColumnMinWidth(a.oNextColumn)}else{a.iMaxIncrease=window.innerWidth}};s.prototype._setSessionDistanceX=function(t){a.iDistanceX=(t>0?Math.min(t,a.iMaxIncrease):Math.max(t,a.iMaxDecrease))*c};s.prototype._setColumnWidth=function(){if(!a.iDistanceX){return}var t=a.fCurrentColumnWidth+a.iDistanceX+"px";if(!this._fireColumnResize(a.oCurrentColumn,t)){return}a.oCurrentColumn.setWidth(t);if(a.oNextColumn&&(a.iEmptySpace<3||a.iDistanceX>a.iEmptySpace)){t=a.fNextColumnWidth-a.iDistanceX+a.iEmptySpace+"px";if(this._fireColumnResize(a.oNextColumn,t)){a.oNextColumn.setWidth(t)}}this.getControlPluginConfig("fixAutoWidthColumns")&&this._aResizables.forEach(function(t){var e=o(t),i=e.control(0,true),n=i.getWidth();if(n&&n.toLowerCase()!="auto"){return}n=e.css("width");if(n&&this._fireColumnResize(i,n)){i.setWidth(n)}},this)};s.prototype._fireColumnResize=function(t,e){return this.fireColumnResize({column:t,width:e})};s.prototype._onLeftRightModifiersKeyDown=function(t,e){if(!t.shiftKey){return}var i=o(t.target).closest(this._aResizables)[0],n=this._aResizables.indexOf(i);if(n===-1){return}this._startResizeSession(n);this._setSessionDistanceX(e);this._setColumnWidth();this._endResizeSession()};s.prototype._endResizeSession=function(){a={}};s.prototype._setPositions=function(){if(!this._bPositionsInvalid){return this._aPositions}this._bPositionsInvalid=false;this._fContainerX=this._$Container[0].getBoundingClientRect()[h];this._aPositions=this._aResizables.map(function(t,e,i){return t.getBoundingClientRect()[d]-(++e==i.length?1.25*c:0)},this)};s.prototype.startResizing=function(t){var e=this._aResizables.indexOf(t);this._setPositions();this._displayHandle(e,true)};t.setConfig({"sap.m.Table":{container:"listUl",resizable:".sapMListTblHeaderCell:not([aria-hidden=true])",fixAutoWidthColumns:true,onActivate:function(t){this._vOrigFixedLayout=t.getFixedLayout();t.setFixedLayout("Strict")},onDeactivate:function(t){t.setFixedLayout(this._vOrigFixedLayout);delete this._vOrigFixedLayout},emptySpace:function(t){var e=t.getDomRef("tblHeadDummyCell");return e?e.clientWidth:0}}},s);return s});