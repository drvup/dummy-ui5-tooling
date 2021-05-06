/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_Helper","sap/base/strings/escapeRegExp"],function(e,n){"use strict";var r={POST:true,PUT:true,PATCH:true,DELETE:true},t=/^\$\d+/,i=/(\S*?)=(?:"(.+)"|(\S+))/;function o(e){var r=s(e,"boundary"),t=e.trim().indexOf("multipart/mixed");if(t!==0||!r){throw new Error('Invalid $batch response header "Content-Type": '+e)}r=n(r);return new RegExp("--"+r+"(?:[ \t]*\r\n|--)")}function s(e,n){var r,t=e.split(";"),o;n=n.toLowerCase();for(r=1;r<t.length;r+=1){o=i.exec(t[r]);if(o[1].toLowerCase()===n){return o[2]||o[3]}}}function a(e){var n=c(e,"content-type");return n.startsWith("multipart/mixed;")?n:undefined}function u(e){var n=c(e,"content-id"),r;if(!n){throw new Error("Content-ID MIME header missing for the change set response.")}r=parseInt(n);if(isNaN(r)){throw new Error("Invalid Content-ID value in change set response.")}return r}function c(e,n){var r,t,i=e.split("\r\n");for(r=0;r<i.length;r+=1){t=i[r].split(":");if(t[0].toLowerCase().trim()===n){return t[1].trim()}}}function f(e,n,r){var t=n.split(o(e)),i=[];t=t.slice(1,-1);t.forEach(function(e){var n,t,o,c,d,h,p,l,y,m,C,T,E,w={},v;E=e.indexOf("\r\n\r\n");T=e.slice(0,E);y=e.indexOf("\r\n\r\n",E+4);l=e.slice(E+4,y);n=a(T);if(n){i.push(f(n,e.slice(E+4),true));return}p=l.split("\r\n");m=p[0].split(" ");w.status=parseInt(m[1]);w.statusText=m.slice(2).join(" ");w.headers={};for(C=1;C<p.length;C+=1){c=p[C];o=c.indexOf(":");d=c.slice(0,o).trim();h=c.slice(o+1).trim();w.headers[d]=h;if(d.toLowerCase()==="content-type"){t=s(h,"charset");if(t&&t.toLowerCase()!=="utf-8"){throw new Error('Unsupported "Content-Type" charset: '+t)}}}w.responseText=e.slice(y+4,-2);if(r){v=u(T);i[v]=w}else{i.push(w)}});return i}function d(e){var n,r=[];for(n in e){r.push(n,":",e[n],"\r\n")}return r}function h(n,i,o){var s=(i!==undefined?"changeset_":"batch_")+e.uid(),a=i!==undefined,u=[];if(a){u.push("Content-Type: multipart/mixed;boundary=",s,"\r\n\r\n")}n.forEach(function(n,o){var c="",f=n.url;if(a){n.$ContentID=o+"."+i;c="Content-ID:"+n.$ContentID+"\r\n"}u.push("--",s,"\r\n");if(Array.isArray(n)){if(a){throw new Error("Change set must not contain a nested change set.")}u=u.concat(h(n,o).body)}else{if(a&&!r[n.method]){throw new Error("Invalid HTTP request method: "+n.method+". Change set must contain only POST, PUT, PATCH or DELETE requests.")}if(i!==undefined&&f[0]==="$"){f=f.replace(t,"$&."+i)}u=u.concat("Content-Type:application/http\r\n","Content-Transfer-Encoding:binary\r\n",c,"\r\n",n.method," ",f," HTTP/1.1\r\n",d(e.resolveIfMatchHeader(n.headers)),"\r\n",JSON.stringify(n.body)||"","\r\n")}});u.push("--",s,"--\r\n",o);return{body:u,batchBoundary:s}}return{deserializeBatchResponse:function(e,n){return f(e,n,false)},serializeBatchRequest:function(e,n){var r=h(e,undefined,n);return{body:r.body.join(""),headers:{"Content-Type":"multipart/mixed; boundary="+r.batchBoundary,"MIME-Version":"1.0"}}}}},false);