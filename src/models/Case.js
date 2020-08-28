import investigationReports from "@/json/investigation-reports.json";
import { clone } from "@pranavraut033/js-utils/utils/object";
import { sortBy } from "@pranavraut033/js-utils/utils/list";

import FollowUp from "./FollowUp";

export default class Case {
  constructor(caseObject) {
    if (caseObject)
      Object.keys(caseObject).forEach(
        (key) => (this[key] = clone(caseObject[key]))
      );
    else {
      this.mind = "";
      this.duringAcute = "";
      this.pastHistory = "";
      this.familyHistory = "";
      this.medicalNote = "";
    }

    this.followUps =
      (this.followUps &&
        this.followUps
          .map((ev) => new FollowUp(ev))
          .sort(sortBy("createdAt", true))) ||
      [];

    this.new = !this._id;

    this.investigations =
      (this.investigations &&
        this.investigations.map((ev) => {
          ev.format = investigationReports.find(
            (e) => (e.name || e) === ev.name
          );

          ev.entries =
            (ev.entries &&
              ev.entries.map((entry) => {
                entry.edit = false;
                entry.changeDate = false;
                entry.values =
                  entry.values || (typeof format === "string" ? "" : {});

                return entry;
              })) ||
            [];

          return ev;
        })) ||
      [];
  }
}
