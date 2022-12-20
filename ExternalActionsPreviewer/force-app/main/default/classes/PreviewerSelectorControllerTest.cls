@isTest
public with sharing class PreviewerSelectorControllerTest {
    @isTest
    static void testFetchExternalActionDetails() {
        // Arrange
        Id marketingAppExtActionId = '2Yo000000000000';
        Boolean exceptionOccurred = false;

        // Act
        try {
	        MarketingAppExtAction maea = PreviewerSelectorController.fetchExternalActionDetails(marketingAppExtActionId);            
        } catch (Exception e) {
            exceptionOccurred = true;
        }

        // Assert
        System.assert(exceptionOccurred);
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