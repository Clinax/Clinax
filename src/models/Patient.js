import Address from "@/models/Address";
import { clone } from "@pranavraut033/js-utils/utils/object";
import Case from "./Case";

export default class Patient {
  constructor(patient) {
    if (patient)
      Object.keys(patient).forEach((key) => (this[key] = clone(patient[key])));

    this.address = new Address(this.address);
    this.case = new Case(this.case);

    if (!this.case._id) this.case.patinet = this._id;
  }
}
