/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./TableHelper.support","sap/ui/support/library","sap/ui/core/library"],function(e,t,i){"use strict";var a=t.Categories;var l=t.Severity;var s=i.MessageType;var r=e.normalizeRule({id:"AccessibleLabel",minversion:"1.38",categories:[a.Accessibility],title:"Accessible Label",description:"Checks whether 'sap.ui.table.Table' controls have an accessible label.",resolution:"Use the 'title' aggregation or the 'ariaLabelledBy' association of the 'sap.ui.table.Table' control "+"to define a proper accessible labeling.",check:function(t,i,a){var s=e.find(a,true,"sap.ui.table.Table");for(var r=0;r<s.length;r++){if(!s[r].getTitle()&&s[r].getAriaLabelledBy().length==0){e.reportIssue(t,"The table does not have an accessible label.",l.High,s[r].getId())}}}});var o=e.normalizeRule({id:"AccessibleRowHighlight",minversion:"1.62",categories:[a.Accessibility],title:"Accessible Row Highlight",description:"Checks whether the row highlights of the 'sap.ui.table.Table' controls are accessible.",resolution:"Use the 'highlightText' property of the 'sap.ui.table.RowSettings' to define the semantics of the row 'highlight'.",resolutionurls:[e.createDocuRef("API Reference: sap.ui.table.RowSettings#getHighlight","#/api/sap.ui.table.RowSettings/methods/getHighlight"),e.createDocuRef("API Reference: sap.ui.table.RowSettings#getHighlightText","#/api/sap.ui.table.RowSettings/methods/getHighlightText")],check:function(t,i,a){var r=e.find(a,true,"sap.ui.table.Table");function o(i){var a=i.getAggregation("_settings");var r=a?a.getHighlight():null;var o=a?a.getHighlightText():null;var g=i.getId();if(a&&!(r in s)&&o===""){e.reportIssue(t,"The row of table '"+i.getParent().getId()+"' does not have a highlight text.",l.High,g)}}for(var g=0;g<r.length;g++){r[g].getRows().forEach(o)}}});return[r,o]},true);