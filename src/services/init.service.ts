import {DataSource} from "typeorm";
import NautiljonService from "./nautiljon.service";

export default class InitService {

    readonly nautiljon: NautiljonService;

    constructor(datasource: DataSource) {
        this.nautiljon = new NautiljonService(datasource);
    }

}