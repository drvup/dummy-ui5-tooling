//@ui5-bundle sap/ui/table/library-preload.support.js
sap.ui.predefine('sap/ui/table/library.support', [
    './rules/Accessibility.support',
    './rules/Binding.support',
    './rules/ColumnTemplate.support',
    './rules/Plugins.support',
    './rules/Rows.support'
], function (AccessibilityRules, BindingRules, ColumnTemplateRules, PluginRules, RowRules) {
    'use strict';
    return {
        name: 'sap.ui.table',
        niceName: 'UI5 Table Library',
        ruleset: [
            AccessibilityRules,
            BindingRules,
            ColumnTemplateRules,
            PluginRules,
            RowRules
        ]
    };
}, true);
sap.ui.predefine('sap/ui/table/rules/Accessibility.support', [
    './TableHelper.support',
    'sap/ui/support/library',
    'sap/ui/core/library'
], function (SupportHelper, SupportLibrary, CoreLibrary) {
    'use strict';
    var Categories = SupportLibrary.Categories;
    var Severity = SupportLibrary.Severity;
    var MessageType = CoreLibrary.MessageType;
    var oAccessibleLabel = SupportHelper.normalizeRule({
        id: 'AccessibleLabel',
        minversion: '1.38',
        categories: [Categories.Accessibility],
        title: 'Accessible Label',
        description: 'Checks whether \'sap.ui.table.Table\' controls have an accessible label.',
        resolution: 'Use the \'title\' aggregation or the \'ariaLabelledBy\' association of the \'sap.ui.table.Table\' control ' + 'to define a proper accessible labeling.',
        check: function (oIssueManager, oCoreFacade, oScope) {
            var aTables = SupportHelper.find(oScope, true, 'sap.ui.table.Table');
            for (var i = 0; i < aTables.length; i++) {
                if (!aTables[i].getTitle() && aTables[i].getAriaLabelledBy().length == 0) {
                    SupportHelper.reportIssue(oIssueManager, 'The table does not have an accessible label.', Severity.High, aTables[i].getId());
                }
            }
        }
    });
    var oAccessibleRowHighlight = SupportHelper.normalizeRule({
        id: 'AccessibleRowHighlight',
        minversion: '1.62',
        categories: [Categories.Accessibility],
        title: 'Accessible Row Highlight',
        description: 'Checks whether the row highlights of the \'sap.ui.table.Table\' controls are accessible.',
        resolution: 'Use the \'highlightText\' property of the \'sap.ui.table.RowSettings\' to define the semantics of the row \'highlight\'.',
        resolutionurls: [
            SupportHelper.createDocuRef('API Reference: sap.ui.table.RowSettings#getHighlight', '#/api/sap.ui.table.RowSettings/methods/getHighlight'),
            SupportHelper.createDocuRef('API Reference: sap.ui.table.RowSettings#getHighlightText', '#/api/sap.ui.table.RowSettings/methods/getHighlightText')
        ],
        check: function (oIssueManager, oCoreFacade, oScope) {
            var aTables = SupportHelper.find(oScope, true, 'sap.ui.table.Table');
            function checkRowHighlight(oRow) {
                var oRowSettings = oRow.getAggregation('_settings');
                var sHighlight = oRowSettings ? oRowSettings.getHighlight() : null;
                var sHighlightText = oRowSettings ? oRowSettings.getHighlightText() : null;
                var sRowId = oRow.getId();
                if (oRowSettings && !(sHighlight in MessageType) && sHighlightText === '') {
                    SupportHelper.reportIssue(oIssueManager, 'The row of table \'' + oRow.getParent().getId() + '\' does not have a highlight text.', Severity.High, sRowId);
                }
            }
            for (var i = 0; i < aTables.length; i++) {
                aTables[i].getRows().forEach(checkRowHighlight);
            }
        }
    });
    return [
        oAccessibleLabel,
        oAccessibleRowHighlight
    ];
}, true);
sap.ui.predefine('sap/ui/table/rules/Binding.support', [
    './TableHelper.support',
    'sap/ui/support/library',
    'sap/base/Log'
], function (SupportHelper, SupportLibrary, Log) {
    'use strict';
    var Categories = SupportLibrary.Categories;
    var Severity = SupportLibrary.Severity;
    var oAnalyticsNoDeviatingUnits = SupportHelper.normalizeRule({
        id: 'AnalyticsNoDeviatingUnits',
        minversion: '1.38',
        categories: [Categories.Bindings],
        title: 'Analytical Binding reports \'No deviating units found...\'',
        description: 'The analytical service returns duplicate IDs. This could also lead to many requests, but the analytical service ' + 'expects to receive just one record',
        resolution: 'Adjust the service implementation.',
        check: function (oIssueManager, oCoreFacade, oScope) {
            var aTables = SupportHelper.find(oScope, true, 'sap.ui.table.AnalyticalTable');
            var sAnalyticalErrorId = 'NO_DEVIATING_UNITS';
            var oIssues = {};
            SupportHelper.checkLogEntries(function (oLogEntry) {
                if (oLogEntry.level != Log.Level.ERROR && oLogEntry.level != Log.Level.FATAL) {
                    return false;
                }
                var oInfo = oLogEntry.supportInfo;
                return oInfo && oInfo.type === 'sap.ui.model.analytics.AnalyticalBinding' && oInfo.analyticalError === sAnalyticalErrorId;
            }, function (oLogEntry) {
                var sBindingId = oLogEntry.supportInfo.analyticalBindingId;
                if (sBindingId && !oIssues[sAnalyticalErrorId + '-' + sBindingId]) {
                    var oBinding;
                    for (var i = 0; i < aTables.length; i++) {
                        oBinding = aTables[i].getBinding();
                        if (oBinding && oBinding.__supportUID === sBindingId) {
                            oIssues[sAnalyticalErrorId + '-' + sBindingId] = true;
                            SupportHelper.reportIssue(oIssueManager, 'Analytical Binding reports \'No deviating units found...\'', Severity.High, aTables[i].getId());
                        }
                    }
                }
            });
        }
    });
    return [oAnalyticsNoDeviatingUnits];
}, true);
sap.ui.predefine('sap/ui/table/rules/ColumnTemplate.support', [
    './TableHelper.support',
    'sap/ui/support/library'
], function (SupportHelper, SupportLibrary) {
    'use strict';
    var Categories = SupportLibrary.Categories;
    var Severity = SupportLibrary.Severity;
    function checkColumnTemplate(fnDoCheck, oScope, sType) {
        var aTables = SupportHelper.find(oScope, true, 'sap.ui.table.Table');
        var aColumns, oTemplate;
        for (var i = 0; i < aTables.length; i++) {
            aColumns = aTables[i].getColumns();
            for (var k = 0; k < aColumns.length; k++) {
                oTemplate = aColumns[k].getTemplate();
                if (oTemplate && oTemplate.isA(sType)) {
                    fnDoCheck(aTables[i], aColumns[k], oTemplate);
                }
            }
        }
    }
    var oTextWrapping = SupportHelper.normalizeRule({
        id: 'ColumnTemplateTextWrapping',
        minversion: '1.38',
        categories: [Categories.Usage],
        title: 'Column template validation - \'sap.m.Text\'',
        description: 'The \'wrapping\' and/or \'renderWhitespace\' property of the control \'sap.m.Text\' is set to \'true\' ' + 'although the control is used as a column template.',
        resolution: 'Set the \'wrapping\' and \'renderWhitespace\' property of the control \'sap.m.Text\' to \'false\' if the ' + 'control is used as a column template.',
        check: function (oIssueManager, oCoreFacade, oScope) {
            checkColumnTemplate(function (oTable, oColumn, oMTextTemplate) {
                var sColumnId = oColumn.getId();
                if (oMTextTemplate.isBound('wrapping') || !oMTextTemplate.isBound('wrapping') && oMTextTemplate.getWrapping()) {
                    SupportHelper.reportIssue(oIssueManager, 'Column \'' + sColumnId + '\' of table \'' + oTable.getId() + '\' uses an ' + '\'sap.m.Text\' control with wrapping enabled.', Severity.High, sColumnId);
                }
                if (oMTextTemplate.isBound('renderWhitespace') || !oMTextTemplate.isBound('renderWhitespace') && oMTextTemplate.getRenderWhitespace()) {
                    SupportHelper.reportIssue(oIssueManager, 'Column \'' + sColumnId + '\' of table \'' + oTable.getId() + '\' uses an ' + '\'sap.m.Text\' control with renderWhitespace enabled.', Severity.High, sColumnId);
                }
            }, oScope, 'sap.m.Text');
        }
    });
    var oLinkWrapping = SupportHelper.normalizeRule({
        id: 'ColumnTemplateLinkWrapping',
        minversion: '1.38',
        categories: [Categories.Usage],
        title: 'Column template validation - \'sap.m.Link\'',
        description: 'The \'wrapping\' property of the control \'sap.m.Link\' is set to \'true\' although the control is used as a column template.',
        resolution: 'Set the \'wrapping\' property of the control \'sap.m.Link\' to \'false\' if the control is used as a column template.',
        check: function (oIssueManager, oCoreFacade, oScope) {
            checkColumnTemplate(function (oTable, oColumn, oMLinkTemplate) {
                if (oMLinkTemplate.isBound('wrapping') || !oMLinkTemplate.isBound('wrapping') && oMLinkTemplate.getWrapping()) {
                    var sColumnId = oColumn.getId();
                    SupportHelper.reportIssue(oIssueManager, 'Column \'' + sColumnId + '\' of table \'' + oTable.getId() + '\' uses an ' + '\'sap.m.Link\' control with wrapping enabled.', Severity.High, sColumnId);
                }
            }, oScope, 'sap.m.Link');
        }
    });
    return [
        oTextWrapping,
        oLinkWrapping
    ];
}, true);
sap.ui.predefine('sap/ui/table/rules/Plugins.support', [
    './TableHelper.support',
    'sap/ui/support/library'
], function (SupportHelper, SupportLibrary) {
    'use strict';
    var Categories = SupportLibrary.Categories;
    var Severity = SupportLibrary.Severity;
    var oPlugins = SupportHelper.normalizeRule({
        id: 'Plugins',
        minversion: '1.64',
        categories: [Categories.Usage],
        title: 'Plugins validation',
        description: 'Checks the number and type of plugins which are applied to the table. Only one MultiSelectionPlugin can be applied. ' + 'No other plugins are allowed.',
        resolution: 'Check if multiple MultiSelectionPlugins are applied, or a plugin of another type is applied to the table.',
        check: function (oIssueManager, oCoreFacade, oScope) {
            var aTables = SupportHelper.find(oScope, true, 'sap.ui.table.Table');
            for (var i = 0; i < aTables.length; i++) {
                var oTable = aTables[i];
                var aPlugins = oTable.getPlugins();
                if (aPlugins.length > 1) {
                    SupportHelper.reportIssue(oIssueManager, 'Only one plugin can be applied to the table', Severity.High, oTable.getId());
                } else if (aPlugins.length == 1) {
                    var oPlugin = aPlugins[0];
                    if (!oPlugin.isA('sap.ui.table.plugins.MultiSelectionPlugin')) {
                        SupportHelper.reportIssue(oIssueManager, 'Only one MultiSelectionPlugin can be applied to the table', Severity.High, oTable.getId());
                    }
                }
            }
        }
    });
    return [oPlugins];
}, true);
sap.ui.predefine('sap/ui/table/rules/Rows.support', [
    './TableHelper.support',
    'sap/ui/support/library',
    'sap/ui/Device'
], function (SupportHelper, SupportLibrary, Device) {
    'use strict';
    var Categories = SupportLibrary.Categories;
    var Severity = SupportLibrary.Severity;
    function checkDensity($Source, sTargetClass, sMessage, oIssueManager) {
        var bFound = false;
        $Source.each(function () {
            if (jQuery(this).closest(sTargetClass).length) {
                bFound = true;
            }
        });
        if (bFound && sMessage) {
            SupportHelper.reportIssue(oIssueManager, sMessage, Severity.High);
        }
        return bFound;
    }
    var oContentDensity = SupportHelper.normalizeRule({
        id: 'ContentDensity',
        minversion: '1.38',
        categories: [Categories.Usage],
        title: 'Content Density Usage',
        description: 'Checks whether the content densities \'Cozy\', \'Compact\' and \'Condensed\' are used correctly.',
        resolution: 'Ensure that either only the \'Cozy\' or \'Compact\' content density is used, or the \'Condensed\' and \'Compact\' content densities' + ' are used in combination.',
        resolutionurls: [SupportHelper.createDocuRef('Documentation: Content Densities', '#docs/guide/e54f729da8e3405fae5e4fe8ae7784c1.html')],
        check: function (oIssueManager, oCoreFacade, oScope) {
            var $Document = jQuery('html');
            var $Cozy = $Document.find('.sapUiSizeCozy');
            var $Compact = $Document.find('.sapUiSizeCompact');
            var $Condensed = $Document.find('.sapUiSizeCondensed');
            checkDensity($Compact, '.sapUiSizeCozy', '\'Compact\' content density is used within \'Cozy\' area.', oIssueManager);
            checkDensity($Cozy, '.sapUiSizeCompact', '\'Cozy\' content density is used within \'Compact\' area.', oIssueManager);
            checkDensity($Condensed, '.sapUiSizeCozy', '\'Condensed\' content density is used within \'Cozy\' area.', oIssueManager);
            checkDensity($Cozy, '.sapUiSizeCondensed', '\'Cozy\' content density is used within \'Condensed\' area.', oIssueManager);
            if ($Condensed.length > 0) {
                var bFound = checkDensity($Condensed, '.sapUiSizeCompact', oIssueManager);
                if (!bFound) {
                    SupportHelper.reportIssue(oIssueManager, '\'Condensed\' content density must be used in combination with \'Compact\'.', Severity.High);
                }
            }
            if (sap.ui.getCore().getLoadedLibraries()['sap.m'] && $Cozy.length === 0 && $Compact.length === 0 && $Condensed.length === 0) {
                SupportHelper.reportIssue(oIssueManager, 'If the sap.ui.table and the sap.m libraries are used together, a content density must be specified.', Severity.High);
            }
        }
    });
    var oRowHeights = SupportHelper.normalizeRule({
        id: 'RowHeights',
        minversion: '1.38',
        categories: [Categories.Usage],
        title: 'Row heights',
        description: 'Checks whether the currently rendered rows have the expected height.',
        resolution: 'Check whether content densities are correctly used, and only the supported controls are used as column templates, with their' + ' wrapping property set to "false"',
        resolutionurls: [
            SupportHelper.createDocuRef('Documentation: Content Densities', '#/topic/e54f729da8e3405fae5e4fe8ae7784c1'),
            SupportHelper.createDocuRef('Documentation: Supported controls', '#/topic/148892ff9aea4a18b912829791e38f3e'),
            SupportHelper.createDocuRef('API Reference: sap.ui.table.Column#getTemplate', '#/api/sap.ui.table.Column/methods/getTemplate'),
            SupportHelper.createFioriGuidelineResolutionEntry()
        ],
        check: function (oIssueManager, oCoreFacade, oScope) {
            var aTables = SupportHelper.find(oScope, true, 'sap.ui.table.Table');
            var bIsZoomedInChrome = Device.browser.chrome && window.devicePixelRatio != 1;
            for (var i = 0; i < aTables.length; i++) {
                var aVisibleRows = aTables[i].getRows();
                var iExpectedRowHeight = aTables[i]._getBaseRowHeight();
                var bUnexpectedRowHeightDetected = false;
                for (var j = 0; j < aVisibleRows.length; j++) {
                    var oRowElement = aVisibleRows[j].getDomRef();
                    var oRowElementFixedPart = aVisibleRows[j].getDomRef('fixed');
                    if (oRowElement) {
                        var nActualRowHeight = oRowElement.getBoundingClientRect().height;
                        var nActualRowHeightFixedPart = oRowElementFixedPart ? oRowElementFixedPart.getBoundingClientRect().height : null;
                        var nHeightToReport = nActualRowHeight;
                        if (bIsZoomedInChrome) {
                            var nHeightDeviation = Math.abs(iExpectedRowHeight - nActualRowHeight);
                            var nHeightDeviationFixedPart = Math.abs(nActualRowHeightFixedPart - nActualRowHeight);
                            if (nHeightDeviation > 1) {
                                bUnexpectedRowHeightDetected = true;
                            } else if (nActualRowHeightFixedPart != null && nHeightDeviationFixedPart > 1) {
                                bUnexpectedRowHeightDetected = true;
                                nHeightToReport = nActualRowHeightFixedPart;
                            }
                        } else if (nActualRowHeight !== iExpectedRowHeight) {
                            bUnexpectedRowHeightDetected = true;
                        } else if (nActualRowHeightFixedPart != null && nActualRowHeightFixedPart !== iExpectedRowHeight) {
                            bUnexpectedRowHeightDetected = true;
                            nHeightToReport = nActualRowHeightFixedPart;
                        }
                        if (bUnexpectedRowHeightDetected) {
                            SupportHelper.reportIssue(oIssueManager, 'The row height was expected to be ' + iExpectedRowHeight + 'px, but was ' + nHeightToReport + 'px instead.' + ' This causes issues with vertical scrolling.', Severity.High, aVisibleRows[j].getId());
                            break;
                        }
                    }
                }
            }
        }
    });
    var oDynamicPageConfoguration = SupportHelper.normalizeRule({
        id: 'DynamicPageConfiguration',
        minversion: '1.38',
        categories: [Categories.Usage],
        title: 'Table environment validation - \'sap.f.DynamicPage\'',
        description: 'Verifies that the DynamicPage is configured correctly from the table\'s perspective.',
        resolution: 'If a table with visibleRowCountMode=Auto is placed inside a sap.f.DynamicPage, the fitContent property of the DynamicPage' + ' should be set to true, otherwise false.',
        resolutionurls: [SupportHelper.createDocuRef('API Reference: sap.f.DynamicPage#getFitContent', '#/api/sap.f.DynamicPage/methods/getFitContent')],
        check: function (oIssueManager, oCoreFacade, oScope) {
            var aTables = SupportHelper.find(oScope, true, 'sap.ui.table.Table');
            function checkAllParentDynamicPages(oControl, fnCheck) {
                if (oControl) {
                    if (oControl.isA('sap.f.DynamicPage')) {
                        fnCheck(oControl);
                    }
                    checkAllParentDynamicPages(oControl.getParent(), fnCheck);
                }
            }
            function checkConfiguration(oTable, oDynamicPage) {
                if (oTable._getRowMode().isA('sap.ui.table.rowmodes.AutoRowMode') && !oDynamicPage.getFitContent()) {
                    SupportHelper.reportIssue(oIssueManager, 'A table with an auto row mode is placed inside a sap.f.DynamicPage with fitContent="false"', Severity.High, oTable.getId());
                } else if ((oTable._getRowMode().isA('sap.ui.table.rowmodes.FixedRowMode') || oTable._getRowMode().isA('sap.ui.table.rowmodes.InteractiveRowMode')) && oDynamicPage.getFitContent()) {
                    SupportHelper.reportIssue(oIssueManager, 'A table with a fixed or interactive row mode is placed inside a sap.f.DynamicPage with fitContent="true"', Severity.Low, oTable.getId());
                }
            }
            for (var i = 0; i < aTables.length; i++) {
                checkAllParentDynamicPages(aTables[i], checkConfiguration.bind(null, aTables[i]));
            }
        }
    });
    return [
        oContentDensity,
        oRowHeights,
        oDynamicPageConfoguration
    ];
}, true);
sap.ui.predefine('sap/ui/table/rules/TableHelper.support', [
    'sap/ui/support/library',
    'sap/base/Log'
], function (SupportLib, Log) {
    'use strict';
    var Severity = SupportLib.Severity;
    var TableSupportHelper = {
        DOCU_REF: 'https://ui5.sap.com/',
        normalizeRule: function (oRuleDef) {
            if (oRuleDef.id && oRuleDef.id !== '') {
                oRuleDef.id = 'gridTable' + oRuleDef.id;
            }
            return oRuleDef;
        },
        createDocuRef: function (sText, sRefSuffix) {
            return {
                text: sText,
                href: TableSupportHelper.DOCU_REF + sRefSuffix
            };
        },
        createFioriGuidelineResolutionEntry: function () {
            return {
                text: 'SAP Fiori Design Guidelines: Grid Table',
                href: 'https://experience.sap.com/fiori-design-web/grid-table'
            };
        },
        reportIssue: function (oIssueManager, sText, sSeverity, sControlId) {
            oIssueManager.addIssue({
                severity: sSeverity || Severity.Medium,
                details: sText,
                context: { id: sControlId || 'WEBPAGE' }
            });
        },
        find: function (oScope, bVisibleOnly, sType) {
            var mElements = oScope.getElements();
            var aResult = [];
            for (var n in mElements) {
                var oElement = mElements[n];
                if (oElement.isA(sType)) {
                    if (bVisibleOnly && oElement.getDomRef() || !bVisibleOnly) {
                        aResult.push(oElement);
                    }
                }
            }
            return aResult;
        },
        checkLogEntries: function (fnFilter, fnCheck) {
            var aLog = Log.getLogEntries();
            var oLogEntry;
            for (var i = 0; i < aLog.length; i++) {
                oLogEntry = aLog[i];
                if (fnFilter(oLogEntry)) {
                    if (fnCheck(oLogEntry)) {
                        return;
                    }
                }
            }
        }
    };
    return TableSupportHelper;
}, true);
