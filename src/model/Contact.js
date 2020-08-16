import mongoObjectId from "@/utils/mongoObjectId";
import Address from "@/model/Address";

import { getFromColorMap } from "@/utils";
import { clone } from "@/modules/object";

export default class Contact {
  constructor(contact, userId) {
    if (contact)
      Object.keys(contact).forEach((key) => (this[key] = clone(contact[key])));
    else {
      this.newObject = true;
      this._id = mongoObjectId();
      this.color = getFromColorMap(this._id);
      this.name = {};
      this.addedBy = userId;
    }

    this.address = new Address(this.address);
  }
}
