/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./lib/_Helper","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/Context"],function(e,t,n,i){"use strict";var o="sap.ui.model.odata.v4.Context",r=0,s,h=-9007199254740991;function a(e,t,i,o){var r,s=[e.fetchValue(t,null,o)],h=e.oModel.resolve(t,e);if(i){s.push(e.oModel.getMetaModel().fetchUI5Type(h))}return n.all(s).then(function(e){var t=e[1],n=e[0];if(n&&typeof n==="object"){r=new Error("Accessed value is not primitive: "+h);r.isNotPrimitive=true;throw r}return i?t.formatValue(n,"string"):n})}var d=i.extend("sap.ui.model.odata.v4.Context",{constructor:function(e,t,n,o,r,s){if(n[0]!=="/"){throw new Error("Not an absolute path: "+n)}if(n.endsWith("/")){throw new Error("Unsupported trailing slash: "+n)}i.call(this,e,n);this.oBinding=t;this.oCreatedPromise=r&&Promise.resolve(r).then(function(){});this.oSyncCreatePromise=r;this.iGeneration=s||0;this.iIndex=o;this.bKeepAlive=false;this.fnOnBeforeDestroy=undefined}});d.prototype._delete=function(e,t){var n=this;if(this.isTransient()){return this.oBinding._delete(e,"n/a",this)}return this.fetchCanonicalPath().then(function(i){return n.oBinding._delete(e,i.slice(1),n,t)})};d.prototype.adjustPredicate=function(e,t,n){var i=this.sPath;if(i.includes(e)){this.sPath=i.split("/").map(function(n){if(n.endsWith(e)){n=n.slice(0,-e.length)+t}return n}).join("/");if(n){n(i,this.sPath)}this.oModel.getDependentBindings(this).forEach(function(n){n.adjustPredicate(e,t)})}};d.prototype.checkUpdate=function(){return n.all(this.oModel.getDependentBindings(this).map(function(e){return e.checkUpdate()}))};d.prototype.collapse=function(){switch(this.getProperty("@$ui5.node.level")===0?undefined:this.isExpanded()){case true:this.oBinding.collapse(this);break;case false:throw new Error("Already collapsed: "+this);default:throw new Error("Not expandable: "+this)}};d.prototype.created=function(){return this.oCreatedPromise};d.prototype.delete=function(e){var t,n=this.oModel,i=this;n.checkGroupId(e);this.oBinding.checkSuspended();if(this.isTransient()){e=e||"$direct"}else if(this.hasPendingChanges()){throw new Error("Cannot delete due to pending changes")}t=this.oBinding.lockGroup(e,true,true);return this._delete(t).then(function(){var e=i.sPath.slice(1);n.getAllBindings().forEach(function(t){t.removeCachesAndMessages(e,true)})}).catch(function(e){t.unlock(true);n.reportError("Failed to delete "+i,o,e);throw e})};d.prototype.destroy=function(){var e=this.fnOnBeforeDestroy;if(e){this.fnOnBeforeDestroy=undefined;e()}this.oModel.getDependentBindings(this).forEach(function(e){e.setContext(undefined)});this.oBinding=undefined;this.oModel=undefined;i.prototype.destroy.call(this)};d.prototype.doSetProperty=function(t,n,i,r){var s=this.oModel.getMetaModel(),h=this;if(this.oModel.bAutoExpandSelect){t=s.getReducedPath(e.buildPath(this.sPath,t),this.oBinding.getBaseForPathReduction())}return this.withCache(function(a,d,u){return u.doSetProperty(d,n,i)||s.fetchUpdateData(t,h,!i).then(function(d){var c=e.getRelativePath(d.entityPath,u.oReturnValueContext?u.oReturnValueContext.getPath():u.getResolvedPath()),f=false;function l(e){h.oModel.reportError("Failed to update path "+h.oModel.resolve(t,h),o,e);p(false)}function p(e){if(f){u.firePatchCompleted(e);f=false}}function g(){f=true;u.firePatchSent()}if(!i){return a.setProperty(d.propertyPath,n,c)}return a.update(i,d.propertyPath,n,r?undefined:l,d.editUrl,c,s.getUnitOrCurrencyPath(h.oModel.resolve(t,h)),u.isPatchWithoutSideEffects(),g).then(function(){p(true)},function(e){p(false);throw e})})},t,false,true)};d.prototype.expand=function(){var e=this;switch(this.isExpanded()){case false:this.oBinding.expand(this).catch(function(t){e.oModel.reportError("Failed to expand "+e,o,t)});break;case true:throw new Error("Already expanded: "+this);default:throw new Error("Not expandable: "+this)}};d.prototype.fetchCanonicalPath=function(){return this.oModel.getMetaModel().fetchCanonicalPath(this)};d.prototype.fetchValue=function(t,i,o){if(this.iIndex===h){return n.resolve()}if(!t||t[0]!=="/"){t=e.buildPath(this.sPath,t);if(this.oModel.bAutoExpandSelect){t=this.oModel.getMetaModel().getReducedPath(t,this.oBinding.getBaseForPathReduction())}}return this.oBinding.fetchValue(t,i,o)};d.prototype.getBinding=function(){return this.oBinding};d.prototype.getCanonicalPath=e.createGetMethod("fetchCanonicalPath",true);d.prototype.getGeneration=function(e){if(this.iGeneration||e){return this.iGeneration}return this.oBinding.getGeneration()};d.prototype.getGroupId=function(){return this.oBinding.getGroupId()};d.prototype.getIndex=function(){if(this.oBinding.bCreatedAtEnd){if(this.iIndex<0){return this.oBinding.bLengthFinal?this.oBinding.iMaxLength-this.iIndex-1:-this.iIndex-1}return this.iIndex}return this.getModelIndex()};d.prototype.getModelIndex=function(){if(this.iIndex!==undefined&&this.oBinding.iCreatedContexts){return this.iIndex+this.oBinding.iCreatedContexts}return this.iIndex};d.prototype.getObject=function(t){return e.publicClone(this.getValue(t))};d.prototype.getProperty=function(e,n){var i,r;this.oBinding.checkSuspended();r=a(this,e,n,true);if(r.isRejected()){r.caught();i=r.getResult();if(i.isNotPrimitive){throw i}else if(!i.$cached){t.warning(i.message,e,o)}}return r.isFulfilled()?r.getResult():undefined};d.prototype.getQueryOptionsForPath=function(e){return this.oBinding.getQueryOptionsForPath(e)};d.prototype.getUpdateGroupId=function(){return this.oBinding.getUpdateGroupId()};d.prototype.getValue=function(e){var t,n=this;this.oBinding.checkSuspended();t=this.fetchValue(e,null,true).catch(function(e){if(!e.$cached){n.oModel.reportError("Unexpected error",o,e)}});if(t.isFulfilled()){return t.getResult()}};d.prototype.hasPendingChanges=function(){return this.isTransient()||this.oModel.getDependentBindings(this).some(function(e){return e.hasPendingChanges()})||this.oModel.withUnresolvedBindings("hasPendingChangesInCaches",this.sPath.slice(1))};d.prototype.isExpanded=function(){return this.getProperty("@$ui5.node.isExpanded")};d.prototype.isKeepAlive=function(){return this.bKeepAlive};d.prototype.isTransient=function(){return this.oSyncCreatePromise&&this.oSyncCreatePromise.isPending()};d.prototype.patch=function(e){return this.withCache(function(t,n){t.patch(n,e)},"")};d.prototype.refresh=function(e,t){this.requestRefresh.apply(this,arguments).catch(this.oModel.getReporter())};d.prototype.requestCanonicalPath=e.createRequestMethod("fetchCanonicalPath");d.prototype.requestObject=function(t){this.oBinding.checkSuspended();return Promise.resolve(this.fetchValue(t)).then(e.publicClone)};d.prototype.requestProperty=function(e,i){var r=Array.isArray(e)?e:[e],s=this;this.oBinding.checkSuspended();return Promise.all(r.map(function(e){return s.oBinding.fetchIfChildCanUseCache(s,e,n.resolve({})).then(function(n){if(n){return a(s,n,i)}t.error("Not a valid property path: "+e,undefined,o)})})).then(function(t){return Array.isArray(e)?t:t[0]})};d.prototype.requestRefresh=function(e,t){var n;this.oModel.checkGroupId(e);this.oBinding.checkSuspended();if(this.hasPendingChanges()){throw new Error("Cannot refresh entity due to pending changes: "+this)}if(this.oBinding.refreshSingle){n=this.oBinding.refreshSingle(this,this.oBinding.lockGroup(e,true),t)}else{if(arguments.length>1){throw new Error("Unsupported parameter bAllowRemoval: "+t)}n=this.oBinding.refreshReturnValueContext(this,e)||this.oBinding.requestRefresh(e)}this.oModel.withUnresolvedBindings("removeCachesAndMessages",this.sPath.slice(1));return Promise.resolve(n).then(function(){})};d.prototype.requestSideEffects=function(t,i){var o,r=this.oModel.getMetaModel(),s=[],h=[],a,d,u=this;function c(e){if(!e){return false}if(e==="*"){return true}if(e.endsWith("/*")){e=e.slice(0,-2)}return!e.includes("*")}this.oBinding.checkSuspended();this.oModel.checkGroupId(i);if(this.isTransient()){throw new Error("Unsupported context: "+this)}if(!t||!t.length){throw new Error("Missing edm:(Navigation)PropertyPath expressions")}if(!this.oBinding.isResolved()){throw new Error("Cannot request side effects of unresolved binding's context: "+this)}o="/"+r.getObject("/$EntityContainer")+"/";t.map(function(e){if(e&&typeof e==="object"){if(c(e.$PropertyPath)){return e.$PropertyPath}if(typeof e.$NavigationPropertyPath==="string"&&!e.$NavigationPropertyPath.includes("*")){return e.$NavigationPropertyPath}}else if(typeof e==="string"&&(!e||c(e))){return e}throw new Error("Not an edm:(Navigation)PropertyPath expression: "+JSON.stringify(e))}).forEach(function(e){if(e[0]==="/"){if(!e.startsWith(o)){throw new Error("Path must start with '"+o+"': "+e)}h.push(e.slice(o.length-1))}else{s.push(e)}});a=this.oBinding.getRootBinding();d=a.getResolvedPath();s=s.reduce(function(t,n){return t.concat(r.getAllPathReductions(e.buildPath(u.getPath(),n),d))},[]);s=e.filterPaths(h,s);i=i||this.getUpdateGroupId();return Promise.resolve(n.resolve(this.oModel.isAutoGroup(i)&&this.oModel.oRequestor.waitForRunningChangeRequests(i).then(function(){u.oModel.oRequestor.relocateAll("$parked."+i,i)})).then(function(){return n.all([u.oModel.requestSideEffects(i,h),u.requestSideEffectsInternal(s,i)])})).then(function(){})};d.prototype.requestSideEffectsInternal=function(t,i){var o=this,r,s=o,h,a=[],d,u=[],c,f=[];if(!t.length){return undefined}for(;;){r=s.getBinding();c=r.getPath();d=r.getContext();if(r.oCache&&(!h||r.oCache.hasChangeListeners())){h=s}if(h&&c){break}if(!r.getBoundContext){throw new Error("Not a context binding: "+r)}s=d}r=h.getBinding();t.forEach(function(t){var n=e.getRelativePath(t,h.getPath());if(n===undefined){u.push(t)}else{a.push(n)}});if(u.length){f.push(r.getContext().requestSideEffectsInternal(u,i))}if(a.length&&r.oCache!==undefined){f.push(r.requestSideEffects(i,a,h))}return n.all(f)};d.prototype.resetKeepAlive=function(){this.bKeepAlive=false};d.prototype.setKeepAlive=function(t,n){if(this.isTransient()){throw new Error("Unsupported transient context "+this)}if(!e.getPrivateAnnotation(this.getValue(),"predicate")){throw new Error("No key predicate known at "+this)}this.oBinding.checkKeepAlive(this);this.bKeepAlive=t;this.fnOnBeforeDestroy=t?n:undefined};d.prototype.setProperty=function(e,t,n,i){var o=null;this.oBinding.checkSuspended();if(typeof t==="function"||t&&typeof t==="object"){throw new Error("Not a primitive value")}if(n!==null){this.oModel.checkGroupId(n);o=this.oBinding.lockGroup(n,true,true)}return Promise.resolve(this.doSetProperty(e,t,o,!i)).catch(function(e){if(o){o.unlock(true)}throw e})};d.prototype.toString=function(){var e="";if(this.iIndex!==undefined){e="["+this.iIndex+(this.isTransient()?"|transient":"")+"]"}return this.sPath+e};d.prototype.withCache=function(t,i,o,r){if(this.iIndex===h){return n.resolve()}return this.oBinding.withCache(t,i[0]==="/"?i:e.buildPath(this.sPath,i),o,r)};s={create:function(e,t,n,i,o){return new d(e,t,n,i,o)},createNewContext:function(e,t,n){r+=1;return new d(e,t,n,undefined,undefined,r)}};Object.defineProperty(s,"VIRTUAL",{value:h});return s},false);