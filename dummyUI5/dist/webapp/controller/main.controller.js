sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/MessageToast"],function(e,n,o){"use strict";return e.extend("dummyUI5.controller.main",{onInit:function(){},onListItemPress:function(e){o.show("Opening "+e.getSource().getTitle());var n=e.getSource().getTooltip();window.open(n,"_blank")}})});