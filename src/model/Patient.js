import Address from "@/model/Address";
import { clone } from "@pranavraut033/js-utils/utils/object";

export default class PatientModel {
  constructor(patient) {
    if (patient)
      Object.keys(patient).forEach((key) => (this[key] = clone(patient[key])));

    this.address = new Address(this.address);
  }
}
