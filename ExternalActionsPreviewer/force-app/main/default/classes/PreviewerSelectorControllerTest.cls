@isTest
public with sharing class PreviewerSelectorControllerTest {
    @isTest
    static void testFetchExternalActionDetails() {
        // Arrange
        Id marketingAppExtActionId = '2Yo000000000000';

        // Act
        MarketingAppExtAction maea = PreviewerSelectorController.fetchExternalActionDetails(marketingAppExtActionId);

        // Assert
        System.assertEquals(maea, null);
    }

    @isTest
    static void testFetchExternalActionsByName() {
        // Arrange
        String queryTerm = 'some query';

        // Act
        List<MarketingAppExtAction> externalActions = PreviewerSelectorController.fetchExternalActionsByName(queryTerm);

        // Assert
        System.assertEquals(externalActions.size(), 0);
    }
}
