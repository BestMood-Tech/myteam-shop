export class Review {
  username: string;
  createDate: string;
  text: string;
  rate: number;

  constructor(Obj?) {
    if (Obj) {
      Object.keys(Obj).forEach((nameField) => {
        this[nameField] = Obj[nameField];
      });
    }
  }
}
