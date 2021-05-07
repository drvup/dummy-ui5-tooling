/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var t={value:function(t,e){if(t.tagName=="INPUT"){t.value=e==null?"":e}},checked:function(t,e){if(t.tagName=="INPUT"){t.checked=e==null?false:true}},selected:function(t,e){if(t.tagName=="OPTION"){t.selected=e==null?false:true}}};var e=function(t,e){if(t=="svg"){return document.createElementNS("http://www.w3.org/2000/svg","svg")}var r=e.namespaceURI;if(r=="http://www.w3.org/1999/xhtml"||e.localName=="foreignObject"){return document.createElement(t)}return document.createElementNS(r,t)};var r={_sStyles:"",_sClasses:"",_aContexts:[],_mAttributes:Object.create(null),_oTemplate:document.createElement("template")};r.setRootNode=function(t){if(this._oRoot){this._aContexts.push(this._getContext())}this._setContext({_oRoot:t})};r.getCurrentNode=function(){return this._oCurrent};r.reset=function(){this._setContext(this._aContexts.pop());this._oParent=this._oReference=null};r.matchElement=function(t,e,r,i){return null};r.createElement=function(t,e,r){return null};r._getContext=function(){return this._applyContext(this,{})};r._setContext=function(t){this._applyContext(t||{},this)};r._applyContext=function(t,e){e._oRoot=t._oRoot||null;e._oCurrent=t._oCurrent||null;e._oNewElement=t._oNewElement||null;e._oNewParent=t._oNewParent||null;e._oNewReference=t._oNewReference||null;e._iTagOpenState=t._iTagOpenState||0;return e};r._walkOnTree=function(){this._oReference=null;if(!this._oCurrent){this._oParent=this._oRoot.parentNode;this._oCurrent=this._oRoot}else if(this._iTagOpenState){this._oParent=this._oCurrent;this._oCurrent=this._oCurrent.firstChild}else{this._oParent=this._oCurrent.parentNode;this._oCurrent=this._oCurrent.nextSibling}};r._matchElement=function(t,e){if(!t){return}if(this._oCurrent){if(this._oCurrent==this._oRoot||this._oCurrent.id==t){return}var r=document.getElementById(t);if(r){this._oCurrent=this._oParent.insertBefore(r,this._oCurrent);return}var i=this.matchElement(t,e,this._oCurrent,this._oParent);if(i){if(i!==this._oCurrent){this._oCurrent=this._oParent.insertBefore(i,this._oCurrent)}}else if(this._oCurrent.id){this._oReference=this._oCurrent;this._oCurrent=null}}if(!this._oCurrent){this._oCurrent=this.createElement(t,e,this._oParent);this._setNewElement(this._oCurrent)}};r._matchNodeName=function(t){if(!this._oCurrent){return}var e=this._oCurrent.nodeType==1?this._oCurrent.localName:this._oCurrent.nodeName;if(e==t){return}this._oReference=this._oCurrent;this._oCurrent=null};r._getAttributes=function(){for(var t=0,e=this._oCurrent.getAttributeNames();t<e.length;t++){this._mAttributes[e[t]]=this._oCurrent.getAttribute(e[t])}};r._setNewElement=function(t){if(!t){return}if(!this._oNewElement){this._oNewElement=this._oCurrent;this._oNewParent=this._oParent;this._oNewReference=this._oReference}else{this._oParent.insertBefore(this._oCurrent,this._oReference)}};r._insertNewElement=function(){if(this._oCurrent==this._oNewElement){this._oNewParent[this._oNewReference==this._oRoot?"replaceChild":"insertBefore"](this._oNewElement,this._oNewReference);this._oNewElement=this._oNewParent=this._oNewReference=null}};r.openStart=function(t,r){this._walkOnTree();this._matchElement(r,t);this._matchNodeName(t);if(this._oCurrent){this._getAttributes();this._iTagOpenState=2}else{this._oCurrent=e(t,this._oParent);this._setNewElement(this._oCurrent);this._iTagOpenState=1}if(r){this.attr("id",r)}return this};r.voidStart=r.openStart;r.attr=function(e,r){if(this._iTagOpenState==1){this._oCurrent.setAttribute(e,r);return this}var i=String(r);var n=this._mAttributes[e];var s=t[e];if(n!==undefined){delete this._mAttributes[e]}if(s&&s(this._oCurrent,i,n)){return this}if(n!==i){this._oCurrent.setAttribute(e,i)}return this};r.class=function(t){if(t){this._sClasses+=this._sClasses?" "+t:t}return this};r.style=function(t,e){if(!t||e==null||e==""){return this}this._sStyles+=(this._sStyles?" ":"")+(t+": "+e+";");return this};r.openEnd=function(){if(this._sClasses){this.attr("class",this._sClasses);this._sClasses=""}if(this._sStyles){this.attr("style",this._sStyles);this._sStyles=""}if(this._iTagOpenState==1){return this}for(var e in this._mAttributes){var r=t[e];r&&r(this._oCurrent,null);this._oCurrent.removeAttribute(e);delete this._mAttributes[e]}return this};r.voidEnd=function(){this.openEnd();this._iTagOpenState=0;this._insertNewElement();return this};r.text=function(t){this._walkOnTree();this._matchNodeName("#text");if(!this._oCurrent){this._oCurrent=document.createTextNode(t);this._oParent.insertBefore(this._oCurrent,this._oReference)}else if(this._oCurrent.data!=t){this._oCurrent.data=t}this._iTagOpenState=0;return this};r.close=function(t){if(this._iTagOpenState){this._iTagOpenState=0;this._oCurrent.textContent=""}else{var e=this._oCurrent.parentNode;for(var r=e.lastChild;r&&r!=this._oCurrent;r=e.lastChild){e.removeChild(r)}this._oCurrent=e}this._insertNewElement();return this};r.unsafeHtml=function(t,e){var r=null;if(!this._oCurrent){r=this._oRoot;if(t){r.outerHTML=t}}else if(this._iTagOpenState){r=this._oCurrent.firstChild;if(t){this._iTagOpenState=0;this._oCurrent.insertAdjacentHTML("afterbegin",t);this._oCurrent=r?r.previousSibling:this._oCurrent.lastChild}}else{r=this._oCurrent.nextSibling;if(t){var i=this._oCurrent.parentNode;if(this._oCurrent.nodeType==1){this._oCurrent.insertAdjacentHTML("afterend",t)}else{this._oTemplate.innerHTML=t;i.insertBefore(this._oTemplate.content,r)}this._oCurrent=r?r.previousSibling:i.lastChild}}if(e&&r&&r.id==e){r.parentNode.removeChild(r)}return this};return r});