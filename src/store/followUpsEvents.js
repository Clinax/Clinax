import getColor, { setColor } from "@pranavraut033/js-utils/utils/getColor";
import moment from "moment";
import { decrypt } from "../utils";

const listeners = {
  eventChange: {},
};

const _state = () => ({
  followUpsEvents: [],
});

export { _state as state };

export const mutations = {
  setEvents(state, _data) {
    const data = decrypt(_data);

    const a = {};
    Object.keys(data).forEach((date) => {
      const element = data[date];

      element.forEach((ev) => {
        setColor(ev._id, ev.color);
        a[ev.followUpId || ev.appointmentId] = ev;
      });
    });

    state.followUpsEvents = a;
    Object.values(listeners.eventChange).forEach((ev) => {
      if (ev && typeof ev === "function") ev();
    });
  },
  addEvent(state, data) {
    const date = moment(data.date);
    data.date = date.format("YYYY-MM-DD");
    data.start = date.format("YYYY-MM-DD hh:mm");
    data.end = date.endOf("day").format("YYYY-MM-DD hh:mm");
    data.color = getColor(data._id);

    state.followUpsEvents[data.followUpId] = data;

    Object.values(listeners.eventChange).forEach((ev) => {
      if (ev && typeof ev === "function") ev();
    });
  },
};

export const getters = {
  events(state) {
    const a = {};

    Object.values(state.followUpsEvents).forEach((ev) => {
      if (a[ev.date]) a[ev.date] = [];

      a[ev.date].push(ev);
    });

    return a;
  },
};

export const actions = {
  addListener(_, { event, name, callback }) {
    listeners[event][name] = callback;
  },
};
