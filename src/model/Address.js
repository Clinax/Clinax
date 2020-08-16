export default class Address {
  constructor(address) {
    if (address) {
      this.street = address.street;
      this.area = address.area;
      this.pincode = address.pincode;
    }
  }
}
