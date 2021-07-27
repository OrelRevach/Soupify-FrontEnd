import List from "./dataStructures";

// Provides a facade to local storage
// mainly enables saving and maintaining lists
export default {
  getObject(item, defaultVal) {
    if (localStorage.getItem(item))
      return JSON.parse(localStorage.getItem(item));
    else return defaultVal;
  },

  updateList(item, action, recipeId) {
    let list = new List(this.getObject(item, []));
    if (action === "add") list.add(recipeId);
    else if (action === "remove") list.remove(recipeId);

    localStorage.setItem(item, JSON.stringify(list.items));
  },

  updateObjectProperty(item, key, progress) {
    let obj = this.getObject(item, {});
    obj[key] = progress;
    localStorage.setItem(item, JSON.stringify(obj));
  },

  removeObjectProperty(item, key) {
    let obj = this.getObject(item, {});
    delete obj[key];
    localStorage.setItem(item, JSON.stringify(obj));
  }
};
