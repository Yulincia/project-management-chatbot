export class Member {
    constructor(
        public id: string, 
        public nom: string, 
        public prenom: string,
        public tel: string,
        public email: string,
        public poste: string,
        public imgUrl?: string,
    ) {}
}