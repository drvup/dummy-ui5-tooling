/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","./utils/TableUtils","sap/ui/core/Element","sap/ui/unified/MenuItem","sap/ui/core/IconPool"],function(t,e,i,o,n){"use strict";var s=t.RowActionType;var r=i.extend("sap.ui.table.RowActionItem",{metadata:{library:"sap.ui.table",properties:{icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},visible:{type:"boolean",group:"Misc",defaultValue:true},text:{type:"string",group:"Misc",defaultValue:""},type:{type:"sap.ui.table.RowActionType",group:"Behavior",defaultValue:s.Custom}},events:{press:{item:{type:"sap.ui.table.RowActionItem"},row:{type:"sap.ui.table.Row"}}}}});r.prototype.init=function(){this._oMenuItem=null};r.prototype.exit=function(){if(this._oMenuItem){this._oMenuItem.destroy();this._oMenuItem=null}};r.prototype.getRowAction=function(){var t=this.getParent();return e.isA(t,"sap.ui.table.RowAction")?t:null};r.prototype._firePress=function(){var t=this.getRowAction();this.firePress({item:this,row:t?t.getRow():null})};r.prototype._getMenuItem=function(){if(!this._oMenuItem){this._oMenuItem=new o({select:[this._firePress,this]})}this._oMenuItem.setIcon(this._getIcon());this._oMenuItem.setVisible(this.getVisible());this._oMenuItem.setText(this._getText(false));return this._oMenuItem};r.prototype._getIcon=function(){var t=this.getIcon();if(t){return t}if(this.getType()===s.Navigation){return n.getIconURI(e.ThemeParameters.navigationIcon)}if(this.getType()===s.Delete){return n.getIconURI(e.ThemeParameters.deleteIcon)}return null};r.prototype._getText=function(t){var i=t?this.getTooltip_AsString()||this.getText():this.getText()||this.getTooltip_AsString();if(i){return i}if(this.getType()===s.Navigation){return e.getResourceText("TBL_ROW_ACTION_NAVIGATE")}if(this.getType()===s.Delete){return e.getResourceText("TBL_ROW_ACTION_DELETE")}return null};r.prototype._syncIcon=function(t){t.setSrc(this._getIcon());t.setTooltip(this._getText(true))};return r});