import mongoObjectId from "@/utils/mongoObjectId";
import Address from "@/models/Address";

import { clone } from "@pranavraut033/js-utils/utils/object";
import getColor from "@pranavraut033/js-utils/utils/getColor";

export default class Contact {
  constructor(contact, userId) {
    if (contact)
      Object.keys(contact).forEach((key) => (this[key] = clone(contact[key])));
    else {
      this.newObject = true;
      this._id = mongoObjectId();
      this.color = getColor(this._id);
      this.name = {};
      this.addedBy = userId;
    }

    this.address = new Address(this.address);
  }
}
