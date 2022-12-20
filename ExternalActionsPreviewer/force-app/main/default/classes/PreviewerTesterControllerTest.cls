@isTest
private class PreviewerTesterControllerTest {

    @isTest
    static void testIsStandardExternalActionCallout() {
        Test.setMock(HttpCalloutMock.class, new PreviewerTesterControllerMock());

        //setup data
        Map<String, String> actionParams = new Map<String,String>();
        actionParams.put('isStandard', 'true');
        actionParams.put('type', 'chatterPost');

        Map<String, String> inputParamsMap = new Map<String,String>();
        List<Map<String, String>> inputParams = new List<Map<String, String>>();
        inputParamsMap.put('id', 'RecordId');
        inputParamsMap.put('value', 'TestRecordId');
        inputParams.add(inputParamsMap);


        String res = PreviewerTesterController.invokeExternalAction(null, actionParams, inputParams);
        System.assertEquals('Success', res);
    }

    @isTest
    static void testCustomExternalActionCallout() {
        Test.setMock(HttpCalloutMock.class, new PreviewerTesterControllerMock());

        //setup data
        Map<String, String> actionParams = new Map<String,String>();
        actionParams.put('isStandard', 'false');
        actionParams.put('type', 'testCustom');

        Map<String, String> inputParamsMap = new Map<String,String>();
        List<Map<String, String>> inputParams = new List<Map<String, String>>();
        inputParamsMap.put('id', 'RecordId');
        inputParamsMap.put('value', 'TestRecordId');
        inputParams.add(inputParamsMap);


        String res = PreviewerTesterController.invokeExternalAction(null, actionParams, inputParams);
        System.assertEquals('Success', res);

    }
    
    @isTest
    static void testThrownException() {
        Test.setMock(HttpCalloutMock.class, new PreviewerTesterControllerMock());

        //setup data
        Map<String, String> actionParams = new Map<String,String>();
        actionParams.put('isStandard', 'false');
        actionParams.put('type', 'testCustom');

        Map<String, String> inputParamsMap = new Map<String,String>();
        List<Map<String, String>> inputParams = new List<Map<String, String>>();
        inputParamsMap.put('id', 'RecordId');
        inputParamsMap.put('value', 'TestRecordId');
        inputParams.add(inputParamsMap);


        String res = PreviewerTesterController.invokeExternalAction('exception', actionParams, inputParams);
        System.assertEquals('Threw Exception!', res);

    }
}
