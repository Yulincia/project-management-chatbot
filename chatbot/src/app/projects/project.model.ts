export class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string,
        public userId: string,
        public members?: string[]
    ) {}
}