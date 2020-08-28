import clone from "clone";
import moment from "moment";

export default class FollowUp {
  constructor(followUp, copyAsEmpty = false) {
    if (followUp)
      Object.keys(followUp).forEach(
        (key) => (this[key] = clone(followUp[key]))
      );

    this.treatment = this.treatment || { drugs: [] };
    this.extra = this.extra || {};
    this.criteria = this.criteria || {};
    this.physicalGeneral = this.physicalGeneral || {};
    this.onExamination = this.onExamination || {};

    if (copyAsEmpty) {
      delete this.createdAt;
      delete this._id;
      ["onExamination", "criteria", "extra", "physicalGeneral"].forEach(
        (key) => {
          this[`old-${key}`] = {};
          Object.keys(this[key]).forEach((subKey) => {
            this[`old-${key}`][subKey] = this[key][subKey];
            this[key][subKey] = "";
          });
        }
      );
      this.treatment.drugs = [];
      this.nextFollowUpDate = null;
    }

    this.new = !this._id;
    this.createdAt = this.createdAt || new Date();
    this.isToday =
      moment(this.createdAt).format("YYYYMMDD") ===
      moment(new Date()).format("YYYYMMDD");
  }
}
