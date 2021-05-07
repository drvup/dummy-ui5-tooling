/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper","./_Cache","./_GrandTotalHelper","./_GroupLock","./_Helper","./_MinMaxHelper","sap/base/Log","sap/ui/base/SyncPromise"],function(e,t,n,r,i,a,o,l){"use strict";function s(r,a,o,s,u){var c=this;t.call(this,r,a,u,true);if(o.groupLevels.length){if(u.$count){throw new Error("Unsupported system query option: $count")}if(u.$filter){throw new Error("Unsupported system query option: $filter")}}this.oAggregation=o;this.sDownloadUrl=t.prototype.getDownloadUrl.call(this,"");this.aElements=[];this.aElements.$byPredicate={};this.aElements.$count=undefined;this.aElements.$created=0;this.oFirstLevel=this.createGroupLevelCache(null,s);this.oGrandTotalPromise=undefined;if(s){this.oGrandTotalPromise=new l(function(t){n.enhanceCacheWithGrandTotal(c.oFirstLevel,o,function(n){var r;e.setAnnotations(n,true,true,0,e.getAllProperties(o));if(o.grandTotalAtBottomOnly===false){r=Object.assign({},n,{"@$ui5.node.isExpanded":undefined});i.setPrivateAnnotation(n,"copy",r);i.setPrivateAnnotation(r,"predicate","($isTotal=true)")}i.setPrivateAnnotation(n,"predicate","()");t(n)})})}}s.prototype=Object.create(t.prototype);s.prototype.addElements=function(e,t,n,r){var a=this.aElements;function o(e,o){var l=a[t+o],s,u=i.getPrivateAnnotation(e,"predicate");if(l){if(l===e){return}s=i.getPrivateAnnotation(l,"parent");if(!s){throw new Error("Unexpected element")}if(s!==n||i.getPrivateAnnotation(l,"index")!==r+o){throw new Error("Wrong placeholder")}}else if(t+o>=a.length){throw new Error("Array index out of bounds: "+(t+o))}if(u in a.$byPredicate&&a.$byPredicate[u]!==e){throw new Error("Duplicate predicate: "+u)}a[t+o]=e;a.$byPredicate[u]=e}if(t<0){throw new Error("Illegal offset: "+t)}if(Array.isArray(e)){e.forEach(o)}else{o(e,0)}};s.prototype.collapse=function(e){var t,n=0,a=this.aElements,o=this.fetchValue(r.$cached,e).getResult(),l=o["@$ui5.node.level"],s=a.indexOf(o),u=s+1;function c(e){delete a.$byPredicate[i.getPrivateAnnotation(a[e],"predicate")];n+=1}t=i.getPrivateAnnotation(o,"collapsed");i.updateAll(this.mChangeListeners,e,o,t);while(u<a.length&&a[u]["@$ui5.node.level"]>l){c(u);u+=1}if(this.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(t).length>1){c(u)}i.setPrivateAnnotation(o,"spliced",a.splice(s+1,n));a.$count-=n;return n};s.prototype.createGroupLevelCache=function(n,r){var a=this.oAggregation,o=e.getAllProperties(a),l,u,c,d,g,f;d=n?n["@$ui5.node.level"]+1:1;c=d>a.groupLevels.length;u=c?a.groupLevels.concat(Object.keys(a.group).sort()):a.groupLevels.slice(0,d);g=e.filterOrderby(this.mQueryOptions,a,d);f=!c&&Object.keys(a.aggregate).some(function(e){return a.aggregate[e].subtotals});if(n){g.$$filterBeforeAggregate=i.getPrivateAnnotation(n,"filter")+(g.$$filterBeforeAggregate?" and ("+g.$$filterBeforeAggregate+")":"")}if(!r){delete g.$count;g=e.buildApply(a,g,d)}g.$count=true;l=t.create(this.oRequestor,this.sResourcePath,g,true);l.calculateKeyPredicate=s.calculateKeyPredicate.bind(null,n,u,o,c,f);return l};s.prototype.expand=function(t,n){var a,o,s=this.aElements,u=typeof n==="string"?this.fetchValue(r.$cached,n).getResult():n,c,d=i.getPrivateAnnotation(u,"spliced"),g=this;if(n!==u){i.updateAll(this.mChangeListeners,n,u,e.getOrCreateExpandedObject(this.oAggregation,u))}if(d){i.deletePrivateAnnotation(u,"spliced");c=s.indexOf(u)+1;this.aElements=s.concat(d,s.splice(c));this.aElements.$byPredicate=s.$byPredicate;o=d.length;this.aElements.$count=s.$count+o;d.forEach(function(e){var t=i.getPrivateAnnotation(e,"predicate");if(t){g.aElements.$byPredicate[t]=e;if(i.getPrivateAnnotation(e,"expanding")){i.deletePrivateAnnotation(e,"expanding");o+=g.expand(r.$cached,e).getResult()}}});return l.resolve(o)}a=i.getPrivateAnnotation(u,"cache");if(!a){a=this.createGroupLevelCache(u);i.setPrivateAnnotation(u,"cache",a)}return a.read(0,this.iReadLength,0,t).then(function(t){var n=g.aElements.indexOf(u)+1,r=u["@$ui5.node.level"],l=i.getPrivateAnnotation(u,"collapsed"),s=g.oAggregation.subtotalsAtBottomOnly!==undefined&&Object.keys(l).length>1,c;if(!u["@$ui5.node.isExpanded"]){i.deletePrivateAnnotation(u,"spliced");return 0}if(!n){i.setPrivateAnnotation(u,"expanding",true);return 0}o=t.value.$count;if(s){o+=1}if(n===g.aElements.length){g.aElements.length+=o}else{for(c=g.aElements.length-1;c>=n;c-=1){g.aElements[c+o]=g.aElements[c];delete g.aElements[c]}}g.addElements(t.value,n,a,0);for(c=n+t.value.length;c<n+t.value.$count;c+=1){g.aElements[c]=e.createPlaceholder(r+1,c-n,a)}if(s){l=Object.assign({},l);e.setAnnotations(l,undefined,true,r,e.getAllProperties(g.oAggregation));i.setPrivateAnnotation(l,"predicate",i.getPrivateAnnotation(u,"predicate").slice(0,-1)+",$isTotal=true)");g.addElements(l,n+o-1)}g.aElements.$count+=o;return o},function(e){i.updateAll(g.mChangeListeners,n,u,i.getPrivateAnnotation(u,"collapsed"));throw e})};s.prototype.fetchValue=function(e,t,n,r){if(t==="$count"){if(this.oAggregation.groupLevels.length){o.error("Failed to drill-down into $count, invalid segment: $count",this.toString(),"sap.ui.model.odata.v4.lib._Cache");return l.resolve()}return this.oFirstLevel.fetchValue(e,t,n,r)}this.registerChange(t,r);return this.drillDown(this.aElements,t,e)};s.prototype.getDownloadQueryOptions=function(t){return e.buildApply(this.oAggregation,e.filterOrderby(t,this.oAggregation),0,true)};s.prototype.getDownloadUrl=function(e,t){return this.sDownloadUrl};s.prototype.read=function(t,n,r,a,o){var s,u=t,c=n,d,g,f=!!this.oGrandTotalPromise,h=f&&this.oAggregation.grandTotalAtBottomOnly!==true,p=[],v,m,E=this;function A(e,t){var n=d,r=i.getPrivateAnnotation(E.aElements[e],"index"),l=E.aElements[e];p.push(d.read(r,t-e,0,a.getUnlockedCopy(),o).then(function(t){var i=false,a;if(l!==E.aElements[e]&&t.value[0]!==E.aElements[e]){i=true;e=E.aElements.indexOf(l);if(e<0){e=E.aElements.indexOf(t.value[0]);if(e<0){a=new Error("Collapse before read has finished");a.canceled=true;throw a}}}E.addElements(t.value,e,n,r);if(i){a=new Error("Collapse or expand before read has finished");a.canceled=true;throw a}}))}if(h&&!t&&n===1){if(r!==0){throw new Error("Unsupported prefetch length: "+r)}a.unlock();return this.oGrandTotalPromise.then(function(e){return{value:[e]}})}else if(this.aElements.$count===undefined){this.iReadLength=n+r;if(h){if(u){u-=1}else{c-=1}}p.push(this.oFirstLevel.read(u,c,r,a,o).then(function(t){var n,r,a=0,o;E.aElements.length=E.aElements.$count=t.value.$count;if(f){E.aElements.$count+=1;E.aElements.length+=1;n=E.oGrandTotalPromise.getResult();switch(E.oAggregation.grandTotalAtBottomOnly){case false:a=1;E.aElements.$count+=1;E.aElements.length+=1;E.addElements(n,0);r=i.getPrivateAnnotation(n,"copy");E.addElements(r,E.aElements.length-1);break;case true:E.addElements(n,E.aElements.length-1);break;default:a=1;E.addElements(n,0)}}E.addElements(t.value,u+a,E.oFirstLevel,u);for(o=0;o<E.aElements.$count;o+=1){if(!E.aElements[o]){E.aElements[o]=e.createPlaceholder(1,o-a,E.oFirstLevel)}}}))}else{for(v=t,m=Math.min(t+n,this.aElements.length);v<m;v+=1){s=i.getPrivateAnnotation(this.aElements[v],"parent");if(s!==d){if(g){A(g,v);d=g=undefined}if(s){g=v;d=s}}}if(g){A(g,v)}a.unlock()}return l.all(p).then(function(){var e=E.aElements.slice(t,t+n);e.$count=E.aElements.$count;return{value:e}})};s.prototype.refreshKeptElements=function(){};s.prototype.toString=function(){return this.sDownloadUrl};s.calculateKeyPredicate=function(t,n,r,a,o,l,s,u){var c;if(!(u in s)){return undefined}if(t){r.forEach(function(e){if(Array.isArray(e)){i.inheritPathValue(e,t,l)}else if(!(e in l)){l[e]=t[e]}})}c=a&&i.getKeyPredicate(l,u,s)||i.getKeyPredicate(l,u,s,n,true);i.setPrivateAnnotation(l,"predicate",c);if(!a){i.setPrivateAnnotation(l,"filter",i.getKeyFilter(l,u,s,n))}e.setAnnotations(l,a?undefined:false,o,t?t["@$ui5.node.level"]+1:1,t?null:r);return c};s.create=function(n,r,i,o,l,u,c){var d,g,f;if(o){g=e.hasGrandTotal(o.aggregate);f=e.hasMinOrMax(o.aggregate);d=o.groupLevels.length||g||f;if(d){if("$expand"in l){throw new Error("Unsupported system query option: $expand")}if("$select"in l){throw new Error("Unsupported system query option: $select")}if(f){return a.createCache(n,r,o,l)}return new s(n,r,o,g,l)}}if(l.$$filterBeforeAggregate){l.$apply="filter("+l.$$filterBeforeAggregate+")/"+l.$apply;delete l.$$filterBeforeAggregate}return t.create(n,r,l,u,i,c)};return s},false);