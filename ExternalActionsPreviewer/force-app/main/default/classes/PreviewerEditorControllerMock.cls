global class PreviewerEditorControllerMock implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest req) {
        if (req.getEndpoint().contains('exception')) {
            throw new MockException('Threw Exception!');
        }
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('Success');
        res.setStatusCode(200);
        return res;
    }
    public class MockException extends Exception {}
}
