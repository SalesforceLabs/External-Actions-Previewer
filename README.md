# External Actions Previewer
A utility tool that allows developer admins to easily author External Actions. It provides a set of tools that allows selection, editing, previewing and testing of External Actions:

* **Selector** - Find for your External Actions with type-ahead search
* **Editor** - Validates JSON with error highlighting
* **Previewer** - Previews your External Action as it would appear in Engagement Studio
* **Tester** - Tests your External Action using specified values for inputs and provides a log of the result

> Note that the External Action is executed in the context of the *current user*.
## Installing the app on a Scratch Org
Coming soon

## Installing the app on an Org
1. Install package
    1. (link to package coming soon)
2. Navigate to Setup
3. Create Connected App
    1. Callback URL (change MyDomainName to your My Domain settings)
        1. https://MyDomainName.my.salesforce.com/services/authcallback/ExternalActionsPreviewerAP (https://mydomainname.my.salesforce.com/services/authcallback/ExternalActionsPreviewerAP)
    2. Enable OAuth Settings
        1. Full access (full)
        2. Perform requests at any time (refresh_token, offline_access)
4. Update ExternalActionsPreviewerAP Auth Provider with Consumer Key and Consumer Secret from newly created Connected App, above.
5. Update ExternalActionsPreviewerNC Named Credential URL to your My Domain settings.
6. Go to user settings and Authenticate the ExternalActionsPreviewerEC Named Principal.
7. Create Permission Set
    1. System Permissions (https://help.salesforce.com/s/articleView?id=sf.auth_per_user_external_cred.htm&type=5)
        1. View Setup and Configuration
        2. Manage Marketing Setup Tasks
        3. Manage Profiles and Permission Sets
        4. Assign Permission Sets
    2. Object Settings
        1. User External Credentials
            1. Read, Create, Edit, Delete
8. Assign Permission Sets to any users you want to give access to External Actions Previewer App:
    1. Assign above newly created Permission Set
    2. Assign “External Actions User” Permission Set. This Permission Set provides the following Apex Class access:
        1. pi_ea_utils.PreviewerEditorController
        2. pi_ea_utils.PreviewerSelectorController
        3. pi_ea_utils.PreviewerTesterController
    3. Assign “Sales Cloud User” Permission Set
9. View External Actions Previewer Lightning App via Lightning App Builder and activate it for all users. Add the app to relevant Apps (e.g. Sales).

## Contributing
Coming soon
