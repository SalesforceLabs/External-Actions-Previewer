@isTest
public class PreviewerEditorControllerTest {

    @isTest
    static void testSaveExternalActionActionSchemaActionCallout() {
        Test.setMock(HttpCalloutMock.class, new PreviewerEditorControllerMock());

        // Arrange
        Id marketingAppExtActionId = '2Yo000000000000';
        String actionSchema = '{\n  \"properties\": {\n    \"ids\": {\n      \"type\": \"string\",\n      \"title\": \"ids\",\n      \"value\": \"\"\n    }\n  },\n  \"view\": {\n    \"components\": [\n      {\n        \"definition\": \"lightning/control\",\n        \"scope\": \"#/properties/ids\"\n      }\n    ]\n  },\n  \"required\": []\n}';

        // Act
        String res = PreviewerEditorController.saveExternalActionActionSchema(marketingAppExtActionId, actionSchema);

        // Assert
        System.assertEquals('Success', res);
    }

    @isTest
    static void testThrownException() {
        Test.setMock(HttpCalloutMock.class, new PreviewerEditorControllerMock());

        // Arrange
        Id marketingAppExtActionId = '2Yo000exception';
        String actionSchema = '{\n  \"properties\": {\n    \"ids\": {\n      \"type\": \"string\",\n      \"title\": \"ids\",\n      \"value\": \"\"\n    }\n  },\n  \"view\": {\n    \"components\": [\n      {\n        \"definition\": \"lightning/control\",\n        \"scope\": \"#/properties/ids\"\n      }\n    ]\n  },\n  \"required\": []\n}';

        // Act
        String res = PreviewerEditorController.saveExternalActionActionSchema(marketingAppExtActionId, actionSchema);

        // Assert
        System.assertEquals('Threw Exception!', res);
    }
}