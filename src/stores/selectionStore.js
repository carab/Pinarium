import {observable, action} from 'mobx';
import {useEffect} from 'react';

const selectionStore = observable(
  {
    bottles: [],
    selection: {},
    get selectedBottles() {
      const ids = Object.keys(this.selection);
      return this.bottles.filter(bottle => ids.indexOf(bottle.$ref.id) !== -1);
    },
    selected(bottle) {
      return Boolean(this.selection[bottle.$ref.id]);
    },
    select(bottles) {
      if (bottles) {
        bottles.forEach(bottle => {
          this.selection[bottle.$ref.id] = true;
        });
      } else {
        this.bottles.forEach(bottle => {
          this.selection[bottle.$ref.id] = true;
        });
      }
    },
    unselect(bottles) {
      if (bottles) {
        bottles.forEach(bottle => {
          delete this.selection[bottle.$ref.id];
        });
      } else {
        this.selection = {};
      }
    },
  },
  {
    select: action.bound,
    unselect: action.bound,
  }
);

export default selectionStore;

export function useSelectionProvider(bottles) {
  useEffect(
    () => {
      if (bottles) {
        selectionStore.bottles = bottles;
        return () => {
          selectionStore.bottles = [];
        };
      }
    },
    [bottles]
  );

  return useSelection();
}

export function useSelection(bottle) {
  if (bottle) {
    return [
      selectionStore.selected(bottle),
      () => selectionStore.select([bottle]),
      () => selectionStore.unselect([bottle]),
    ];
  }

  return [
    selectionStore.selectedBottles,
    selectionStore.select,
    selectionStore.unselect,
    selectionStore.selected,
  ];
}
