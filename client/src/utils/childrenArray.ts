export const childrenArray = (children: any) => {
  return Array.isArray(children) ? children.flat() : [children];
};
