import { getCurrentInstance } from "vue";

export const filters = {
  sexName: (sex: any) => {
    const currIns = getCurrentInstance();
    let result: any = currIns?.proxy;
    result?.sexList.find((obj: any) => obj.value == sex);
    return result ? result.name : "Null";
  },
};

export default filters;
