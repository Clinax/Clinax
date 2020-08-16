import Address from "@/model/Address";
import { clone } from "@/modules/object";

export default class PatientModel {
  constructor(patient) {
    patient &&
      Object.keys(patient).forEach((key) => (this[key] = clone(patient[key])));

    this.address = new Address(this.address);
  }
}
