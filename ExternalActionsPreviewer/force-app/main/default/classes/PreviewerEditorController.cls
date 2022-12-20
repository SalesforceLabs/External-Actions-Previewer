public with sharing class PreviewerEditorController {
    public PreviewerEditorController() {}

    @AuraEnabled(cacheable=false)
    public static String saveExternalActionActionSchema(Id marketingAppExtActionId, String actionSchema) {
        HttpRequest req = new HttpRequest();
        Http h = new Http();
        String baseUrl = 'callout:ExternalActionsPreviewerNC';
        String endpoint = baseUrl + '/tooling/sobjects/MarketingAppExtAction/' + marketingAppExtActionId;
        String body = '{"ActionSchema":' + actionSchema + '}';
        System.debug('========== body: ' + body);

        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID());
        req.setHeader('Content-Type', 'application/json');
        req.setEndpoint(endpoint);
        req.setBody(body);
        req.setMethod('PATCH');

        HttpResponse res = h.send(req);
        System.debug('========== res.getBody(): ' + res.getBody());
        return res.getBody();
    }
}