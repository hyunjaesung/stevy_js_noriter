const type = (target, type) => {
  if (typeof type == "string") {
    if (typeof target != type) throw `invalidType ${target} : ${type}`;
  } else if (!(target instanceof type)) {
    throw `invalidType ${target} : ${type}`;
  }
  return target;
};

export default type;
