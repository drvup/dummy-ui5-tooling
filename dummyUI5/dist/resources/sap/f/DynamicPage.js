/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/Core","sap/m/ScrollBar","sap/m/library","sap/ui/base/ManagedObjectObserver","sap/ui/core/ResizeHandler","sap/ui/core/Configuration","sap/ui/core/delegate/ScrollEnablement","sap/ui/Device","sap/ui/base/ManagedObject","sap/f/DynamicPageTitle","sap/f/DynamicPageHeader","./DynamicPageRenderer","sap/base/Log","sap/ui/dom/getScrollbarSize","sap/ui/core/theming/Parameters","sap/ui/dom/units/Rem","sap/ui/core/library"],function(e,t,i,r,a,s,n,o,l,h,d,p,_,g,c,u,f,S,H){"use strict";var y=a.PageBackgroundDesign;var E=t.extend("sap.f.DynamicPage",{metadata:{library:"sap.f",properties:{preserveHeaderStateOnScroll:{type:"boolean",group:"Behavior",defaultValue:false},headerExpanded:{type:"boolean",group:"Behavior",defaultValue:true},toggleHeaderOnTitleClick:{type:"boolean",group:"Behavior",defaultValue:true},showFooter:{type:"boolean",group:"Behavior",defaultValue:false},backgroundDesign:{type:"sap.m.PageBackgroundDesign",group:"Appearance",defaultValue:y.Standard},fitContent:{type:"boolean",group:"Behavior",defaultValue:false}},associations:{stickySubheaderProvider:{type:"sap.f.IDynamicPageStickyContent",multiple:false}},aggregations:{title:{type:"sap.f.DynamicPageTitle",multiple:false},header:{type:"sap.f.DynamicPageHeader",multiple:false},content:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.m.IBar",multiple:false},landmarkInfo:{type:"sap.f.DynamicPageAccessibleLandmarkInfo",multiple:false},_scrollBar:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},dnd:{draggable:false,droppable:true},designtime:"sap/f/designtime/DynamicPage.designtime"}});function A(e){if(arguments.length===1){return e&&"length"in e?e.length>0:!!e}return Array.prototype.slice.call(arguments).every(function(e){return A(e)})}function T(e){var t;if(!e){return false}t=e.getBoundingClientRect();return!!(t.width&&t.height)}var b=H.AccessibleLandmarkRole;E.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE=.6;E.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE=.6;E.HEADER_MAX_ALLOWED_NON_SROLLABLE_ON_MOBILE=.3;E.BREAK_POINTS={DESKTOP:1439,TABLET:1024,PHONE:600};E.EVENTS={TITLE_PRESS:"_titlePress",TITLE_MOUSE_OVER:"_titleMouseOver",TITLE_MOUSE_OUT:"_titleMouseOut",PIN_UNPIN_PRESS:"_pinUnpinPress",VISUAL_INDICATOR_MOUSE_OVER:"_visualIndicatorMouseOver",VISUAL_INDICATOR_MOUSE_OUT:"_visualIndicatorMouseOut",HEADER_VISUAL_INDICATOR_PRESS:"_headerVisualIndicatorPress",TITLE_VISUAL_INDICATOR_PRESS:"_titleVisualIndicatorPress"};E.MEDIA={PHONE:"sapFDynamicPage-Std-Phone",TABLET:"sapFDynamicPage-Std-Tablet",DESKTOP:"sapFDynamicPage-Std-Desktop",DESKTOP_XL:"sapFDynamicPage-Std-Desktop-XL"};E.RESIZE_HANDLER_ID={PAGE:"_sResizeHandlerId",TITLE:"_sTitleResizeHandlerId",HEADER:"_sHeaderResizeHandlerId",CONTENT:"_sContentResizeHandlerId"};E.DIV="div";E.HEADER="header";E.FOOTER="footer";E.SHOW_FOOTER_CLASS_NAME="sapFDynamicPageActualFooterControlShow";E.HIDE_FOOTER_CLASS_NAME="sapFDynamicPageActualFooterControlHide";E.NAVIGATION_CLASS_NAME="sapFDynamicPageNavigation";E.ARIA_ROLE_DESCRIPTION="DYNAMIC_PAGE_ROLE_DESCRIPTION";E.prototype.init=function(){this._bPinned=false;this._bHeaderInTitleArea=false;this._bExpandingWithAClick=false;this._bSuppressToggleHeaderOnce=false;this._headerBiggerThanAllowedHeight=false;this._oStickySubheader=null;this._bStickySubheaderInTitleArea=false;this._bMSBrowser=h.browser.internet_explorer||h.browser.edge||false;this._oScrollHelper=new l(this,this.getId()+"-content",{horizontal:false,vertical:true});this._oScrollHelper.setOnAfterScrollToElement(this._onAfterScrollToElement.bind(this));this._oStickyHeaderObserver=null;this._oHeaderObserver=null;this._oSubHeaderAfterRenderingDelegate={onAfterRendering:function(){this._bStickySubheaderInTitleArea=false;this._adjustStickyContent()}};this._setAriaRoleDescription(i.getLibraryResourceBundle("sap.f").getText(E.ARIA_ROLE_DESCRIPTION));this._iHeaderContentPaddingBottom=S.toPx(f.get("_sap_f_DynamicPageHeader_PaddingBottom"))};E.prototype.onBeforeRendering=function(){if(!this._preserveHeaderStateOnScroll()){this._attachPinPressHandler()}this._attachTitlePressHandler();this._attachVisualIndicatorsPressHandlers();if(h.system.desktop){this._attachVisualIndicatorMouseOverHandlers();this._attachTitleMouseOverHandlers()}this._attachHeaderObserver();this._addStickySubheaderAfterRenderingDelegate();this._detachScrollHandler();this._detachResizeHandlers();this._toggleAdditionalNavigationClass()};E.prototype.onAfterRendering=function(){var e,t;if(this._preserveHeaderStateOnScroll()){setTimeout(this._overridePreserveHeaderStateOnScroll.bind(this),0)}this._bPinned=false;this._cacheDomElements();this._attachResizeHandlers();this._updateMedia(this._getWidth(this));this._attachScrollHandler();this._updateScrollBar();this._attachPageChildrenAfterRenderingDelegates();this._resetPinButtonState();if(!this.getHeaderExpanded()){this._snapHeader(false);e=this.getHeader()&&!this.getPreserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();if(e){t=this._getScrollBar().getScrollPosition();this._setScrollPosition(t?t:this._getSnappingHeight())}else{this._toggleHeaderVisibility(false);this._moveHeaderToTitleArea()}}this._updateToggleHeaderVisualIndicators();this._updateTitleVisualState()};E.prototype.exit=function(){this._detachResizeHandlers();if(this._oScrollHelper){this._oScrollHelper.destroy()}if(this._oStickyHeaderObserver){this._oStickyHeaderObserver.disconnect()}if(this._oHeaderObserver){this._oHeaderObserver.disconnect()}if(this._oStickySubheader){this._oStickySubheader.removeEventDelegate(this._oSubHeaderAfterRenderingDelegate)}};E.prototype.setShowFooter=function(e){var t=this.setProperty("showFooter",e,true);this._toggleFooter(e);return t};E.prototype.setHeader=function(e){var t=this.getHeader();if(e===t){return this}if(t){if(this._oStickyHeaderObserver){this._oStickyHeaderObserver.disconnect()}if(this._oHeaderObserver){this._oHeaderObserver.disconnect()}this._deRegisterResizeHandler(E.RESIZE_HANDLER_ID.HEADER);t.detachEvent(E.EVENTS.PIN_UNPIN_PRESS,this._onPinUnpinButtonPress);this._bAlreadyAttachedPinPressHandler=false;t.detachEvent(E.EVENTS.HEADER_VISUAL_INDICATOR_PRESS,this._onCollapseHeaderVisualIndicatorPress);this._bAlreadyAttachedHeaderIndicatorPressHandler=false;t.detachEvent(E.EVENTS.VISUAL_INDICATOR_MOUSE_OVER,this._onVisualIndicatorMouseOver);t.detachEvent(E.EVENTS.VISUAL_INDICATOR_MOUSE_OUT,this._onVisualIndicatorMouseOut);this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler=false;this._bAlreadyAttachedStickyHeaderObserver=false;this._bAlreadyAttachedHeaderObserver=false}this.setAggregation("header",e);return this};E.prototype.setStickySubheaderProvider=function(e){var t,r=this.getStickySubheaderProvider();if(e===r){return this}t=i.byId(r);if(this._oStickySubheader&&t){t._returnStickyContent();t._setStickySubheaderSticked(false);this._oStickySubheader.removeEventDelegate(this._oSubHeaderAfterRenderingDelegate);this._bAlreadyAddedStickySubheaderAfterRenderingDelegate=false;this._oStickySubheader=null}this.setAssociation("stickySubheaderProvider",e);return this};E.prototype.setHeaderExpanded=function(e){e=this.validateProperty("headerExpanded",e);if(this._bPinned){return this}if(this.getHeaderExpanded()===e){return this}if(this.getDomRef()){this._titleExpandCollapseWhenAllowed()}this.setProperty("headerExpanded",e,true);return this};E.prototype.setToggleHeaderOnTitleClick=function(e){var t=this.getHeaderExpanded(),i=this.setProperty("toggleHeaderOnTitleClick",e,true);e=this.getProperty("toggleHeaderOnTitleClick");this._updateTitleVisualState();this._updateToggleHeaderVisualIndicators();this._updateARIAStates(t);return i};E.prototype.setFitContent=function(e){var t=this.setProperty("fitContent",e,true);if(A(this.$())){this._updateFitContainer()}return t};E.prototype.getScrollDelegate=function(){return this._oScrollHelper};E.prototype._onAfterScrollToElement=function(){var e=this.$wrapper.scrollTop(),t=this._bStickySubheaderInTitleArea;this._toggleHeaderOnScroll();if(this._bStickySubheaderInTitleArea&&!t&&this.$wrapper.scrollTop()===e){this.$wrapper.scrollTop(e-this._getHeight(this._oStickySubheader))}};E.prototype._overridePreserveHeaderStateOnScroll=function(){if(!this._shouldOverridePreserveHeaderStateOnScroll()){this._headerBiggerThanAllowedHeight=false;return}this._headerBiggerThanAllowedHeight=true;if(this.getHeaderExpanded()){this._moveHeaderToContentArea()}else{this._adjustSnap()}this._updateScrollBar()};E.prototype._shouldOverridePreserveHeaderStateOnScroll=function(){return this._headerBiggerThanAllowedToBeFixed()&&this._preserveHeaderStateOnScroll()};E.prototype._toggleFooter=function(e){var t=this.getFooter(),r,a;if(!A(this.$())||!A(t)||!A(this.$footerWrapper)){return}a=i.getConfiguration().getAnimationMode();r=a!==o.AnimationMode.none&&a!==o.AnimationMode.minimal;if(A(this.$contentFitContainer)){this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainerFooterVisible",e)}if(r){this._toggleFooterAnimation(e,t)}else{this.$footerWrapper.toggleClass("sapUiHidden",!e)}this._updateScrollBar()};E.prototype._toggleFooterAnimation=function(e,t){this.$footerWrapper.on("webkitAnimationEnd animationend",this._onToggleFooterAnimationEnd.bind(this,t));if(e){this.$footerWrapper.removeClass("sapUiHidden")}t.toggleStyleClass(E.SHOW_FOOTER_CLASS_NAME,e);t.toggleStyleClass(E.HIDE_FOOTER_CLASS_NAME,!e)};E.prototype._onToggleFooterAnimationEnd=function(e){this.$footerWrapper.off("webkitAnimationEnd animationend");if(e.hasStyleClass(E.HIDE_FOOTER_CLASS_NAME)){this.$footerWrapper.addClass("sapUiHidden");e.removeStyleClass(E.HIDE_FOOTER_CLASS_NAME)}else{e.removeStyleClass(E.SHOW_FOOTER_CLASS_NAME)}};E.prototype._toggleHeaderInTabChain=function(e){var t=this.getTitle(),i=this.getHeader();if(!A(t)||!A(i)){return}i.$().css("visibility",e?"visible":"hidden")};E.prototype._snapHeader=function(e,t){var i=this.getTitle();if(this._bPinned&&!t){c.debug("DynamicPage :: aborted snapping, header is pinned",this);return}c.debug("DynamicPage :: snapped header",this);if(this._bPinned&&t){this._unPin();this._togglePinButtonPressedState(false)}if(A(i)){i._toggleState(false,t);if(e&&this._bHeaderInTitleArea){this._moveHeaderToContentArea(true)}}if(!A(this.$titleArea)){c.warning("DynamicPage :: couldn't snap header. There's no title.",this);return}this.setProperty("headerExpanded",false,true);if(this._hasVisibleTitleAndHeader()){this.$titleArea.addClass(h.system.phone&&i.getSnappedTitleOnMobile()?"sapFDynamicPageTitleSnappedTitleOnMobile":"sapFDynamicPageTitleSnapped");this._updateToggleHeaderVisualIndicators();this._togglePinButtonVisibility(false)}this._toggleHeaderInTabChain(false);this._updateARIAStates(false)};E.prototype._expandHeader=function(e,t){var i=this.getTitle();c.debug("DynamicPage :: expand header",this);if(A(i)){i._toggleState(true,t);if(e){this._moveHeaderToTitleArea(true)}}if(!A(this.$titleArea)){c.warning("DynamicPage :: couldn't expand header. There's no title.",this);return}this.setProperty("headerExpanded",true,true);if(this._hasVisibleTitleAndHeader()){this.$titleArea.removeClass(h.system.phone&&i.getSnappedTitleOnMobile()?"sapFDynamicPageTitleSnappedTitleOnMobile":"sapFDynamicPageTitleSnapped");this._updateToggleHeaderVisualIndicators();if(!this.getPreserveHeaderStateOnScroll()&&!this._headerBiggerThanAllowedToPin()){this._togglePinButtonVisibility(true)}}this._toggleHeaderInTabChain(true);this._updateARIAStates(true)};E.prototype._toggleHeaderVisibility=function(e,t){var i=this.getHeaderExpanded(),r=this.getTitle(),a=this.getHeader();if(this._bPinned&&!t){c.debug("DynamicPage :: header toggle aborted, header is pinned",this);return}if(A(r)){r._toggleState(i)}if(A(a)){a.$().toggleClass("sapFDynamicPageHeaderHidden",!e);this._updateScrollBar()}};E.prototype._moveHeaderToContentArea=function(e){var t=this.getHeader();if(A(t)){t.$().prependTo(this.$wrapper);this._bHeaderInTitleArea=false;if(e){this._offsetContentOnMoveHeader()}this.fireEvent("_moveHeader")}};E.prototype._moveHeaderToTitleArea=function(e){var t=this.getHeader();if(A(t)){t.$().prependTo(this.$stickyPlaceholder);this._bHeaderInTitleArea=true;if(e){this._offsetContentOnMoveHeader()}this.fireEvent("_moveHeader")}};E.prototype._offsetContentOnMoveHeader=function(){var e=Math.ceil(this._getHeaderHeight()),t=this._getScrollPosition(),i=this._getScrollBar().getScrollPosition(),r;if(!e){return}if(!t&&i){r=this._getScrollBar().getScrollPosition()}else{r=this._bHeaderInTitleArea?t-e:t+e}r=Math.max(r,0);this._setScrollPosition(r,true)};E.prototype._pin=function(){var e=this.$();if(this._bPinned){return}this._bPinned=true;if(!this._bHeaderInTitleArea){this._moveHeaderToTitleArea(true);this._updateScrollBar()}this._updateToggleHeaderVisualIndicators();if(A(e)){e.addClass("sapFDynamicPageHeaderPinned")}};E.prototype._unPin=function(){var e=this.$();if(!this._bPinned){return}this._bPinned=false;this._updateToggleHeaderVisualIndicators();if(A(e)){e.removeClass("sapFDynamicPageHeaderPinned")}};E.prototype._togglePinButtonVisibility=function(e){var t=this.getHeader();if(A(t)){t._setShowPinBtn(e)}};E.prototype._togglePinButtonPressedState=function(e){var t=this.getHeader();if(A(t)){t._togglePinButton(e)}};E.prototype._resetPinButtonState=function(){if(this._preserveHeaderStateOnScroll()){this._togglePinButtonVisibility(false)}else{this._togglePinButtonPressedState(false)}};E.prototype._restorePinButtonFocus=function(){this.getHeader()._focusPinButton()};E.prototype._getScrollPosition=function(){return A(this.$wrapper)?Math.ceil(this.$wrapper.scrollTop()):0};E.prototype._setAriaRoleDescription=function(e){this._sAriaRoleDescription=e;return this};E.prototype._getAriaRoleDescription=function(){return this._sAriaRoleDescription};E.prototype._setScrollPosition=function(e,t){if(!A(this.$wrapper)){return}if(this._getScrollPosition()===e){return}if(t){this._bSuppressToggleHeaderOnce=true}if(!this.getScrollDelegate()._$Container){this.getScrollDelegate()._$Container=this.$wrapper}this.getScrollDelegate().scrollTo(0,e)};E.prototype._shouldSnapOnScroll=function(){return!this._preserveHeaderStateOnScroll()&&this._getScrollPosition()>=this._getSnappingHeight()&&this.getHeaderExpanded()&&!this._bPinned};E.prototype._shouldExpandOnScroll=function(){var e=this._needsVerticalScrollBar();return!this._preserveHeaderStateOnScroll()&&this._getScrollPosition()<this._getSnappingHeight()&&!this.getHeaderExpanded()&&!this._bPinned&&e};E.prototype._shouldStickStickyContent=function(){var e,t,i;i=this._getScrollPosition();e=i<this._getSnappingHeight()&&!this._bPinned&&!this.getPreserveHeaderStateOnScroll();t=i===0||e&&this._hasVisibleHeader();return!t};E.prototype._headerScrolledOut=function(){return this._getScrollPosition()>=this._getSnappingHeight()};E.prototype._headerSnapAllowed=function(){return!this._preserveHeaderStateOnScroll()&&this.getHeaderExpanded()&&!this._bPinned};E.prototype._canSnapHeaderOnScroll=function(){var e=this._getMaxScrollPosition(),t=this._bMSBrowser?1:0;if(this._bHeaderInTitleArea&&e>0){e+=this._getHeaderHeight();e-=t}return e>this._getSnappingHeight()};E.prototype._getSnappingHeight=function(){var e=this.getTitle(),t=e&&e.$expandWrapper,i=e&&e.$snappedWrapper,r=e&&e.$expandHeadingWrapper,a=e&&e.$snappedHeadingWrapper,s=t&&t.length?t.height():0,n=a&&a.length?a.height():0,o=r&&r.length?r.height():0,l=i&&i.length?i.height():0,h=Math.ceil(this._getHeaderHeight()||s+l+n+o)-this._iHeaderContentPaddingBottom;return h>0?h:0};E.prototype._getMaxScrollPosition=function(){var e;if(A(this.$wrapper)){e=this.$wrapper[0];return e.scrollHeight-e.clientHeight}return 0};E.prototype._needsVerticalScrollBar=function(){var e=this._bMSBrowser?1:0;return this._getMaxScrollPosition()>e};E.prototype._getOwnHeight=function(){return this._getHeight(this)};E.prototype._getEntireHeaderHeight=function(){var e=0,t=0,i=this.getTitle(),r=this.getHeader();if(A(i)){e=i.$().outerHeight()}if(A(r)){t=r.$().outerHeight()}return e+t};E.prototype._headerBiggerThanAllowedToPin=function(e){if(!(typeof e==="number"&&!isNaN(parseInt(e)))){e=this._getOwnHeight()}return this._getEntireHeaderHeight()>E.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE*e};E.prototype._headerBiggerThanAllowedToBeFixed=function(){var e=this._getOwnHeight();return this._getEntireHeaderHeight()>E.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE*e};E.prototype._headerBiggerThanAllowedToBeExpandedInTitleArea=function(){var e=this._getEntireHeaderHeight(),t=this._getOwnHeight();if(t===0){return false}return h.system.phone?e>=E.HEADER_MAX_ALLOWED_NON_SROLLABLE_ON_MOBILE*t:e>=t};E.prototype._measureScrollBarOffsetHeight=function(){var e=0,t=!this.getHeaderExpanded(),i=this._bHeaderInTitleArea;if(this._preserveHeaderStateOnScroll()||this._bPinned||!t&&this._bHeaderInTitleArea){e=this._getTitleAreaHeight();c.debug("DynamicPage :: preserveHeaderState is enabled or header pinned :: title area height"+e,this);return e}if(t||!A(this.getTitle())||!this._canSnapHeaderOnScroll()){e=this._getTitleHeight();c.debug("DynamicPage :: header snapped :: title height "+e,this);return e}this._snapHeader(true);e=this._getTitleHeight();if(!t){this._expandHeader(i)}c.debug("DynamicPage :: snapped mode :: title height "+e,this);return e};E.prototype._updateScrollBar=function(){var e,t,i;if(!A(this.$wrapper)||this._getHeight(this)===0){return}if(!h.system.desktop){setTimeout(this._updateFitContainer.bind(this),0);return}e=this._getScrollBar();e.setContentSize(this._measureScrollBarOffsetHeight()+this.$wrapper[0].scrollHeight+"px");t=this._needsVerticalScrollBar();i=this.bHasScrollbar!==t;if(i){e.toggleStyleClass("sapUiHidden",!t);this.toggleStyleClass("sapFDynamicPageWithScroll",t);this.bHasScrollbar=t}setTimeout(this._updateFitContainer.bind(this),0);setTimeout(this._updateScrollBarOffset.bind(this),0)};E.prototype._updateFitContainer=function(e){var t=typeof e!=="undefined"?!e:!this._needsVerticalScrollBar(),i=this.getFitContent(),r=i||t;this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainer",r)};E.prototype._updateScrollBarOffset=function(){var e=i.getConfiguration().getRTL()?"left":"right",t=this._needsVerticalScrollBar()?u().width+"px":0,r=this.getFooter();this.$titleArea.css("padding-"+e,t);if(A(r)){r.$().css(e,t)}};E.prototype._updateHeaderARIAState=function(e){var t=this.getHeader();if(A(t)){t._updateARIAState(e)}};E.prototype._updateTitleARIAState=function(e){var t=this.getTitle();if(A(t)){t._updateARIAState(e)}};E.prototype._updateARIAStates=function(e){this._updateHeaderARIAState(e);this._updateTitleARIAState(e)};E.prototype._applyContextualSettings=function(e){var t=e.contextualWidth;this._updateMedia(t);return d.prototype._applyContextualSettings.call(this,e)};E.prototype._updateMedia=function(e){if(!e){return}if(e<=E.BREAK_POINTS.PHONE){this._updateMediaStyle(E.MEDIA.PHONE)}else if(e<=E.BREAK_POINTS.TABLET){this._updateMediaStyle(E.MEDIA.TABLET)}else if(e<=E.BREAK_POINTS.DESKTOP){this._updateMediaStyle(E.MEDIA.DESKTOP)}else{this._updateMediaStyle(E.MEDIA.DESKTOP_XL)}};E.prototype._updateMediaStyle=function(e){Object.keys(E.MEDIA).forEach(function(t){var i=e===E.MEDIA[t];this.toggleStyleClass(E.MEDIA[t],i)},this)};E.prototype._toggleExpandVisualIndicator=function(e){var t=this.getTitle();if(A(t)){t._toggleExpandButton(e)}};E.prototype._focusExpandVisualIndicator=function(){var e=this.getTitle();if(A(e)){e._focusExpandButton()}};E.prototype._toggleCollapseVisualIndicator=function(e){var t=this.getHeader();if(A(t)){t._toggleCollapseButton(e)}};E.prototype._focusCollapseVisualIndicator=function(){var e=this.getHeader();if(A(e)){e._focusCollapseButton()}};E.prototype._updateToggleHeaderVisualIndicators=function(){var e,t,i,r=this._hasVisibleTitleAndHeader(),a=this.getHeader(),s=false;if(A(a)){s=!!a.getContent().length}if(!this.getToggleHeaderOnTitleClick()||!r){t=false;i=false}else{e=this.getHeaderExpanded();t=e;i=h.system.phone&&this.getTitle().getAggregation("snappedTitleOnMobile")?false:!e}i=i&&s;t=t&&s;this._toggleCollapseVisualIndicator(t);this._toggleExpandVisualIndicator(i);this._updateTitleVisualState()};E.prototype._updateHeaderVisualState=function(e,t){var i=this.getHeader();if(e&&this.getPreserveHeaderStateOnScroll()){this._overridePreserveHeaderStateOnScroll()}if(!this._preserveHeaderStateOnScroll()&&i){if(this._headerBiggerThanAllowedToPin(t)||h.system.phone){this._unPin();this._togglePinButtonVisibility(false);this._togglePinButtonPressedState(false)}else{this._togglePinButtonVisibility(true)}if(this.getHeaderExpanded()&&this._bHeaderInTitleArea&&this._headerBiggerThanAllowedToBeExpandedInTitleArea()){this._expandHeader(false);this._setScrollPosition(0)}}};E.prototype._updateTitleVisualState=function(){var e=this.getTitle(),t=this._hasVisibleTitleAndHeader()&&this.getToggleHeaderOnTitleClick();this.$().toggleClass("sapFDynamicPageTitleClickEnabled",t&&!h.system.phone);if(A(e)){e._toggleFocusableState(t)}};E.prototype._scrollBellowCollapseVisualIndicator=function(){var e=this.getHeader(),t,i,r,a;if(A(e)){t=this.getHeader()._getCollapseButton().getDomRef();i=t.getBoundingClientRect().height;r=this.$wrapper[0].getBoundingClientRect().height;a=t.offsetTop+i-r;this._setScrollPosition(a)}};E.prototype._hasVisibleTitleAndHeader=function(){var e=this.getTitle();return A(e)&&e.getVisible()&&this._hasVisibleHeader()};E.prototype._hasVisibleHeader=function(){var e=this.getHeader();return A(e)&&e.getVisible()&&A(e.getContent())};E.prototype._getHeight=function(e){var i;if(!(e instanceof t)){return 0}i=e.getDomRef();return i?i.getBoundingClientRect().height:0};E.prototype._getWidth=function(e){return!(e instanceof t)?0:e.$().outerWidth()||0};E.prototype._getTitleAreaHeight=function(){return A(this.$titleArea)?this.$titleArea.outerHeight()||0:0};E.prototype._getTitleHeight=function(){return this._getHeight(this.getTitle())};E.prototype._getHeaderHeight=function(){return this._getHeight(this.getHeader())};E.prototype._preserveHeaderStateOnScroll=function(){return this.getPreserveHeaderStateOnScroll()&&!this._headerBiggerThanAllowedHeight};E.prototype._getScrollBar=function(){if(!A(this.getAggregation("_scrollBar"))){var e=new r(this.getId()+"-vertSB",{scrollPosition:0,scroll:this._onScrollBarScroll.bind(this)});this.setAggregation("_scrollBar",e,true)}return this.getAggregation("_scrollBar")};E.prototype._cacheDomElements=function(){var e=this.getFooter();if(A(e)){this.$footer=e.$();this.$footerWrapper=this.$("footerWrapper")}this.$wrapper=this.$("contentWrapper");this.$contentFitContainer=this.$("contentFitContainer");this.$titleArea=this.$("header");this.$stickyPlaceholder=this.$("stickyPlaceholder");this._cacheTitleDom();this._cacheHeaderDom()};E.prototype._cacheTitleDom=function(){var e=this.getTitle();if(A(e)){this.$title=e.$()}};E.prototype._cacheHeaderDom=function(){var e=this.getHeader();if(A(e)){this.$header=e.$()}};E.prototype._adjustSnap=function(){var e,t,i,r,a,s,n=this.$();if(!A(n)){return}if(!T(n[0])){return}e=this.getHeader();t=!this.getHeaderExpanded();if(!e||!t){return}i=!this._preserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();r=t&&e.$().hasClass("sapFDynamicPageHeaderHidden");if(i&&r){this._toggleHeaderVisibility(true);this._moveHeaderToContentArea(true);return}if(!i&&!r){this._moveHeaderToTitleArea(true);this._toggleHeaderVisibility(false);return}if(i){a=this._getScrollPosition();s=this._getSnappingHeight();if(a<s){this._setScrollPosition(s)}}};E.prototype.ontouchmove=function(e){e.setMarked()};E.prototype._onChildControlAfterRendering=function(e){var t=e.srcControl;if(t instanceof p){this._cacheTitleDom();this._deRegisterResizeHandler(E.RESIZE_HANDLER_ID.TITLE);this._registerResizeHandler(E.RESIZE_HANDLER_ID.TITLE,this.$title[0],this._onChildControlsHeightChange.bind(this))}else if(t instanceof _&&t.getDomRef()!==this.$header.get(0)){this._cacheHeaderDom();this._deRegisterResizeHandler(E.RESIZE_HANDLER_ID.HEADER);this._registerResizeHandler(E.RESIZE_HANDLER_ID.HEADER,this.$header[0],this._onChildControlsHeightChange.bind(this))}setTimeout(this._updateScrollBar.bind(this),0)};E.prototype._onChildControlsHeightChange=function(e){var t=this._needsVerticalScrollBar(),i=this.getHeader(),r,a;if(t){this._updateFitContainer(t)}this._adjustSnap();if(!this._bExpandingWithAClick){this._updateScrollBar()}this._bExpandingWithAClick=false;if(i&&e.target.id===i.getId()){r=e.size.height;a=e.oldSize.height;this._updateHeaderVisualState(r!==a&&r!==0&&a!==0);this._adaptScrollPositionOnHeaderChange(r,a)}};E.prototype._onResize=function(e){var t=this.getTitle(),i=e.size.width,r=e.size.height,a=r!==e.oldSize.height;this._updateHeaderVisualState(a,r);if(A(t)){t._onResize(i)}this._adjustSnap();this._updateScrollBar();this._updateMedia(i)};E.prototype._onWrapperScroll=function(e){var t=Math.max(e.target.scrollTop,0);if(h.system.desktop){if(this.allowCustomScroll===true){this.allowCustomScroll=false;return}this.allowInnerDiv=true;this._getScrollBar().setScrollPosition(t);this.toggleStyleClass("sapFDynamicPageWithScroll",this._needsVerticalScrollBar())}};E.prototype._toggleHeaderOnScroll=function(){this._adjustStickyContent();if(this._bSuppressToggleHeaderOnce){this._bSuppressToggleHeaderOnce=false;return}if(h.system.desktop&&this._bExpandingWithAClick){return}if(this._preserveHeaderStateOnScroll()){return}if(this._shouldSnapOnScroll()){this._snapHeader(true,true)}else if(this._shouldExpandOnScroll()){this._expandHeader(false,true);this._toggleHeaderVisibility(true)}else if(!this._bPinned&&this._bHeaderInTitleArea){var e=this._getScrollPosition()>=this._getSnappingHeight();this._moveHeaderToContentArea(e)}};E.prototype._adjustStickyContent=function(){if(!this._oStickySubheader){return}var e,t=this._shouldStickStickyContent(),r,a=this.getStickySubheaderProvider();if(t===this._bStickySubheaderInTitleArea){return}r=i.byId(a);if(!A(r)){return}e=document.activeElement;r._setStickySubheaderSticked(t);if(t){this._oStickySubheader.$().appendTo(this.$stickyPlaceholder)}else{r._returnStickyContent()}e.focus();this._bStickySubheaderInTitleArea=t};E.prototype._onScrollBarScroll=function(){if(this.allowInnerDiv===true){this.allowInnerDiv=false;return}this.allowCustomScroll=true;this._setScrollPosition(this._getScrollBar().getScrollPosition())};E.prototype._adaptScrollPositionOnHeaderChange=function(e,t){var i=e-t,r=this.getHeader();if(i&&(!this.getHeaderExpanded()&&r.$().css("visibility")!=="hidden")&&!this._bHeaderInTitleArea&&this._needsVerticalScrollBar()){this._setScrollPosition(this._getScrollPosition()+i)}};E.prototype._onTitlePress=function(){if(this.getToggleHeaderOnTitleClick()&&this._hasVisibleTitleAndHeader()){this._titleExpandCollapseWhenAllowed(true);this.getTitle()._focus()}};E.prototype._onExpandHeaderVisualIndicatorPress=function(){this._onTitlePress();if(this._headerBiggerThanAllowedToBeExpandedInTitleArea()){this._scrollBellowCollapseVisualIndicator()}this._focusCollapseVisualIndicator()};E.prototype._onCollapseHeaderVisualIndicatorPress=function(){this._onTitlePress();this._focusExpandVisualIndicator()};E.prototype._onVisualIndicatorMouseOver=function(){var e=this.$();if(A(e)){e.addClass("sapFDynamicPageTitleForceHovered")}};E.prototype._onVisualIndicatorMouseOut=function(){var e=this.$();if(A(e)){e.removeClass("sapFDynamicPageTitleForceHovered")}};E.prototype._onTitleMouseOver=E.prototype._onVisualIndicatorMouseOver;E.prototype._onTitleMouseOut=E.prototype._onVisualIndicatorMouseOut;E.prototype._titleExpandCollapseWhenAllowed=function(e){var t,i;if(this._bPinned&&!e){return this}if(this._preserveHeaderStateOnScroll()||!this._canSnapHeaderOnScroll()||!this.getHeader()){if(!this.getHeaderExpanded()){this._expandHeader(false,e);this._toggleHeaderVisibility(true,e)}else{this._snapHeader(false,e);this._toggleHeaderVisibility(false,e)}}else if(!this.getHeaderExpanded()){t=!this._headerBiggerThanAllowedToBeExpandedInTitleArea();this._bExpandingWithAClick=true;this._expandHeader(t,e);this.getHeader().$().removeClass("sapFDynamicPageHeaderHidden");if(!t){this._setScrollPosition(0)}this._bExpandingWithAClick=false}else{var r=this._bHeaderInTitleArea;this._snapHeader(r,e);if(!r){i=this._getSnappingHeight();this._setScrollPosition(i?i+this._iHeaderContentPaddingBottom:0)}}};E.prototype._onPinUnpinButtonPress=function(){if(this._bPinned){this._unPin()}else{this._pin();this._restorePinButtonFocus()}};E.prototype._attachResizeHandlers=function(){var e=this._onChildControlsHeightChange.bind(this);this._registerResizeHandler(E.RESIZE_HANDLER_ID.PAGE,this,this._onResize.bind(this));if(A(this.$title)){this._registerResizeHandler(E.RESIZE_HANDLER_ID.TITLE,this.$title[0],e)}if(A(this.$header)){this._registerResizeHandler(E.RESIZE_HANDLER_ID.HEADER,this.$header[0],e)}if(A(this.$contentFitContainer)){this._registerResizeHandler(E.RESIZE_HANDLER_ID.CONTENT,this.$contentFitContainer[0],e)}};E.prototype._registerResizeHandler=function(e,t,i){if(!this[e]){this[e]=n.register(t,i)}};E.prototype._detachResizeHandlers=function(){this._deRegisterResizeHandler(E.RESIZE_HANDLER_ID.PAGE);this._deRegisterResizeHandler(E.RESIZE_HANDLER_ID.TITLE);this._deRegisterResizeHandler(E.RESIZE_HANDLER_ID.HEADER);this._deRegisterResizeHandler(E.RESIZE_HANDLER_ID.CONTENT)};E.prototype._deRegisterResizeHandler=function(e){if(this[e]){n.deregister(this[e]);this[e]=null}};E.prototype._attachPageChildrenAfterRenderingDelegates=function(){var e=this.getTitle(),t=this.getHeader(),i=this.getContent(),r={onAfterRendering:this._onChildControlAfterRendering.bind(this)};if(A(e)){e.addEventDelegate(r)}if(A(i)){i.addEventDelegate(r)}if(A(t)){t.addEventDelegate(r)}};E.prototype._attachTitlePressHandler=function(){var e=this.getTitle();if(A(e)&&!this._bAlreadyAttachedTitlePressHandler){e.attachEvent(E.EVENTS.TITLE_PRESS,this._onTitlePress,this);this._bAlreadyAttachedTitlePressHandler=true}};E.prototype._attachPinPressHandler=function(){var e=this.getHeader();if(A(e)&&!this._bAlreadyAttachedPinPressHandler){e.attachEvent(E.EVENTS.PIN_UNPIN_PRESS,this._onPinUnpinButtonPress,this);this._bAlreadyAttachedPinPressHandler=true}};E.prototype._attachStickyHeaderObserver=function(){var e=this.getHeader();if(A(e)&&!this._bAlreadyAttachedStickyHeaderObserver){if(!this._oStickyHeaderObserver){this._oStickyHeaderObserver=new s(this._adjustStickyContent.bind(this))}this._oStickyHeaderObserver.observe(e,{properties:["visible"]});this._bAlreadyAttachedStickyHeaderObserver=true}};E.prototype._attachHeaderObserver=function(){var e=this.getHeader();if(A(e)&&!this._bAlreadyAttachedHeaderObserver){if(!this._oHeaderObserver){this._oHeaderObserver=new s(this._updateToggleHeaderVisualIndicators.bind(this))}this._oHeaderObserver.observe(e,{aggregations:["content"],properties:["visible"]});this._bAlreadyAttachedHeaderObserver=true}};E.prototype._attachVisualIndicatorsPressHandlers=function(){var e=this.getTitle(),t=this.getHeader();if(A(e)&&!this._bAlreadyAttachedTitleIndicatorPressHandler){e.attachEvent(E.EVENTS.TITLE_VISUAL_INDICATOR_PRESS,this._onExpandHeaderVisualIndicatorPress,this);this._bAlreadyAttachedTitleIndicatorPressHandler=true}if(A(t)&&!this._bAlreadyAttachedHeaderIndicatorPressHandler){t.attachEvent(E.EVENTS.HEADER_VISUAL_INDICATOR_PRESS,this._onCollapseHeaderVisualIndicatorPress,this);this._bAlreadyAttachedHeaderIndicatorPressHandler=true}};E.prototype._addStickySubheaderAfterRenderingDelegate=function(){var e,t=this.getStickySubheaderProvider(),r;e=i.byId(t);if(A(e)&&!this._bAlreadyAddedStickySubheaderAfterRenderingDelegate){r=e.getMetadata().getInterfaces().indexOf("sap.f.IDynamicPageStickyContent")!==-1;if(r){this._oStickySubheader=e._getStickyContent();this._oStickySubheader.addEventDelegate(this._oSubHeaderAfterRenderingDelegate,this);this._bAlreadyAddedStickySubheaderAfterRenderingDelegate=true;this._attachStickyHeaderObserver()}}};E.prototype._attachVisualIndicatorMouseOverHandlers=function(){var e=this.getHeader();if(A(e)&&!this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler){e.attachEvent(E.EVENTS.VISUAL_INDICATOR_MOUSE_OVER,this._onVisualIndicatorMouseOver,this);e.attachEvent(E.EVENTS.VISUAL_INDICATOR_MOUSE_OUT,this._onVisualIndicatorMouseOut,this);this._bAlreadyAttachedVisualIndicatorMouseOverOutHandler=true}};E.prototype._attachTitleMouseOverHandlers=function(){var e=this.getTitle();if(A(e)&&!this._bAlreadyAttachedTitleMouseOverOutHandler){e.attachEvent(E.EVENTS.TITLE_MOUSE_OVER,this._onTitleMouseOver,this);e.attachEvent(E.EVENTS.TITLE_MOUSE_OUT,this._onTitleMouseOut,this);this._bAlreadyAttachedTitleMouseOverOutHandler=true}};E.prototype._attachScrollHandler=function(){this._onWrapperScrollReference=this._onWrapperScroll.bind(this);this._toggleHeaderOnScrollReference=this._toggleHeaderOnScroll.bind(this);this.$wrapper.on("scroll",this._onWrapperScrollReference);this.$wrapper.on("scroll",this._toggleHeaderOnScrollReference)};E.prototype._toggleAdditionalNavigationClass=function(){var e=this._bStickySubheaderProviderExists();this.toggleStyleClass(E.NAVIGATION_CLASS_NAME,e)};E.prototype._bStickySubheaderProviderExists=function(){var e=i.byId(this.getStickySubheaderProvider());return!!e&&e.isA("sap.f.IDynamicPageStickyContent")};E.prototype._detachScrollHandler=function(){if(this.$wrapper){this.$wrapper.off("scroll",this._onWrapperScrollReference);this.$wrapper.off("scroll",this._toggleHeaderOnScrollReference)}};E.prototype._formatLandmarkInfo=function(e,t){if(e){var i=e["get"+t+"Role"]()||"",r=e["get"+t+"Label"]()||"";if(i===b.None){i=""}return{role:i.toLowerCase(),label:r}}return{}};E.prototype._getHeaderTag=function(e){if(e&&e.getHeaderRole()!==b.None){return E.DIV}return E.HEADER};E.prototype._getFooterTag=function(e){if(e&&e.getFooterRole()!==b.None){return E.DIV}return E.FOOTER};return E});