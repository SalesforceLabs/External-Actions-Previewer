import { LightningElement, api } from "lwc";
import desert from "./templates/desert.html";
import walkthroughNotAvailable from "./templates/walkthroughNotAvailable.html";
import pageNotAvailable from "./templates/pageNotAvailable.html";

export default class ExternalActionIllustration extends LightningElement {
  @api type;

  render() {
    if (this.type === "walkthroughNotAvailable") return walkthroughNotAvailable;
    if (this.type === "pageNotAvailable") return pageNotAvailable;
    return desert;
  }
}
