/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/IntervalTrigger","sap/ui/core/format/DateFormat","sap/ui/core/date/UniversalDate","sap/m/Text"],function(t,e,a,i,r){"use strict";var s=6e4;var m=t.extend("sap.f.cards.BaseHeader",{metadata:{library:"sap.f",abstract:true,properties:{dataTimestamp:{type:"string",defaultValue:""}},aggregations:{_dataTimestamp:{type:"sap.m.Text",multiple:false,visibility:"hidden"},toolbar:{type:"sap.ui.core.Control",multiple:false}}}});m.prototype.exit=function(){this._removeTimestampListener()};m.prototype.onBeforeRendering=function(){var t=this.getToolbar();if(t){t.addStyleClass("sapFCardHeaderToolbar")}};m.prototype.setDataTimestamp=function(t){var e=this.getDataTimestamp();if(e&&!t){this.destroyAggregation("_dataTimestamp");this._removeTimestampListener()}this.setProperty("dataTimestamp",t);if(t){this._updateDataTimestamp();this._addTimestampListener()}return this};m.prototype._createDataTimestamp=function(){var t=this.getAggregation("_dataTimestamp");if(!t){t=new r({wrapping:false});t.addStyleClass("sapFCardDataTimestamp");this.setAggregation("_dataTimestamp",t)}return t};m.prototype._updateDataTimestamp=function(){var t=this._createDataTimestamp(),e=this.getDataTimestamp(),r,s,m;if(!e){t.setText("");return}r=a.getDateTimeInstance({relative:true});s=new i(e);m=r.format(s);t.setText(m)};m.prototype._addTimestampListener=function(){m.getTimestampIntervalTrigger().addListener(this._updateDataTimestamp,this);this._bHasTimestampListener=true};m.prototype._removeTimestampListener=function(){if(!this._bHasTimestampListener){return}m.getTimestampIntervalTrigger().removeListener(this._updateDataTimestamp,this);this._bHasTimestampListener=false};m.getTimestampIntervalTrigger=function(){if(!m._oTimestampIntervalTrigger){m._oTimestampIntervalTrigger=new e(s)}return m._oTimestampIntervalTrigger};return m});