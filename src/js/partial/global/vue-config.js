import vue from 'vue';

vue.prototype.$chaining = vue.prototype.$chaining = (obj, ...rest) => {
  let tmp = obj;
  for (let key in rest) {
    let name = rest[key];
    tmp = tmp?.[name];
  }

  return tmp || null;
};

const Vue = vue;

export default Vue;
