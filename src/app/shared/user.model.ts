export class User {

    nickName: string;
    picture: string;
    provider: string;
    email: string;
    firsName: string;
    lastName: string;
    phone: string;
    address: string[];
    orders: string [];

    constructor(obj) {
        [
            this.nickName,
            this.picture,
            this.provider,
            this.email,
            this.firsName,
            this.lastName,
            this.phone,
            this.address,
            this.orders
        ] = obj;
        this.updateLSUser(this.nickName, this.toJson());
    }

    get fullName(): string {
        return `${this.firsName} ${this.lastName}`;
    }

    get userProfile(): Object {
        return {
            nickName: this.nickName,
            firstName: this.firsName,
            lastName: this.lastName,
            phone: this.phone,
            email: this.email
        };
    }

    get userAddress(): string[] {
        return this.address;
    }

    get userOrders(): string[] {
        return this.orders;
    }

    public updateProfile(profile) {
        if (!profile) return;
        this.firsName = profile.firsName;
        this.lastName = profile.lastName;
        this.email = profile.email;
        this.phone = profile.phone;

        this.updateLSUser(this.nickName, this.toJson());
    }

    public updateAddress(address) {
        if (!address) return;
        this.address = address;
        this.updateLSUser(this.nickName, this.toJson());
    }

    public toJson() {
        return JSON.stringify(this);
    }

    public updateLSUser(nick, user) {
        window.localStorage.setItem(nick, user);
    }


}
