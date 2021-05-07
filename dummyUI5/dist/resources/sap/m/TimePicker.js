/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./InputBase","./DateTimeField","./MaskInputRule","./ResponsivePopover","sap/ui/core/EnabledPropagator","sap/ui/core/IconPool","./TimePickerSliders","./MaskEnabler","sap/ui/Device","sap/ui/core/format/DateFormat","sap/ui/core/Locale","sap/m/library","sap/ui/core/LocaleData","./TimePickerRenderer","sap/ui/events/KeyCodes","sap/base/Log","sap/ui/core/InvisibleText","./Button","sap/ui/thirdparty/jquery"],function(e,t,i,s,a,r,n,o,l,u,h,p,d,m,c,g,f,_,y){"use strict";var V=p.PlacementType,P=p.TimePickerMaskMode,S=p.ButtonType,v=1;var b=t.extend("sap.m.TimePicker",{metadata:{library:"sap.m",designtime:"sap/m/designtime/TimePicker.designtime",properties:{localeId:{type:"string",group:"Data"},title:{type:"string",group:"Misc",defaultValue:null},minutesStep:{type:"int",group:"Misc",defaultValue:v},secondsStep:{type:"int",group:"Misc",defaultValue:v},placeholderSymbol:{type:"string",group:"Misc",defaultValue:"_"},mask:{type:"string",group:"Misc",defaultValue:null},maskMode:{type:"sap.m.TimePickerMaskMode",group:"Misc",defaultValue:P.On},support2400:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{rules:{type:"sap.m.MaskInputRule",multiple:true,singularName:"rule"},_picker:{type:"sap.m.ResponsivePopover",multiple:false,visibility:"hidden"}},dnd:{draggable:false,droppable:true}}});r.insertFontFaceStyle();a.call(b.prototype,true);o.call(b.prototype);var A={Short:"short",Medium:"medium",Long:"long"},C={Hour:"hour",Minute:"minute",Second:"second"},k="-";b.prototype.init=function(){t.prototype.init.apply(this,arguments);o.init.apply(this,arguments);this.setDisplayFormat(x());this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._bValid=false;this._sUsedDisplayPattern=null;this._sUsedValuePattern=null;this._oDisplayFormat=null;this._sValueFormat=null;this._oPopoverKeydownEventDelegate=null;this._rPlaceholderRegEx=new RegExp(k,"g");this._sLastChangeValue=null;var e=this.addEndIcon({id:this.getId()+"-icon",src:this.getIconSrc(),noTabStop:true,title:"",tooltip:this._oResourceBundle.getText("OPEN_PICKER_TEXT")});this._bShouldClosePicker=false;e.addEventDelegate({onmousedown:function(e){this._bShouldClosePicker=this.isOpen()}},this);e.attachPress(function(){this.toggleOpen(this._bShouldClosePicker)},this)};b.prototype.onBeforeRendering=function(){t.prototype.onBeforeRendering.apply(this,arguments);var e=this._getValueHelpIcon();if(e){e.setProperty("visible",this.getEditable(),true)}};b.prototype.exit=function(){if(this._oTimeSemanticMaskHelper){this._oTimeSemanticMaskHelper.destroy()}o.exit.apply(this,arguments);this._removePickerEvents();this._oResourceBundle=null;this._bValid=false;this._sUsedDisplayPattern=null;this._oDisplayFormat=null;this._oPopoverKeydownEventDelegate=null;this._sUsedValuePattern=null;this._sValueFormat=null;this._sLastChangeValue=null};b.prototype.getIconSrc=function(){return r.getIconURI("time-entry-request")};b.prototype.isOpen=function(){return this._getPicker()&&this._getPicker().isOpen()};b.prototype.toggleOpen=function(e){if(this.getEditable()&&this.getEnabled()){this[e?"_closePicker":"_openPicker"]()}};b.prototype.onfocusin=function(e){var t=this._getPicker();var i=this._isIconClicked(e);o.onfocusin.apply(this,arguments);if(t&&t.isOpen()&&!i){this._closePicker()}};b.prototype._isIconClicked=function(e){return y(e.target).hasClass("sapUiIcon")||y(e.target).hasClass("sapMInputBaseIconContainer")};b.prototype.onBeforeOpen=function(){var t=this._getSliders(),i=this.getDateValue(),s=this._$input.val(),a=this.getValueFormat(),r=a.indexOf("HH"),o=a.indexOf("H");t.setValue(s);if(this._shouldSetInitialFocusedDateValue()){i=this.getInitialFocusedDateValue()}t._setTimeValues(i,n._isHoursValue24(s,r,o));t.collapseAll();this.$().addClass(e.ICON_PRESSED_CSS_CLASS)};b.prototype.onAfterOpen=function(){var e=this._getSliders();if(e){e.openFirstSlider();this._handleAriaOnExpandCollapse()}};b.prototype.onAfterClose=function(){this.$().removeClass(e.ICON_PRESSED_CSS_CLASS);this._handleAriaOnExpandCollapse()};b.prototype._getValueHelpIcon=function(){var e=this.getAggregation("_endIcon");return e&&e[0]};b.prototype._handleInputChange=function(e){var t,i,s,a,r=this.getValueFormat(),o=r.indexOf("HH"),l=r.indexOf("H");e=e||this._$input.val();i=e;s=n._isHoursValue24(i,o,l);a=this.getSupport2400()&&s;this._bValid=true;if(e!==""){t=this._parseValue(s?n._replace24HoursWithZero(e,o,l):e,true);if(a){t.setMinutes(0,0)}if(!t){this._bValid=false}else{e=this._formatValue(t);if(this.getMaskMode()&&this.getMask()){this._setupMaskVariables()}}}i=a?"24:"+e.replace(/[0-9]/g,"0").slice(0,-3):e;this.updateDomValue(i);if(t){i=e=this._formatValue(t,true);if(a&&t&&t.getHours()===0){i=e=n._replaceZeroHoursWith24(e,o,l)}}this.setProperty("value",i,true);this.setLastValue(e);if(this._bValid){this.setProperty("dateValue",t,true)}this.fireChangeEvent(i,{valid:this._bValid});return true};b.prototype.onChange=function(e){var t=e?e.value:null;if(this.getEditable()&&this.getEnabled()){return this._handleInputChange(t)}return false};b.prototype.setMinutesStep=function(e){var t=this._getSliders();e=Math.max(v,e||v);if(t){t.setMinutesStep(e)}return this.setProperty("minutesStep",e,true)};b.prototype.setSecondsStep=function(e){var t=this._getSliders();e=Math.max(v,e||v);if(t){t.setSecondsStep(e)}return this.setProperty("secondsStep",e,true)};b.prototype.setTitle=function(e){var t=this._getSliders();if(t){t.setLabelText(e)}this.setProperty("title",e,true);return this};b.prototype._handleDateValidation=function(e){if(!e){this._bValid=false;g.warning("Value can not be converted to a valid date",this)}else{this._bValid=true;this.setProperty("dateValue",e,true);var t=this._formatValue(e);if(this.isActive()){this.updateDomValue(t)}else{this.setProperty("value",t,true);this.setLastValue(t);this._sLastChangeValue=t}}};b.prototype.setSupport2400=function(e){var t=this._getSliders();this.setProperty("support2400",e,true);if(t){t.setSupport2400(e)}this._initMask();return this};b.prototype.setDisplayFormat=function(e){var t=this._getSliders();this.setProperty("displayFormat",e,true);this._initMask();if(t){t.setDisplayFormat(e)}var i=this.getDateValue();if(!i){return this}var s=this._formatValue(i);this.updateDomValue(s);this.setLastValue(s);return this};b.prototype.setValue=function(e){var t,i,s=this.getValueFormat(),a=s.indexOf("HH"),r=s.indexOf("H"),l=this._getSliders();e=this.validateProperty("value",e);this._initMask();if(this.getValue()!==e){this._sLastChangeValue=e}o.setValue.call(this,e);if(this.getMask()){this._setupMaskVariables()}this._bValid=true;if(e){t=this._parseValue(n._isHoursValue24(e,a,r)?n._replace24HoursWithZero(e,a,r):e);if(!t){this._bValid=false;g.warning("Value can not be converted to a valid date",this)}}if(this._bValid){this.setProperty("dateValue",t,true)}if(t&&!this.getSupport2400()){i=this._formatValue(t)}else{i=e}if(l){l.setValue(e)}this.updateDomValue(i);this.setLastValue(i);return this};b.prototype.setDateValue=function(e){this._initMask();return t.prototype.setDateValue.apply(this,arguments)};b.prototype.setTooltip=function(e){var t=this.getDomRef(),i;this._refreshTooltipBaseDelegate(e);this.setAggregation("tooltip",e,true);if(!t){return this}i=this.getTooltip_AsString();if(i){t.setAttribute("title",i)}else{t.removeAttribute("title")}return this};b.prototype.setLocaleId=function(e){var t=this.getValue(),i=this._getSliders();this.setProperty("localeId",e,true);this._initMask();this._oDisplayFormat=null;this._sValueFormat=null;if(t){this.setValue(t)}if(i){i.setLocaleId(e)}return this};b.prototype._getDefaultDisplayStyle=function(){return A.Medium};b.prototype._getDefaultValueStyle=function(){return A.Medium};b.prototype._getLocale=function(){var e=this.getLocaleId();return e?new h(e):sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()};b.prototype._getFormatterInstance=function(e,t,i,s,a){var r=this._getLocale();if(t===A.Short||t===A.Medium||t===A.Long){e=u.getTimeInstance({style:t,strictParsing:true,relative:i},r)}else{e=u.getTimeInstance({pattern:t,strictParsing:true,relative:i},r)}if(a){this._sUsedDisplayPattern=t;this._oDisplayFormat=e}else{this._sUsedValuePattern=t;this._sValueFormat=e}return e};b.prototype._getFormat=function(){var e=this._getDisplayFormatPattern();if(!e){e=A.Medium}if(Object.keys(A).indexOf(e)!==-1){e=x()}return e};b.prototype.onsappageup=function(e){this._increaseTime(1,C.Hour);e.preventDefault()};b.prototype.onsappageupmodifiers=function(e){if(!(e.ctrlKey||e.metaKey||e.altKey)&&e.shiftKey){this._increaseTime(1,C.Minute)}if(!e.altKey&&e.shiftKey&&(e.ctrlKey||e.metaKey)){this._increaseTime(1,C.Second)}e.preventDefault()};b.prototype.onsappagedown=function(e){this._increaseTime(-1,C.Hour);e.preventDefault()};b.prototype.onsappagedownmodifiers=function(e){if(!(e.ctrlKey||e.metaKey||e.altKey)&&e.shiftKey){this._increaseTime(-1,C.Minute)}if(!e.altKey&&e.shiftKey&&(e.ctrlKey||e.metaKey)){this._increaseTime(-1,C.Second)}e.preventDefault()};b.prototype.onkeydown=function(e){var t=c,i=e.which||e.keyCode,s=e.altKey,a;if(i===t.F4||s&&(i===t.ARROW_UP||i===t.ARROW_DOWN)){a=this._getPicker()&&this._getPicker().isOpen();if(!a){this._openPicker()}else{this._closePicker()}e.preventDefault()}else{o.onkeydown.call(this,e)}};b.prototype._getPicker=function(){return this.getAggregation("_picker")};b.prototype._removePickerEvents=function(){var e,t=this._getPicker();if(t){e=t.getAggregation("_popup");if(typeof this._oPopoverKeydownEventDelegate==="function"){e.removeEventDelegate(this._oPopoverKeydownEventDelegate)}}};b.prototype._openPicker=function(){var e=this._getPicker(),t;if(!e){e=this._createPicker(this._getDisplayFormatPattern())}e.open();t=this._getSliders();setTimeout(t._updateSlidersValues.bind(t),0);return e};b.prototype._closePicker=function(){var e=this._getPicker();if(e){e.close()}else{g.warning("There is no picker to close.")}return e};b.prototype._createPicker=function(e){var t=this,i,a,r,o,u,h,p=this.getAggregation("_endIcon")[0],d=this._getLocale().getLanguage(),m,g,y;r=sap.ui.getCore().getLibraryResourceBundle("sap.m");o=r.getText("TIMEPICKER_SET");u=r.getText("TIMEPICKER_CANCEL");h=this.getTitle();a=new s(t.getId()+"-RP",{showCloseButton:false,showHeader:false,horizontalScrolling:false,verticalScrolling:false,placement:V.VerticalPreferedBottom,beginButton:new _({text:o,type:S.Emphasized,press:this._handleOkPress.bind(this)}),content:[new n(this.getId()+"-sliders",{support2400:this.getSupport2400(),displayFormat:e,valueFormat:this.getValueFormat(),labelText:h?h:"",localeId:d,minutesStep:this.getMinutesStep(),secondsStep:this.getSecondsStep()})._setShouldOpenSliderAfterRendering(true)],contentHeight:b._PICKER_CONTENT_HEIGHT,ariaLabelledBy:f.getStaticId("sap.m","TIMEPICKER_SET_TIME"),beforeOpen:this.onBeforeOpen.bind(this),afterOpen:this.onAfterOpen.bind(this),afterClose:this.onAfterClose.bind(this)});i=a.getAggregation("_popup");if(i.setShowArrow){i.setShowArrow(false)}i.oPopup.setAutoCloseAreas([p]);if(l.system.phone){m=this.$("inner").attr("aria-labelledby");g=m&&m.split(" ")[0];y=g?document.getElementById(g).getAttribute("aria-label"):"";a.setTitle(y);a.setShowHeader(true);a.setShowCloseButton(true)}else{a.setEndButton(new _(this.getId()+"-Cancel",{text:u,press:this._handleCancelPress.bind(this)}));this._oPopoverKeydownEventDelegate={onkeydown:function(e){var t=c,i=e.which||e.keyCode,s=e.altKey;if(s&&(i===t.ARROW_UP||i===t.ARROW_DOWN)||i===t.F4){this._handleOkPress(e);this.focus();e.preventDefault()}}};i.addEventDelegate(this._oPopoverKeydownEventDelegate,this);i._afterAdjustPositionAndArrowHook=function(){t._getSliders()._onOrientationChanged()}}a.addStyleClass(this.getRenderer().CSS_CLASS+"DropDown");a.open=function(){return this.openBy(t)};this.setAggregation("_picker",a,true);return a};b.prototype._getSliders=function(){var e=this._getPicker();if(!e){return null}return e.getContent()[0]};b.prototype._handleOkPress=function(e){var t=this._getSliders().getTimeValues(),i=this._formatValue(t);this.updateDomValue(i);this._handleInputChange();this._closePicker()};b.prototype._handleCancelPress=function(e){this._closePicker()};b.prototype._getLocaleBasedPattern=function(e){return d.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).getTimePattern(e)};b.prototype._parseValue=function(e,i){if(i){e=this._oTimeSemanticMaskHelper.stripValueOfLeadingSpaces(e);e=e.replace(this._rPlaceholderRegEx,"")}return t.prototype._parseValue.call(this,e,i)};b.prototype._formatValue=function(e,i){var s=t.prototype._formatValue.apply(this,arguments),a=this.getValueFormat(),r=a.indexOf("HH"),o=a.indexOf("H");if(e){if(!i&&this._oTimeSemanticMaskHelper){s=this._oTimeSemanticMaskHelper.formatValueWithLeadingTrailingSpaces(s)}}if(e&&e.getHours()===0&&this.getSupport2400()&&this._getSliders()&&this._getSliders()._getHoursSlider().getSelectedValue()==="24"){s=n._replaceZeroHoursWith24(s,r,o)}return s};b.prototype._handleAriaOnExpandCollapse=function(){this.getFocusDomRef().setAttribute("aria-expanded",this._getPicker().isOpen())};b.prototype._increaseTime=function(e,t){var i=this.getDateValue(),s,a;if(i&&this.getEditable()&&this.getEnabled()){s=new Date(i.getTime());switch(t){case C.Hour:s.setHours(s.getHours()+e);a=60*60*1e3;break;case C.Minute:s.setMinutes(s.getMinutes()+e);a=60*1e3;break;case C.Second:a=1e3;s.setSeconds(s.getSeconds()+e)}if(e<0&&s.getTime()-i.getTime()!==e*a){s=new Date(i.getTime()+e*a)}this.setDateValue(s);this.fireChangeEvent(this.getValue(),{valid:true})}};b.prototype._initMask=function(){if(this._oTimeSemanticMaskHelper){this._oTimeSemanticMaskHelper.destroy()}this._oTimeSemanticMaskHelper=new I(this)};b.prototype._isMaskEnabled=function(){return this.getMaskMode()===P.On};b.prototype._shouldSetInitialFocusedDateValue=function(){if(!this._isValidValue()){return true}return!this.getValue()&&!!this.getInitialFocusedDateValue()};b.prototype._isValidValue=function(){return this._bValid};b.prototype.fireChangeEvent=function(e,i){if(e){e=e.trim()}if(e!==this._sLastChangeValue){this._sLastChangeValue=e;t.prototype.fireChangeEvent.call(this,e,i)}};var I=function(e){var t=e._getDisplayFormatPattern(),s,a,r=e._getLocale(),n;if(e._checkStyle(t)){s=d.getInstance(r).getTimePattern(t)}else{t=t.replace(/'/g,"");s=t}this._oTimePicker=e;this.aOriginalAmPmValues=d.getInstance(r).getDayPeriods("abbreviated");this.aAmPmValues=this.aOriginalAmPmValues.slice(0);this.iAmPmValueMaxLength=Math.max(this.aAmPmValues[0].length,this.aAmPmValues[1].length);for(n=0;n<this.aAmPmValues.length;n++){while(this.aAmPmValues[n].length<this.iAmPmValueMaxLength){this.aAmPmValues[n]+=" "}}this.b24H=t.indexOf("H")!==-1;this.bLeadingZero=t.indexOf("HH")!==-1||t.indexOf("hh")!==-1;this.sLeadingChar=this.bLeadingZero?"0":" ";this.sAlternativeLeadingChar=this.bLeadingZero?" ":"0";this.sLeadingRegexChar=this.bLeadingZero?"0":"\\s";e.setPlaceholderSymbol(k);s=s.replace(/hh/gi,"h").replace(/h/gi,"h9");if(this.b24H){a="["+this.sLeadingRegexChar+"012]"}else{a="["+this.sLeadingRegexChar+"1]"}this._maskRuleHours=new i({maskFormatSymbol:"h",regex:a});e.addRule(this._maskRuleHours);this.iHourNumber1Index=s.indexOf("h9");this.iHourNumber2Index=this.iHourNumber1Index!==-1?this.iHourNumber1Index+1:-1;this.iMinuteNumber1Index=s.indexOf("mm");s=s.replace(/mm/g,"59");this.iSecondNumber1Index=s.indexOf("ss");s=s.replace(/ss/g,"59");this._maskRuleMinSec=new i({maskFormatSymbol:"5",regex:"[0-5]"});e.addRule(this._maskRuleMinSec);this.aAllowedHours=c.call(this,this.b24H,this.sLeadingChar);this.aAllowedMinutesAndSeconds=g.call(this);this.iAmPmChar1Index=s.indexOf("a");this.iAfterAmPmValueIndex=-1;if(this.iAmPmChar1Index!==-1){this.iAfterAmPmValueIndex=this.iAmPmChar1Index+this.iAmPmValueMaxLength;var o=this.iAmPmValueMaxLength-"a".length;this.shiftIndexes(o);var l=65;var u="";var h="";var p="";for(n=0;n<this.iAmPmValueMaxLength;n++){h="[";if(this.aAmPmValues[0][n]){h+=this.aAmPmValues[0][n]}else{h+="\\s"}if(this.aAmPmValues[1][n]!==this.aAmPmValues[0][n]){if(this.aAmPmValues[1][n]){h+=this.aAmPmValues[1][n]}else{h+="\\s"}}h+="]";p=String.fromCharCode(l++);u+=p;this._maskRuleChars=new i({maskFormatSymbol:p,regex:h});e.addRule(this._maskRuleChars)}s=s.replace(/a/g,u)}e.setMask(s);function m(e,t,i){var s=[],a,r;for(r=e;r<=t;r++){a=r.toString();if(r<10){a=i+a}s.push(a)}return s}function c(e,t){var i=e?0:1,s=this._oTimePicker.getSupport2400()?24:23,a=e?s:12;return m(i,a,t)}function g(){return m(0,59,"0")}};I.prototype.replaceChar=function(e,t,i){var s=t-this.iAmPmChar1Index,a,r,n,o,l,u,h;if(t===this.iHourNumber1Index&&this.sAlternativeLeadingChar===e){if(this.aAllowedHours.indexOf(this.sLeadingChar+e)!==-1){return this.sLeadingChar+e}else{return this.sLeadingChar}}else if(t===this.iHourNumber1Index&&!this._oTimePicker._isCharAllowed(e,t)&&this.aAllowedHours.indexOf(this.sLeadingChar+e)!==-1){return this.sLeadingChar+e}else if(t===this.iHourNumber2Index&&i[this.iHourNumber1Index]===k){this._oTimePicker._oTempValue.setCharAt(this.sLeadingChar,this.iHourNumber1Index);return e}else if(t===this.iHourNumber2Index&&this.aAllowedHours.indexOf(i[this.iHourNumber1Index]+e)===-1){return""}else if((t===this.iMinuteNumber1Index||t===this.iSecondNumber1Index)&&!this._oTimePicker._isCharAllowed(e,t)&&this.aAllowedMinutesAndSeconds.indexOf("0"+e)!==-1){return"0"+e}else if(s>=0&&t<this.iAfterAmPmValueIndex){a=i.slice(this.iAmPmChar1Index,t);r=this.aAmPmValues[0].slice(0,s);n=this.aAmPmValues[1].slice(0,s);l=this.aAmPmValues[0].slice(s,this.iAfterAmPmValueIndex);u=this.aAmPmValues[1].slice(s,this.iAfterAmPmValueIndex);o=r===n;var p="";for(h=s;h<this.iAmPmValueMaxLength;h++){if(this.aAmPmValues[0][h]===this.aAmPmValues[1][h]){p+=this.aAmPmValues[0][h]}else{break}}if(h===this.iAmPmValueMaxLength||h!==s){return p}else{if(!o){if(a===r){return l}else if(a===n){return u}else{return e}}else{if(this.aAmPmValues[0][s].toLowerCase()===e.toLowerCase()&&this.aAmPmValues[0]===a+l){return l}else if(this.aAmPmValues[1][s].toLowerCase()===e.toLowerCase()&&this.aAmPmValues[1]===a+u){return u}else{return e}}}}else{return e}};I.prototype.formatValueWithLeadingTrailingSpaces=function(e){var t=this._oTimePicker.getMask().length;if(this.aOriginalAmPmValues[0]!==this.aAmPmValues[0]){e=e.replace(this.aOriginalAmPmValues[0],this.aAmPmValues[0])}if(this.aOriginalAmPmValues[1]!==this.aAmPmValues[1]){e=e.replace(this.aOriginalAmPmValues[1],this.aAmPmValues[1])}while(t>e.length){e=[e.slice(0,this.iHourNumber1Index)," ",e.slice(this.iHourNumber1Index)].join("")}return e};I.prototype.stripValueOfLeadingSpaces=function(e){if(e[this.iHourNumber1Index]===" "){e=[e.slice(0,this.iHourNumber1Index),e.slice(this.iHourNumber1Index+1)].join("")}return e};I.prototype.shiftIndexes=function(e){if(this.iAmPmChar1Index<this.iHourNumber1Index){this.iHourNumber1Index+=e;this.iHourNumber2Index+=e}if(this.iAmPmChar1Index<this.iMinuteNumber1Index){this.iMinuteNumber1Index+=e}if(this.iAmPmChar1Index<this.iSecondNumber1Index){this.iSecondNumber1Index+=e}};I.prototype.destroy=function(){if(this._maskRuleHours){this._maskRuleHours.destroy();this._maskRuleHours=null}if(this._maskRuleMinSec){this._maskRuleMinSec.destroy();this._maskRuleMinSec=null}if(this._maskRuleChars){this._maskRuleChars.destroy();this._maskRuleChars=null}};b.prototype._feedReplaceChar=function(e,t,i){return this._oTimeSemanticMaskHelper.replaceChar(e,t,i)};b.prototype._getAlteredUserInputValue=function(e){return e?this._formatValue(this._parseValue(e),true):e};b.prototype.getAccessibilityInfo=function(){var e=this.getRenderer();var i=t.prototype.getAccessibilityInfo.apply(this,arguments);var s=this.getValue()||"";if(this._bValid){var a=this.getDateValue();if(a){s=this._formatValue(a)}}y.extend(true,i,{role:e.getAriaRole(this),type:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_TIMEINPUT"),description:[s,e.getLabelledByAnnouncement(this),e.getDescribedByAnnouncement(this)].join(" ").trim(),autocomplete:"none",expanded:false,haspopup:true,owns:this.getId()+"-sliders"});return i};function x(){var e=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),t=d.getInstance(e);return t.getTimePattern(A.Medium)}b.prototype._revertKey=function(e,t){t=t||this._getTextSelection();var i=t.iFrom,s=t.iTo,a=i,r,n;if(!t.bHasSelection){if(e.bBackspace){a=i=this._oRules.previousTo(i)}else if(e.bDelete){r=this.getPlaceholderSymbol();n=this._oTempValue._aContent.length;while((this._oTempValue._aContent[i]===r||this._oTempValue._aInitial[i]!==r)&&i<n){i++}s=i}}if(e.bBackspace||e.bDelete&&t.bHasSelection){s=s-1}this._resetTempValue(i,s);this.updateDomValue(this._oTempValue.toString());this._setCursorPosition(Math.max(this._iUserInputStartPosition,a))};b._PICKER_CONTENT_HEIGHT="25rem";return b});