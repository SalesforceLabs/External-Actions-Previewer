public with sharing class PreviewerSelectorController {
    @AuraEnabled(cacheable=true)
    public static MarketingAppExtAction fetchExternalActionDetails(Id marketingAppExtActionId) {
        MarketingAppExtAction maea = [
            SELECT Id, ActionName, ActionSelector, ActionParams, MarketingAppExtension.MasterLabel, ActionSchema, IsActive
            FROM MarketingAppExtAction
            WHERE Id = :marketingAppExtActionId
            WITH SECURITY_ENFORCED
        ];
        return maea;
    }

    @AuraEnabled(cacheable=true)
    public static List<MarketingAppExtAction> fetchExternalActionsByName(String queryTerm) {
        List<MarketingAppExtAction> externalActions = new List<MarketingAppExtAction>();
        String actionName = '%' + queryTerm + '%';
        for (MarketingAppExtAction maea : [
            SELECT Id, ActionName, ActionSelector, IsActive, MarketingAppExtension.MasterLabel
            FROM MarketingAppExtAction
            WHERE ActionName LIKE :actionName
            WITH SECURITY_ENFORCED
            ORDER BY ActionName
            LIMIT 5
        ]) {
            externalActions.add(maea);
        }
        return externalActions;
    }
}