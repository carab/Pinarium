import {observable, action} from 'mobx';

const dialogStore = observable(
  {
    dialogs: {},
    props(identifier) {
      return this.dialogs[identifier];
    },
    open(identifier, props) {
      this.dialogs[identifier] = props;
    },
    close(identifier) {
      delete this.dialogs[identifier];
    },
  },
  {
    open: action,
    close: action,
  }
);

export default dialogStore;
