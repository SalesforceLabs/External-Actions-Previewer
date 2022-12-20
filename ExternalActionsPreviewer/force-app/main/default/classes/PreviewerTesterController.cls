public with sharing class PreviewerTesterController {
    public PreviewerTesterController() {}

    @AuraEnabled(cacheable=false)
    public static String invokeExternalAction(String actionSelector, Map<String,String> actionParams, List<Map<String, String>> inputParams) {
        Invocable.Action action;
        Boolean isStandard = actionParams.get('isStandard') == 'true';
        HttpRequest standardActionRequest = createIaRestRequest(isStandard, actionParams.get('type'), inputParams, actionSelector);

        String returnMessage;
        Http h = new Http();
        try {
            HttpResponse res = h.send(standardActionRequest);
            returnMessage = res.getBody();
        } catch (Exception e) {
            returnMessage = e.getMessage();
        }
        return returnMessage;
    }

    private static HttpRequest createIaRestRequest(
        Boolean isStandard,
        String type,
        List<Map<String, String>> inputParams,
        String actionSelector) {
        HttpRequest req = new HttpRequest();
        String baseUrl = 'callout:ExternalActionsPreviewerNC';
        String endpoint;
        if (isStandard) {
            endpoint = baseUrl + '/actions/standard/' + type;
        } else {
            endpoint = baseUrl + '/actions/custom/' + type + '/' + actionSelector;
        }

        Map<String,String> requestParams = new Map<String,String>();
        //loop through action params and set them
        for (Map<String,String> param : inputParams) {
            requestParams.put(param.get('id'), param.get('value'));
        }
        List<Map<String,String>> requestParamList = new List<Map<String,String>>();
        requestParamList.add(requestParams);
        Map<String,List<Map<String,String>>> inputs = new Map<String,List<Map<String,String>>>();

        inputs.put('inputs', requestParamList);

        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(endpoint);
        req.setBody(JSON.serialize(inputs));
        req.setMethod('POST');

        return req;
    }
}