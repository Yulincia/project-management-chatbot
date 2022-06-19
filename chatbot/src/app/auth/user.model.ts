export class User {
    constructor(
        public uid: string,
        public email: string,
        //private _token: string,
        //private tokenExpirationDate: Date,
        public nom?: string,
        public prenom?: string,
        public tel?: string,
        public poste?: string,
        public projects?: string[]
    ) {}

    /*get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this._token;
    }

    get tokenDuration() {
        if (!this.token) {
            return 0;
        }
        return this.tokenExpirationDate.getTime() - new Date().getTime();
    }*/
}