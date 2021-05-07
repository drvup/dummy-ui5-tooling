/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/assert","sap/base/Log","sap/base/util/includes","sap/base/util/isEmptyObject","sap/ui/model/ChangeReason","sap/ui/model/Context","sap/ui/model/Filter","sap/ui/model/FilterProcessor","sap/ui/model/FilterType","sap/ui/model/Sorter","sap/ui/model/SorterProcessor","sap/ui/model/TreeBinding","sap/ui/model/TreeBindingUtils","sap/ui/model/odata/CountMode","sap/ui/model/odata/ODataUtils","sap/ui/model/odata/OperationMode","sap/ui/thirdparty/jquery"],function(e,t,i,s,r,o,a,n,h,l,d,f,p,u,c,g,v){"use strict";var y=f.extend("sap.ui.model.odata.v2.ODataTreeBinding",{constructor:function(e,i,s,r,o,n){f.apply(this,arguments);this.mParameters=this.mParameters||o||{};this.sGroupId;this.sRefreshGroupId;this.oFinalLengths={};this.oLengths={};this.oKeys={};this.bNeedsUpdate=false;this._bRootMissing=false;this.bSkipDataEvents=false;if(n instanceof l){n=[n]}this.aSorters=n||[];this.sFilterParams="";this.mNormalizeCache={};if(r instanceof a){r=[r]}this.aApplicationFilters=r;this.oModel.checkFilterOperation(this.aApplicationFilters);this.mRequestHandles={};this.oRootContext=null;this.iNumberOfExpandedLevels=o&&o.numberOfExpandedLevels||0;this.iRootLevel=o&&o.rootLevel||0;this.sCountMode=o&&o.countMode||this.oModel.sDefaultCountMode;if(this.sCountMode==u.None){t.fatal("To use an ODataTreeBinding at least one CountMode must be supported by the service!")}if(o){this.sGroupId=o.groupId||o.batchGroupId}this.bInitial=true;this._mLoadedSections={};this._iPageSize=0;this.sOperationMode=o&&o.operationMode||this.oModel.sDefaultOperationMode;if(this.sOperationMode===g.Default){this.sOperationMode=g.Server}this.bClientOperation=false;switch(this.sOperationMode){case g.Server:this.bClientOperation=false;break;case g.Client:this.bClientOperation=true;break;case g.Auto:this.bClientOperation=false;break}this.iThreshold=o&&o.threshold||0;this.bThresholdRejected=false;this.iTotalCollectionCount=null;this.bUseServersideApplicationFilters=o&&o.useServersideApplicationFilters||false;this.bUsePreliminaryContext=this.mParameters.usePreliminaryContext||e.bPreliminaryContext;this.oAllKeys=null;this.oAllLengths=null;this.oAllFinalLengths=null}});y.DRILLSTATES={Collapsed:"collapsed",Expanded:"expanded",Leaf:"leaf"};y.prototype._getNodeFilterParams=function(e){var t=e.isRoot?this.oTreeProperties["hierarchy-node-for"]:this.oTreeProperties["hierarchy-parent-node-for"];var i=this._getEntityType();return c._createFilterParams(new a(t,"EQ",e.id),this.oModel.oMetadata,i)};y.prototype._getLevelFilterParams=function(e,t){var i=this._getEntityType();return c._createFilterParams(new a(this.oTreeProperties["hierarchy-level-for"],e,t),this.oModel.oMetadata,i)};y.prototype._loadSingleRootNodeByNavigationProperties=function(e,t){var i=this,s;if(this.mRequestHandles[t]){this.mRequestHandles[t].abort()}s=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;var r=this.getResolvedPath();if(r){this.mRequestHandles[t]=this.oModel.read(r,{groupId:s,success:function(s){var r=i._getNavPath(i.getPath());if(s){var o=s;var a=i.oModel._getKey(o);var n=i.oModel.getContext("/"+a);i.oRootContext=n;i._processODataObject(n.getObject(),e,r)}else{i._bRootMissing=true}i.bNeedsUpdate=true;delete i.mRequestHandles[t];i.oModel.callAfterUpdate(function(){i.fireDataReceived({data:s})})},error:function(e){if(e&&e.statusCode!=0&&e.statusText!="abort"){i.bNeedsUpdate=true;i._bRootMissing=true;delete i.mRequestHandles[t];i.fireDataReceived()}}})}};y.prototype.getRootContexts=function(e,t,i){var s=null,r={numberOfExpandedLevels:this.iNumberOfExpandedLevels},o=[];if(this.isInitial()){return o}e=e||0;t=t||this.oModel.sizeLimit;i=i||0;var a=""+s+"-"+e+"-"+this._iPageSize+"-"+i;if(this.bHasTreeAnnotations){this.bDisplayRootNode=true;o=this._getContextsForNodeId(null,e,t,i)}else{s=this.getResolvedPath();var n=this.oModel.isList(this.sPath,this.getContext());if(n){this.bDisplayRootNode=true}if(this.bDisplayRootNode&&!n){if(this.oRootContext){return[this.oRootContext]}else if(this._bRootMissing){return[]}else{this._loadSingleRootNodeByNavigationProperties(s,a)}}else{r.navPath=this._getNavPath(this.getPath());if(!this.bDisplayRootNode){s+="/"+r.navPath}o=this._getContextsForNodeId(s,e,t,i,r)}}return o};y.prototype.getNodeContexts=function(e,t,i,s){var r,o={};if(this.isInitial()){return[]}if(this.bHasTreeAnnotations){r=this.oModel.getKey(e);o.level=parseInt(e.getProperty(this.oTreeProperties["hierarchy-level-for"]))+1}else{var a=this._getNavPath(e.getPath());if(!a){return[]}r=this.oModel.resolve(a,e);o.navPath=this.oNavigationPaths[a]}return this._getContextsForNodeId(r,t,i,s,o)};y.prototype.hasChildren=function(e){if(this.bHasTreeAnnotations){if(!e){return false}var i=e.getProperty(this.oTreeProperties["hierarchy-drill-state-for"]);var s=this.oModel.getKey(e);var r=this.oLengths[s];if(r===0&&this.oFinalLengths[s]){return false}if(i==="expanded"||i==="collapsed"){return true}else if(i==="leaf"){return false}else{t.warning("The entity '"+e.getPath()+"' has not specified Drilldown State property value.");if(i===undefined||i===""){return true}return false}}else{if(!e){return this.oLengths[this.getPath()]>0}var r=this.oLengths[e.getPath()+"/"+this._getNavPath(e.getPath())];return r!==0}};y.prototype.getChildCount=function(e){if(this.bHasTreeAnnotations){var t;if(!e){t=null}else{t=this.oModel.getKey(e)}return this.oLengths[t]}else{if(!e){if(!this.bDisplayRootNode){return this.oLengths[this.getPath()+"/"+this._getNavPath(this.getPath())]}else{return this.oLengths[this.getPath()]}}return this.oLengths[e.getPath()+"/"+this._getNavPath(e.getPath())]}};y.prototype._getContextsForNodeId=function(e,t,i,s,r){var o=[],a;if(this.sOperationMode==g.Auto){if(this.iTotalCollectionCount==null){if(!this.bCollectionCountRequested){this._getCountForCollection();this.bCollectionCountRequested=true}return[]}}t=t||0;i=i||this.oModel.iSizeLimit;s=s||0;if(this.sOperationMode==g.Auto){if(this.iThreshold>=0){s=Math.max(this.iThreshold,s)}}if(!this._mLoadedSections[e]){this._mLoadedSections[e]=[]}if(this.oFinalLengths[e]&&this.oLengths[e]<t+i){i=Math.max(this.oLengths[e]-t,0)}var n=this;var h=function(t){for(var i=0;i<n._mLoadedSections[e].length;i++){var s=n._mLoadedSections[e][i];if(t>=s.startIndex&&t<s.startIndex+s.length){return true}}};var l=[];var d=Math.max(t-s-this._iPageSize,0);if(this.oKeys[e]){var f=t+i+s;if(this.oLengths[e]){f=Math.min(f,this.oLengths[e])}for(d;d<f;d++){a=this.oKeys[e][d];if(!a){if(!this.bClientOperation&&!h(d)){l=p.mergeSections(l,{startIndex:d,length:1})}}if(d>=t&&d<t+i){if(a){o.push(this.oModel.getContext("/"+a))}else{o.push(undefined)}}}var u=Math.max(t-s-this._iPageSize,0);var c=t+i+s;var v=l[0]&&l[0].startIndex===u&&l[0].startIndex+l[0].length===c;if(l.length>0&&!v){d=Math.max(l[0].startIndex-s-this._iPageSize,0);var m=l[0].startIndex;for(d;d<m;d++){var a=this.oKeys[e][d];if(!a){if(!h(d)){l=p.mergeSections(l,{startIndex:d,length:1})}}}d=l[l.length-1].startIndex+l[l.length-1].length;var P=d+s+this._iPageSize;if(this.oLengths[e]){P=Math.min(P,this.oLengths[e])}for(d;d<P;d++){var a=this.oKeys[e][d];if(!a){if(!h(d)){l=p.mergeSections(l,{startIndex:d,length:1})}}}}}else{if(!h(t)){var C=t-d;l=p.mergeSections(l,{startIndex:d,length:i+C+s})}}if(this.oModel.getServiceMetadata()){if(l.length>0){var _=[];var b="";if(this.bHasTreeAnnotations){if(this.sOperationMode=="Server"||this.bUseServersideApplicationFilters){b=this.getFilterParams()}if(e){b=b?"%20and%20"+b:"";var R=this.oModel.getContext("/"+e);var T=R.getProperty(this.oTreeProperties["hierarchy-node-for"]);var L=this._getNodeFilterParams({id:T});_.push("$filter="+L+b)}else if(e==null){var M="";if(!this.bClientOperation||this.iRootLevel>0){var x=this.bClientOperation?"GE":"EQ";M=this._getLevelFilterParams(x,this.iRootLevel)}if(M||b){if(b&&M){b="%20and%20"+b}_.push("$filter="+M+b)}}}else{b=this.getFilterParams();if(b){_.push("$filter="+b)}}if(this.sCustomParams){_.push(this.sCustomParams)}if(!this.bClientOperation){for(d=0;d<l.length;d++){var F=l[d];this._mLoadedSections[e]=p.mergeSections(this._mLoadedSections[e],{startIndex:F.startIndex,length:F.length});this._loadSubNodes(e,F.startIndex,F.length,0,_,r,F)}}else{if(!this.oAllKeys&&!this.mRequestHandles[y.REQUEST_KEY_CLIENT]){this._loadCompleteTreeWithAnnotations(_)}}}}return o};y.prototype._getCountForCollection=function(){if(!this.bHasTreeAnnotations||this.sOperationMode!=g.Auto){t.error("The Count for the collection can only be retrieved with Hierarchy Annotations and in OperationMode.Auto.");return}var e=[];function i(e){var t=e.__count?parseInt(e.__count):parseInt(e);this.iTotalCollectionCount=t;if(this.sOperationMode==g.Auto){if(this.iTotalCollectionCount<=this.iThreshold){this.bClientOperation=true;this.bThresholdRejected=false}else{this.bClientOperation=false;this.bThresholdRejected=true}this._fireChange({reason:r.Change})}}function s(e){if(e&&e.statusCode===0&&e.statusText==="abort"){return}var i="Request for $count failed: "+e.message;if(e.response){i+=", "+e.response.statusCode+", "+e.response.statusText+", "+e.response.body}t.warning(i)}var o=this.getResolvedPath();var a="";if(this.iRootLevel>0){a=this._getLevelFilterParams("GE",this.getRootLevel())}var n="";if(this.bUseServersideApplicationFilters){var n=this.getFilterParams()}if(a||n){if(n&&a){n="%20and%20"+n}e.push("$filter="+a+n)}var h="";if(this.sCountMode==u.Request||this.sCountMode==u.Both){h="/$count"}else if(this.sCountMode==u.Inline||this.sCountMode==u.InlineRepeat){e.push("$top=0");e.push("$inlinecount=allpages")}if(o){this.oModel.read(o+h,{urlParameters:e,success:i.bind(this),error:s.bind(this),groupId:this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId})}};y.prototype._getCountForNodeId=function(e,i,s,r,o){var a=this,n;var h=[];function l(t){a.oFinalLengths[e]=true;a.oLengths[e]=parseInt(t)}function d(e){if(e&&e.statusCode===0&&e.statusText==="abort"){return}var i="Request for $count failed: "+e.message;if(e.response){i+=", "+e.response.statusCode+", "+e.response.statusText+", "+e.response.body}t.warning(i)}var f;var p=this.getFilterParams()||"";var u="";if(this.bHasTreeAnnotations){var c=this.oModel.getContext("/"+e);var g=c.getProperty(this.oTreeProperties["hierarchy-node-for"]);f=this.getResolvedPath();if(e!=null){u=this._getNodeFilterParams({id:g})}else{u=this._getLevelFilterParams("EQ",this.getRootLevel())}}else{f=e}if(u||p){var v="";if(u&&p){v="%20and%20"}p="$filter="+p+v+u;h.push(p)}if(f){n=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.oModel.read(f+"/$count",{urlParameters:h,success:l,error:d,sorters:this.aSorters,groupId:n})}};y.prototype._getParentMap=function(e){var i={};for(var s=0;s<e.length;s++){var r=e[s][this.oTreeProperties["hierarchy-node-for"]];if(i[r]){t.warning("ODataTreeBinding: Duplicate key: "+r+"!")}i[r]=this.oModel._getKey(e[s])}return i};y.prototype._createKeyMap=function(e,t){if(e&&e.length>0){var i=this._getParentMap(e),s={};for(var r=t?1:0;r<e.length;r++){var o=e[r][this.oTreeProperties["hierarchy-parent-node-for"]],a=i[o];if(parseInt(e[r][this.oTreeProperties["hierarchy-level-for"]])===this.iRootLevel){a="null"}if(!s[a]){s[a]=[]}s[a].push(this.oModel._getKey(e[r]))}return s}};y.prototype._importCompleteKeysHierarchy=function(e){var t,i;for(i in e){t=e[i].length||0;this.oKeys[i]=e[i];this.oLengths[i]=t;this.oFinalLengths[i]=true;this._mLoadedSections[i]=[{startIndex:0,length:t}]}};y.prototype._updateNodeKey=function(e,t){var i=this.oModel.getKey(e.context),s,r;if(parseInt(e.context.getProperty(this.oTreeProperties["hierarchy-level-for"]))===this.iRootLevel){s="null"}else{s=this.oModel.getKey(e.parent.context)}r=this.oKeys[s].indexOf(i);if(r!==-1){this.oKeys[s][r]=t}else{this.oKeys[s].push(t)}};y.prototype._loadSubTree=function(e,t){return new Promise(function(i,s){var r,o,a;if(!this.bHasTreeAnnotations){s(new Error("_loadSubTree: doesn't support hierarchies without tree annotations"));return}r="loadSubTree-"+t.join("-");if(this.mRequestHandles[r]){this.mRequestHandles[r].abort()}var n=function(t){if(t.results.length>0){var s=this.oModel.getKey(t.results[0]);this._updateNodeKey(e,s);var o=this._createKeyMap(t.results);this._importCompleteKeysHierarchy(o)}delete this.mRequestHandles[r];this.bNeedsUpdate=true;this.oModel.callAfterUpdate(function(){this.fireDataReceived({data:t})}.bind(this));i(t)}.bind(this);var h=function(e){delete this.mRequestHandles[r];if(e&&e.statusCode===0&&e.statusText==="abort"){return}this.fireDataReceived();s()}.bind(this);if(!this.bSkipDataEvents){this.fireDataRequested()}this.bSkipDataEvents=false;a=this.getResolvedPath();if(a){o=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.mRequestHandles[r]=this.oModel.read(a,{urlParameters:t,success:n,error:h,sorters:this.aSorters,groupId:o})}}.bind(this))};y.prototype._loadSubNodes=function(e,t,i,s,r,o,a){var n=this,h,l=false;if((t||i)&&!this.bClientOperation){r.push("$skip="+t+"&$top="+(i+s))}if(!this.oFinalLengths[e]||this.sCountMode==u.InlineRepeat){if(this.sCountMode==u.Inline||this.sCountMode==u.InlineRepeat||this.sCountMode==u.Both){r.push("$inlinecount=allpages");l=true}else if(this.sCountMode==u.Request){n._getCountForNodeId(e)}}var d=""+e+"-"+t+"-"+this._iPageSize+"-"+s;function f(i){if(i){n.oKeys[e]=n.oKeys[e]||[];if(l&&i.__count>=0){n.oLengths[e]=parseInt(i.__count);n.oFinalLengths[e]=true}}if(Array.isArray(i.results)&&i.results.length>0){if(n.bHasTreeAnnotations){var s={};for(var r=0;r<i.results.length;r++){var a=i.results[r];if(r==0){s[e]=t}else if(s[e]==undefined){s[e]=0}n.oKeys[e][s[e]]=n.oModel._getKey(a);s[e]++}}else{for(var r=0;r<i.results.length;r++){var a=i.results[r];var h=n.oModel._getKey(a);n._processODataObject(a,"/"+h,o.navPath);n.oKeys[e][r+t]=h}}}else if(i&&!Array.isArray(i.results)){n.oKeys[null]=n.oModel._getKey(i);if(!n.bHasTreeAnnotations){n._processODataObject(i,e,o.navPath)}}delete n.mRequestHandles[d];n.bNeedsUpdate=true;n.oModel.callAfterUpdate(function(){n.fireDataReceived({data:i})})}function c(t){if(t&&t.statusCode===0&&t.statusText==="abort"){return}n.fireDataReceived();delete n.mRequestHandles[d];if(a){var i=[];for(var s=0;s<n._mLoadedSections[e].length;s++){var r=n._mLoadedSections[e][s];if(a.startIndex>=r.startIndex&&a.startIndex+a.length<=r.startIndex+r.length){if(a.startIndex!==r.startIndex&&a.length!==r.length){i=p.mergeSections(i,{startIndex:r.startIndex,length:a.startIndex-r.startIndex});i=p.mergeSections(i,{startIndex:a.startIndex+a.length,length:r.startIndex+r.length-(a.startIndex+a.length)})}}else{i.push(r)}}n._mLoadedSections[e]=i}}if(e!==undefined){if(!this.bSkipDataEvents){this.fireDataRequested()}this.bSkipDataEvents=false;var g;if(this.bHasTreeAnnotations){g=this.getResolvedPath()}else{g=e}if(this.mRequestHandles[d]){this.mRequestHandles[d].abort()}if(g){h=this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId;this.mRequestHandles[d]=this.oModel.read(g,{urlParameters:r,success:f,error:c,sorters:this.aSorters,groupId:h})}}};y.REQUEST_KEY_CLIENT="_OPERATIONMODE_CLIENT_TREE_LOADING";y.prototype._loadCompleteTreeWithAnnotations=function(e){var i=this;var s=y.REQUEST_KEY_CLIENT;var o=function(e){if(e.results&&e.results.length>0){var r={};var o;for(var a=0;a<e.results.length;a++){o=e.results[a];var n=o[i.oTreeProperties["hierarchy-node-for"]];if(r[n]){t.warning("ODataTreeBinding - Duplicate data entry for key: "+n+"!")}r[n]=i.oModel._getKey(o)}for(var h=0;h<e.results.length;h++){o=e.results[h];var l=o[i.oTreeProperties["hierarchy-parent-node-for"]];var d=r[l];if(parseInt(o[i.oTreeProperties["hierarchy-level-for"]])===i.iRootLevel){d="null"}i.oKeys[d]=i.oKeys[d]||[];var f=i.oModel._getKey(o);i.oKeys[d].push(f);i.oLengths[d]=i.oLengths[d]||0;i.oLengths[d]++;i.oFinalLengths[d]=true;i._mLoadedSections[d]=i._mLoadedSections[d]||[];i._mLoadedSections[d][0]=i._mLoadedSections[d][0]||{startIndex:0,length:0};i._mLoadedSections[d][0].length++}}else{i.oKeys["null"]=[];i.oLengths["null"]=0;i.oFinalLengths["null"]=true}i.oAllKeys=v.extend(true,{},i.oKeys);i.oAllLengths=v.extend(true,{},i.oLengths);i.oAllFinalLengths=v.extend(true,{},i.oFinalLengths);delete i.mRequestHandles[s];i.bNeedsUpdate=true;if(i.aApplicationFilters&&i.aApplicationFilters.length>0||i.aFilters&&i.aFilters.length>0){i._applyFilter()}if(i.aSorters&&i.aSorters.length>0){i._applySort()}i.oModel.callAfterUpdate(function(){i.fireDataReceived({data:e})})};var a=function(e){delete i.mRequestHandles[s];var t=e.statusCode==0;if(!t){i.oKeys={};i.oLengths={};i.oFinalLengths={};i.oAllKeys={};i.oAllLengths={};i.oAllFinalLengths={};i._fireChange({reason:r.Change});i.fireDataReceived()}};if(!this.bSkipDataEvents){this.fireDataRequested()}this.bSkipDataEvents=false;if(this.mRequestHandles[s]){this.mRequestHandles[s].abort()}var n=this.getResolvedPath();if(n){this.mRequestHandles[s]=this.oModel.read(n,{urlParameters:e,success:o,error:a,sorters:this.aSorters,groupId:this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId})}};y.prototype.resetData=function(e){var t,i=false;if(typeof e==="boolean"){i=e}else{t=e}if(t){var s=t.getPath();delete this.oKeys[s];delete this.oLengths[s];delete this.oFinalLengths[s];delete this._mLoadedSections[s]}else{this.oKeys={};this.bClientOperation=false;switch(this.sOperationMode){case g.Server:this.bClientOperation=false;break;case g.Client:this.bClientOperation=true;break;case g.Auto:this.bClientOperation=false;break}this.bThresholdRejected=false;this.iTotalCollectionCount=null;this.bCollectionCountRequested=false;this.oAllKeys=null;this.oAllLengths=null;this.oAllFinalLengths=null;this.oLengths={};this.oFinalLengths={};this.oRootContext=null;this._bRootMissing=false;if(!i){this._abortPendingRequest()}this._mLoadedSections={};this._iPageSize=0;this.sFilterParams=""}};y.prototype.refresh=function(e,t){if(typeof e==="string"){t=e}this.sRefreshGroupId=t;this._refresh(e);this.sRefreshGroupId=undefined};y.prototype._refresh=function(e,t,i){var s=false;if(!e){if(i){var o=this.getResolvedPath();if(o){if(o.indexOf("?")!==-1){o=o.split("?")[0]}var a=this.oModel.oMetadata._getEntityTypeByPath(o);if(a&&a.entityType in i){s=true}}}if(t&&!s){s=this._hasChangedEntity(t)}if(!t&&!i){s=true}}if(e||s){this.resetData();this.bNeedsUpdate=false;this.bRefresh=true;this._fireRefresh({reason:r.Refresh})}};y.prototype._hasChangedEntity=function(e){var t,s;for(s in this.oKeys){for(t in e){if(i(this.oKeys[s],t)){return true}}}return false};y.prototype.filter=function(e,i,s){var o=false;i=i||h.Control;this.oModel.checkFilterOperation(e);if(i==h.Control&&(!this.bClientOperation||this.sOperationMode==g.Server)){t.warning("Filtering with ControlFilters is ONLY possible if the ODataTreeBinding is running in OperationMode.Client or "+"OperationMode.Auto, in case the given threshold is lower than the total number of tree nodes.");return}if(!e){e=[]}if(e instanceof a){e=[e]}if(i===h.Control){this.aFilters=e}else{this.aApplicationFilters=e}if(!this.bInitial){if(this.bClientOperation&&(i===h.Control||i===h.Application&&!this.bUseServersideApplicationFilters)){if(this.oAllKeys){this.oKeys=v.extend(true,{},this.oAllKeys);this.oLengths=v.extend(true,{},this.oAllLengths);this.oFinalLengths=v.extend(true,{},this.oAllFinalLengths);this._applyFilter();this._applySort();this._fireChange({reason:r.Filter})}else{this.sChangeReason=r.Filter}}else{this.resetData();this.sChangeReason=r.Filter;this._fireRefresh({reason:this.sChangeReason})}o=true}if(s){return o}else{return this}};y.prototype._applyFilter=function(){var e=this;var i;if(this.bUseServersideApplicationFilters){i=n.groupFilters(this.aFilters)}else{i=n.combineFilters(this.aFilters,this.aApplicationFilters)}var s=function(t){var s=n.apply([t],i,function(t,i){var s=e.oModel.getContext("/"+t);return e.oModel.getProperty(i,s)},e.mNormalizeCache);return s.length>0};var r={};this._filterRecursive({id:"null"},r,s);this.oKeys=r;if(!this.oKeys["null"]){t.warning("Clientside filter did not match on any node!")}else{this.oLengths["null"]=this.oKeys["null"].length;this.oFinalLengths["null"]=true}};y.prototype._filterRecursive=function(e,t,i){var s=this.oKeys[e.id];if(s){e.children=e.children||[];for(var r=0;r<s.length;r++){var o=this._filterRecursive({id:s[r]},t,i);if(o.isFiltered){t[e.id]=t[e.id]||[];t[e.id].push(o.id);e.children.push(o)}}if(e.children.length>0){e.isFiltered=true}else{e.isFiltered=i(e.id)}if(e.isFiltered){this.oLengths[e.id]=e.children.length;this.oFinalLengths[e.id]=true}return e}else{e.isFiltered=i(e.id);return e}};y.prototype.sort=function(e,t){var i=false;if(e instanceof l){e=[e]}this.aSorters=e||[];if(!this.bInitial){this._abortPendingRequest();if(this.bClientOperation){this.addSortComparators(e,this.oEntityType);if(this.oAllKeys){this._applySort();this._fireChange({reason:r.Sort})}else{this.sChangeReason=r.Sort}}else{this.resetData(undefined,{reason:r.Sort});this.sChangeReason=r.Sort;this._fireRefresh({reason:this.sChangeReason})}i=true}if(t){return i}else{return this}};y.prototype.addSortComparators=function(i,s){var r,o;if(!s){t.warning("Cannot determine sort comparators, as entitytype of the collection is unkown!");return}v.each(i,function(t,i){if(!i.fnCompare){r=this.oModel.oMetadata._getPropertyMetadata(s,i.sPath);o=r&&r.type;e(r,"PropertyType for property "+i.sPath+" of EntityType "+s.name+" not found!");i.fnCompare=c.getComparator(o)}}.bind(this))};y.prototype._applySort=function(){var e=this,t;var i=function(i,s){t=e.oModel.getContext("/"+i);return e.oModel.getProperty(s,t)};for(var s in this.oKeys){d.apply(this.oKeys[s],this.aSorters,i)}};y.prototype.checkUpdate=function(e,t){var i=this.sChangeReason?this.sChangeReason:r.Change;var s=false;if(!e){if(this.bNeedsUpdate||!t){s=true}else{v.each(this.oKeys,function(e,i){v.each(i,function(e,i){if(i in t){s=true;return false}});if(s){return false}})}}if(e||s){this.bNeedsUpdate=false;this._fireChange({reason:i})}this.sChangeReason=undefined};y.prototype._getNavPath=function(e){var t=this.oModel.resolve(e,this.getContext());if(!t){return}var i=t.split("/"),s=i[i.length-1],r;var o=s.split("(")[0];if(o&&this.oNavigationPaths[o]){r=this.oNavigationPaths[o]}return r};y.prototype._processODataObject=function(e,t,i){var s=[],r=this;if(i&&i.indexOf("/")>-1){s=i.split("/");i=s[0];s.splice(0,1)}var o=this.oModel._getObject(t);if(Array.isArray(o)){this.oKeys[t]=o;this.oLengths[t]=o.length;this.oFinalLengths[t]=true}else if(o){this.oLengths[t]=1;this.oFinalLengths[t]=true}if(i&&e[i]){if(Array.isArray(o)){o.forEach(function(e){var t=r.getModel().getData("/"+e);r._processODataObject(t,"/"+e+"/"+i,s.join("/"))})}else if(typeof o==="object"){r._processODataObject(e,t+"/"+i,s.join("/"))}}};y.prototype._hasTreeAnnotations=function(){var e=this.oModel.oMetadata,i=this.getResolvedPath(),s,r=e.mNamespaces["sap"],o=this;this.oTreeProperties={"hierarchy-level-for":false,"hierarchy-parent-node-for":false,"hierarchy-node-for":false,"hierarchy-drill-state-for":false};var a=function(){var e=0;var i=0;v.each(o.oTreeProperties,function(t,s){i++;if(s){e+=1}});if(e===i){return true}else if(e>0&&e<i){t.warning("Incomplete hierarchy tree annotations. Please check your service metadata definition!")}return false};if(this.mParameters&&this.mParameters.treeAnnotationProperties){this.oTreeProperties["hierarchy-level-for"]=this.mParameters.treeAnnotationProperties.hierarchyLevelFor;this.oTreeProperties["hierarchy-parent-node-for"]=this.mParameters.treeAnnotationProperties.hierarchyParentNodeFor;this.oTreeProperties["hierarchy-node-for"]=this.mParameters.treeAnnotationProperties.hierarchyNodeFor;this.oTreeProperties["hierarchy-drill-state-for"]=this.mParameters.treeAnnotationProperties.hierarchyDrillStateFor;return a()}if(i.indexOf("?")!==-1){i=i.split("?")[0]}s=e._getEntityTypeByPath(i);if(!s){t.fatal("EntityType for path "+i+" could not be found.");return false}v.each(s.property,function(e,t){if(!t.extensions){return true}v.each(t.extensions,function(e,i){var s=i.name;if(i.namespace===r&&s in o.oTreeProperties&&!o.oTreeProperties[s]){o.oTreeProperties[s]=t.name}})});return a()};y.prototype.initialize=function(){if(this.oModel.oMetadata&&this.oModel.oMetadata.isLoaded()&&this.bInitial){var e=this.isRelative();if(!e||e&&this.oContext){this._initialize()}this._fireRefresh({reason:r.Refresh})}return this};y.prototype._initialize=function(){this.bInitial=false;this.bHasTreeAnnotations=this._hasTreeAnnotations();this.oEntityType=this._getEntityType();this._processSelectParameters();this._applyAdapter();return this};y.prototype.setContext=function(e){if(e&&e.isPreliminary()&&!this.bUsePreliminaryContext){return}if(e&&e.isUpdated()&&this.bUsePreliminaryContext&&this.oContext===e){this._fireChange({reason:r.Context});return}if(o.hasChanged(this.oContext,e)){this.oContext=e;if(!this.isRelative()){return}if(this.getResolvedPath()){this.resetData();this._initialize();this._fireChange({reason:r.Context})}else{if(!s(this.oAllKeys)||!s(this.oKeys)||!s(this._aNodes)){this.resetData();this._fireChange({reason:r.Context})}}}};y.prototype.applyAdapterInterface=function(){this.getContexts=this.getContexts||function(){return[]};this.getNodes=this.getNodes||function(){return[]};this.getLength=this.getLength||function(){return 0};this.isLengthFinal=this.isLengthFinal||function(){return false};this.getContextByIndex=this.getContextByIndex||function(){return};this.attachSelectionChanged=this.attachSelectionChanged||function(e,t,i){this.attachEvent("selectionChanged",e,t,i);return this};this.detachSelectionChanged=this.detachSelectionChanged||function(e,t){this.detachEvent("selectionChanged",e,t);return this};this.fireSelectionChanged=this.fireSelectionChanged||function(e){this.fireEvent("selectionChanged",e);return this};return this};y.prototype._applyAdapter=function(){var e="hierarchy-node-descendant-count-for";var i="hierarchy-sibling-rank-for";var s="hierarchy-preorder-rank-for";if(this.bHasTreeAnnotations){var r=this.getResolvedPath();if(r.indexOf("?")!==-1){r=r.split("?")[0]}var o=this.oModel.oMetadata._getEntityTypeByPath(r);var a=this;v.each(o.property,function(t,r){if(!r.extensions){return true}v.each(r.extensions,function(t,o){var n=o.name;if(o.namespace===a.oModel.oMetadata.mNamespaces["sap"]&&(n==e||n==i||n==s)){a.oTreeProperties[n]=r.name}})});this.oTreeProperties[e]=this.oTreeProperties[e]||this.mParameters.treeAnnotationProperties&&this.mParameters.treeAnnotationProperties.hierarchyNodeDescendantCountFor;if(this.oTreeProperties[e]&&this.sOperationMode==g.Server){var n,h,l;this.oTreeProperties[i]=this.oTreeProperties[i]||this.mParameters.treeAnnotationProperties&&this.mParameters.treeAnnotationProperties.hierarchySiblingRankFor;this.oTreeProperties[s]=this.oTreeProperties[s]||this.mParameters.treeAnnotationProperties&&this.mParameters.treeAnnotationProperties.hierarchyPreorderRankFor;if(this.mParameters.restoreTreeStateAfterChange){if(this.oTreeProperties[i]&&this.oTreeProperties[s]){this._bRestoreTreeStateAfterChange=true;this._aTreeKeyProperties=[];for(n=o.key.propertyRef.length-1;n>=0;n--){this._aTreeKeyProperties.push(o.key.propertyRef[n].name)}}else{t.warning('Tree state restoration not possible: Missing annotation "hierarchy-sibling-rank-for" and/or "hierarchy-preorder-rank-for"');this._bRestoreTreeStateAfterChange=false}}else{this._bRestoreTreeStateAfterChange=false}if(this.mParameters&&this.mParameters.select){if(this.mParameters.select.indexOf(this.oTreeProperties[e])===-1){this.mParameters.select+=","+this.oTreeProperties[e]}if(this._bRestoreTreeStateAfterChange){for(h=this._aTreeKeyProperties.length-1;h>=0;h--){l=this._aTreeKeyProperties[h];if(this.mParameters.select.indexOf(l)===-1){this.mParameters.select+=","+l}}}this.sCustomParams=this.oModel.createCustomParams(this.mParameters)}var d=sap.ui.requireSync("sap/ui/model/odata/ODataTreeBindingFlat");d.apply(this)}else{var f=sap.ui.requireSync("sap/ui/model/odata/ODataTreeBindingAdapter");f.apply(this)}}else if(this.oNavigationPaths){var f=sap.ui.requireSync("sap/ui/model/odata/ODataTreeBindingAdapter");f.apply(this)}else{t.error("Neither hierarchy annotations, nor navigation properties are specified to build the tree.",this)}};y.prototype._processSelectParameters=function(){if(this.mParameters){this.oNavigationPaths=this.mParameters.navigation;if(this.mParameters.select){var e=this.mParameters.select.split(",");var i=[];if(this.oNavigationPaths){v.each(this.oNavigationPaths,function(e,t){if(i.indexOf(t)==-1){i.push(t)}})}v.each(i,function(t,i){if(e.indexOf(i)==-1){e.push(i)}});if(this.bHasTreeAnnotations){v.each(this.oTreeProperties,function(t,i){if(i){if(e.indexOf(i)==-1){e.push(i)}}})}this.mParameters.select=e.join(",")}this.sCustomParams=this.oModel.createCustomParams(this.mParameters)}if(!this.bHasTreeAnnotations&&!this.oNavigationPaths){t.error("Neither navigation paths parameters, nor (complete/valid) tree hierarchy annotations where provided to the TreeBinding.");this.oNavigationPaths={}}};y.prototype.getTreeAnnotation=function(e){return this.bHasTreeAnnotations?this.oTreeProperties[e]:undefined};y.prototype.getDownloadUrl=function(e){var t=[],i;if(e){t.push("$format="+encodeURIComponent(e))}if(this.aSorters&&this.aSorters.length>0){t.push(c.createSortParams(this.aSorters))}if(this.getFilterParams()){t.push("$filter="+this.getFilterParams())}if(this.sCustomParams){t.push(this.sCustomParams)}i=this.getResolvedPath();if(i){return this.oModel._createRequestUrl(i,null,t)}};y.prototype.setNumberOfExpandedLevels=function(e){e=e||0;if(e<0){t.warning("ODataTreeBinding: numberOfExpandedLevels was set to 0. Negative values are prohibited.");e=0}this.iNumberOfExpandedLevels=e;this._fireChange()};y.prototype.getNumberOfExpandedLevels=function(){return this.iNumberOfExpandedLevels};y.prototype.setRootLevel=function(e){e=parseInt(e||0);if(e<0){t.warning("ODataTreeBinding: rootLevels was set to 0. Negative values are prohibited.");e=0}this.iRootLevel=e;this.refresh()};y.prototype.getRootLevel=function(){return parseInt(this.iRootLevel)};y.prototype._getEntityType=function(){var t=this.getResolvedPath();if(t){var i=this.oModel.oMetadata._getEntityTypeByPath(t);e(i,"EntityType for path "+t+" could not be found!");return i}return undefined};y.prototype.getFilterParams=function(){var e;if(this.aApplicationFilters){this.aApplicationFilters=Array.isArray(this.aApplicationFilters)?this.aApplicationFilters:[this.aApplicationFilters];if(this.aApplicationFilters.length>0&&!this.sFilterParams){e=n.groupFilters(this.aApplicationFilters);this.sFilterParams=c._createFilterParams(e,this.oModel.oMetadata,this.oEntityType);this.sFilterParams=this.sFilterParams?"("+this.sFilterParams+")":""}}else{this.sFilterParams=""}return this.sFilterParams};y.prototype._abortPendingRequest=function(){if(!s(this.mRequestHandles)){this.bSkipDataEvents=true;v.each(this.mRequestHandles,function(e,t){if(t){t.abort()}});this.mRequestHandles={}}};return y});