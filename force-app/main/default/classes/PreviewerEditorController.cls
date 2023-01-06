public with sharing class PreviewerEditorController {
    @AuraEnabled(cacheable=false)
    public static String saveExternalActionActionSchema(Id marketingAppExtActionId, String actionSchema) {
        Http h = new Http();
        HttpRequest req = createHttpRequest(marketingAppExtActionId, actionSchema);
        String returnMessage;

        try {
            HttpResponse res = h.send(req);
            returnMessage = res.getBody();
        } catch (Exception e) {
            returnMessage = e.getMessage();
        }
        return returnMessage;
    }

    private static HttpRequest createHttpRequest(Id marketingAppExtActionId, String actionSchema) {
        HttpRequest req = new HttpRequest();
        String baseUrl = 'callout:pi_ea_utils__ExternalActionsPreviewerNC';
        String endpoint = baseUrl + '/tooling/sobjects/MarketingAppExtAction/' + marketingAppExtActionId;
        String body = '{"ActionSchema":' + actionSchema + '}';

        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(endpoint);
        req.setBody(body);
        req.setMethod('PATCH');

        return req;
    }
}