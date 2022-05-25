import {makeAutoObservable} from "mobx";

export default class OfferStore {
    constructor() {
        this._offers = [{}]
        makeAutoObservable(this)
    }

    setOffers(offers) {
        this._offers = offers
    }


    get offers() {
        return this._offers
    }

}