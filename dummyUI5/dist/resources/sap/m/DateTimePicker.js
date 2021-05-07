/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.getCore().loadLibrary("sap.ui.unified");sap.ui.define(["sap/ui/thirdparty/jquery","./InputBase","./DatePicker","sap/ui/model/type/Date","sap/ui/unified/DateRange","./library","sap/ui/core/Control","sap/ui/Device","sap/ui/core/format/DateFormat","sap/ui/core/LocaleData","./DateTimePickerRenderer","./TimePickerSliders","./SegmentedButton","./SegmentedButtonItem","./ResponsivePopover","./Button","sap/ui/events/KeyCodes","sap/ui/core/IconPool"],function(e,t,i,s,o,a,n,r,p,l,u,g,h,d,c,f,_,y){"use strict";var S=a.PlacementType,m=a.ButtonType,C="Phone";var D=i.extend("sap.m.DateTimePicker",{metadata:{library:"sap.m",properties:{minutesStep:{type:"int",group:"Misc",defaultValue:1},secondsStep:{type:"int",group:"Misc",defaultValue:1}},designtime:"sap/m/designtime/DateTimePicker.designtime",dnd:{draggable:false,droppable:true}}});var P={Short:"short",Medium:"medium",Long:"long",Full:"full"};var T=n.extend("sap.m.internal.DateTimePickerPopup",{metadata:{library:"sap.m",aggregations:{_switcher:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},calendar:{type:"sap.ui.core.Control",multiple:false},timeSliders:{type:"sap.ui.core.Control",multiple:false}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("div",t);e.class("sapMDateTimePopupCont").class("sapMTimePickerDropDown");e.openEnd();var i=t.getAggregation("_switcher");if(i){e.openStart("div");e.class("sapMTimePickerSwitch");e.openEnd();e.renderControl(i);e.close("div")}var s=t.getCalendar();if(s){e.renderControl(s)}e.openStart("div");e.class("sapMTimePickerSep");e.openEnd();e.close("div");var o=t.getTimeSliders();if(o){e.renderControl(o)}e.close("div")}},init:function(){},onBeforeRendering:function(){var t=this.getAggregation("_switcher");if(!t){var i=sap.ui.getCore().getLibraryResourceBundle("sap.m");var s=i.getText("DATETIMEPICKER_DATE");var o=i.getText("DATETIMEPICKER_TIME");t=new h(this.getId()+"-Switch",{selectedKey:"Cal",items:[new d(this.getId()+"-Switch-Cal",{key:"Cal",text:s}),new d(this.getId()+"-Switch-Sli",{key:"Sli",text:o})]});t.attachSelect(this._handleSelect,this);this.setAggregation("_switcher",t,true)}if(r.system.phone||e("html").hasClass("sapUiMedia-Std-Phone")){t.setVisible(true);t.setSelectedKey("Cal")}else{t.setVisible(false)}},onAfterRendering:function(){if(r.system.phone||e("html").hasClass("sapUiMedia-Std-Phone")){var t=this.getAggregation("_switcher");var i=t.getSelectedKey();this._switchVisibility(i)}},_handleSelect:function(e){this._switchVisibility(e.getParameter("key"))},_switchVisibility:function(e){var t=this.getCalendar();var i=this.getTimeSliders();if(!t||!i){return}if(e=="Cal"){t.$().css("display","");i.$().css("display","none")}else{t.$().css("display","none");i.$().css("display","");i._updateSlidersValues();i._onOrientationChanged();i.openFirstSlider()}},switchToTime:function(){var e=this.getAggregation("_switcher");if(e&&e.getVisible()){e.setSelectedKey("Sli");this._switchVisibility("Sli")}},getSpecialDates:function(){return this._oDateTimePicker.getSpecialDates()},onkeydown:function(e){var t=e.keyCode===_.TAB&&!e.shiftKey;var i=e.keyCode===_.TAB&&e.shiftKey;if(t&&e.target.classList.contains("sapUiCalHeadBLast")){this.getAggregation("timeSliders").getDomRef().children[0].focus()}if(i&&e.target.classList.contains("sapUiCalItem")){var s=this.oParent.getAggregation("footer").getAggregation("content").length-1;this.oParent.getAggregation("footer").getAggregation("content")[s].focus()}}});D.prototype.init=function(){i.prototype.init.apply(this,arguments);this._bOnlyCalendar=false};D.prototype.getIconSrc=function(){return y.getIconURI("date-time")};D.prototype.exit=function(){i.prototype.exit.apply(this,arguments);if(this._oSliders){this._oSliders.destroy();delete this._oSliders}this._oPopupContent=undefined;r.media.detachHandler(this._handleWindowResize,this)};D.prototype.setDisplayFormat=function(e){i.prototype.setDisplayFormat.apply(this,arguments);if(this._oSliders){this._oSliders.setDisplayFormat(I.call(this))}return this};D.prototype.setMinutesStep=function(e){this.setProperty("minutesStep",e,true);if(this._oSliders){this._oSliders.setMinutesStep(e)}return this};D.prototype._getDefaultValueStyle=function(){return P.Medium};D.prototype.setMinDate=function(e){i.prototype.setMinDate.call(this,e);if(e){this._oMinDate.setHours(e.getHours(),e.getMinutes(),e.getSeconds())}return this};D.prototype.setMaxDate=function(e){i.prototype.setMaxDate.call(this,e);if(e){this._oMaxDate.setHours(e.getHours(),e.getMinutes(),e.getSeconds())}return this};D.prototype.setSecondsStep=function(e){this.setProperty("secondsStep",e,true);if(this._oSliders){this._oSliders.setSecondsStep(e)}return this};D.prototype._getFormatInstance=function(t,i){var s=e.extend({},t);var o=-1;if(s.style){o=s.style.indexOf("/")}if(i){var a=e.extend({},s);if(o>0){a.style=a.style.substr(0,o)}this._oDisplayFormatDate=p.getInstance(a)}return p.getDateTimeInstance(s)};D.prototype._checkStyle=function(e){if(i.prototype._checkStyle.apply(this,arguments)){return true}else if(e.indexOf("/")>0){var t=[P.Short,P.Medium,P.Long,P.Long];var s=false;for(var o=0;o<t.length;o++){var a=t[o];for(var n=0;n<t.length;n++){var r=t[n];if(e==a+"/"+r){s=true;break}}if(s){break}}return s}return false};D.prototype._parseValue=function(e,t){var s=i.prototype._parseValue.apply(this,arguments);if(t&&!s){s=this._oDisplayFormatDate.parse(e);if(s){var o=this.getDateValue();if(!o){o=new Date}s.setHours(o.getHours());s.setMinutes(o.getMinutes());s.setSeconds(o.getSeconds());s.setMilliseconds(o.getMilliseconds())}}return s};D.prototype._getLocaleBasedPattern=function(e){var t=l.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()),i=e.indexOf("/");if(i>0){return t.getCombinedDateTimePattern(e.substr(0,i),e.substr(i+1))}else{return t.getCombinedDateTimePattern(e,e)}};D.prototype._createPopup=function(){var e,t,i,s,o,a;if(!this._oPopup){i=sap.ui.getCore().getLibraryResourceBundle("sap.m");s=i.getText("TIMEPICKER_SET");o=i.getText("TIMEPICKER_CANCEL");this._oPopupContent=new T(this.getId()+"-PC");this._oPopupContent._oDateTimePicker=this;this._oOKButton=new f(this.getId()+"-OK",{text:s,type:m.Emphasized,press:v.bind(this)});this._oPopup=new c(this.getId()+"-RP",{showCloseButton:false,showHeader:false,placement:S.VerticalPreferedBottom,beginButton:this._oOKButton,content:this._oPopupContent,afterOpen:b.bind(this),afterClose:M.bind(this)});if(r.system.phone){e=this.$("inner").attr("aria-labelledby");t=e?document.getElementById(e).getAttribute("aria-label"):"";this._oPopup.setTitle(t);this._oPopup.setShowHeader(true);this._oPopup.setShowCloseButton(true)}else{this._oPopup._getPopup().setDurations(0,0);this._oPopup.setEndButton(new f(this.getId()+"-Cancel",{text:o,press:w.bind(this)}))}this._oPopup.addStyleClass("sapMDateTimePopup");a=this._oPopup.getAggregation("_popup");if(a.setShowArrow){a.setShowArrow(false)}this.setAggregation("_popup",this._oPopup,true)}};D.prototype._openPopup=function(){if(!this._oPopup){return}this.addStyleClass(t.ICON_PRESSED_CSS_CLASS);this._storeInputSelection(this._$input.get(0));var e=this._oPopup.getAggregation("_popup");e.oPopup.setAutoCloseAreas([this.getDomRef()]);this._oPopup.openBy(this);var i=this._oPopup.getContent()[0]&&this._oPopup.getContent()[0].getTimeSliders();if(i){setTimeout(i._updateSlidersValues.bind(i),0)}};D.prototype._createPopupContent=function(){var e=!this._oCalendar;i.prototype._createPopupContent.apply(this,arguments);if(e){this._oPopupContent.setCalendar(this._oCalendar);this._oCalendar.attachSelect(A,this)}if(!this._oSliders){this._oSliders=new g(this.getId()+"-Sliders",{minutesStep:this.getMinutesStep(),secondsStep:this.getSecondsStep(),displayFormat:I.call(this),localeId:this.getLocaleId()})._setShouldOpenSliderAfterRendering(true);this._oPopupContent.setTimeSliders(this._oSliders)}};D.prototype._selectFocusedDateValue=function(e){var t=this._oCalendar;t.removeAllSelectedDates();t.addSelectedDate(e);return this};D.prototype._fillDateRange=function(){var e=this.getDateValue(),t=true;if(e){e=new Date(e.getTime());this._oOKButton.setEnabled(true)}else{t=false;e=this.getInitialFocusedDateValue();if(!e){e=new Date;this._oCalendar.removeAllSelectedDates()}var i=this._oMaxDate.getTime();if(e.getTime()<this._oMinDate.getTime()||e.getTime()>i){e=this._oMinDate}this._oOKButton.setEnabled(false)}this._oCalendar.focusDate(e);if(t){if(!this._oDateRange.getStartDate()||this._oDateRange.getStartDate().getTime()!=e.getTime()){this._oDateRange.setStartDate(e)}}this._oSliders._setTimeValues(e)};D.prototype._getSelectedDate=function(){var e=i.prototype._getSelectedDate.apply(this,arguments);if(e){var t=this._oSliders.getTimeValues();var s=this._oSliders._getDisplayFormatPattern();if(s.search("h")>=0||s.search("H")>=0){e.setHours(t.getHours())}if(s.search("m")>=0){e.setMinutes(t.getMinutes())}if(s.search("s")>=0){e.setSeconds(t.getSeconds())}if(e.getTime()<this._oMinDate.getTime()){e=new Date(this._oMinDate.getTime())}else if(e.getTime()>this._oMaxDate.getTime()){e=new Date(this._oMaxDate.getTime())}}return e};D.prototype.getLocaleId=function(){return sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString()};D.prototype.getAccessibilityInfo=function(){var e=i.prototype.getAccessibilityInfo.apply(this,arguments);e.type=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_DATETIMEINPUT");return e};function v(e){this._handleCalendarSelect()}function w(e){this.onsaphide(e);if(!this.getDateValue()){this._oCalendar.removeAllSelectedDates()}}D.prototype._handleWindowResize=function(e){var t=this.getAggregation("_popup").getContent()[0].getAggregation("_switcher"),i=this.getAggregation("_popup").getContent()[0].getCalendar(),s=this.getAggregation("_popup").getContent()[0].getTimeSliders();if(e.name===C){t.setVisible(true);this.getAggregation("_popup").getContent()[0]._switchVisibility(t.getSelectedKey())}else{t.setVisible(false);s.$().css("display","");i.$().css("display","")}};function b(e){this.$("inner").attr("aria-expanded",true);this._oCalendar.focus();this._oSliders._onOrientationChanged();r.media.attachHandler(this._handleWindowResize,this)}function M(){this.removeStyleClass(t.ICON_PRESSED_CSS_CLASS);this.$("inner").attr("aria-expanded",false);this._restoreInputSelection(this._$input.get(0));this._oCalendar._closePickers();r.media.detachHandler(this._handleWindowResize,this)}function I(){var e=this.getDisplayFormat();var t;var i=this.getBinding("value");if(i&&i.oType&&i.oType instanceof s){e=i.oType.getOutputPattern()}else if(i&&i.oType&&i.oType.oFormat){e=i.oType.oFormat.oFormatOptions.pattern}else{e=this.getDisplayFormat()}if(!e){e=P.Medium}var o=e.indexOf("/");if(o>0&&this._checkStyle(e)){e=e.substr(o+1)}if(e==P.Short||e==P.Medium||e==P.Long||e==P.Full){var a=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();var n=l.getInstance(a);t=n.getTimePattern(e)}else{t=e}return t}function A(e){this._oOKButton.setEnabled(true);this._oPopupContent.switchToTime()}return D});